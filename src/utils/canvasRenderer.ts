import { ProjectState, Transform, GridGroup, GridSlot, CanvasItem, DotaHero } from '../types/dota';
import { HEROES_BY_ID, getHeroImageUrls, getHeroImageUrl, ATTR_COLORS } from '../data/dotaHeroes';

export class CanvasRenderer {
  private imageCache = new Map<string, HTMLImageElement>();
  private failedImages = new Set<string>();
  private heroImageCache = new Map<string, HTMLImageElement>();
  private heroFallbackIndex = new Map<string, number>();

  public getImage(url: string, onLoad?: () => void): HTMLImageElement | null {
    if (this.failedImages.has(url)) return null;

    if (this.imageCache.has(url)) {
      const img = this.imageCache.get(url)!;
      if (img.complete && img.naturalWidth > 0) {
        return img;
      }
      return null;
    }

    const img = new Image();
    img.src = url;
    this.imageCache.set(url, img);

    img.onload = () => {
      if (onLoad) onLoad();
    };
    img.onerror = () => {
      this.failedImages.add(url);
    };

    return null;
  }

  public getHeroImage(shortName: string, onLoad?: () => void): HTMLImageElement | null {
    if (this.heroImageCache.has(shortName)) {
      const img = this.heroImageCache.get(shortName)!;
      if (img.complete && img.naturalWidth > 0) {
        return img;
      }
      return null;
    }

    const urls = getHeroImageUrls(shortName);
    const currentIndex = this.heroFallbackIndex.get(shortName) || 0;
    if (currentIndex >= urls.length) {
      return null; // All CDNs exhausted
    }

    const targetUrl = urls[currentIndex];
    const img = new Image();
    img.src = targetUrl;
    this.heroImageCache.set(shortName, img);

    img.onload = () => {
      if (onLoad) onLoad();
    };

    img.onerror = () => {
      // Try next fallback CDN
      const nextIndex = currentIndex + 1;
      this.heroFallbackIndex.set(shortName, nextIndex);
      this.heroImageCache.delete(shortName);
      if (nextIndex < urls.length) {
        this.getHeroImage(shortName, onLoad);
      }
    };

    return null;
  }

  public render(
    ctx: CanvasRenderingContext2D,
    project: ProjectState,
    transform: Transform,
    viewportWidth: number,
    viewportHeight: number,
    selectedItemIds: string[],
    selectedSlotInfo: { gridId: string; slotId: string } | null,
    hoveredSlot: { gridId: string; slot: GridSlot } | null,
    draggingHero: { hero: DotaHero; mouseX: number; mouseY: number } | null,
    marqueeBox: { x1: number; y1: number; x2: number; y2: number } | null,
    onImageLoaded?: () => void
  ) {
    ctx.save();
    ctx.clearRect(0, 0, viewportWidth, viewportHeight);

    // Fill workspace dark neutral backdrop
    ctx.fillStyle = '#070A0F';
    ctx.fillRect(0, 0, viewportWidth, viewportHeight);

    // Apply Pan & Zoom transformation
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.zoom, transform.zoom);

    // 1. Draw Canvas Board boundary & shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 48 / transform.zoom;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 12 / transform.zoom;

    ctx.fillStyle = project.canvasBgColor || '#0E121A';
    ctx.fillRect(0, 0, project.canvasWidth, project.canvasHeight);
    ctx.restore();

    // 2. Draw Canvas Subtle Grid lines if enabled
    if (project.showGridLines) {
      this.drawCanvasGridPattern(ctx, project.canvasWidth, project.canvasHeight);
    }

    // 3. Draw Background Image Layer
    this.renderBackground(ctx, project, onImageLoaded);

    // 4. Draw Grids & Hero Slots
    this.renderGrids(ctx, project, selectedSlotInfo, hoveredSlot, onImageLoaded);

    // 5. Draw Canvas Vector / Text / Image Items
    this.renderItems(ctx, project, selectedItemIds, onImageLoaded);

    // 6. Draw Selection Bounding Box & Handles
    this.renderSelectionHandles(ctx, project, selectedItemIds, transform.zoom);

    // 7. Draw Marquee Selection Box
    if (marqueeBox) {
      ctx.save();
      const mx = Math.min(marqueeBox.x1, marqueeBox.x2);
      const my = Math.min(marqueeBox.y1, marqueeBox.y2);
      const mw = Math.abs(marqueeBox.x2 - marqueeBox.x1);
      const mh = Math.abs(marqueeBox.y2 - marqueeBox.y1);

      ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
      ctx.fillRect(mx, my, mw, mh);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1 / transform.zoom;
      ctx.setLineDash([4 / transform.zoom, 4 / transform.zoom]);
      ctx.strokeRect(mx, my, mw, mh);
      ctx.restore();
    }

    // 8. Draw Dragging Hero Ghost if active
    if (draggingHero) {
      this.renderDraggingHeroGhost(ctx, draggingHero, hoveredSlot, transform.zoom, onImageLoaded);
    }

    ctx.restore();

    // 9. Draw Rulers if enabled
    if (project.showRulers) {
      this.renderRulers(ctx, transform, viewportWidth, viewportHeight, project.canvasWidth, project.canvasHeight);
    }
  }

  private drawCanvasGridPattern(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;

    const gridSize = 40;
    ctx.beginPath();
    for (let x = 0; x <= width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Draw canvas border line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(0, 0, width, height);
    ctx.restore();
  }

  private renderBackground(ctx: CanvasRenderingContext2D, project: ProjectState, onImageLoaded?: () => void) {
    const bg = project.background;
    if (!bg.visible || !bg.imageUrl) return;

    const img = this.getImage(bg.imageUrl, onImageLoaded);
    if (!img) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, bg.opacity));

    let dx = bg.x;
    let dy = bg.y;
    let dw = bg.width;
    let dh = bg.height;

    if (bg.scaleMode === 'fit' || bg.scaleMode === 'fill') {
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = project.canvasWidth / project.canvasHeight;

      if (bg.scaleMode === 'fit') {
        if (imgAspect > canvasAspect) {
          dw = project.canvasWidth;
          dh = project.canvasWidth / imgAspect;
          dx = 0;
          dy = (project.canvasHeight - dh) / 2;
        } else {
          dh = project.canvasHeight;
          dw = project.canvasHeight * imgAspect;
          dy = 0;
          dx = (project.canvasWidth - dw) / 2;
        }
      } else {
        // Fill mode
        if (imgAspect > canvasAspect) {
          dh = project.canvasHeight;
          dw = project.canvasHeight * imgAspect;
          dy = 0;
          dx = (project.canvasWidth - dw) / 2;
        } else {
          dw = project.canvasWidth;
          dh = project.canvasWidth / imgAspect;
          dx = 0;
          dy = (project.canvasHeight - dh) / 2;
        }
      }
    }

    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  }

  private renderGrids(
    ctx: CanvasRenderingContext2D,
    project: ProjectState,
    selectedSlotInfo: { gridId: string; slotId: string } | null,
    hoveredSlot: { gridId: string; slot: GridSlot } | null,
    onImageLoaded?: () => void
  ) {
    project.grids.forEach((grid) => {
      if (!grid.visible) return;

      grid.slots.forEach((slot) => {
        const isHovered = hoveredSlot?.slot.id === slot.id && hoveredSlot.gridId === grid.id;
        const isSelected = selectedSlotInfo?.slotId === slot.id && selectedSlotInfo.gridId === grid.id;

        this.renderSingleSlot(ctx, project, grid, slot, isSelected, isHovered, onImageLoaded);
      });
    });
  }

  private renderSingleSlot(
    ctx: CanvasRenderingContext2D,
    project: ProjectState,
    grid: GridGroup,
    slot: GridSlot,
    isSelected: boolean,
    isHovered: boolean,
    onImageLoaded?: () => void
  ) {
    ctx.save();
    const { x, y, width, height, heroId, isBan } = slot;
    const radius = grid.slotBorderRadius ?? 4;

    // Slot Background
    ctx.fillStyle = isBan ? (slot.heroId ? '#3a1114' : '#1e1114') : grid.slotBgColor || '#161922';
    this.roundRect(ctx, x, y, width, height, radius);
    ctx.fill();

    // Render Hero Portrait if assigned
    if (heroId) {
      const hero = HEROES_BY_ID.get(heroId);
      if (hero) {
        const img = this.getHeroImage(hero.shortName, onImageLoaded);

        ctx.save();
        this.roundRect(ctx, x, y, width, height, radius);
        ctx.clip();

        if (img && img.complete && img.naturalWidth > 0) {
          // Object-fit: Cover math for crisp aspect-ratio handling
          const imgRatio = img.naturalWidth / img.naturalHeight;
          const slotRatio = width / height;
          let drawW = width;
          let drawH = height;
          let offX = x;
          let offY = y;

          if (imgRatio > slotRatio) {
            drawW = height * imgRatio;
            offX = x - (drawW - width) / 2;
          } else {
            drawH = width / imgRatio;
            offY = y - (drawH - height) / 2;
          }

          ctx.drawImage(img, offX, offY, drawW, drawH);
        } else {
          // Stylish fallback vector card while image is loading or offline
          const attr = ATTR_COLORS[hero.primaryAttr] || ATTR_COLORS.str;
          const grad = ctx.createLinearGradient(x, y, x + width, y + height);
          grad.addColorStop(0, '#1E2638');
          grad.addColorStop(1, '#0F131D');
          ctx.fillStyle = grad;
          ctx.fillRect(x, y, width, height);

          // Hero Initials & Name
          ctx.fillStyle = attr.text;
          ctx.font = `bold ${Math.max(10, Math.floor(height * 0.28))}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(hero.displayName.substring(0, 4).toUpperCase(), x + width / 2, y + height / 2 - 2);
        }

        // Bottom Attribute Indicator Bar
        const attr = ATTR_COLORS[hero.primaryAttr];
        if (attr) {
          ctx.fillStyle = attr.bg;
          ctx.fillRect(x, y + height - 3, width, 3);
        }

        // Hero Name Label (if enabled or hovered)
        const showHeroName = project.showHeroNames || (isHovered && height >= 40);
        if (showHeroName && height >= 36) {
          ctx.fillStyle = 'rgba(7, 10, 15, 0.82)';
          ctx.fillRect(x, y + height - 14, width, 14);

          ctx.fillStyle = '#F8FAFC';
          ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const maxChar = Math.floor(width / 6.5);
          const shortDisplay = hero.displayName.length > maxChar ? hero.displayName.substring(0, maxChar - 1) + '…' : hero.displayName;
          ctx.fillText(shortDisplay.toUpperCase(), x + width / 2, y + height - 7);
        }

        // Dota Plus Rank Tier Badge (Levels 1-30) if configured or enabled
        const tierLevel = slot.heroTierLevel !== undefined ? slot.heroTierLevel : (project.showHeroTiers ? 15 : undefined);
        if (tierLevel !== undefined && tierLevel > 0 && height >= 38) {
          this.renderTierBadge(ctx, x + 3, y + 3, tierLevel);
        }

        // If BAN slot, add subtle red ban tint & icon
        if (isBan) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
          ctx.fillRect(x, y, width, height);

          ctx.fillStyle = '#EF4444';
          ctx.font = `bold ${Math.floor(height * 0.35)}px sans-serif`;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'top';
          ctx.fillText('🚫', x + width - 2, y + 2);
        }

        ctx.restore();
      }
    } else {
      // Empty slot display
      if (isBan) {
        ctx.fillStyle = '#EF4444';
        ctx.font = `bold ${Math.max(10, Math.floor(height * 0.35))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BAN', x + width / 2, y + height / 2 - 2);

        if (slot.label) {
          ctx.fillStyle = '#991B1B';
          ctx.font = '8px sans-serif';
          ctx.fillText(slot.label, x + width / 2, y + height - 6);
        }
      } else {
        // Subtle slot dot / cross
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(x + width / 2 - 1, y + height / 2 - 1, 2, 2);
      }
    }

    // Slot Border
    ctx.strokeStyle = isSelected
      ? '#F59E0B'
      : isHovered
      ? '#F59E0B'
      : isBan
      ? '#DC2626'
      : grid.slotBorderColor || '#202B3D';

    ctx.lineWidth = isSelected || isHovered ? 2 : 1;
    this.roundRect(ctx, x, y, width, height, radius);
    ctx.stroke();

    // Hover / Snap Glow
    if (isHovered) {
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 3;
      this.roundRect(ctx, x - 1, y - 1, width + 2, height + 2, radius + 1);
      ctx.stroke();
    }

    ctx.restore();
  }

  private renderTierBadge(ctx: CanvasRenderingContext2D, badgeX: number, badgeY: number, level: number) {
    ctx.save();
    const size = 16;
    const centerX = badgeX + size / 2;
    const centerY = badgeY + size / 2;

    // Dota Plus Tier colors
    let badgeColor = '#CD7F32'; // Bronze 1-5
    let strokeColor = '#78350F';
    let textColor = '#FFFFFF';

    if (level >= 30) {
      badgeColor = '#DC2626'; // Grandmaster 30 (Crimson & Gold)
      strokeColor = '#F59E0B';
    } else if (level >= 25) {
      badgeColor = '#9333EA'; // Master 25-29 (Purple)
      strokeColor = '#C084FC';
    } else if (level >= 18) {
      badgeColor = '#0284C7'; // Platinum 18-24 (Cyan/Blue)
      strokeColor = '#38BDF8';
    } else if (level >= 12) {
      badgeColor = '#D97706'; // Gold 12-17 (Gold)
      strokeColor = '#FDE047';
    } else if (level >= 6) {
      badgeColor = '#64748B'; // Silver 6-11 (Silver)
      strokeColor = '#CBD5E1';
    }

    // Shield shape
    ctx.fillStyle = badgeColor;
    ctx.beginPath();
    ctx.moveTo(centerX, badgeY);
    ctx.lineTo(badgeX + size, badgeY + size * 0.35);
    ctx.lineTo(centerX, badgeY + size);
    ctx.lineTo(badgeX, badgeY + size * 0.35);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Level number
    ctx.fillStyle = textColor;
    ctx.font = 'bold 8px "Plus Jakarta Sans", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(level.toString(), centerX, centerY + 0.5);

    ctx.restore();
  }

  private renderItems(
    ctx: CanvasRenderingContext2D,
    project: ProjectState,
    selectedItemIds: string[],
    onImageLoaded?: () => void
  ) {
    const sortedItems = [...project.items].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    sortedItems.forEach((item) => {
      if (!item.visible) return;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, item.opacity ?? 1));

      // Item rotation around its center
      const centerX = item.x + item.width / 2;
      const centerY = item.y + item.height / 2;
      if (item.rotation) {
        ctx.translate(centerX, centerY);
        ctx.rotate((item.rotation * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
      }

      switch (item.type) {
        case 'text':
          this.renderTextItem(ctx, item);
          break;
        case 'rect':
          this.renderRectItem(ctx, item);
          break;
        case 'circle':
          this.renderCircleItem(ctx, item);
          break;
        case 'line':
          this.renderLineItem(ctx, item);
          break;
        case 'brush':
          this.renderBrushItem(ctx, item);
          break;
        case 'icon':
          this.renderIconItem(ctx, item);
          break;
        case 'image':
          this.renderImageItem(ctx, item, onImageLoaded);
          break;
        case 'hero':
          this.renderHeroItem(ctx, item, onImageLoaded);
          break;
      }

      ctx.restore();
    });
  }

  private renderHeroItem(ctx: CanvasRenderingContext2D, item: CanvasItem, onImageLoaded?: () => void) {
    const { x, y, width, height, heroId, borderRadius = 4 } = item;
    if (!heroId) return;

    const hero = HEROES_BY_ID.get(heroId);
    if (!hero) return;

    ctx.save();
    // Card background
    ctx.fillStyle = item.fill || '#0E1420';
    this.roundRect(ctx, x, y, width, height, borderRadius);
    ctx.fill();

    // Clip for hero portrait
    ctx.save();
    this.roundRect(ctx, x, y, width, height, borderRadius);
    ctx.clip();

    const img = this.getHeroImage(hero.shortName, onImageLoaded);

    if (img && img.complete && img.naturalWidth > 0) {
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const slotRatio = width / height;
      let drawW = width;
      let drawH = height;
      let offX = x;
      let offY = y;

      if (imgRatio > slotRatio) {
        drawW = height * imgRatio;
        offX = x - (drawW - width) / 2;
      } else {
        drawH = width / imgRatio;
        offY = y - (drawH - height) / 2;
      }

      ctx.drawImage(img, offX, offY, drawW, drawH);
    } else {
      const attr = ATTR_COLORS[hero.primaryAttr] || ATTR_COLORS.str;
      const grad = ctx.createLinearGradient(x, y, x + width, y + height);
      grad.addColorStop(0, '#1E2638');
      grad.addColorStop(1, '#0F131D');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, width, height);

      ctx.fillStyle = attr.text;
      ctx.font = `bold ${Math.max(10, Math.floor(height * 0.28))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(hero.displayName.substring(0, 4).toUpperCase(), x + width / 2, y + height / 2 - 2);
    }

    // Attribute indicator bar
    const attr = ATTR_COLORS[hero.primaryAttr];
    if (attr) {
      ctx.fillStyle = attr.bg;
      ctx.fillRect(x, y + height - 3, width, 3);
    }

    // Hero name tag
    if (height >= 36) {
      ctx.fillStyle = 'rgba(7, 10, 15, 0.82)';
      ctx.fillRect(x, y + height - 14, width, 14);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const maxChar = Math.floor(width / 6.5);
      const shortDisplay = hero.displayName.length > maxChar ? hero.displayName.substring(0, maxChar - 1) + '…' : hero.displayName;
      ctx.fillText(shortDisplay.toUpperCase(), x + width / 2, y + height - 7);
    }

    // Dota Plus Tier Badge
    const tierLevel = item.heroTierLevel !== undefined ? item.heroTierLevel : 15;
    if (tierLevel > 0 && height >= 38) {
      this.renderTierBadge(ctx, x + 3, y + 3, tierLevel);
    }

    ctx.restore(); // restore clip

    // Card border
    ctx.strokeStyle = item.stroke || '#2B3A52';
    ctx.lineWidth = item.strokeWidth || 1;
    this.roundRect(ctx, x, y, width, height, borderRadius);
    ctx.stroke();

    ctx.restore();
  }

  private renderTextItem(ctx: CanvasRenderingContext2D, item: CanvasItem) {
    const { x, y, width, height, text, fontSize = 24, fontFamily = 'sans-serif', fontWeight = 'normal', fontStyle = 'normal', textAlign = 'center', textColor = '#ffffff', textGlow, textGlowBlur = 8 } = item;

    if (!text) return;

    ctx.save();
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'middle';

    if (textGlow) {
      ctx.shadowColor = textGlow;
      ctx.shadowBlur = textGlowBlur;
    }

    ctx.fillStyle = textColor;

    // Handle multiline text rendering for columns and ascii art
    if (text.includes('\n')) {
      const lines = text.split('\n');
      const lineHeight = fontSize * 1.25;
      const totalTextH = lines.length * lineHeight;
      const startY = y + (height - totalTextH) / 2 + lineHeight / 2;

      lines.forEach((line, index) => {
        let renderX = x + width / 2;
        if (textAlign === 'left') renderX = x;
        if (textAlign === 'right') renderX = x + width;
        ctx.fillText(line, renderX, startY + index * lineHeight);
      });
    } else {
      let renderX = x + width / 2;
      if (textAlign === 'left') renderX = x;
      if (textAlign === 'right') renderX = x + width;
      const renderY = y + height / 2;
      ctx.fillText(text, renderX, renderY);
    }

    ctx.restore();
  }

  private renderRectItem(ctx: CanvasRenderingContext2D, item: CanvasItem) {
    const { x, y, width, height, fill, stroke, strokeWidth = 1, strokeDash, borderRadius = 4 } = item;

    ctx.save();
    if (fill && fill !== 'transparent') {
      ctx.fillStyle = fill;
      this.roundRect(ctx, x, y, width, height, borderRadius);
      ctx.fill();
    }

    if (stroke && stroke !== 'transparent' && strokeWidth > 0) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      if (strokeDash && strokeDash.length > 0) {
        ctx.setLineDash(strokeDash);
      }
      this.roundRect(ctx, x, y, width, height, borderRadius);
      ctx.stroke();
    }

    // If rectangle has a Dota Category Name or label, render a stylish header badge
    const headerTitle = item.dotaCategoryName || (item.text && item.text.length < 40 ? item.text : null);
    if (headerTitle) {
      ctx.save();
      ctx.fillStyle = 'rgba(11, 14, 21, 0.9)';
      const badgeWidth = Math.min(width - 8, Math.max(60, headerTitle.length * 7.5 + 16));
      this.roundRect(ctx, x + 6, y - 10, badgeWidth, 18, 3);
      ctx.fill();
      ctx.strokeStyle = stroke || '#F59E0B';
      ctx.lineWidth = 1;
      this.roundRect(ctx, x + 6, y - 10, badgeWidth, 18, 3);
      ctx.stroke();

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 9px "Cinzel", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(headerTitle, x + 6 + badgeWidth / 2, y - 1);
      ctx.restore();
    }

    ctx.restore();
  }

  private renderCircleItem(ctx: CanvasRenderingContext2D, item: CanvasItem) {
    const { x, y, width, height, fill, stroke, strokeWidth = 1, strokeDash } = item;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);

    if (fill && fill !== 'transparent') {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    if (stroke && stroke !== 'transparent' && strokeWidth > 0) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      if (strokeDash && strokeDash.length > 0) {
        ctx.setLineDash(strokeDash);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  private renderLineItem(ctx: CanvasRenderingContext2D, item: CanvasItem) {
    const { x, y, width, height, stroke = '#ffffff', strokeWidth = 2, strokeDash, arrowStart, arrowEnd } = item;

    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    if (strokeDash && strokeDash.length > 0) {
      ctx.setLineDash(strokeDash);
    }

    const startX = x;
    const startY = y + height / 2;
    const endX = x + width;
    const endY = y + height / 2;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Arrows
    if (arrowEnd) {
      const angle = Math.atan2(endY - startY, endX - startX);
      const headLen = Math.max(8, strokeWidth * 3);

      ctx.fillStyle = stroke;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLen * Math.cos(angle - Math.PI / 6),
        endY - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - headLen * Math.cos(angle + Math.PI / 6),
        endY - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  private renderBrushItem(ctx: CanvasRenderingContext2D, item: CanvasItem) {
    const { path, stroke = '#ef4444', strokeWidth = 3 } = item;
    if (!path || path.length < 2) return;

    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);

    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  private renderIconItem(ctx: CanvasRenderingContext2D, item: CanvasItem) {
    const { x, y, width, height, iconChar = '⭐', fontSize = 28, textGlow } = item;

    ctx.save();
    ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (textGlow) {
      ctx.shadowColor = textGlow;
      ctx.shadowBlur = 12;
    }

    ctx.fillText(iconChar, x + width / 2, y + height / 2);
    ctx.restore();
  }

  private renderImageItem(ctx: CanvasRenderingContext2D, item: CanvasItem, onImageLoaded?: () => void) {
    const { x, y, width, height, imageData } = item;
    if (!imageData) return;

    const img = this.getImage(imageData, onImageLoaded);
    if (!img) return;

    ctx.drawImage(img, x, y, width, height);
  }

  private renderSelectionHandles(
    ctx: CanvasRenderingContext2D,
    project: ProjectState,
    selectedItemIds: string[],
    zoom: number
  ) {
    if (selectedItemIds.length === 0) return;

    let groupMinX = Infinity;
    let groupMinY = Infinity;
    let groupMaxX = -Infinity;
    let groupMaxY = -Infinity;
    let validCount = 0;

    selectedItemIds.forEach((id) => {
      const item = project.items.find((i) => i.id === id);
      if (!item || !item.visible) return;

      validCount++;
      groupMinX = Math.min(groupMinX, item.x);
      groupMinY = Math.min(groupMinY, item.y);
      groupMaxX = Math.max(groupMaxX, item.x + item.width);
      groupMaxY = Math.max(groupMaxY, item.y + item.height);

      const { x, y, width, height, rotation = 0 } = item;
      const handleSize = 7 / zoom;
      const centerX = x + width / 2;
      const centerY = y + height / 2;

      ctx.save();
      if (rotation) {
        ctx.translate(centerX, centerY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
      }

      // Individual selection box
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = (selectedItemIds.length > 1 ? 1.2 : 1.5) / zoom;
      if (selectedItemIds.length > 1) {
        ctx.setLineDash([4 / zoom, 3 / zoom]);
      }
      ctx.strokeRect(x, y, width, height);

      // Corner handles (draw if single selection or small count)
      if (selectedItemIds.length <= 4) {
        ctx.fillStyle = '#F59E0B';
        const corners = [
          { x: x - handleSize / 2, y: y - handleSize / 2 },
          { x: x + width - handleSize / 2, y: y - handleSize / 2 },
          { x: x - handleSize / 2, y: y + height - handleSize / 2 },
          { x: x + width - handleSize / 2, y: y + height - handleSize / 2 }
        ];

        corners.forEach((c) => {
          ctx.fillRect(c.x, c.y, handleSize, handleSize);
        });
      }

      ctx.restore();
    });

    // If multiple items are selected, draw collective group bounding box & badge
    if (validCount > 1 && groupMinX !== Infinity) {
      const pad = 6 / zoom;
      const gx = groupMinX - pad;
      const gy = groupMinY - pad;
      const gw = groupMaxX - groupMinX + pad * 2;
      const gh = groupMaxY - groupMinY + pad * 2;

      ctx.save();
      // Outer bounding box
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.8 / zoom;
      ctx.setLineDash([]);
      ctx.strokeRect(gx, gy, gw, gh);

      // Outer Corner Handles
      const hSize = 8 / zoom;
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(gx - hSize / 2, gy - hSize / 2, hSize, hSize);
      ctx.fillRect(gx + gw - hSize / 2, gy - hSize / 2, hSize, hSize);
      ctx.fillRect(gx - hSize / 2, gy + gh - hSize / 2, hSize, hSize);
      ctx.fillRect(gx + gw - hSize / 2, gy + gh - hSize / 2, hSize, hSize);

      // Top Badge indicator: "X объектов выбрано"
      const badgeText = `${validCount} объектов (Ctrl+C / перетаскивание)`;
      ctx.font = `bold ${Math.max(10, Math.min(14, 12 / zoom))}px "Plus Jakarta Sans", sans-serif`;
      const textMetrics = ctx.measureText(badgeText);
      const badgeW = textMetrics.width + 16 / zoom;
      const badgeH = 20 / zoom;
      const badgeX = gx;
      const badgeY = gy - badgeH - 4 / zoom;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      this.roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 4 / zoom);
      ctx.fill();

      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1 / zoom;
      this.roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 4 / zoom);
      ctx.stroke();

      ctx.fillStyle = '#38BDF8';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, badgeX + 8 / zoom, badgeY + badgeH / 2);

      ctx.restore();
    }
  }

  private renderDraggingHeroGhost(
    ctx: CanvasRenderingContext2D,
    draggingHero: { hero: DotaHero; mouseX: number; mouseY: number },
    hoveredSlot: { gridId: string; slot: GridSlot } | null,
    zoom: number,
    onImageLoaded?: () => void
  ) {
    const { hero, mouseX, mouseY } = draggingHero;
    const cardW = 54;
    const cardH = 74;
    let targetX = mouseX - cardW / 2;
    let targetY = mouseY - cardH / 2;

    // Snap ghost directly to slot if hovered
    if (hoveredSlot) {
      targetX = hoveredSlot.slot.x;
      targetY = hoveredSlot.slot.y;
    }

    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 14 / zoom;

    const img = this.getHeroImage(hero.shortName, onImageLoaded);

    this.roundRect(ctx, targetX, targetY, cardW, cardH, 4);
    ctx.clip();

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, targetX, targetY, cardW, cardH);
    } else {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(targetX, targetY, cardW, cardH);
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(hero.displayName, targetX + cardW / 2, targetY + cardH / 2);
    }

    ctx.strokeStyle = hoveredSlot ? '#F59E0B' : '#38BDF8';
    ctx.lineWidth = 2 / zoom;
    this.roundRect(ctx, targetX, targetY, cardW, cardH, 4);
    ctx.stroke();

    ctx.restore();
  }

  private renderRulers(
    ctx: CanvasRenderingContext2D,
    transform: Transform,
    viewportW: number,
    viewportH: number,
    canvasW: number,
    canvasH: number
  ) {
    const rulerThickness = 20;

    ctx.save();
    // Top ruler
    ctx.fillStyle = '#0B0E15';
    ctx.fillRect(0, 0, viewportW, rulerThickness);

    // Left ruler
    ctx.fillRect(0, 0, rulerThickness, viewportH);

    // Corner square
    ctx.fillStyle = '#0E121A';
    ctx.fillRect(0, 0, rulerThickness, rulerThickness);

    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, rulerThickness);
    ctx.lineTo(viewportW, rulerThickness);
    ctx.moveTo(rulerThickness, 0);
    ctx.lineTo(rulerThickness, viewportH);
    ctx.stroke();

    // Ticks on top ruler
    ctx.fillStyle = '#94A3B8';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const step = 100;
    for (let cX = 0; cX <= canvasW; cX += step) {
      const screenX = transform.x + cX * transform.zoom;
      if (screenX >= rulerThickness && screenX <= viewportW) {
        ctx.beginPath();
        ctx.moveTo(screenX, rulerThickness - 6);
        ctx.lineTo(screenX, rulerThickness);
        ctx.stroke();

        ctx.fillText(cX.toString(), screenX, 3);
      }
    }

    // Ticks on left ruler
    for (let cY = 0; cY <= canvasH; cY += step) {
      const screenY = transform.y + cY * transform.zoom;
      if (screenY >= rulerThickness && screenY <= viewportH) {
        ctx.beginPath();
        ctx.moveTo(rulerThickness - 6, screenY);
        ctx.lineTo(rulerThickness, screenY);
        ctx.stroke();

        ctx.save();
        ctx.translate(3, screenY);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(cY.toString(), 0, 0);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    if (radius <= 0) {
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      return;
    }
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  public exportPNG(project: ProjectState, scale = 2): Promise<string> {
    return new Promise((resolve) => {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = project.canvasWidth * scale;
      exportCanvas.height = project.canvasHeight * scale;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return resolve('');

      ctx.scale(scale, scale);

      // Render full canvas without UI overlays
      ctx.fillStyle = project.canvasBgColor || '#0c0e14';
      ctx.fillRect(0, 0, project.canvasWidth, project.canvasHeight);

      this.renderBackground(ctx, project);
      this.renderGrids(ctx, project, null, null);
      this.renderItems(ctx, project, []);

      resolve(exportCanvas.toDataURL('image/png'));
    });
  }
}
