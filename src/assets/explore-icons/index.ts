import bookmarkIcon from './bookmark.svg?url';
import clothesIcon from './clothes.svg?url';
import goodsIcon from './goods.svg?url';
import loveIcon from './love.png';
import memosIcon from './memos.png';
import phoneIcon from './phone.svg?url';
import photoIcon from './photo.svg?url';
import travelIcon from './travel.svg?url';

export const exploreIconImages = {
	bookmark: bookmarkIcon,
	clothes: clothesIcon,
	goods: goodsIcon,
	love: loveIcon.src,
	memos: memosIcon.src,
	phone: phoneIcon,
	photo: photoIcon,
	travel: travelIcon,
} as const;

export type ExploreIconImageKey = keyof typeof exploreIconImages;
