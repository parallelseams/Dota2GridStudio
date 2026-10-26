import React, { useState, useMemo, useEffect } from 'react';
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
  Sparkles,
  HardDriveDownload,
  FolderSearch
} from 'lucide-react';

interface ExportDotaModalProps {
  project: ProjectState;
  onClose: () => void;
}

export const ExportDotaModal: React.FC<ExportDotaModalProps> = ({ project, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [installTarget, setInstallTarget] = useState('');
  const [detectedTargets, setDetectedTargets] = useState<Awaited<ReturnType<NonNullable<Window['dotaDesktop']>['getTargets']>>['detected']>([]);
  const [scanInfo, setScanInfo] = useState<Awaited<ReturnType<NonNullable<Window['dotaDesktop']>['getTargets']>> | null>(null);
  const [installError, setInstallError] = useState('');
  const [installResult, setInstallResult] = useState<Awaited<ReturnType<NonNullable<Window['dotaDesktop']>['installConfig']>> | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (!window.dotaDesktop) return;
    window.dotaDesktop.getTargets().then(({ saved, detected, scans, monitor }) => {
      setDetectedTargets(detected);
      setScanInfo({ saved, detected, scans, monitor });
      setInstallTarget(saved || (detected.length === 1 ? detected[0].folder : ''));
    }).catch(() => setInstallError('Не удалось найти папку Dota 2. Выберите её вручную.'));
  }, []);
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

  const handleChooseInstallTarget = async () => {
    if (!window.dotaDesktop) return;
    setInstallError('');
    try {
      const folder = await window.dotaDesktop.chooseTarget();
      if (folder) setInstallTarget(folder);
    } catch (error) {
      setInstallError(error instanceof Error ? error.message : 'Не удалось выбрать папку.');
    }
  };

  const handleInstall = async () => {
    if (!window.dotaDesktop) return;
    if (!installTarget) {
      await handleChooseInstallTarget();
      return;
    }
    const confirmed = window.confirm(
      `Добавить или обновить профиль этой сетки?\n\n${installTarget}\n\nОстальные профили останутся. Перед заменой файла приложение сохранит резервную копию.`
    );
    if (!confirmed) return;

    setIsInstalling(true);
    setInstallError('');
    setInstallResult(null);
    try {
      const result = await window.dotaDesktop.installConfig(installTarget, jsonString);
      setInstallResult(result);
    } catch (error) {
      setInstallError(error instanceof Error ? error.message : 'Не удалось записать файл. Проверьте выбранную папку.');
    } finally {
      setIsInstalling(false);
    }
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
            <div className="p-2 rounded bg-[#161F30] border border-[#2B3A52] text-[#66C0F4]">
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
            <div className="flex items-center gap-2 text-[#66C0F4] text-xs font-bold font-['Cinzel']">
              <Folder className="w-4 h-4" />
              <span>ИНСТРУКЦИЯ ПО УСТАНОВКЕ В DOTA 2:</span>
            </div>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Поместите скачанный файл <code className="text-[#66C0F4]">hero_grid_config.json</code> в папку вашего профиля Steam:
            </p>
            <div className="bg-[#080B10] border border-[#1E293B] p-2.5 rounded font-mono text-[11px] text-[#FBBF24] select-all overflow-x-auto">
              C:\Program Files (x86)\Steam\userdata\&lt;Ваш_SteamID32&gt;\570\remote\cfg\hero_grid_config.json
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              💡 <strong>Совет:</strong> В самой Dota 2 во вкладке «Герои» выберите этот созданный макет в выпадающем списке макетов сеток!
            </p>
          </div>

          {window.dotaDesktop && scanInfo && (
            <section className="rounded-lg border border-[#2B3A52] bg-[#0D141D] p-3.5 space-y-2" aria-live="polite">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-white">Автосканирование этого ПК</div>
                  <div className="text-[11px] text-[#94A3B8] mt-1">Монитор {scanInfo.monitor.width} × {scanInfo.monitor.height} · масштаб Windows {Math.round(scanInfo.monitor.scaleFactor * 100)}%</div>
                </div>
                <span className="text-[10px] text-emerald-300 border border-emerald-900 bg-emerald-950/40 px-2 py-1 rounded-full">Завершено</span>
              </div>
              {scanInfo.scans.length > 0 ? (
                <div className="space-y-2">
                  {scanInfo.scans.map((scan, index) => (
                    <div key={`${scan.folder}-${index}`} className="rounded border border-[#202B3D] bg-[#080B10] px-3 py-2">
                      <div className="text-[11px] text-[#CBD5E1]">{scan.accountId ? `Steam ID ${scan.accountId}` : 'Профиль Steam'} · {scan.profileCount ?? 0} сеток · {scan.categoryCount ?? 0} категорий · {scan.heroCount ?? 0} героев</div>
                      {scan.bounds && <div className="text-[10px] text-[#8291A5] mt-1">Область сетки: {scan.bounds.width} × {scan.bounds.height} единиц Dota · {scan.categories?.length ?? 0} элементов с размерами считано</div>}
                      {scan.error && <div className="text-[10px] text-amber-300 mt-1">{scan.error}</div>}
                    </div>
                  ))}
                  <p className="text-[10px] leading-relaxed text-[#8291A5]">Размеры берутся из hero_grid_config.json, разрешение и масштаб — с этого ПК. Они помогают подогнать предпросмотр; Dota хранит координаты сетки отдельно от разрешения монитора.</p>
                </div>
              ) : <p className="text-[11px] text-[#94A3B8]">Сохранённая сетка Dota не найдена. После появления hero_grid_config.json она будет обнаружена автоматически.</p>}
            </section>
          )}
          {window.dotaDesktop && (
            <div className="border border-[#2B3A52] bg-[#121824] rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <HardDriveDownload className="w-4 h-4 text-[#4ADE80]" /> Быстрая установка в Dota 2
                  </div>
                  <p className="mt-1 text-[11px] text-[#94A3B8] truncate" title={installTarget || 'Папка не выбрана'}>
                    {installTarget || 'Папка Steam не найдена — выберите её'}
                  </p>
                </div>
                <button onClick={handleChooseInstallTarget} className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-[#CBD5E1] hover:text-white border border-[#2B3A52] rounded">
                  <FolderSearch className="w-3.5 h-3.5" /> Выбрать
                </button>
              </div>
              {detectedTargets.length > 1 && (
                <select value={installTarget} onChange={(event) => setInstallTarget(event.target.value)} className="w-full bg-[#080B10] border border-[#2B3A52] rounded px-2 py-1.5 text-[11px] text-[#E2E8F0]">
                  <option value="">Выберите аккаунт Steam</option>
                  {detectedTargets.map((target) => <option key={target.folder} value={target.folder}>Steam ID {target.accountId}{target.hasConfig ? ' · есть сетка' : ''}</option>)}
                </select>
              )}
              {installError && <p role="alert" className="text-[11px] text-red-300">{installError}</p>}
              {installResult && <p role="status" className="text-[11px] text-green-300">Готово: сетка установлена. {installResult.backupPath ? `Резервная копия: ${installResult.backupPath}` : 'Предыдущего файла не было.'}</p>}
              <button onClick={handleInstall} disabled={isInstalling} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-[#4ADE80] to-[#22C55E] hover:from-[#86EFAC] hover:to-[#4ADE80] disabled:opacity-60 text-[#07130A] text-xs font-bold rounded transition-colors">
                <HardDriveDownload className="w-4 h-4" /> {isInstalling ? 'Устанавливаем…' : 'Установить сетку в папку Dota 2'}
              </button>
              <p className="text-[10px] text-[#94A3B8]">Перед установкой закройте Dota 2. Старый файл сохранится рядом как резервная копия.</p>
            </div>
          )}
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
              {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5 text-[#66C0F4]" />}
              <span>{copied ? 'Скопировано!' : 'Скопировать JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#66C0F4] to-[#1A9FFF] hover:from-[#66C0F4] hover:to-[#66C0F4] text-black text-xs font-bold rounded shadow-md transition-colors cursor-pointer"
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
