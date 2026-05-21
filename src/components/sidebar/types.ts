import type { CollectionEntry } from 'astro:content';
import type { SidebarWidgetConfig } from '../../config/stellar';

export type SidebarSide = 'left' | 'right';

export interface ColumnSidebarContext {
	title: string;
	description?: string;
	icon?: string;
	count: number;
	posts: CollectionEntry<'posts'>[];
}

export interface SidebarContext {
	headings?: { depth: number; slug: string; text: string }[];
	pathname?: string;
	column?: ColumnSidebarContext;
}

export interface WidgetProps {
	widget: SidebarWidgetConfig;
	side: SidebarSide;
	context: SidebarContext;
}
