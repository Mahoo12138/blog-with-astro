/**
 * Immich 相册数据获取（构建时执行）
 *
 * 不会下载原图到本地，仅拼接略缩图 / 预览图的 URL，
 * 供 <img src> 在浏览器端按需加载。
 *
 * 鉴权：Immich 的 API 支持通过 `apiKey` 查询参数访问受保护资源，
 * 我们利用这一点让 <img> 标签直接命中接口。注意 API key 会暴露在
 * 生成的静态 HTML 中，请使用最小权限的 key。
 */

export interface ImmichAlbumAsset {
	id: string;
	type: 'IMAGE' | 'VIDEO' | string;
	originalFileName?: string;
	fileCreatedAt?: string;
	localDateTime?: string;
	exifInfo?: {
		exifImageWidth?: number | null;
		exifImageHeight?: number | null;
		make?: string | null;
		model?: string | null;
		dateTimeOriginal?: string | null;
		description?: string | null;
	} | null;
}

export interface ImmichAlbum {
	id: string;
	albumName: string;
	description?: string;
	assetCount?: number;
	createdAt?: string;
	updatedAt?: string;
	albumThumbnailAssetId?: string | null;
	assets?: ImmichAlbumAsset[];
}

export interface ImmichConfig {
	apiUrl: string;
	apiKey: string;
	albumName: string;
}

export interface GalleryPhoto {
	id: string;
	thumbnailUrl: string;
	previewUrl: string;
	width: number;
	height: number;
	aspectRatio: number;
	takenAt?: string;
	originalFileName?: string;
	description?: string;
}

export function readImmichConfig(): ImmichConfig | null {
	const apiUrl = (import.meta.env.IMMICH_API_URL ?? process.env.IMMICH_API_URL ?? '').replace(/\/$/, '');
	const apiKey = import.meta.env.IMMICH_API_KEY ?? process.env.IMMICH_API_KEY ?? '';
	const albumName = import.meta.env.IMMICH_ALBUM_NAME ?? process.env.IMMICH_ALBUM_NAME ?? '';
	if (!apiUrl || !apiKey || !albumName) {
		return null;
	}
	return { apiUrl, apiKey, albumName };
}

async function immichFetch<T>(config: ImmichConfig, path: string): Promise<T> {
	const url = `${config.apiUrl}${path}`;
	const res = await fetch(url, {
		headers: {
			'x-api-key': config.apiKey,
			Accept: 'application/json',
		},
	});
	if (!res.ok) {
		throw new Error(`Immich request failed: ${res.status} ${res.statusText} → ${url}`);
	}
	return (await res.json()) as T;
}

export function buildThumbnailUrl(config: ImmichConfig, assetId: string, size: 'thumbnail' | 'preview' = 'preview') {
	const params = new URLSearchParams({ size, apiKey: config.apiKey });
	return `${config.apiUrl}/api/assets/${assetId}/thumbnail?${params.toString()}`;
}

export async function fetchAlbumByName(config: ImmichConfig): Promise<ImmichAlbum | null> {
	// 同时检索自有相册与共享相册（共享相册需 ?shared=true）
	const [owned, shared] = await Promise.all([
		immichFetch<ImmichAlbum[]>(config, '/api/albums').catch(() => [] as ImmichAlbum[]),
		immichFetch<ImmichAlbum[]>(config, '/api/albums?shared=true').catch(() => [] as ImmichAlbum[]),
	]);
	const seen = new Set<string>();
	const albums = [...owned, ...shared].filter((a) => {
		if (seen.has(a.id)) return false;
		seen.add(a.id);
		return true;
	});
	const target = albums.find((a) => a.albumName === config.albumName);
	if (!target) return null;
	// 列表接口不带 assets，需要再请求一次详情
	return immichFetch<ImmichAlbum>(config, `/api/albums/${target.id}`);
}

/**
 * 获取所有相册列表（不含 assets），用于侧边栏展示。
 * 同时返回 env 中配置的默认相册名。
 */
export async function loadAllAlbums(): Promise<{ albums: ImmichAlbum[]; defaultAlbumName: string; error?: string }> {
	const config = readImmichConfig();
	if (!config) {
		return { albums: [], defaultAlbumName: '', error: '未配置 Immich 环境变量' };
	}
	try {
		const [owned, shared] = await Promise.all([
			immichFetch<ImmichAlbum[]>(config, '/api/albums').catch(() => [] as ImmichAlbum[]),
			immichFetch<ImmichAlbum[]>(config, '/api/albums?shared=true').catch(() => [] as ImmichAlbum[]),
		]);
		const seen = new Set<string>();
		const albums = [...owned, ...shared].filter((a) => {
			if (seen.has(a.id)) return false;
			seen.add(a.id);
			return true;
		});
		return { albums, defaultAlbumName: config.albumName };
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return { albums: [], defaultAlbumName: config.albumName ?? '', error: message };
	}
}

export async function loadGalleryPhotos(): Promise<{ photos: GalleryPhoto[]; album: ImmichAlbum | null; error?: string }> {
	const config = readImmichConfig();
	if (!config) {
		return {
			photos: [],
			album: null,
			error: '未配置 Immich 环境变量（IMMICH_API_URL / IMMICH_API_KEY / IMMICH_ALBUM_NAME），跳过相册数据加载。',
		};
	}
	try {
		const album = await fetchAlbumByName(config);
		if (!album) {
			return { photos: [], album: null, error: `未在 Immich 中找到名为 "${config.albumName}" 的相册。` };
		}
		const assets = (album.assets ?? []).filter((a) => a.type === 'IMAGE');
		const photos: GalleryPhoto[] = assets.map((asset) => {
			const w = asset.exifInfo?.exifImageWidth ?? 4;
			const h = asset.exifInfo?.exifImageHeight ?? 3;
			const width = Number(w) || 4;
			const height = Number(h) || 3;
			return {
				id: asset.id,
				thumbnailUrl: buildThumbnailUrl(config, asset.id, 'thumbnail'),
				previewUrl: buildThumbnailUrl(config, asset.id, 'preview'),
				width,
				height,
				aspectRatio: width / height,
				takenAt: asset.exifInfo?.dateTimeOriginal ?? asset.localDateTime ?? asset.fileCreatedAt,
				originalFileName: asset.originalFileName,
				description: asset.exifInfo?.description ?? undefined,
			};
		});
		// 按拍摄时间倒序
		photos.sort((a, b) => {
			const at = a.takenAt ? Date.parse(a.takenAt) : 0;
			const bt = b.takenAt ? Date.parse(b.takenAt) : 0;
			return bt - at;
		});
		return { photos, album };
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return { photos: [], album: null, error: message };
	}
}
