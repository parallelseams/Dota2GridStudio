import { ProjectState } from '../types/dota';
import { DOTA_HEROES } from '../data/dotaHeroes';

export function generateStandaloneHtml(initialProject?: ProjectState): string {
  const heroesJson = JSON.stringify(DOTA_HEROES);
  const projectJson = JSON.stringify(initialProject || null);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dota 2 Grid Studio (Desktop Edition)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0b0d13;
      --panel-bg: #131722;
      --panel-border: #232a3b;
      --accent-gold: #f59e0b;
      --accent-red: #ef4444;
      --accent-blue: #3b82f6;
      --text-main: #f1f5f9;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-dark);
      color: var(--text-main);
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      height: 48px;
      background: #0f121a;
      border-bottom: 1px solid var(--panel-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 50;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Cinzel', serif;
      font-weight: 700;
      font-size: 16px;
      color: var(--accent-gold);
      letter-spacing: 0.5px;
    }
    .badge-35x7 {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fbbf24;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'Inter', sans-serif;
    }
    .btn {
      background: #1e2433;
      border: 1px solid var(--panel-border);
      color: var(--text-main);
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s;
    }
    .btn:hover { background: #2a3347; border-color: #3b4661; }
    .btn-gold { background: #d97706; border-color: #f59e0b; color: #fff; font-weight: 600; }
    .btn-gold:hover { background: #b45309; }
    .btn-red { background: #991b1b; border-color: #ef4444; color: #fff; }
    .btn-red:hover { background: #7f1d1d; }
    .main-workspace {
      flex: 1;
      display: flex;
      position: relative;
      overflow: hidden;
    }
    .sidebar-left, .sidebar-right {
      width: 290px;
      background: var(--panel-bg);
      border-color: var(--panel-border);
      display: flex;
      flex-direction: column;
      z-index: 40;
    }
    .sidebar-left { border-right: 1px solid var(--panel-border); }
    .sidebar-right { border-left: 1px solid var(--panel-border); }
    .sidebar-header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--panel-border);
      font-size: 13px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #cbd5e1;
    }
    .hero-search {
      padding: 10px 14px;
      border-bottom: 1px solid var(--panel-border);
    }
    .hero-search input {
      width: 100%;
      background: #0d1017;
      border: 1px solid var(--panel-border);
      padding: 7px 10px;
      border-radius: 6px;
      color: #fff;
      font-size: 12px;
      outline: none;
    }
    .hero-search input:focus { border-color: var(--accent-gold); }
    .attr-filters {
      display: flex;
      gap: 4px;
      padding: 8px 14px;
      border-bottom: 1px solid var(--panel-border);
    }
    .attr-btn {
      flex: 1;
      padding: 5px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 4px;
      border: 1px solid var(--panel-border);
      background: #171c2a;
      color: var(--text-muted);
      cursor: pointer;
      text-align: center;
    }
    .attr-btn.active { background: #283147; color: #fff; border-color: #475569; }
    .hero-list {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      align-content: start;
    }
    .hero-card {
      aspect-ratio: 16/9;
      background: #1a202c;
      border: 1px solid #2d3748;
      border-radius: 4px;
      overflow: hidden;
      cursor: grab;
      position: relative;
      transition: transform 0.1s, border-color 0.1s;
    }
    .hero-card:hover { transform: scale(1.05); border-color: var(--accent-gold); z-index: 10; }
    .hero-card img { width: 100%; height: 100%; object-fit: cover; }
    .hero-card-name {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,0.75);
      font-size: 8px;
      padding: 2px;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .canvas-container {
      flex: 1;
      position: relative;
      background: #080a0f;
      cursor: default;
      overflow: hidden;
    }
    canvas { display: block; }
    .floating-toolbar {
      position: absolute;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      background: #131722;
      border: 1px solid var(--panel-border);
      border-radius: 8px;
      padding: 4px;
      display: flex;
      gap: 4px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      z-index: 30;
    }
    .tool-btn {
      padding: 6px 10px;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: #94a3b8;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tool-btn.active { background: #2563eb; color: #fff; }
    .tool-btn:hover:not(.active) { background: #1f2738; color: #f1f5f9; }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
    }
    .modal-overlay.open { opacity: 1; pointer-events: auto; }
    .modal-card {
      width: 720px;
      max-width: 90vw;
      max-height: 85vh;
      background: #131722;
      border: 1px solid var(--panel-border);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
    .modal-body { padding: 20px; overflow-y: auto; flex: 1; }
    pre {
      background: #0a0c10;
      border: 1px solid var(--panel-border);
      border-radius: 6px;
      padding: 12px;
      font-family: monospace;
      font-size: 11px;
      color: #a5f3fc;
      max-height: 300px;
      overflow-y: auto;
      user-select: text;
    }
  </style>
</head>
<body>
  <header>
    <div class="logo">
      <span>⚔️ DOTA GRID STUDIO</span>
      <span class="badge-35x7">35×7 Grid (245 Slots) + 10 Bans</span>
    </div>
    <div style="display:flex; gap:8px;">
      <button class="btn" id="btnUploadBg">🖼️ Upload Background</button>
      <input type="file" id="bgFileInput" accept="image/*" style="display:none">
      <button class="btn" id="btnToggleLockBg">🔓 Lock BG</button>
      <button class="btn" id="btnUndo">↩️ Undo</button>
      <button class="btn" id="btnRedo">↪️ Redo</button>
      <button class="btn" id="btnSaveProj">💾 Save JSON</button>
      <button class="btn" id="btnLoadProj">📂 Load JSON</button>
      <input type="file" id="projFileInput" accept=".json" style="display:none">
      <button class="btn btn-gold" id="btnExportPng">📷 Export PNG</button>
      <button class="btn btn-red" id="btnExportDota">🎮 Export Dota JSON</button>
    </div>
  </header>

  <div class="main-workspace">
    <!-- Left Hero Drawer -->
    <div class="sidebar-left">
      <div class="sidebar-header">
        <span>HERO ROSTER</span>
        <span id="heroCountBadge" style="font-size:11px; color:var(--accent-gold);">124 Heroes</span>
      </div>
      <div class="hero-search">
        <input type="text" id="heroSearchInput" placeholder="Search hero (e.g. Invoker, Axe)...">
      </div>
      <div class="attr-filters">
        <button class="attr-btn active" data-attr="all">All</button>
        <button class="attr-btn" data-attr="str" style="color:#ef4444">STR</button>
        <button class="attr-btn" data-attr="agi" style="color:#22c55e">AGI</button>
        <button class="attr-btn" data-attr="int" style="color:#06b6d4">INT</button>
        <button class="attr-btn" data-attr="uni" style="color:#a855f7">UNI</button>
      </div>
      <div style="padding: 6px 12px; display:flex; gap:6px;">
        <button class="btn" id="btnFillAlphabetical" style="flex:1; font-size:10px; padding:4px;">Fill A-Z</button>
        <button class="btn" id="btnFillAttr" style="flex:1; font-size:10px; padding:4px;">Fill By Attr</button>
        <button class="btn" id="btnClearSlots" style="flex:1; font-size:10px; padding:4px;">Clear All</button>
      </div>
      <div class="hero-list" id="heroListContainer"></div>
    </div>

    <!-- Central Interactive Canvas -->
    <div class="canvas-container" id="canvasContainer">
      <div class="floating-toolbar">
        <button class="tool-btn active" data-tool="select">↖ Select</button>
        <button class="tool-btn" data-tool="pan">✋ Pan</button>
        <button class="tool-btn" data-tool="text">T Text</button>
        <button class="tool-btn" data-tool="rect">▢ Rect</button>
        <button class="tool-btn" data-tool="circle">◯ Circle</button>
        <button class="tool-btn" data-tool="line">↗ Line</button>
        <button class="tool-btn" data-tool="brush">✏ Brush</button>
        <button class="tool-btn" id="btnResetZoom">🔍 100%</button>
      </div>
      <canvas id="studioCanvas"></canvas>
    </div>

    <!-- Right Inspector & Layers -->
    <div class="sidebar-right">
      <div class="sidebar-header">
        <span>GRID & PROPERTIES</span>
      </div>
      <div style="padding:14px; overflow-y:auto; flex:1;">
        <div style="margin-bottom:16px;">
          <label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:6px;">GRID CONFIGURATION</label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <div>
              <span style="font-size:10px; color:#64748b;">Columns</span>
              <input type="number" id="gridColsInput" value="35" min="1" max="50" style="width:100%; background:#0d1017; border:1px solid #232a3b; color:#fff; padding:4px 8px; border-radius:4px;">
            </div>
            <div>
              <span style="font-size:10px; color:#64748b;">Rows</span>
              <input type="number" id="gridRowsInput" value="7" min="1" max="20" style="width:100%; background:#0d1017; border:1px solid #232a3b; color:#fff; padding:4px 8px; border-radius:4px;">
            </div>
          </div>
          <button class="btn" id="btnRegenerateGrid" style="width:100%; margin-top:8px; justify-content:center;">Regenerate 35×7 Grid (245 Slots)</button>
        </div>

        <div style="margin-bottom:16px;">
          <label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:6px;">BAN SLOTS CONFIG</label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <div>
              <span style="font-size:10px; color:#64748b;">Ban Count</span>
              <input type="number" id="banCountInput" value="10" min="0" max="20" style="width:100%; background:#0d1017; border:1px solid #232a3b; color:#fff; padding:4px 8px; border-radius:4px;">
            </div>
            <div>
              <span style="font-size:10px; color:#64748b;">Slot Gap</span>
              <input type="number" id="banGapInput" value="6" min="0" max="20" style="width:100%; background:#0d1017; border:1px solid #232a3b; color:#fff; padding:4px 8px; border-radius:4px;">
            </div>
          </div>
          <button class="btn btn-red" id="btnRegenerateBans" style="width:100%; margin-top:8px; justify-content:center;">Reset 10 Ban Slots</button>
        </div>

        <div style="margin-bottom:16px;">
          <label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:6px;">ADD UNICODE SYMBOLS</label>
          <div style="display:flex; flex-wrap:wrap; gap:6px;" id="symbolPicker">
            <button class="btn" data-sym="⚔️">⚔️</button>
            <button class="btn" data-sym="🛡️">🛡️</button>
            <button class="btn" data-sym="👑">👑</button>
            <button class="btn" data-sym="⭐">⭐</button>
            <button class="btn" data-sym="🚫">🚫</button>
            <button class="btn" data-sym="💀">💀</button>
            <button class="btn" data-sym="🔥">🔥</button>
            <button class="btn" data-sym="⚡">⚡</button>
            <button class="btn" data-sym="💎">💎</button>
            <button class="btn" data-sym="🏆">🏆</button>
          </div>
        </div>

        <div>
          <label style="font-size:11px; color:#94a3b8; display:block; margin-bottom:6px;">LAYERS & VISIBILITY</label>
          <div id="layersList" style="display:flex; flex-direction:column; gap:4px; max-height:200px; overflow-y:auto;"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Dota Export Modal -->
  <div class="modal-overlay" id="dotaModal">
    <div class="modal-card">
      <div class="sidebar-header" style="background:#0d1017;">
        <span>DOTA 2 HERO_GRID_CONFIG.JSON EXPORT</span>
        <button class="btn" id="btnCloseDotaModal" style="padding:2px 8px;">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size:12px; color:#cbd5e1; margin-bottom:12px;">
          Copy this file into your Steam user directory to see your layout in Dota 2:
          <br><code style="color:#fbbf24; background:#1e2433; padding:2px 6px; border-radius:4px; display:inline-block; margin-top:4px;">Steam/userdata/&lt;YourSteamID&gt;/570/remote/cfg/hero_grid_config.json</code>
        </p>
        <pre id="dotaJsonOutput"></pre>
      </div>
      <div style="padding:14px; background:#0f121a; border-top:1px solid var(--panel-border); display:flex; justify-content:flex-end; gap:8px;">
        <button class="btn" id="btnCopyDotaJson">📋 Copy JSON</button>
        <button class="btn btn-gold" id="btnDownloadDotaJson">💾 Download hero_grid_config.json</button>
      </div>
    </div>
  </div>

  <script>
    const DOTA_HEROES = ${heroesJson};
    let project = ${projectJson} || {
      id: 'proj_' + Date.now(),
      title: '35x7 Dota 2 Strategy Grid',
      canvasWidth: 1920,
      canvasHeight: 1080,
      canvasBgColor: '#0c0e14',
      background: { imageUrl: null, opacity: 0.6, scaleMode: 'fit', locked: false, visible: true, x:0, y:0, width:1920, height:1080 },
      grids: [],
      items: [
        { id: 't1', name: 'Header', type: 'text', x: 960, y: 60, width: 600, height: 50, rotation: 0, opacity: 1, locked: false, visible: true, text: 'DOTA 2 HERO GRID STUDIO', fontSize: 32, fontFamily: 'Cinzel, serif', fontWeight: 'bold', textAlign: 'center', textColor: '#f59e0b', textGlow: 'rgba(245, 158, 11, 0.45)' }
      ]
    };

    // Hero lookup
    const heroMap = new Map();
    DOTA_HEROES.forEach(h => heroMap.set(h.id, h));

    // Initialize default grids if empty
    function initDefaultGrids() {
      // 35 x 7 = 245 slots
      const cols = 35;
      const rows = 7;
      const slotW = 48;
      const slotH = 30;
      const gap = 4;
      const totalW = cols * slotW + (cols - 1) * gap;
      const startX = Math.round((1920 - totalW) / 2);
      const startY = 160;

      const mainSlots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          mainSlots.push({
            id: 'slot_' + r + '_' + c,
            col: c, row: r,
            x: startX + c * (slotW + gap),
            y: startY + r * (slotH + gap),
            width: slotW, height: slotH,
            heroId: idx < DOTA_HEROES.length ? DOTA_HEROES[idx].id : null,
            isBan: false
          });
        }
      }

      const mainGrid = {
        id: 'main_grid',
        name: 'Main Hero Grid (35×7 = 245 Slots)',
        cols: 35, rows: 7,
        slotWidth: slotW, slotHeight: slotH,
        gapX: gap, gapY: gap,
        x: startX, y: startY,
        slotBgColor: '#161922',
        slotBorderColor: '#3b4252',
        isBanGrid: false,
        locked: false, visible: true,
        slots: mainSlots
      };

      // 10 Ban slots
      const banCount = 10;
      const banW = 52;
      const banH = 34;
      const banGap = 6;
      const totalBanW = banCount * banW + (banCount - 1) * banGap;
      const banStartX = Math.round((1920 - totalBanW) / 2);
      const banStartY = 880;

      const banSlots = [];
      for (let i = 0; i < banCount; i++) {
        banSlots.push({
          id: 'ban_' + i,
          col: i, row: 0,
          x: banStartX + i * (banW + banGap),
          y: banStartY,
          width: banW, height: banH,
          heroId: null,
          isBan: true,
          label: 'BAN ' + (i + 1)
        });
      }

      const banGrid = {
        id: 'ban_grid',
        name: 'Ban Slots (10 Slots)',
        cols: 10, rows: 1,
        slotWidth: banW, slotHeight: banH,
        gapX: banGap, gapY: 0,
        x: banStartX, y: banStartY,
        slotBgColor: '#2b1114',
        slotBorderColor: '#ef4444',
        isBanGrid: true,
        locked: false, visible: true,
        slots: banSlots
      };

      project.grids = [mainGrid, banGrid];
    }

    if (!project.grids || project.grids.length === 0) {
      initDefaultGrids();
    }

    // Canvas Engine
    const canvas = document.getElementById('studioCanvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('canvasContainer');

    let transform = { x: 0, y: 0, zoom: 1 };
    let currentTool = 'select';
    let isPanning = false;
    let panStart = { x: 0, y: 0 };
    let hoveredSlot = null;
    let selectedSlot = null;
    let draggingHeroData = null;
    const imgCache = new Map();

    function resizeCanvas() {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      // Auto center canvas on load
      if (transform.zoom === 1 && transform.x === 0 && transform.y === 0) {
        const scale = Math.min(canvas.width / 2000, canvas.height / 1150);
        transform.zoom = Math.max(0.3, Math.min(1.2, scale));
        transform.x = (canvas.width - 1920 * transform.zoom) / 2;
        transform.y = (canvas.height - 1080 * transform.zoom) / 2;
      }
      render();
    }

    window.addEventListener('resize', resizeCanvas);

    function getCachedImage(url) {
      if (!url) return null;
      if (imgCache.has(url)) {
        const img = imgCache.get(url);
        return img.complete ? img : null;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => render();
      imgCache.set(url, img);
      return null;
    }

    function render() {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#080a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.zoom, transform.zoom);

      // Canvas board
      ctx.fillStyle = project.canvasBgColor || '#0c0e14';
      ctx.fillRect(0, 0, 1920, 1080);
      ctx.strokeStyle = '#232a3b';
      ctx.strokeRect(0, 0, 1920, 1080);

      // Background image
      if (project.background && project.background.visible && project.background.imageUrl) {
        const bgImg = getCachedImage(project.background.imageUrl);
        if (bgImg) {
          ctx.save();
          ctx.globalAlpha = project.background.opacity || 0.6;
          ctx.drawImage(bgImg, 0, 0, 1920, 1080);
          ctx.restore();
        }
      }

      // Grids & Slots
      project.grids.forEach(g => {
        if (!g.visible) return;
        g.slots.forEach(slot => {
          const isHov = hoveredSlot && hoveredSlot.id === slot.id;
          const isSel = selectedSlot && selectedSlot.id === slot.id;

          ctx.save();
          ctx.fillStyle = slot.isBan ? '#220e11' : g.slotBgColor;
          ctx.fillRect(slot.x, slot.y, slot.width, slot.height);

          if (slot.heroId) {
            const h = heroMap.get(slot.heroId);
            if (h) {
              const url = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/' + h.shortName + '.png';
              const img = getCachedImage(url);
              if (img) {
                ctx.drawImage(img, slot.x, slot.y, slot.width, slot.height);
              } else {
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
                ctx.fillStyle = '#fff';
                ctx.font = '9px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(h.displayName.slice(0, 5), slot.x + slot.width/2, slot.y + slot.height/2);
              }
            }
          } else if (slot.isBan) {
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('BAN', slot.x + slot.width/2, slot.y + slot.height/2 + 3);
          }

          ctx.strokeStyle = isSel ? '#f59e0b' : isHov ? '#60a5fa' : slot.isBan ? '#ef4444' : g.slotBorderColor;
          ctx.lineWidth = isSel || isHov ? 2 : 1;
          ctx.strokeRect(slot.x, slot.y, slot.width, slot.height);
          ctx.restore();
        });
      });

      // Canvas Items (Text, etc)
      project.items.forEach(item => {
        if (!item.visible) return;
        ctx.save();
        if (item.type === 'text') {
          ctx.font = (item.fontWeight || 'normal') + ' ' + (item.fontSize || 24) + 'px ' + (item.fontFamily || 'sans-serif');
          ctx.fillStyle = item.textColor || '#fff';
          ctx.textAlign = item.textAlign || 'center';
          if (item.textGlow) {
            ctx.shadowColor = item.textGlow;
            ctx.shadowBlur = 10;
          }
          ctx.fillText(item.text || '', item.x, item.y);
        } else if (item.type === 'rect') {
          ctx.fillStyle = item.fill || '#3b82f6';
          ctx.fillRect(item.x, item.y, item.width, item.height);
        } else if (item.type === 'circle') {
          ctx.beginPath();
          ctx.arc(item.x + item.width/2, item.y + item.height/2, item.width/2, 0, Math.PI*2);
          ctx.fillStyle = item.fill || '#3b82f6';
          ctx.fill();
        }
        ctx.restore();
      });

      ctx.restore();
    }

    // Hero sidebar populate
    function populateHeroList(filterAttr = 'all', search = '') {
      const container = document.getElementById('heroListContainer');
      container.innerHTML = '';
      const list = DOTA_HEROES.filter(h => {
        const matchesAttr = filterAttr === 'all' || h.primaryAttr === filterAttr || (filterAttr === 'uni' && h.primaryAttr === 'all');
        const matchesSearch = !search || h.displayName.toLowerCase().includes(search.toLowerCase());
        return matchesAttr && matchesSearch;
      });

      document.getElementById('heroCountBadge').innerText = list.length + ' Heroes';

      list.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'hero-card';
        card.draggable = true;
        const imgUrl = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/' + hero.shortName + '.png';
        card.innerHTML = '<img src="' + imgUrl + '" alt="' + hero.displayName + '"><div class="hero-card-name">' + hero.displayName + '</div>';

        card.addEventListener('dragstart', (e) => {
          draggingHeroData = hero;
          e.dataTransfer.setData('text/plain', hero.id.toString());
        });
        card.addEventListener('click', () => {
          if (selectedSlot) {
            selectedSlot.heroId = hero.id;
            render();
          }
        });
        container.appendChild(card);
      });
    }

    // Canvas Mouse Events (Pan, Zoom, Drag Drop)
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const mouseX = e.clientX - canvas.getBoundingClientRect().left;
      const mouseY = e.clientY - canvas.getBoundingClientRect().top;
      
      transform.x = mouseX - (mouseX - transform.x) * zoomFactor;
      transform.y = mouseY - (mouseY - transform.y) * zoomFactor;
      transform.zoom *= zoomFactor;
      render();
    });

    canvas.addEventListener('mousedown', (e) => {
      if (currentTool === 'pan' || e.button === 1 || e.spaceKey) {
        isPanning = true;
        panStart = { x: e.clientX - transform.x, y: e.clientY - transform.y };
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left - transform.x) / transform.zoom;
      const canvasY = (e.clientY - rect.top - transform.y) / transform.zoom;

      // Check slot selection
      let found = null;
      project.grids.forEach(g => {
        g.slots.forEach(s => {
          if (canvasX >= s.x && canvasX <= s.x + s.width && canvasY >= s.y && canvasY <= s.y + s.height) {
            found = s;
          }
        });
      });

      selectedSlot = found;
      render();
    });

    window.addEventListener('mousemove', (e) => {
      if (isPanning) {
        transform.x = e.clientX - panStart.x;
        transform.y = e.clientY - panStart.y;
        render();
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left - transform.x) / transform.zoom;
      const canvasY = (e.clientY - rect.top - transform.y) / transform.zoom;

      let found = null;
      project.grids.forEach(g => {
        g.slots.forEach(s => {
          if (canvasX >= s.x && canvasX <= s.x + s.width && canvasY >= s.y && canvasY <= s.y + s.height) {
            found = s;
          }
        });
      });

      if (hoveredSlot !== found) {
        hoveredSlot = found;
        render();
      }
    });

    window.addEventListener('mouseup', () => { isPanning = false; });

    // Drag & drop heroes directly onto canvas slots
    canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const canvasX = (e.clientX - rect.left - transform.x) / transform.zoom;
      const canvasY = (e.clientY - rect.top - transform.y) / transform.zoom;

      let found = null;
      project.grids.forEach(g => {
        g.slots.forEach(s => {
          if (canvasX >= s.x && canvasX <= s.x + s.width && canvasY >= s.y && canvasY <= s.y + s.height) {
            found = s;
          }
        });
      });
      if (hoveredSlot !== found) {
        hoveredSlot = found;
        render();
      }
    });

    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      if (hoveredSlot && draggingHeroData) {
        hoveredSlot.heroId = draggingHeroData.id;
        draggingHeroData = null;
        render();
      }
    });

    // Toolbar buttons
    document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTool = btn.dataset.tool;
      });
    });

    document.getElementById('btnResetZoom').addEventListener('click', () => {
      transform.zoom = 1;
      transform.x = (canvas.width - 1920) / 2;
      transform.y = (canvas.height - 1080) / 2;
      render();
    });

    // Search and filters
    document.getElementById('heroSearchInput').addEventListener('input', (e) => {
      populateHeroList(document.querySelector('.attr-btn.active').dataset.attr, e.target.value);
    });

    document.querySelectorAll('.attr-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.attr-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        populateHeroList(btn.dataset.attr, document.getElementById('heroSearchInput').value);
      });
    });

    // Auto-fill algorithms
    document.getElementById('btnFillAlphabetical').addEventListener('click', () => {
      const sorted = [...DOTA_HEROES].sort((a,b) => a.displayName.localeCompare(b.displayName));
      if (project.grids[0]) {
        project.grids[0].slots.forEach((s, i) => { s.heroId = i < sorted.length ? sorted[i].id : null; });
        render();
      }
    });

    document.getElementById('btnFillAttr').addEventListener('click', () => {
      const attrOrder = { str:0, agi:1, int:2, all:3 };
      const sorted = [...DOTA_HEROES].sort((a,b) => (attrOrder[a.primaryAttr] - attrOrder[b.primaryAttr]) || a.displayName.localeCompare(b.displayName));
      if (project.grids[0]) {
        project.grids[0].slots.forEach((s, i) => { s.heroId = i < sorted.length ? sorted[i].id : null; });
        render();
      }
    });

    document.getElementById('btnClearSlots').addEventListener('click', () => {
      project.grids.forEach(g => g.slots.forEach(s => s.heroId = null));
      render();
    });

    // Background upload & lock
    const bgInput = document.getElementById('bgFileInput');
    document.getElementById('btnUploadBg').addEventListener('click', () => bgInput.click());
    bgInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          project.background.imageUrl = re.target.result;
          render();
        };
        reader.readAsDataURL(file);
      }
    });

    const btnLockBg = document.getElementById('btnToggleLockBg');
    btnLockBg.addEventListener('click', () => {
      project.background.locked = !project.background.locked;
      btnLockBg.innerText = project.background.locked ? '🔒 Unlock BG' : '🔓 Lock BG';
    });

    // Export Dota JSON modal
    const dotaModal = document.getElementById('dotaModal');
    document.getElementById('btnExportDota').addEventListener('click', () => {
      const categories = [];
      project.grids.forEach(g => {
        const ids = g.slots.filter(s => s.heroId).map(s => s.heroId);
        if (ids.length > 0) {
          categories.push({
            category_name: g.isBanGrid ? 'PRIORITY BANS' : g.name.toUpperCase(),
            x_position: Math.round(g.x * (1100 / 1920)),
            y_position: Math.round(g.y * (700 / 1080)),
            width: Math.round((g.cols * g.slotWidth) * (1100 / 1920)),
            height: Math.round((g.rows * g.slotHeight) * (700 / 1080)),
            hero_ids: ids
          });
        }
      });
      const dotaData = { version: 3, configs: [{ config_name: project.title, categories }] };
      const jsonStr = JSON.stringify(dotaData, null, 2);
      document.getElementById('dotaJsonOutput').innerText = jsonStr;
      dotaModal.classList.add('open');
    });

    document.getElementById('btnCloseDotaModal').addEventListener('click', () => dotaModal.classList.remove('open'));
    document.getElementById('btnCopyDotaJson').addEventListener('click', () => {
      navigator.clipboard.writeText(document.getElementById('dotaJsonOutput').innerText);
      alert('Dota 2 hero_grid_config.json copied to clipboard!');
    });

    document.getElementById('btnDownloadDotaJson').addEventListener('click', () => {
      const blob = new Blob([document.getElementById('dotaJsonOutput').innerText], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'hero_grid_config.json';
      a.click();
    });

    // Export PNG
    document.getElementById('btnExportPng').addEventListener('click', () => {
      const expCanvas = document.createElement('canvas');
      expCanvas.width = 1920;
      expCanvas.height = 1080;
      const expCtx = expCanvas.getContext('2d');
      expCtx.fillStyle = project.canvasBgColor || '#0c0e14';
      expCtx.fillRect(0, 0, 1920, 1080);
      
      // Background
      if (project.background && project.background.imageUrl) {
        const bg = getCachedImage(project.background.imageUrl);
        if (bg) expCtx.drawImage(bg, 0, 0, 1920, 1080);
      }

      // Grids
      project.grids.forEach(g => {
        g.slots.forEach(s => {
          expCtx.fillStyle = s.isBan ? '#220e11' : g.slotBgColor;
          expCtx.fillRect(s.x, s.y, s.width, s.height);
          if (s.heroId) {
            const h = heroMap.get(s.heroId);
            if (h) {
              const url = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/' + h.shortName + '.png';
              const img = getCachedImage(url);
              if (img) expCtx.drawImage(img, s.x, s.y, s.width, s.height);
            }
          }
          expCtx.strokeStyle = s.isBan ? '#ef4444' : g.slotBorderColor;
          expCtx.strokeRect(s.x, s.y, s.width, s.height);
        });
      });

      const a = document.createElement('a');
      a.href = expCanvas.toDataURL('image/png');
      a.download = 'dota_grid_layout.png';
      a.click();
    });

    // Save/Load Project JSON
    document.getElementById('btnSaveProj').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'dota_grid_project.json';
      a.click();
    });

    const projInput = document.getElementById('projFileInput');
    document.getElementById('btnLoadProj').addEventListener('click', () => projInput.click());
    projInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          try {
            project = JSON.parse(re.target.result);
            render();
          } catch(err) { alert('Invalid project JSON file'); }
        };
        reader.readAsText(file);
      }
    });

    // Init
    populateHeroList();
    setTimeout(resizeCanvas, 50);
  </script>
</body>
</html>`;
}
