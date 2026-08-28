export type HeroAttribute = 'str' | 'agi' | 'int' | 'all';

export interface DotaHero {
  id: number;
  name: string; // internal name, e.g. "npc_dota_hero_antimage"
  shortName: string; // e.g. "antimage"
  displayName: string;
  primaryAttr: HeroAttribute;
  roles: string[];
  legs: number;
}

export type ToolType = 'select' | 'pan' | 'grid' | 'rect' | 'circle' | 'line' | 'brush' | 'text' | 'icon' | 'image';

export interface Transform {
  x: number;
  y: number;
  zoom: number;
}

export interface GridSlot {
  id: string;
  col: number;
  row: number;
  x: number;
  y: number;
  width: number;
  height: number;
  heroId: number | null;
  isBan?: boolean;
  label?: string;
  locked?: boolean;
  heroTierLevel?: number; // Dota Plus tier (e.g. 1-30)
  customBadge?: string;
}

export interface GridGroup {
  id: string;
  name: string;
  cols: number; // default 35
  rows: number; // default 7
  slotWidth: number; // default 48
  slotHeight: number; // default 32
  gapX: number; // default 4
  gapY: number; // default 4
  x: number;
  y: number;
  slotBorderColor: string;
  slotBgColor: string;
  slotBorderRadius: number;
  isBanGrid?: boolean;
  locked: boolean;
  visible: boolean;
  slots: GridSlot[];
}

export type ItemType = 'text' | 'rect' | 'circle' | 'line' | 'brush' | 'icon' | 'image' | 'hero' | 'symbol_group';

export interface CanvasItem {
  id: string;
  name: string;
  type: ItemType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // in degrees
  opacity: number; // 0 to 1
  locked: boolean;
  visible: boolean;
  zIndex: number;
  
  // Style properties
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDash?: number[];
  borderRadius?: number;
  
  // Text specific
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold' | '600' | '800';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
  textGlow?: string;
  textGlowBlur?: number;
  
  // Line specific
  points?: { x: number; y: number }[];
  isArrow?: boolean;
  arrowStart?: boolean;
  arrowEnd?: boolean;
  
  // Brush/Freehand specific
  path?: { x: number; y: number }[];
  
  // Icon specific
  iconChar?: string;
  iconName?: string;
  
  // Image specific
  imageData?: string; // base64 or URL
  aspectRatio?: number;

  // Hero specific
  heroId?: number;

  // Dota 2 Native Export Integration
  exportToDota?: boolean; // Default true - whether this item becomes a category in hero_grid_config.json
  dotaCategoryName?: string; // Custom category name in Dota 2
  dotaHeroIds?: number[]; // Heroes assigned to this item's Dota category
  autoCaptureHeroes?: boolean; // If true for rect, automatically collects heroes visually inside this box
  heroTierLevel?: number; // Dota Plus tier badge for hero item
}

export interface BackgroundConfig {
  imageUrl: string | null;
  opacity: number;
  scaleMode: 'fit' | 'fill' | 'stretch' | 'original' | 'center';
  locked: boolean;
  visible: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  blur?: number;
  brightness?: number;
}

export interface ProjectState {
  id: string;
  title: string;
  canvasWidth: number; // default 2560 (2K Standard)
  canvasHeight: number; // default 1440 (2K Standard)
  canvasBgColor: string; // default #0c0d12
  background: BackgroundConfig;
  grids: GridGroup[];
  items: CanvasItem[];
  snapToGrid: boolean;
  snapThreshold: number;
  showRulers: boolean;
  showGridLines: boolean;
  showHeroNames?: boolean;
  showHeroTiers?: boolean;
  cardStyle?: 'standard' | 'portrait' | 'compact';
  exportMode?: 'column_preserve' | 'single_category';
}

// Native Dota 2 hero_grid_config.json format
export interface DotaCategoryExport {
  category_name: string;
  x_position: number;
  y_position: number;
  width: number;
  height: number;
  hero_ids: number[];
}

export interface DotaConfigExport {
  config_name: string;
  categories: DotaCategoryExport[];
}

export interface DotaHeroGridConfigFile {
  version: number;
  configs: DotaConfigExport[];
}
