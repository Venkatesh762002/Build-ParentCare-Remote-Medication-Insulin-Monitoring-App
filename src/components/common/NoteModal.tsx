import React, { useState } from 'react';
import { X, MessageSquare, Send } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from '../../locales/translations';

interface NoteModalProps {
  isOpen: boolean;
  title: string;
  initialNote?: string;
  language: Language;
  onSave: (note: string) => void;
  onClose: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  title,
  initialNote = '',
  language,
  onSave,
  onClose,
}) => {
  const [noteText, setNoteText] = useState(initialNote);
  const t = getTranslation(language);

  if (!isOpen) return null;

  const handleSelectQuickNote = (preset: string) => {
    setNoteText(preset);
  };

  const handleSave = () => {
    onSave(noteText.trim());
    onClose();
  };

  return (
    <div 
      id="note-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="note-modal-content"
        className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-700" />
            <h3 className="font-bold text-lg text-slate-900">{title}</h3>
          </div>
          <button
            id="btn-close-note-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick selection presets */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            {language === 'ta' ? 'விரைவு குறிப்புகள் (Quick notes):' : 'Quick options:'}
          </label>
          <div className="flex flex-wrap gap-2">
            {t.quickNotes.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuickNote(preset)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all text-left ${
                  noteText === preset
                    ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom text area */}
        <div className="mb-5">
          <textarea
            id="note-textarea-input"
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={t.notePlaceholder}
            className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 text-slate-900 text-sm sm:text-base resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            id="btn-cancel-note"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {t.btnCancel}
          </button>
          <button
            id="btn-save-note"
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm sm:text-base font-semibold shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>{t.btnConfirm}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
