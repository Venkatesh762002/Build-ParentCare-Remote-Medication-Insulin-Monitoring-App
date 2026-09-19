import React from 'react';
import { X, ZoomIn, ShieldCheck } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from '../../locales/translations';

interface PhotoModalProps {
  isOpen: boolean;
  photoUrl: string;
  medicineName: string;
  strengthText: string;
  language: Language;
  onClose: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  isOpen,
  photoUrl,
  medicineName,
  strengthText,
  language,
  onClose,
}) => {
  const t = getTranslation(language);

  if (!isOpen) return null;

  return (
    <div 
      id="photo-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="photo-modal-card"
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-slate-900">{medicineName}</h3>
            <p className="text-sm font-medium text-teal-700">{strengthText}</p>
          </div>
          <button
            id="btn-close-photo-modal"
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
            aria-label={t.btnClosePhoto}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Photo Container */}
        <div className="p-4 sm:p-6 bg-slate-900/5 flex items-center justify-center overflow-auto max-h-[60vh]">
          {photoUrl ? (
            <img
              id="medicine-strip-enlarged-photo"
              src={photoUrl}
              alt={`${medicineName} strip`}
              className="max-h-[55vh] w-auto max-w-full object-contain rounded-lg shadow-md border border-slate-300"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-slate-400 py-16 text-center">
              <ZoomIn className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No package photo uploaded yet.</p>
            </div>
          )}
        </div>

        {/* Footer verification note */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{t.photoVerifyNotice}</span>
          </div>
          <button
            id="btn-close-photo-footer"
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-900 transition-colors shrink-0"
          >
            {t.btnClosePhoto}
          </button>
        </div>
      </div>
    </div>
  );
};
