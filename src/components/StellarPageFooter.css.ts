import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../styles/theme.css';

const textP1 = 'rgba(18, 25, 38, 0.8)';
const textP2 = 'rgba(18, 25, 38, 0.62)';
const blockBorder = 'rgba(18, 25, 38, 0.10)';

export const root = style({
	margin: '4rem 1rem 3rem',
	color: textP2,
});

export const sitemap = style({
	margin: '0.5rem -4px',
	columnGap: '1rem',
	scrollbarWidth: 'none',
});

export const sitemapGroup = style({
	breakInside: 'avoid',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	paddingBottom: '1rem',
});

export const text = style({
	marginTop: '0.5rem',
});

globalStyle(`${root} hr`, { margin: '2rem 0', border: 'none', borderTop: `1px dashed ${blockBorder}` });
globalStyle(`${root} a`, { color: textP2, borderRadius: '4px', transition: 'background 0.2s ease-out, color 0.2s ease-out' });
globalStyle(`${root} a:hover`, { color: vars.color.textStrong, background: blockBorder });
globalStyle(`${sitemap}::-webkit-scrollbar`, { display: 'none' });
globalStyle(`${sitemapGroup} > span, ${sitemapGroup} > a`, { textDecoration: 'none', padding: '4px' });
globalStyle(`${sitemapGroup} > span`, { fontWeight: 500, color: textP1, margin: '4px 0' });
globalStyle(`${text} p`, { margin: '4px 0', lineHeight: 1.5 });
globalStyle(`${text} a:not([class])`, { fontWeight: 500 });