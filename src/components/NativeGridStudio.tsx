import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, FolderDown, Monitor, Users, X, ShieldCheck, ZoomIn, ZoomOut, Maximize2, Minus, Square, Copy } from 'lucide-react';
import { DOTA_HEROES, getHeroImageUrl } from '../data/dotaHeroes';
import { ProjectState, GridGroup, GridSlot, HeroAttribute, CanvasItem } from '../types/dota';
import { ExportDotaModal } from './modals/ExportDotaModal';
import { exportToDotaGridConfig } from '../utils/gridUtils';

type Group = { id: string; name: string; attr: HeroAttribute; heroIds: number[]; cols: number };
type DotaText = { id: string; name: string; text: string; x: number; y: number; width: number; kind: 'text' | 'line' | 'symbol' };
const STORAGE_KEY = 'dota_grid_studio_native_v2';
const attrMeta: Record<HeroAttribute, { label: string; color: string }> = {
  str: { label: 'СИЛА', color: '#e85a32' }, agi: { label: 'ЛОВКОСТЬ', color: '#38c875' },
  int: { label: 'ИНТЕЛЛЕКТ', color: '#31b7d0' }, all: { label: 'УНИВЕРСАЛЬНЫЕ', color: '#44bd87' }
};
const defaultGroups = (): Group[] => (['str', 'agi', 'int', 'all'] as HeroAttribute[]).map((attr) => ({
  id: `attr-${attr}`, name: attrMeta[attr].label, attr,
  heroIds: DOTA_HEROES.filter((hero) => hero.primaryAttr === attr).map((hero) => hero.id), cols: 5
}));

function makeProject(groups: Group[], decorations: DotaText[] = [], title = 'Моя сетка Dota 2'): ProjectState {
  const grids: GridGroup[] = groups.map((group, groupIndex) => {
    const cols = Math.max(1, group.cols);
    const rows = Math.max(1, Math.ceil(group.heroIds.length / cols));
    const slotWidth = 54, slotHeight = 76, gapX = 6, gapY = 6;
    const slots: GridSlot[] = group.heroIds.map((heroId, index) => ({
      id: `${group.id}-${heroId}`, col: index % cols, row: Math.floor(index / cols),
      x: 10 + groupIndex * 625 + (index % cols) * (slotWidth + gapX),
      y: 150 + Math.floor(index / cols) * (slotHeight + gapY), width: slotWidth, height: slotHeight,
      heroId, locked: false
    }));
    return { id: group.id, name: group.name, cols, rows, slotWidth, slotHeight, gapX, gapY,
      x: 10 + groupIndex * 625, y: 150, slotBorderColor: '#334155', slotBgColor: '#111820', slotBorderRadius: 2,
      locked: false, visible: true, slots };
  });
  return { id: 'native-grid-studio', title, canvasWidth: 2560, canvasHeight: 1440,
    canvasBgColor: '#0a1113', background: { imageUrl: null, opacity: 1, scaleMode: 'fit', locked: true, visible: false, x: 0, y: 0, width: 0, height: 0 },
    grids, items: decorations.map((decoration, index): CanvasItem => ({ id: decoration.id, name: decoration.name, type: 'text', x: decoration.x * 2560 / 1200, y: decoration.y * 1440 / 700, width: decoration.width * 2560 / 1200, height: 32 * 1440 / 700, rotation: 0, opacity: 1, locked: false, visible: true, zIndex: 50 + index, text: decoration.text, fontSize: 18, fontFamily: 'sans-serif', fontWeight: '600', textAlign: 'left', textColor: '#ffffff' })), snapToGrid: false, snapThreshold: 0, showRulers: false, showGridLines: false,
    showHeroNames: false, showHeroTiers: false, cardStyle: 'portrait', exportMode: 'single_category' };
}

export default function NativeGridStudio() {
  const [groups, setGroups] = useState<Group[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as Group[];
    } catch { /* Restore a clean Dota-native starter layout. */ }
    return defaultGroups();
  });
  const [query, setQuery] = useState('');
  const [libraryAttr, setLibraryAttr] = useState<HeroAttribute | 'any'>('any');
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight);
  const [previewScale, setPreviewScale] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]?.id ?? '');
  const [selectedHero, setSelectedHero] = useState<number | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [decorations, setDecorations] = useState<DotaText[]>(() => { try { return JSON.parse(localStorage.getItem('dota_grid_native_text_v1') || '[]') as DotaText[]; } catch { return []; } });
  const [selectedDecoration, setSelectedDecoration] = useState<string | null>(null);
const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isWindowMaximized, setIsWindowMaximized] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryDecoration, setCategoryDecoration] = useState('');
  const [scan, setScan] = useState<Awaited<ReturnType<NonNullable<Window['dotaDesktop']>['getTargets']>> | null>(null);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(groups)); }, [groups]);
  useEffect(() => { localStorage.setItem('dota_grid_native_text_v1', JSON.stringify(decorations)); }, [decorations]);
  useEffect(() => { window.dotaDesktop?.getTargets().then(setScan).catch(() => {}); }, []);
  useEffect(() => window.dotaDesktop?.onWindowState(setIsWindowMaximized), []);
  useEffect(() => { const updateSize = () => setViewportHeight(window.innerHeight); window.addEventListener('resize', updateSize); return () => window.removeEventListener('resize', updateSize); }, []);

  const project = useMemo(() => makeProject(groups, decorations), [groups, decorations]);
  const assignedCount = groups.reduce((sum, group) => sum + group.heroIds.length, 0);
  const maxRows = Math.max(1, ...groups.map((group) => Math.ceil(group.heroIds.length / group.cols)));
  const fitCardHeight = Math.max(42, Math.min(90, Math.floor((viewportHeight - 365) / maxRows)));
  const cardHeight = Math.floor(fitCardHeight * previewScale);
  const dotaConfig = useMemo(() => exportToDotaGridConfig(project), [project]);
  const exportedCategories = dotaConfig.configs[0]?.categories ?? [];
  const layoutWidth = Math.max(0, ...exportedCategories.map((category) => category.x_position + category.width));
  const layoutHeight = Math.max(0, ...exportedCategories.map((category) => category.y_position + category.height));
  const matching = (heroId: number) => {
    if (!query.trim()) return true;
    const hero = DOTA_HEROES.find((item) => item.id === heroId);
    return !!hero && `${hero.displayName} ${hero.shortName}`.toLowerCase().includes(query.toLowerCase());
  };
  const addGroup = () => {
    const id = `custom-${Date.now()}`;
    const baseName = newCategoryName.trim() || 'НОВАЯ КАТЕГОРИЯ';
    const decoratedName = categoryDecoration ? `${categoryDecoration} ${baseName} ${categoryDecoration}` : baseName;
    setGroups((prev) => [...prev, { id, name: decoratedName.toUpperCase(), attr: 'all', heroIds: [], cols: 5 }]);
    setSelectedGroup(id); setSelectedHero(null); setNewCategoryName(''); setCategoryDecoration(''); setIsCategoryDialogOpen(false);
  };
  const addDotaText = (kind: DotaText['kind']) => {
    const templates: Record<DotaText['kind'], Omit<DotaText, 'id'>> = {
      line: { kind, name: 'Полоска ASCII', text: '͟ '.repeat(28), x: 80, y: 350, width: 1040 },
      symbol: { kind, name: 'Символы и сердце', text: '♡  ★  ♥', x: 620, y: 90, width: 300 },
      text: { kind, name: 'Многострочный текст', text: 'うれしそうな音\n優しい音\nそれは今カムバックです', x: 820, y: 80, width: 350 }
    };
    const id = `dota-text-${Date.now()}`;
    setDecorations((prev) => [...prev, { id, ...templates[kind] }]);
    setSelectedDecoration(id); setIsCategoryDialogOpen(false);
  };
  const addTemplate = (names: string[]) => {
    const created = names.map((name, index) => ({ id: `template-${Date.now()}-${index}`, name, attr: 'all' as HeroAttribute, heroIds: [] as number[], cols: 5 }));
    setGroups((prev) => [...prev, ...created]); setSelectedGroup(created[0].id); setSelectedHero(null); setIsCategoryDialogOpen(false);
  };
  const moveHero = (heroId: number, targetId: string) => {
    setGroups((prev) => prev.map((group) => group.id === targetId && !group.heroIds.includes(heroId)
      ? { ...group, heroIds: [...group.heroIds, heroId] } : group));
    setSelectedGroup(targetId); setSelectedHero(heroId);
  };
  const renameGroup = (id: string, name: string) => setGroups((prev) => prev.map((group) => group.id === id ? { ...group, name } : group));
  const setGroupCols = (id: string, cols: number) => setGroups((prev) => prev.map((group) => group.id === id ? { ...group, cols } : group));
  const removeGroup = (id: string) => {
    if (groups.length < 2) return;
    const remaining = groups.filter((group) => group.id !== id);
    setGroups(remaining); setSelectedGroup(remaining[0].id); setSelectedHero(null);
  };
  const selected = groups.find((group) => group.id === selectedGroup) ?? groups[0];
  const selectedHeroInfo = DOTA_HEROES.find((hero) => hero.id === selectedHero);
  const libraryHeroes = DOTA_HEROES.filter((hero) => (libraryAttr === 'any' || hero.primaryAttr === libraryAttr) && (!query.trim() || `${hero.displayName} ${hero.shortName}`.toLowerCase().includes(query.toLowerCase())));

  return <div className="native-app">
    <div className="native-titlebar">
      <div className="titlebar-drag"><span className="titlebar-app-icon">D</span><span>Dota Grid Studio</span></div>
      {window.dotaDesktop && <div className="window-controls">
        <button title="Свернуть" aria-label="Свернуть" onClick={() => window.dotaDesktop?.controlWindow('minimize')}><Minus size={15} /></button>
        <button title={isWindowMaximized ? 'Восстановить' : 'Развернуть'} aria-label={isWindowMaximized ? 'Восстановить' : 'Развернуть'} onClick={() => window.dotaDesktop?.controlWindow('toggle-maximize')}>{isWindowMaximized ? <Copy size={12} /> : <Square size={12} />}</button>
        <button className="window-close" title="Закрыть" aria-label="Закрыть" onClick={() => window.dotaDesktop?.controlWindow('close')}><X size={16} /></button>
      </div>}
    </div>
    <header className="native-topbar">
      <div className="brand"><div className="brand-mark">D</div><div><strong>DOTA GRID STUDIO</strong><span>Редактор игровых сеток</span></div></div>
      <div className="topbar-center"><span className="live-dot" />Все изменения сохраняются автоматически</div>
      <div className="topbar-actions">
        <button className="button secondary" onClick={() => setIsCategoryDialogOpen(true)}><Plus size={16} /> Создать категорию</button>
        <button className="button primary" onClick={() => setIsExportOpen(true)}><FolderDown size={16} /> Установить в Dota</button>
      </div>
    </header>
    <div className="native-layout">
      <aside className="hero-library">
        <div className="library-heading"><strong>ГЕРОИ</strong><span>{libraryHeroes.length} / {DOTA_HEROES.length}</span></div>
        <div className="library-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти героя…" /></div>
        <div className="library-filters">{[{key:'any',label:'Все'},{key:'str',label:'Сила'},{key:'agi',label:'Ловкость'},{key:'int',label:'Интеллект'},{key:'all',label:'Универс.'}].map((filter) => <button key={filter.key} className={libraryAttr===filter.key?'active':''} onClick={() => setLibraryAttr(filter.key as HeroAttribute | 'any')}>{filter.label}</button>)}</div>
        <div className="library-grid">{libraryHeroes.map((hero) => <button key={hero.id} className={`library-hero ${selectedHero===hero.id?'active':''}`} draggable onDragStart={(event) => event.dataTransfer.setData('text/hero-id', String(hero.id))} onClick={() => { if (selected) moveHero(hero.id, selected.id); setSelectedHero(hero.id); }} title={`Добавить ${hero.displayName} в «${selected?.name ?? ''}»`}><img src={getHeroImageUrl(hero.shortName)} alt="" loading="lazy"/><span>{hero.displayName}</span></button>)}</div>
        <div className="library-foot">Перетащите героя в категорию или нажмите, чтобы добавить в выбранную.</div>
      </aside>
      <main className="native-board-wrap">
        <div className="board-heading"><div><div className="eyebrow">МОЯ КОЛЛЕКЦИЯ</div><h1>Сетка героев</h1><p>Выберите категорию, затем добавьте героя слева или перетащите его в нужный пул.</p></div><div className="board-stats"><span><Users size={15} /> {assignedCount} героев</span><span><Monitor size={15} /> Сетка Dota: {layoutWidth} × {layoutHeight} / 1200 × 700</span><span>Монитор: {scan ? `${scan.monitor.width} × ${scan.monitor.height} · ${Math.round(scan.monitor.scaleFactor * 100)}%` : 'сканируется при запуске'}</span></div></div>
        <div className="search-row"><span className="search-hint">Перетащите героя из библиотеки в нужную категорию</span><div className="zoom-controls"><button title="Уменьшить карточки" onClick={() => setPreviewScale((value) => Math.max(.65, Number((value - .1).toFixed(2))))}><ZoomOut size={14} /></button><span>{Math.round(previewScale * 100)}%</span><button title="Увеличить карточки" onClick={() => setPreviewScale((value) => Math.min(1.35, Number((value + .1).toFixed(2))))}><ZoomIn size={14} /></button><button title="Вписать в экран" onClick={() => setPreviewScale(1)}><Maximize2 size={13} /> Вписать</button></div></div>
        <div className="hero-groups" style={{ "--hero-card-height": `${cardHeight}px` } as React.CSSProperties}>
          {groups.map((group) => {
            const meta = attrMeta[group.attr];
            const heroes = group.heroIds.map((id) => DOTA_HEROES.find((hero) => hero.id === id)).filter((hero) => hero && matching(hero.id));
            return <section key={group.id} className={`hero-group ${selectedGroup === group.id ? 'is-selected' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const id = Number(event.dataTransfer.getData('text/hero-id')); if (id) moveHero(id, group.id); }} onClick={() => setSelectedGroup(group.id)}>
              <div className="group-title-row"><span className="attr-mark" style={{ background: meta.color }}>{group.attr === 'str' ? '✦' : group.attr === 'agi' ? '◉' : group.attr === 'int' ? '✺' : '✥'}</span><input aria-label="Название категории" value={group.name} onChange={(event) => renameGroup(group.id, event.target.value)} onClick={(event) => event.stopPropagation()} /><span className="group-count">{group.heroIds.length}</span></div>
              <div className="hero-grid" style={{ gridTemplateColumns: `repeat(${group.cols}, minmax(0, 1fr))` }}>
                {heroes.map((hero) => hero && <button key={hero.id} className={`hero-card ${selectedHero === hero.id ? 'hero-active' : ''}`} draggable onDragStart={(event) => event.dataTransfer.setData('text/hero-id', String(hero.id))} onClick={(event) => { event.stopPropagation(); setSelectedGroup(group.id); setSelectedHero(hero.id); }} title={`${hero.displayName} · ID ${hero.id}`}>
                  <img src={getHeroImageUrl(hero.shortName)} alt="" loading="lazy" /><span className="hero-shade" /><span className="hero-name">{hero.displayName}</span>
                </button>)}
              </div>
              {group.heroIds.length === 0 && <div className="empty-drop"><Plus size={15} /> Перетащите героев сюда</div>}
            </section>;
          })}
        </div>
      </main>
      <aside className="native-inspector">
        <div className="inspector-top"><span className="eyebrow">НАСТРОЙКИ</span><span className="native-chip"><ShieldCheck size={13} /> DOTA NATIVE</span></div>
        {selected && <>
          <label className="field-label">Название категории</label>
          <input className="field-input" value={selected.name} onChange={(event) => renameGroup(selected.id, event.target.value)} />
          <div className="field-label with-value"><span>Карточек в строке</span><strong>{selected.cols}</strong></div>
          <input className="range-control" type="range" min="3" max="10" value={selected.cols} onChange={(event) => setGroupCols(selected.id, Number(event.target.value))} />
          <div className="range-labels"><span>Компактно</span><span>Крупнее</span></div>
          <div className="inspector-divider" />
          <div className="field-label">Выбранный герой</div>
          {selectedHeroInfo ? <div className="selected-hero"><img src={getHeroImageUrl(selectedHeroInfo.shortName)} alt="" /><div><strong>{selectedHeroInfo.displayName}</strong><span>{selectedHeroInfo.roles.slice(0, 2).join(' · ')}</span></div><button title="Убрать из категории" onClick={() => { setGroups((prev) => prev.map((group) => ({ ...group, heroIds: group.id === selectedGroup ? group.heroIds.filter((id) => id !== selectedHero) : group.heroIds }))); setSelectedHero(null); }}><X size={15} /></button></div> : <div className="selection-empty">Выберите карточку героя, чтобы увидеть её параметры.</div>}
          <div className="inspector-divider" />
          <div className="inspector-divider" />
          <div className="field-label">Текст и символы Dota <span className="decoration-count">{decorations.length}</span></div>
          {decorations.length === 0 ? <div className="selection-empty">Создайте текстовый шаблон через «Создать категорию».</div> : <div className="decoration-list">{decorations.map((item) => <button key={item.id} className={selectedDecoration === item.id ? 'active' : ''} onClick={() => setSelectedDecoration(item.id)}><span>{item.kind === 'line' ? '—' : item.kind === 'symbol' ? '♡' : 'T'}</span>{item.name}<X size={13} onClick={(event) => { event.stopPropagation(); setDecorations((prev) => prev.filter((entry) => entry.id !== item.id)); if (selectedDecoration === item.id) setSelectedDecoration(null); }}/></button>)}</div>}
          {decorations.find((item) => item.id === selectedDecoration) && (() => { const item = decorations.find((entry) => entry.id === selectedDecoration)!; return <div className="decoration-editor"><label className="field-label">Текст в игре</label><textarea className="field-input" rows={3} value={item.text} onChange={(event) => setDecorations((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, text: event.target.value } : entry))}/><div className="coordinate-row"><label>X<input type="number" min="0" max="1200" value={item.x} onChange={(event) => setDecorations((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, x: Number(event.target.value) } : entry))}/></label><label>Y<input type="number" min="0" max="700" value={item.y} onChange={(event) => setDecorations((prev) => prev.map((entry) => entry.id === item.id ? { ...entry, y: Number(event.target.value) } : entry))}/></label></div><small>Координаты области Dota 1200 × 700. Стиль текста задаёт игра.</small></div>; })()}          <div className="field-label">Скан этого компьютера</div>
          {scan ? <div className="scan-card"><div><span className="scan-dot" />Скан завершён автоматически</div><p>{scan.scans.length ? `${scan.scans.reduce((sum, item) => sum + (item.categoryCount ?? 0), 0)} категорий · ${scan.scans.reduce((sum, item) => sum + (item.heroCount ?? 0), 0)} героев найдено` : 'Существующая сетка Dota не найдена'}</p><p>{scan.scans[0]?.bounds ? `Размер сетки: ${scan.scans[0].bounds.width} × ${scan.scans[0].bounds.height} ед.` : `Монитор: ${scan.monitor.width} × ${scan.monitor.height}`} · ${Math.round(scan.monitor.scaleFactor * 100)}%</p></div> : <div className="selection-empty">В браузерном предпросмотре сканирование Steam недоступно. Откройте приложение через Electron для автосканирования.</div>}
          {selectedHeroInfo && <div className="hero-details"><span>ID героя</span><strong>{selectedHeroInfo.id}</strong><span>Атрибут</span><strong>{attrMeta[selectedHeroInfo.primaryAttr].label}</strong></div>}
          <div className="inspector-bottom"><button className="button danger" onClick={() => removeGroup(selected.id)} disabled={groups.length < 2}><X size={14} /> Удалить категорию</button><p>Категория станет отдельным разделом в сетке выбора героев Dota 2.</p></div>
        </>}
      </aside>
    </div>
    <footer className="native-footer"><span><span className="live-dot" /> Локально сохранено</span><span>Формат Dota 2 · hero_grid_config.json</span></footer>
    {isCategoryDialogOpen && <div className="category-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsCategoryDialogOpen(false); }}><section className="category-modal" role="dialog" aria-modal="true" aria-labelledby="category-modal-title"><div className="category-modal-head"><div><span className="eyebrow">НОВАЯ СЕТКА DOTA</span><h2 id="category-modal-title">Создать категорию</h2></div><button aria-label="Закрыть" onClick={() => setIsCategoryDialogOpen(false)}><X size={18} /></button></div><p className="category-modal-help">Категория появится в игре отдельным блоком. Потом перетащите в неё нужных героев — они могут входить сразу в несколько пулов.</p><label className="field-label" htmlFor="new-category-name">Название</label><input id="new-category-name" autoFocus className="field-input" value={newCategoryName} onChange={(event) => setNewCategoryName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') addGroup(); }} placeholder="Например, POS 4 MAIN POOL"/><label className="field-label category-symbol-label">Символ в заголовке <span>проверены: ♡ ♥ ★</span></label><div className="symbol-options">{[{value:'',label:'Без символов'},{value:'♡',label:'♡ Сердце'},{value:'★',label:'★ Звезда'}].map((option) => <button key={option.value || 'plain'} className={categoryDecoration===option.value?'chosen':''} onClick={() => setCategoryDecoration(option.value)}>{option.label}</button>)}</div><button className="button primary create-category-submit" onClick={addGroup}><Plus size={15}/> Создать пустую категорию</button><div className="template-divider"><span>ИЛИ ДОБАВИТЬ ГОТОВЫЙ ШАБЛОН</span></div><div className="template-list"><button onClick={() => addTemplate(['POS 1 — CARRY','POS 2 — MID','POS 3 — OFFLANE','POS 4 — SOFT SUPPORT','POS 5 — HARD SUPPORT'])}><strong>Позиции 1–5</strong><span>Пять пустых пулов для ролей</span><Plus size={15}/></button><button onClick={() => addTemplate(['CORE','SUPPORT','FLEX PICK'])}><strong>Core / Support</strong><span>Три базовые категории драфта</span><Plus size={15}/></button><button onClick={() => addTemplate(['INITIATORS','DISABLERS','NUKERS','DURABLE'])}><strong>По ролям героев</strong><span>Инициаторы, контроль, урон и выживаемость</span><Plus size={15}/></button></div><div className="template-divider"><span>ТЕКСТ И СИМВОЛЫ, КОТОРЫЕ ЧИТАЕТ DOTA</span></div><div className="template-list"><button onClick={() => addDotaText('line')}><strong>Полоска из символов</strong><span>Знак ͟ из уже сохранённой сетки Dota</span><Plus size={15}/></button><button onClick={() => addDotaText('symbol')}><strong>♡ Сердце и звезда</strong><span>Символы в заголовке категории</span><Plus size={15}/></button><button onClick={() => addDotaText('text')}><strong>Многострочный текст</strong><span>Каждая строка становится заголовком Dota</span><Plus size={15}/></button></div><p className="template-note">Шаблоны добавляют нативные текстовые заголовки, а не рисунок поверх игры.</p></section></div>}
    {isExportOpen && <ExportDotaModal project={project} onClose={() => setIsExportOpen(false)} />}
  </div>;
}















