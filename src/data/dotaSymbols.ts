export type DotaSymbolCompatibility = 'verified' | 'unknown' | 'unsupported';

export type DotaSymbolCategory =
  | 'lines'
  | 'corners'
  | 'box-drawing'
  | 'separators'
  | 'stars'
  | 'geometric'
  | 'arrows'
  | 'decorative'
  | 'ascii-safe';

export interface DotaSymbolEntry {
  symbol: string;
  name: string;
  category: DotaSymbolCategory;
  compatibility: DotaSymbolCompatibility;
}

export const DOTA_SYMBOL_CATEGORY_META: Record<DotaSymbolCategory, { label: string }> = {
  lines: { label: 'Lines' },
  corners: { label: 'Corners' },
  'box-drawing': { label: 'Box drawing' },
  separators: { label: 'Separators' },
  stars: { label: 'Stars' },
  geometric: { label: 'Geometric symbols' },
  arrows: { label: 'Arrows' },
  decorative: { label: 'Decorative' },
  'ascii-safe': { label: 'ASCII-safe' }
};

// Verified is intentionally conservative: only plain ASCII is marked safe without client-side evidence.
export const DOTA_SYMBOLS: DotaSymbolEntry[] = [
  { symbol: '─', name: 'Box Drawing Light Horizontal', category: 'lines', compatibility: 'unknown' },
  { symbol: '━', name: 'Box Drawing Heavy Horizontal', category: 'lines', compatibility: 'unknown' },
  { symbol: '═', name: 'Box Drawing Double Horizontal', category: 'lines', compatibility: 'unknown' },
  { symbol: '│', name: 'Box Drawing Light Vertical', category: 'lines', compatibility: 'unknown' },
  { symbol: '┃', name: 'Box Drawing Heavy Vertical', category: 'lines', compatibility: 'unknown' },
  { symbol: '║', name: 'Box Drawing Double Vertical', category: 'lines', compatibility: 'unknown' },
  { symbol: '╱', name: 'Box Drawing Diagonal Rising', category: 'lines', compatibility: 'unknown' },
  { symbol: '╲', name: 'Box Drawing Diagonal Falling', category: 'lines', compatibility: 'unknown' },
  { symbol: '╳', name: 'Box Drawing Diagonal Cross', category: 'lines', compatibility: 'unknown' },
  { symbol: '┌', name: 'Light Corner Top Left', category: 'corners', compatibility: 'unknown' },
  { symbol: '┐', name: 'Light Corner Top Right', category: 'corners', compatibility: 'unknown' },
  { symbol: '└', name: 'Light Corner Bottom Left', category: 'corners', compatibility: 'unknown' },
  { symbol: '┘', name: 'Light Corner Bottom Right', category: 'corners', compatibility: 'unknown' },
  { symbol: '╔', name: 'Double Corner Top Left', category: 'corners', compatibility: 'unknown' },
  { symbol: '╗', name: 'Double Corner Top Right', category: 'corners', compatibility: 'unknown' },
  { symbol: '╚', name: 'Double Corner Bottom Left', category: 'corners', compatibility: 'unknown' },
  { symbol: '╝', name: 'Double Corner Bottom Right', category: 'corners', compatibility: 'unknown' },
  { symbol: '┏', name: 'Heavy Corner Top Left', category: 'corners', compatibility: 'unknown' },
  { symbol: '┓', name: 'Heavy Corner Top Right', category: 'corners', compatibility: 'unknown' },
  { symbol: '┗', name: 'Heavy Corner Bottom Left', category: 'corners', compatibility: 'unknown' },
  { symbol: '┛', name: 'Heavy Corner Bottom Right', category: 'corners', compatibility: 'unknown' },
  { symbol: '├', name: 'Light Tee Left', category: 'box-drawing', compatibility: 'unknown' },
  { symbol: '┤', name: 'Light Tee Right', category: 'box-drawing', compatibility: 'unknown' },
  { symbol: '┬', name: 'Light Tee Top', category: 'box-drawing', compatibility: 'unknown' },
  { symbol: '┴', name: 'Light Tee Bottom', category: 'box-drawing', compatibility: 'unknown' },
  { symbol: '┼', name: 'Light Cross', category: 'box-drawing', compatibility: 'unknown' },
  { symbol: '╠', name: 'Double Tee Left', category: 'box-drawing', compatibility: 'unknown' },
  { symbol: '╣', name: 'Double Tee Right', category: 'box-drawing', compatibility: 'unknown' },
  { symbol: '╦', name: 'Double Tee Top', category: 'box-drawing', compatibility: 'unknown' },
  { symbol: '╩', name: 'Double Tee Bottom', category: 'box-drawing', compatibility: 'unknown' },
  { symbol: '╬', name: 'Double Cross', category: 'box-drawing', compatibility: 'unknown' },
  { symbol: '•', name: 'Bullet', category: 'separators', compatibility: 'unknown' },
  { symbol: '·', name: 'Middle Dot', category: 'separators', compatibility: 'unknown' },
  { symbol: '⋅', name: 'Dot Operator', category: 'separators', compatibility: 'unknown' },
  { symbol: '｡', name: 'Halfwidth Ideographic Full Stop', category: 'separators', compatibility: 'unknown' },
  { symbol: '･', name: 'Katakana Middle Dot', category: 'separators', compatibility: 'unknown' },
  { symbol: '¦', name: 'Broken Bar', category: 'separators', compatibility: 'unknown' },
  { symbol: '★', name: 'Black Star', category: 'stars', compatibility: 'unknown' },
  { symbol: '☆', name: 'White Star', category: 'stars', compatibility: 'unknown' },
  { symbol: '✦', name: 'Black Four Pointed Star', category: 'stars', compatibility: 'unknown' },
  { symbol: '✧', name: 'White Four Pointed Star', category: 'stars', compatibility: 'unknown' },
  { symbol: '✪', name: 'Circled White Star', category: 'stars', compatibility: 'unknown' },
  { symbol: '✫', name: 'Open Centre Black Star', category: 'stars', compatibility: 'unknown' },
  { symbol: '✬', name: 'Black Centre White Star', category: 'stars', compatibility: 'unknown' },
  { symbol: '✭', name: 'Outlined Black Star', category: 'stars', compatibility: 'unknown' },
  { symbol: '✯', name: 'Pinwheel Star', category: 'stars', compatibility: 'unknown' },
  { symbol: '✰', name: 'Shadowed White Star', category: 'stars', compatibility: 'unknown' },
  { symbol: '✶', name: 'Six Pointed Black Star', category: 'stars', compatibility: 'unknown' },
  { symbol: '✹', name: 'Twelve Pointed Black Star', category: 'stars', compatibility: 'unknown' },
  { symbol: '■', name: 'Black Square', category: 'geometric', compatibility: 'unknown' },
  { symbol: '□', name: 'White Square', category: 'geometric', compatibility: 'unknown' },
  { symbol: '▲', name: 'Black Up Triangle', category: 'geometric', compatibility: 'unknown' },
  { symbol: '▼', name: 'Black Down Triangle', category: 'geometric', compatibility: 'unknown' },
  { symbol: '◀', name: 'Black Left Triangle', category: 'geometric', compatibility: 'unknown' },
  { symbol: '▶', name: 'Black Right Triangle', category: 'geometric', compatibility: 'unknown' },
  { symbol: '◆', name: 'Black Diamond', category: 'geometric', compatibility: 'unknown' },
  { symbol: '◇', name: 'White Diamond', category: 'geometric', compatibility: 'unknown' },
  { symbol: '●', name: 'Black Circle', category: 'geometric', compatibility: 'unknown' },
  { symbol: '○', name: 'White Circle', category: 'geometric', compatibility: 'unknown' },
  { symbol: '◈', name: 'Diamond with Small Diamond', category: 'geometric', compatibility: 'unknown' },
  { symbol: '▣', name: 'Square with Small Square', category: 'geometric', compatibility: 'unknown' },
  { symbol: '█', name: 'Full Block', category: 'geometric', compatibility: 'unknown' },
  { symbol: '░', name: 'Light Shade', category: 'geometric', compatibility: 'unknown' },
  { symbol: '▒', name: 'Medium Shade', category: 'geometric', compatibility: 'unknown' },
  { symbol: '▓', name: 'Dark Shade', category: 'geometric', compatibility: 'unknown' },
  { symbol: '←', name: 'Left Arrow', category: 'arrows', compatibility: 'unknown' },
  { symbol: '→', name: 'Right Arrow', category: 'arrows', compatibility: 'unknown' },
  { symbol: '↑', name: 'Up Arrow', category: 'arrows', compatibility: 'unknown' },
  { symbol: '↓', name: 'Down Arrow', category: 'arrows', compatibility: 'unknown' },
  { symbol: '↔', name: 'Left Right Arrow', category: 'arrows', compatibility: 'unknown' },
  { symbol: '↕', name: 'Up Down Arrow', category: 'arrows', compatibility: 'unknown' },
  { symbol: '➜', name: 'Heavy Right Arrow', category: 'arrows', compatibility: 'unknown' },
  { symbol: '➤', name: 'Black Right Arrowhead', category: 'arrows', compatibility: 'unknown' },
  { symbol: '»', name: 'Right Double Angle Quote', category: 'arrows', compatibility: 'unknown' },
  { symbol: '«', name: 'Left Double Angle Quote', category: 'arrows', compatibility: 'unknown' },
  { symbol: '♡', name: 'White Heart Suit', category: 'decorative', compatibility: 'unknown' },
  { symbol: '♥', name: 'Black Heart Suit', category: 'decorative', compatibility: 'unknown' },
  { symbol: 'ღ', name: 'Georgian Letter Ghani', category: 'decorative', compatibility: 'unknown' },
  { symbol: '✿', name: 'Black Florette', category: 'decorative', compatibility: 'unknown' },
  { symbol: '❀', name: 'White Florette', category: 'decorative', compatibility: 'unknown' },
  { symbol: '❖', name: 'Black Diamond Minus White X', category: 'decorative', compatibility: 'unknown' },
  { symbol: '※', name: 'Reference Mark', category: 'decorative', compatibility: 'unknown' },
  { symbol: '†', name: 'Dagger', category: 'decorative', compatibility: 'unknown' },
  { symbol: '‡', name: 'Double Dagger', category: 'decorative', compatibility: 'unknown' },
  { symbol: '⚜', name: 'Fleur-de-lis', category: 'decorative', compatibility: 'unknown' },
  { symbol: '⚔', name: 'Crossed Swords', category: 'decorative', compatibility: 'unsupported' },
  { symbol: '☠', name: 'Skull and Crossbones', category: 'decorative', compatibility: 'unsupported' },
  { symbol: '👑', name: 'Crown Emoji', category: 'decorative', compatibility: 'unsupported' },
  { symbol: '🔥', name: 'Fire Emoji', category: 'decorative', compatibility: 'unsupported' },
  { symbol: '✨', name: 'Sparkles Emoji', category: 'decorative', compatibility: 'unsupported' },
  { symbol: '💎', name: 'Gem Stone Emoji', category: 'decorative', compatibility: 'unsupported' },
  { symbol: '🏆', name: 'Trophy Emoji', category: 'decorative', compatibility: 'unsupported' },
  { symbol: '🚫', name: 'Prohibited Emoji', category: 'decorative', compatibility: 'unsupported' },
  { symbol: '-', name: 'Hyphen-Minus', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '_', name: 'Low Line', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '=', name: 'Equals Sign', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '|', name: 'Vertical Line', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '/', name: 'Solidus', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '\\', name: 'Reverse Solidus', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '[', name: 'Left Square Bracket', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: ']', name: 'Right Square Bracket', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '(', name: 'Left Parenthesis', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: ')', name: 'Right Parenthesis', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '{', name: 'Left Curly Bracket', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '}', name: 'Right Curly Bracket', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '<', name: 'Less-Than Sign', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '>', name: 'Greater-Than Sign', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '+', name: 'Plus Sign', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '*', name: 'Asterisk', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '.', name: 'Full Stop', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: ':', name: 'Colon', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '#', name: 'Number Sign', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '~', name: 'Tilde', category: 'ascii-safe', compatibility: 'verified' },
  { symbol: '^', name: 'Circumflex Accent', category: 'ascii-safe', compatibility: 'verified' }
];

const DOTA_SYMBOLS_BY_VALUE = new Map(DOTA_SYMBOLS.map((entry) => [entry.symbol, entry]));

export interface DotaTextAnalysis {
  verifiedSymbols: string[];
  unknownSymbols: string[];
  unsupportedSymbols: string[];
  hasWarning: boolean;
}

export function analyzeDotaText(text: string): DotaTextAnalysis {
  const verifiedSymbols: string[] = [];
  const unknownSymbols: string[] = [];
  const unsupportedSymbols: string[] = [];

  for (const symbol of Array.from(text)) {
    const entry = DOTA_SYMBOLS_BY_VALUE.get(symbol);
    const compatibility = entry?.compatibility || (symbol.codePointAt(0)! <= 0x7f ? 'verified' : 'unknown');
    if (compatibility === 'verified') verifiedSymbols.push(symbol);
    if (compatibility === 'unknown') unknownSymbols.push(symbol);
    if (compatibility === 'unsupported') unsupportedSymbols.push(symbol);
  }

  return {
    verifiedSymbols,
    unknownSymbols,
    unsupportedSymbols,
    hasWarning: unknownSymbols.length > 0 || unsupportedSymbols.length > 0
  };
}

export function cleanKnownUnsupportedSymbols(text: string): string {
  return Array.from(text)
    .filter((symbol) => DOTA_SYMBOLS_BY_VALUE.get(symbol)?.compatibility !== 'unsupported')
    .join('');
}