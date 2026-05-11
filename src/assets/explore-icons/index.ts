import bookmarkIcon from './bookmark.svg?url';
import clothesIcon from './clothes.svg?url';
import goodsIcon from './goods.svg?url';
import loveIcon from './love.png';
import memosIcon from './memos.png';
import photoIcon from './photo.svg?url';

export const exploreIconImages = {
	bookmark: bookmarkIcon,
	clothes: clothesIcon,
	goods: goodsIcon,
	love: loveIcon.src,
	memos: memosIcon.src,
	photo: photoIcon,
} as const;

export type ExploreIconImageKey = keyof typeof exploreIconImages;
