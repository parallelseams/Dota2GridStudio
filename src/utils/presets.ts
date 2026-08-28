import { ProjectState, GridGroup, GridSlot, CanvasItem } from '../types/dota';
import { DOTA_HEROES } from '../data/dotaHeroes';

/**
 * Creates the Japanese Aesthetic Grid matching Screenshot 1
 */
export function createAnimeAestheticProject(): ProjectState {
  const canvasWidth = 1920;
  const canvasHeight = 1080;

  // Left Hero Grid: 3 columns x 4 rows (12 heroes with Dota Plus tier badges)
  // Screenshot 1 heroes:
  // Row 1: Abaddon (30), Windranger (5), Weaver (9), Vengeful Spirit (7)
  // Row 2: Spectre (13), Templar Assassin (9), Slardar (13), Slark (5)
  // Row 3: Rubick (19), Wraith King (29), Venge (9), Io (30)
  const leftHeroes = [
    { id: 102, tier: 30 }, // Abaddon
    { id: 21, tier: 5 },   // Windranger
    { id: 63, tier: 9 },   // Weaver
    { id: 20, tier: 7 },   // Vengeful Spirit
    { id: 67, tier: 13 },  // Spectre
    { id: 46, tier: 9 },   // Templar Assassin
    { id: 28, tier: 13 },  // Slardar
    { id: 94, tier: 5 },   // Slark
    { id: 86, tier: 19 },  // Rubick
    { id: 42, tier: 29 },  // Wraith King
    { id: 20, tier: 9 },   // Venge
    { id: 91, tier: 30 }   // Io
  ];

  const leftSlotW = 54;
  const leftSlotH = 74;
  const leftCols = 4;
  const leftRows = 3;
  const leftStartX = 410;
  const leftStartY = 160;

  const leftSlots: GridSlot[] = [];
  for (let r = 0; r < leftRows; r++) {
    for (let c = 0; c < leftCols; c++) {
      const idx = r * leftCols + c;
      const heroData = leftHeroes[idx];
      leftSlots.push({
        id: `anime_left_${r}_${c}`,
        col: c,
        row: r,
        x: leftStartX + c * (leftSlotW + 6),
        y: leftStartY + r * (leftSlotH + 6),
        width: leftSlotW,
        height: leftSlotH,
        heroId: heroData ? heroData.id : null,
        heroTierLevel: heroData ? heroData.tier : 15,
        locked: false
      });
    }
  }

  // Right Hero Grid: 4 columns x 3 rows (8-12 heroes)
  // Phoenix (3), Queen of Pain (4), Shadow Demon (4), Lina (3), Templar (2), Razor, etc.
  const rightHeroes = [
    { id: 110, tier: 3 }, // Phoenix
    { id: 39, tier: 4 },  // QoP
    { id: 79, tier: 4 },  // Shadow Demon
    { id: 25, tier: 3 },  // Lina
    { id: 46, tier: 2 },  // Templar
    { id: 15, tier: 2 },  // Razor
    { id: 108, tier: 3 }, // Underlord
    { id: 83, tier: 3 },  // Treant
    { id: 45, tier: 2 },  // Pugna
    { id: 62, tier: 4 },  // Bounty Hunter
    { id: 119, tier: 5 }, // Dark Willow
    { id: 85, tier: 3 }   // Undying
  ];

  const rightStartX = 1010;
  const rightStartY = 450;
  const rightCols = 4;
  const rightRows = 3;
  const rightSlots: GridSlot[] = [];

  for (let r = 0; r < rightRows; r++) {
    for (let c = 0; c < rightCols; c++) {
      const idx = r * rightCols + c;
      const heroData = rightHeroes[idx];
      rightSlots.push({
        id: `anime_right_${r}_${c}`,
        col: c,
        row: r,
        x: rightStartX + c * (leftSlotW + 6),
        y: rightStartY + r * (leftSlotH + 6),
        width: leftSlotW,
        height: leftSlotH,
        heroId: heroData ? heroData.id : null,
        heroTierLevel: heroData ? heroData.tier : 3,
        locked: false
      });
    }
  }

  const grids: GridGroup[] = [
    {
      id: 'anime_left_pool',
      name: 'Main Hero Pool (Pos 1 / 2 / 5)',
      cols: leftCols,
      rows: leftRows,
      slotWidth: leftSlotW,
      slotHeight: leftSlotH,
      gapX: 6,
      gapY: 6,
      x: leftStartX,
      y: leftStartY,
      slotBorderColor: '#2B3A52',
      slotBgColor: '#0E1420',
      slotBorderRadius: 4,
      locked: false,
      visible: true,
      slots: leftSlots
    },
    {
      id: 'anime_right_pool',
      name: 'Secondary Support & Flex Pool',
      cols: rightCols,
      rows: rightRows,
      slotWidth: leftSlotW,
      slotHeight: leftSlotH,
      gapX: 6,
      gapY: 6,
      x: rightStartX,
      y: rightStartY,
      slotBorderColor: '#2B3A52',
      slotBgColor: '#0E1420',
      slotBorderRadius: 4,
      locked: false,
      visible: true,
      slots: rightSlots
    }
  ];

  // Decorative items matching Screenshot 1
  const items: CanvasItem[] = [
    // Left decorative serpentine bracket column
    {
      id: 'left_bracket_col',
      name: 'Left Bracket Ornament )()(',
      type: 'text',
      x: 290,
      y: 110,
      width: 80,
      height: 820,
      rotation: 0,
      opacity: 0.85,
      locked: false,
      visible: true,
      zIndex: 2,
      text: ')()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(',
      fontSize: 16,
      fontFamily: 'ui-monospace, monospace',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#A0AEC0'
    },
    // Right decorative serpentine bracket column
    {
      id: 'right_bracket_col',
      name: 'Right Bracket Ornament )()(',
      type: 'text',
      x: 1560,
      y: 110,
      width: 80,
      height: 820,
      rotation: 0,
      opacity: 0.85,
      locked: false,
      visible: true,
      zIndex: 2,
      text: ')()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(\n)()(',
      fontSize: 16,
      fontFamily: 'ui-monospace, monospace',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#A0AEC0'
    },
    // Top dashed aesthetic banner
    {
      id: 'top_dashed_banner',
      name: 'Top Header Dashed Border',
      type: 'text',
      x: 960,
      y: 95,
      width: 1200,
      height: 30,
      rotation: 0,
      opacity: 0.7,
      locked: false,
      visible: true,
      zIndex: 3,
      text: '═══════ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  ✧  ♡  ✧  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ═══════',
      fontSize: 14,
      fontFamily: 'Cinzel, Georgia, serif',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#CBD5E1'
    },
    // Top Japanese poem lyrics
    {
      id: 'japanese_top_lyrics',
      name: 'Japanese Aesthetic Lyrics (Top)',
      type: 'text',
      x: 1000,
      y: 160,
      width: 440,
      height: 240,
      rotation: 0,
      opacity: 0.9,
      locked: false,
      visible: true,
      zIndex: 4,
      text: 'うれしそうな音\n優しい音\nそれは今カムバックです\n世界で最も幸せなサポート\n任意のコストでチームメイトを保存\n私たちはシールです\n> ^ - - ^ <',
      fontSize: 17,
      fontFamily: 'sans-serif',
      fontWeight: '600',
      textAlign: 'left',
      textColor: '#CBD5E1'
    },
    // Bottom Japanese team quote
    {
      id: 'japanese_bottom_quote',
      name: 'Japanese Carry Quote (Bottom)',
      type: 'text',
      x: 670,
      y: 600,
      width: 440,
      height: 240,
      rotation: 0,
      opacity: 0.9,
      locked: false,
      visible: true,
      zIndex: 4,
      text: 'マイキャリー\nキリルメガミポ\nキリルトリプルキル\nキリルは超キラーです\n最強と賢い\n世界で最高のチームメイト\n私たちはシールです',
      fontSize: 16,
      fontFamily: 'sans-serif',
      fontWeight: '600',
      textAlign: 'center',
      textColor: '#CBD5E1'
    },
    // Bottom dotted line
    {
      id: 'bottom_dotted_line',
      name: 'Bottom Hidden Heroes Line',
      type: 'text',
      x: 960,
      y: 950,
      width: 1200,
      height: 30,
      rotation: 0,
      opacity: 0.6,
      locked: false,
      visible: true,
      zIndex: 3,
      text: '═══════ ─ ─ ─ ─ ─ ─ ─ ─  НЕ ВИДНО 93 ГЕРОЕВ  ─ ─ ─ ─ ─ ─ ─ ─ ═══════',
      fontSize: 13,
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#94A3B8'
    }
  ];

  return {
    id: `project_anime_${Date.now()}`,
    title: 'Anime Aesthetic Dota 2 Grid (Японский Стиль)',
    canvasWidth,
    canvasHeight,
    canvasBgColor: '#070A0F',
    background: {
      imageUrl: null,
      opacity: 0.5,
      scaleMode: 'cover' as any,
      locked: false,
      visible: false,
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight
    },
    grids,
    items,
    snapToGrid: true,
    snapThreshold: 8,
    showRulers: false,
    showGridLines: false,
    showHeroNames: false,
    showHeroTiers: true,
    cardStyle: 'portrait'
  };
}

/**
 * Creates the Role-Based Tournament Grid matching Screenshot 2
 */
export function createRoleProProject(): ProjectState {
  const canvasWidth = 1920;
  const canvasHeight = 1080;

  const slotW = 56;
  const slotH = 76;
  const gap = 8;

  // 1. Kerry / Pos 1 (4 heroes: Naga, Spectre, Hoodwink, Ursa)
  const pos1Heroes = [
    { id: 89, tier: 8 },  // Naga Siren
    { id: 67, tier: 8 },  // Spectre
    { id: 123, tier: 15 },// Hoodwink
    { id: 70, tier: 16 }  // Ursa
  ];
  const pos1StartX = 80;
  const pos1StartY = 220;
  const pos1Slots: GridSlot[] = pos1Heroes.map((h, i) => ({
    id: `pos1_slot_${i}`,
    col: i,
    row: 0,
    x: pos1StartX + i * (slotW + gap),
    y: pos1StartY,
    width: slotW,
    height: slotH,
    heroId: h.id,
    heroTierLevel: h.tier,
    locked: false
  }));

  // 2. Main (2 heroes: Windranger 14, QoP 19)
  const mainHeroes = [
    { id: 21, tier: 14 }, // Windranger
    { id: 39, tier: 19 }  // Queen of Pain
  ];
  const mainStartX = 460;
  const mainStartY = 220;
  const mainSlots: GridSlot[] = mainHeroes.map((h, i) => ({
    id: `main_slot_${i}`,
    col: 0,
    row: i,
    x: mainStartX,
    y: mainStartY + i * (slotH + gap),
    width: slotW,
    height: slotH,
    heroId: h.id,
    heroTierLevel: h.tier,
    locked: false
  }));

  // 3. Hard Line / Pos 3 (4 heroes: Terrorblade, Centaur, Tidehunter, Dragon Knight, Dawnbreaker)
  const pos3Heroes = [
    { id: 109, tier: 5 }, // Terrorblade
    { id: 96, tier: 12 }, // Centaur
    { id: 29, tier: 13 }, // Tidehunter
    { id: 49, tier: 7 },  // Dragon Knight
    { id: 135, tier: 9 }  // Dawnbreaker
  ];
  const pos3StartX = 580;
  const pos3StartY = 220;
  const pos3Slots: GridSlot[] = pos3Heroes.map((h, i) => ({
    id: `pos3_slot_${i}`,
    col: i,
    row: 0,
    x: pos3StartX + i * (slotW + gap),
    y: pos3StartY,
    width: slotW,
    height: slotH,
    heroId: h.id,
    heroTierLevel: h.tier,
    locked: false
  }));

  // 4. Mid / Pos 2 (4 heroes: Muerta, Enigma, Invoker, Underlord)
  const pos2Heroes = [
    { id: 138, tier: 8 }, // Muerta
    { id: 33, tier: 4 },  // Enigma
    { id: 74, tier: 16 }, // Invoker
    { id: 108, tier: 12 } // Underlord
  ];
  const pos2StartX = 80;
  const pos2StartY = 660;
  const pos2Slots: GridSlot[] = pos2Heroes.map((h, i) => ({
    id: `pos2_slot_${i}`,
    col: i,
    row: 0,
    x: pos2StartX + i * (slotW + gap),
    y: pos2StartY,
    width: slotW,
    height: slotH,
    heroId: h.id,
    heroTierLevel: h.tier,
    locked: false
  }));

  // 5. Support / Pos 4 | Pos 5 (5 heroes: Vengeful Spirit, Enchantress, Lion, Pudge, Crystal Maiden)
  const supHeroes = [
    { id: 20, tier: 8 },  // Vengeful Spirit
    { id: 58, tier: 6 },  // Enchantress
    { id: 26, tier: 30 }, // Lion
    { id: 14, tier: 22 }, // Pudge
    { id: 5, tier: 13 }   // Crystal Maiden
  ];
  const supStartX = 580;
  const supStartY = 660;
  const supSlots: GridSlot[] = supHeroes.map((h, i) => ({
    id: `sup_slot_${i}`,
    col: i,
    row: 0,
    x: supStartX + i * (slotW + gap),
    y: supStartY,
    width: slotW,
    height: slotH,
    heroId: h.id,
    heroTierLevel: h.tier,
    locked: false
  }));

  const grids: GridGroup[] = [
    {
      id: 'grid_pos1',
      name: '<KERRY | POS 1>',
      cols: 4,
      rows: 1,
      slotWidth: slotW,
      slotHeight: slotH,
      gapX: gap,
      gapY: gap,
      x: pos1StartX,
      y: pos1StartY,
      slotBorderColor: '#2B3A52',
      slotBgColor: '#0E1420',
      slotBorderRadius: 4,
      locked: false,
      visible: true,
      slots: pos1Slots
    },
    {
      id: 'grid_main',
      name: '[]MAIN[]',
      cols: 1,
      rows: 2,
      slotWidth: slotW,
      slotHeight: slotH,
      gapX: gap,
      gapY: gap,
      x: mainStartX,
      y: mainStartY,
      slotBorderColor: '#F59E0B',
      slotBgColor: '#1A1408',
      slotBorderRadius: 4,
      locked: false,
      visible: true,
      slots: mainSlots
    },
    {
      id: 'grid_pos3',
      name: '<HARD LINE | POS 3>',
      cols: 5,
      rows: 1,
      slotWidth: slotW,
      slotHeight: slotH,
      gapX: gap,
      gapY: gap,
      x: pos3StartX,
      y: pos3StartY,
      slotBorderColor: '#2B3A52',
      slotBgColor: '#0E1420',
      slotBorderRadius: 4,
      locked: false,
      visible: true,
      slots: pos3Slots
    },
    {
      id: 'grid_pos2',
      name: '<MID | POS 2>',
      cols: 4,
      rows: 1,
      slotWidth: slotW,
      slotHeight: slotH,
      gapX: gap,
      gapY: gap,
      x: pos2StartX,
      y: pos2StartY,
      slotBorderColor: '#2B3A52',
      slotBgColor: '#0E1420',
      slotBorderRadius: 4,
      locked: false,
      visible: true,
      slots: pos2Slots
    },
    {
      id: 'grid_pos45',
      name: '<SUPPORT | POS 4 | POS 5>',
      cols: 5,
      rows: 1,
      slotWidth: slotW,
      slotHeight: slotH,
      gapX: gap,
      gapY: gap,
      x: supStartX,
      y: supStartY,
      slotBorderColor: '#2B3A52',
      slotBgColor: '#0E1420',
      slotBorderRadius: 4,
      locked: false,
      visible: true,
      slots: supSlots
    }
  ];

  const items: CanvasItem[] = [
    // Top Dotted Separator Bar
    {
      id: 'top_separator_line',
      name: 'Category Top Line',
      type: 'text',
      x: 960,
      y: 110,
      width: 1800,
      height: 24,
      rotation: 0,
      opacity: 0.6,
      locked: false,
      visible: true,
      zIndex: 1,
      text: '------------------------------------------------------------------------------------------------------------------------',
      fontSize: 14,
      fontFamily: 'monospace',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#475569'
    },
    // <KERRY | POS 1> Header Text
    {
      id: 'header_pos1',
      name: '<KERRY | POS 1>',
      type: 'text',
      x: pos1StartX + 120,
      y: 175,
      width: 260,
      height: 36,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 2,
      text: '<KERRY | POS 1>',
      fontSize: 15,
      fontFamily: 'Cinzel, Georgia, serif',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#F1F5F9'
    },
    // []MAIN[] Header Text
    {
      id: 'header_main',
      name: '[]MAIN[]',
      type: 'text',
      x: mainStartX + 28,
      y: 175,
      width: 140,
      height: 36,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 2,
      text: '[]MAIN[]',
      fontSize: 15,
      fontFamily: 'Cinzel, Georgia, serif',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#F59E0B'
    },
    // <HARD LINE | POS 3> Header Text
    {
      id: 'header_pos3',
      name: '<HARD LINE | POS 3>',
      type: 'text',
      x: pos3StartX + 160,
      y: 175,
      width: 300,
      height: 36,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 2,
      text: '<HARD LINE | POS 3>',
      fontSize: 15,
      fontFamily: 'Cinzel, Georgia, serif',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#F1F5F9'
    },
    // Mid Dotted Separator Bar
    {
      id: 'mid_separator_line',
      name: 'Middle Line',
      type: 'text',
      x: 960,
      y: 570,
      width: 1800,
      height: 24,
      rotation: 0,
      opacity: 0.6,
      locked: false,
      visible: true,
      zIndex: 1,
      text: '------------------------------------------------------------------------------------------------------------------------',
      fontSize: 14,
      fontFamily: 'monospace',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#475569'
    },
    // <MID | POS 2> Header Text
    {
      id: 'header_pos2',
      name: '<MID | POS 2>',
      type: 'text',
      x: pos2StartX + 120,
      y: 615,
      width: 240,
      height: 36,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 2,
      text: '<MID | POS 2>',
      fontSize: 15,
      fontFamily: 'Cinzel, Georgia, serif',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#F1F5F9'
    },
    // <SUPPORT | POS 4 | POS 5> Header Text
    {
      id: 'header_support',
      name: '<SUPPORT | POS 4 | POS 5>',
      type: 'text',
      x: supStartX + 160,
      y: 615,
      width: 360,
      height: 36,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 2,
      text: '<SUPPORT | POS 4 | POS 5>',
      fontSize: 15,
      fontFamily: 'Cinzel, Georgia, serif',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#F1F5F9'
    }
  ];

  return {
    id: `project_roles_${Date.now()}`,
    title: 'Dota 2 Pro Roles Layout (<KERRY> <MID> <OFF> <SUP>)',
    canvasWidth,
    canvasHeight,
    canvasBgColor: '#090D14',
    background: {
      imageUrl: null,
      opacity: 0.5,
      scaleMode: 'cover' as any,
      locked: false,
      visible: false,
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight
    },
    grids,
    items,
    snapToGrid: true,
    snapThreshold: 8,
    showRulers: false,
    showGridLines: false,
    showHeroNames: true,
    showHeroTiers: true,
    cardStyle: 'portrait'
  };
}
