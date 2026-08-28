import React, { useState, useMemo } from 'react';
import { ProjectState } from '../../types/dota';
import { exportToDotaGridConfig } from '../../utils/gridUtils';
import {
  FileCode,
  Copy,
  Check,
  Download,
  AlertCircle,
  Folder,
  Info,
  X,
  Sparkles
} from 'lucide-react';

interface ExportDotaModalProps {
  project: ProjectState;
  onClose: () => void;
}

export const ExportDotaModal: React.FC<ExportDotaModalProps> = ({ project, onClose }) => {
  const [copied, setCopied] = useState(false);

  const dotaConfig = useMemo(() => {
    return exportToDotaGridConfig(project);
  }, [project]);

  const jsonString = useMemo(() => {
    return JSON.stringify(dotaConfig, null, 2);
  }, [dotaConfig]);

  const totalAssignedHeroes = useMemo(() => {
    return dotaConfig.configs[0]?.categories.reduce((acc, cat) => acc + cat.hero_ids.length, 0) || 0;
  }, [dotaConfig]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hero_grid_config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-3xl bg-[#0E121A] border border-[#2B3A52] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#202B3D] flex items-center justify-between bg-[#0B0E15]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#161F30] border border-[#2B3A52] text-[#F59E0B]">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-['Cinzel'] tracking-wide">
                ЭКСПОРТ В DOTA 2 (HERO_GRID_CONFIG.JSON)
              </h2>
              <p className="text-xs text-[#94A3B8]">
                {dotaConfig.configs[0]?.categories.length || 0} Категорий (Сетки, Рамки & Символы) • {totalAssignedHeroes} Героев
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-[#1A2333] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 custom-scrollbar flex-1 bg-[#0E121A]">
          {/* Steam Installation Instructions */}
          <div className="bg-[#121824] border border-[#202B3D] rounded-lg p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-[#F59E0B] text-xs font-bold font-['Cinzel']">
              <Folder className="w-4 h-4" />
              <span>ИНСТРУКЦИЯ ПО УСТАНОВКЕ В DOTA 2:</span>
            </div>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Поместите скачанный файл <code className="text-[#F59E0B]">hero_grid_config.json</code> в папку вашего профиля Steam:
            </p>
            <div className="bg-[#080B10] border border-[#1E293B] p-2.5 rounded font-mono text-[11px] text-[#FBBF24] select-all overflow-x-auto">
              C:\Program Files (x86)\Steam\userdata\&lt;Ваш_SteamID32&gt;\570\remote\cfg\hero_grid_config.json
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              💡 <strong>Совет:</strong> В самой Dota 2 во вкладке «Герои» выберите этот созданный макет в выпадающем списке макетов сеток!
            </p>
          </div>

          {/* Compatibility Notice */}
          <div className="flex items-start gap-2.5 bg-[#121824] border border-[#F59E0B]/30 p-3 rounded-lg text-xs text-[#CBD5E1]">
            <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11px] space-y-1">
              <p>
                <strong className="text-[#F59E0B]">Символы, рамки и нарисованные квадраты перенесены!</strong>
              </p>
              <p className="text-[#94A3B8]">
                Все нарисованные символы (палочки <code>│</code>, <code>─</code>, <code>┌──┐</code>, звёздочки <code>★</code>), боевые плашки и рамки сохранены в конфигурации Dota 2 как категории на точных координатах холста.
              </p>
            </div>
          </div>

          {/* Code Viewer */}
          <div>
            <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1.5 font-['Cinzel']">
              <span>hero_grid_config.json (Dota 2 Schema v3)</span>
              <span className="font-mono text-[10px] text-[#64748B]">{jsonString.length} bytes</span>
            </div>
            <pre className="bg-[#080B10] border border-[#1E293B] p-3.5 rounded font-mono text-xs text-[#FBBF24] max-h-64 overflow-y-auto select-all leading-snug custom-scrollbar">
              {jsonString}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#0B0E15] border-t border-[#202B3D] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-[#94A3B8] hover:text-white hover:bg-[#161F30] rounded transition-colors"
          >
            Закрыть
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#161F30] hover:bg-[#202B3D] text-[#E2E8F0] border border-[#2B3A52] text-xs font-semibold rounded transition-colors shadow-sm cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5 text-[#F59E0B]" />}
              <span>{copied ? 'Скопировано!' : 'Скопировать JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#E5A93C] text-black text-xs font-bold rounded shadow-md transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Скачать hero_grid_config.json</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
