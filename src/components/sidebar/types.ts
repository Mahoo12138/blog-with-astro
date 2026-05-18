import type { SidebarWidgetConfig } from '../../config/stellar';

export type SidebarSide = 'left' | 'right';

export interface SidebarContext {
	headings?: { depth: number; slug: string; text: string }[];
	pathname?: string;
}

export interface WidgetProps {
	widget: SidebarWidgetConfig;
	side: SidebarSide;
	context: SidebarContext;
}
