import React from 'react';
import { HelpCircle, X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ onClose }) => {
  const shortcuts = [
    { key: 'V', desc: 'Инструмент выделения (Select & Move)' },
    { key: 'Рамка мышью', desc: 'Выделение прямоугольной областью множества символов' },
    { key: 'Shift + Клик', desc: 'Добавить / убрать объект из множественного выделения' },
    { key: 'Перетаскивание', desc: 'Перенос всех выделенных символов и объектов вместе' },
    { key: 'Ctrl + C', desc: 'Скопировать выбранные символы и объекты' },
    { key: 'Ctrl + V', desc: 'Вставить скопированные объекты со смещением' },
    { key: 'Ctrl + X', desc: 'Вырезать выбранные объекты' },
    { key: 'Ctrl + A', desc: 'Выделить все объекты на холсте' },
    { key: 'Ctrl + D', desc: 'Быстрое дублирование объектов' },
    { key: 'Стрелочки ↑ ↓ ← →', desc: 'Точный сдвиг группы объектов (Shift = 10px)' },
    { key: 'H / Пробел + Drag', desc: 'Панорамирование холста (Pan / Hand)' },
    { key: 'Колесико мыши', desc: 'Плавный зум холста (Zoom In / Out)' },
    { key: 'T / R / O / L / P', desc: 'Инструменты: Текст / Прямоугольник / Круг / Линия / Кисть' },
    { key: 'Ctrl + Z / Ctrl + Y', desc: 'Отмена (Undo) / Повтор (Redo)' },
    { key: 'Delete / Backspace', desc: 'Удалить выбранные объекты или очистить слот' },
    { key: 'Drag Hero из списка', desc: 'Назначить героя в любой слот сетки' },
    { key: 'Drag слот в слот', desc: 'Поменять героев местами между слотами' }
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-lg bg-[#111111] border border-[#242424] rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#242424] flex items-center justify-between bg-[#0E0E0E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#1A1A1A] border border-[#333333] text-[#A4E044]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F0F0F0] font-['Space_Grotesk'] tracking-wide">
                KEYBOARD SHORTCUTS & GUIDE
              </h2>
              <p className="text-xs text-[#888888]">Master desktop workflow speeds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#888888] hover:text-white hover:bg-[#1A1A1A] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar bg-[#111111]">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-1.5 px-2.5 rounded bg-[#141414] border border-[#262626] text-xs"
            >
              <span className="text-[#C8C8C8]">{sc.desc}</span>
              <kbd className="px-2 py-0.5 bg-[#0A0A0A] border border-[#2D2D2D] text-[#A4E044] font-mono text-[11px] rounded shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#0E0E0E] border-t border-[#242424] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#A4E044] hover:bg-[#B7F055] text-[#0B0B0B] text-xs font-bold rounded shadow-sm transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
