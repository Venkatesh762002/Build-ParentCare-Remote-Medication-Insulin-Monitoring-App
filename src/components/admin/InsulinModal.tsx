import React, { useState } from 'react';
import { X, Syringe, ShieldAlert, AlertCircle } from 'lucide-react';
import { InsulinSchedule, Language } from '../../types';
import { getTranslation } from '../../locales/translations';

interface InsulinModalProps {
  isOpen: boolean;
  parentId: string;
  scheduleToEdit?: InsulinSchedule | null;
  language: Language;
  onSave: (schedule: InsulinSchedule) => void;
  onClose: () => void;
}

export const InsulinModal: React.FC<InsulinModalProps> = ({
  isOpen,
  parentId,
  scheduleToEdit,
  language,
  onSave,
  onClose,
}) => {
  const t = getTranslation(language);

  const [insulinName, setInsulinName] = useState(scheduleToEdit?.insulinName || '');
  const [insulinNameTa, setInsulinNameTa] = useState(scheduleToEdit?.insulinNameTa || '');
  const [prescribedScheduleText, setPrescribedScheduleText] = useState(
    scheduleToEdit?.prescribedScheduleText || ''
  );
  const [scheduledTime, setScheduledTime] = useState(scheduleToEdit?.scheduledTime || '08:30 PM');
  const [instructions, setInstructions] = useState(
    scheduleToEdit?.instructions || 'Inject into lower abdomen or thigh rotating injection sites. Never alter the prescribed dose.'
  );
  const [instructionsTa, setInstructionsTa] = useState(
    scheduleToEdit?.instructionsTa || 'மருத்துவர் கூறியபடி அடிவயிறு அல்லது தொடையில் ஊசி செலுத்தவும். அளவை மாற்ற வேண்டாம்.'
  );
  const [prescribingDoctor, setPrescribingDoctor] = useState(
    scheduleToEdit?.prescribingDoctor || ''
  );
  const [notes, setNotes] = useState(scheduleToEdit?.notes || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insulinName.trim()) {
      setValidationError('Insulin name is required.');
      return;
    }
    if (!prescribedScheduleText.trim()) {
      setValidationError('Prescribed regimen instructions are required.');
      return;
    }

    const schedule: InsulinSchedule = {
      id: scheduleToEdit?.id || `insulin_${Date.now()}`,
      parentId,
      insulinName: insulinName.trim(),
      insulinNameTa: insulinNameTa.trim() || undefined,
      prescribedScheduleText: prescribedScheduleText.trim(),
      scheduledTime,
      instructions: instructions.trim(),
      instructionsTa: instructionsTa.trim() || undefined,
      startDate: scheduleToEdit?.startDate || new Date().toISOString().split('T')[0],
      active: scheduleToEdit ? scheduleToEdit.active : true,
      prescribingDoctor: prescribingDoctor.trim() || undefined,
      notes: notes.trim() || undefined,
      createdBy: scheduleToEdit?.createdBy || 'admin_child',
      updatedBy: 'admin_child',
      createdAt: scheduleToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(schedule);
    onClose();
  };

  return (
    <div 
      id="insulin-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="insulin-modal-content"
        className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <Syringe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {scheduleToEdit ? t.editInsulinSchedule : t.addInsulinSchedule}
              </h3>
              <p className="text-xs text-purple-900 font-semibold">
                Doctor Prescribed Regimen Only
              </p>
            </div>
          </div>
          <button
            id="btn-close-insulin-modal"
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Warning */}
        <div className="my-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-0.5">Strict Safety Protocol:</p>
            <p>Enter only exact details from doctor prescription. Do not recommend or alter insulin doses.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 space-y-4 text-sm">
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.insulinName} *
            </label>
            <input
              id="input-insulin-name"
              type="text"
              required
              value={insulinName}
              onChange={(e) => setInsulinName(e.target.value)}
              placeholder={t.insulinNamePlaceholder}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ta' ? 'இன்சுலின் பெயர் (தமிழில்)' : 'Insulin Name in Tamil (Optional)'}
            </label>
            <input
              id="input-insulin-name-ta"
              type="text"
              value={insulinNameTa}
              onChange={(e) => setInsulinNameTa(e.target.value)}
              placeholder="எ.கா: லான்டஸ் சோலோஸ்டார்"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.prescribedScheduleText} *
            </label>
            <textarea
              id="input-insulin-schedule-text"
              required
              rows={2}
              value={prescribedScheduleText}
              onChange={(e) => setPrescribedScheduleText(e.target.value)}
              placeholder={t.prescribedSchedulePlaceholder}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.specificTime} *
              </label>
              <input
                id="input-insulin-time"
                type="text"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="08:30 PM"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.prescribingDoctor}
              </label>
              <input
                id="input-insulin-doctor"
                type="text"
                value={prescribingDoctor}
                onChange={(e) => setPrescribingDoctor(e.target.value)}
                placeholder="e.g. Dr. K. Ramanathan, MD"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Storage & Handling Instructions
            </label>
            <input
              id="input-insulin-storage-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Keep refrigerated until in use, rotate injection sites"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              id="btn-cancel-insulin-modal"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
            >
              {t.btnCancel}
            </button>
            <button
              id="btn-save-insulin-modal"
              type="submit"
              className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold shadow-sm transition-colors"
            >
              {t.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
