/**
 * CountdownCardSkeleton — SSR 骨架（React 岛 hydrate 前的占位）
 *
 * 设计：
 * - 保持卡片形状（4 行 grid + 印章位置 + 4 个进度条位置）
 * - 灰色块 + 1.5s 周期 shimmer 动效
 * - React hydrate 后自动被替换为真实内容
 */

import * as styles from '../../styles/countdownCard.css';

export default function CountdownCardSkeleton() {
	return (
		<div
			className={`${styles.skeleton} ${styles.cardResponsive}`}
			aria-hidden="true"
			aria-label="加载节假日中"
		>
			<div className={styles.skeletonHeader}>
				<div className={styles.skeletonRowLabel} style={{ width: '40%' }} />
				<div className={styles.skeletonRowLabel} style={{ width: '20%' }} />
			</div>
			<div className={styles.skeletonDivider} />
			<div className={styles.skeletonBody}>
				<div className={styles.skeletonHero}>
					<div className={styles.skeletonRowLabel} style={{ width: '30%' }} />
					<div className={styles.skeletonHeroNumber} />
					<div className={styles.skeletonHeroUnit} />
				</div>
				<div className={styles.skeletonList}>
					{[0, 1, 2, 3].map((i) => (
						<div className={styles.skeletonRow} key={i}>
							<div className={styles.skeletonRowLabel} />
							<div className={styles.skeletonRowTrack} />
						</div>
					))}
				</div>
			</div>
			<div className={styles.skeletonFooter}>
				<div className={styles.skeletonRowLabel} style={{ width: '20%' }} />
				<div className={styles.skeletonRowLabel} style={{ width: '30%' }} />
			</div>
		</div>
	);
}
