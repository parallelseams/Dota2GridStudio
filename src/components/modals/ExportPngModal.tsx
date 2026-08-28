import React, { useState, useEffect } from 'react';
import { ProjectState } from '../../types/dota';
import { CanvasRenderer } from '../../utils/canvasRenderer';
import { Camera, Download, X, Check, Loader2 } from 'lucide-react';

interface ExportPngModalProps {
  project: ProjectState;
  onClose: () => void;
}

export const ExportPngModal: React.FC<ExportPngModalProps> = ({ project, onClose }) => {
  const [scale, setScale] = useState<number>(2); // Default 2x for crisp 4K
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsGenerating(true);

    const renderer = new CanvasRenderer();
    renderer.exportPNG(project, scale).then((dataUrl) => {
      if (isMounted) {
        setPreviewUrl(dataUrl);
        setIsGenerating(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [project, scale]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `${(project.title || 'dota_grid').toLowerCase().replace(/\s+/g, '_')}_${scale}x.png`;
    a.click();
  };

  const outputWidth = project.canvasWidth * scale;
  const outputHeight = project.canvasHeight * scale;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-2xl bg-[#111111] border border-[#242424] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#242424] flex items-center justify-between bg-[#0E0E0E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#1A1A1A] border border-[#333333] text-[#A4E044]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F0F0F0] font-['Space_Grotesk'] tracking-wide">
                EXPORT HIGH-RESOLUTION CANVAS PNG
              </h2>
              <p className="text-xs text-[#888888]">
                {outputWidth} × {outputHeight} pixels ({scale}× Resolution)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#888888] hover:text-white hover:bg-[#1A1A1A] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1 bg-[#111111]">
          {/* Resolution Selector */}
          <div>
            <label className="text-xs text-[#E0E0E0] font-semibold block mb-2 font-['Space_Grotesk']">
              Select Export Resolution:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { s: 1, label: '1080p Standard', desc: '1920 × 1080 (1×)' },
                { s: 2, label: '4K Ultra-Sharp', desc: '3840 × 2160 (2×)' },
                { s: 3, label: '6K Master Display', desc: '5760 × 3240 (3×)' }
              ].map((opt) => (
                <button
                  key={opt.s}
                  onClick={() => setScale(opt.s)}
                  className={`p-3 rounded border text-left transition-all ${
                    scale === opt.s
                      ? 'bg-[#181818] border-[#A4E044] shadow-sm'
                      : 'bg-[#141414] border-[#242424] hover:border-[#383838]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{opt.label}</span>
                    {scale === opt.s && <Check className="w-3.5 h-3.5 text-[#A4E044]" />}
                  </div>
                  <span className="text-[11px] text-[#888888] font-mono">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Image Box */}
          <div className="relative aspect-[16/9] bg-[#090909] border border-[#222222] rounded overflow-hidden flex items-center justify-center shadow-inner">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-2 text-[#888888]">
                <Loader2 className="w-6 h-6 animate-spin text-[#A4E044]" />
                <span className="text-xs">Rendering High-Res Canvas...</span>
              </div>
            ) : previewUrl ? (
              <img src={previewUrl} alt="Export Preview" className="w-full h-full object-contain" />
            ) : null}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#0E0E0E] border-t border-[#242424] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-[#888888] hover:text-white hover:bg-[#1A1A1A] rounded transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleDownload}
            disabled={isGenerating || !previewUrl}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#A4E044] hover:bg-[#B7F055] disabled:opacity-40 text-[#0B0B0B] text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG Image ({outputWidth} × {outputHeight})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
