import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Trash2, 
  RefreshCw, 
  ShieldAlert, 
  Check, 
  Pill, 
  Clock, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Medication, Language, MedicationFrequency, MedicationScheduleTime } from '../../types';
import { getTranslation } from '../../locales/translations';
import { processMedicinePhoto } from '../../utils/imageUtils';

interface MedicationModalProps {
  isOpen: boolean;
  parentId: string;
  medicationToEdit?: Medication | null;
  language: Language;
  onSave: (med: Medication) => void;
  onClose: () => void;
}

export const MedicationModal: React.FC<MedicationModalProps> = ({
  isOpen,
  parentId,
  medicationToEdit,
  language,
  onSave,
  onClose,
}) => {
  const t = getTranslation(language);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [medicineName, setMedicineName] = useState(medicationToEdit?.medicineName || '');
  const [medicineNameTa, setMedicineNameTa] = useState(medicationToEdit?.medicineNameTa || '');
  const [strengthText, setStrengthText] = useState(medicationToEdit?.strengthText || '');
  const [instructions, setInstructions] = useState(medicationToEdit?.instructions || '');
  const [instructionsTa, setInstructionsTa] = useState(medicationToEdit?.instructionsTa || '');
  const [schedule, setSchedule] = useState<MedicationScheduleTime>(medicationToEdit?.schedule || 'morning');
  const [scheduledTime, setScheduledTime] = useState(medicationToEdit?.scheduledTime || '08:00 AM');
  const [frequency, setFrequency] = useState<MedicationFrequency>(medicationToEdit?.frequency || 'once_daily');
  const [startDate, setStartDate] = useState(medicationToEdit?.startDate || new Date().toISOString().split('T')[0]);
  const [prescribingDoctor, setPrescribingDoctor] = useState(medicationToEdit?.prescribingDoctor || '');
  const [additionalNotes, setAdditionalNotes] = useState(medicationToEdit?.additionalNotes || '');
  const [photoUrl, setPhotoUrl] = useState(medicationToEdit?.photoUrl || '');
  
  // UI processing states
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsProcessingPhoto(true);

    const result = await processMedicinePhoto(file);
    setIsProcessingPhoto(false);

    if (!result.valid) {
      setUploadError(result.error || 'Failed to process photo.');
      return;
    }

    if (result.dataUrl) {
      setPhotoUrl(result.dataUrl);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim()) {
      setValidationError('Medicine name is required.');
      return;
    }
    if (!strengthText.trim()) {
      setValidationError('Strength/Dosage is required.');
      return;
    }
    if (!instructions.trim()) {
      setValidationError('Prescribed instructions are required.');
      return;
    }

    const med: Medication = {
      id: medicationToEdit?.id || `med_${Date.now()}`,
      parentId,
      medicineName: medicineName.trim(),
      medicineNameTa: medicineNameTa.trim() || undefined,
      strengthText: strengthText.trim(),
      photoUrl: photoUrl || '',
      instructions: instructions.trim(),
      instructionsTa: instructionsTa.trim() || undefined,
      schedule,
      scheduledTime,
      frequency,
      startDate,
      active: medicationToEdit ? medicationToEdit.active : true,
      prescribingDoctor: prescribingDoctor.trim() || undefined,
      additionalNotes: additionalNotes.trim() || undefined,
      createdBy: medicationToEdit?.createdBy || 'admin_child',
      updatedBy: 'admin_child',
      createdAt: medicationToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(med);
    onClose();
  };

  return (
    <div 
      id="medication-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="medication-modal-content"
        className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {medicationToEdit ? t.editMedication : t.addMedication}
              </h3>
              <p className="text-xs text-slate-500">
                {t.photoVerifyNotice}
              </p>
            </div>
          </div>
          <button
            id="btn-close-med-modal"
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 py-4 space-y-5 text-sm">
          
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Photo Upload & Preview Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Upload className="w-4 h-4 text-teal-600" />
                <span>{t.medicinePhoto}</span>
              </label>
              <span className="text-xs text-teal-700 font-semibold">
                JPG, JPEG, PNG (Max 6MB)
              </span>
            </div>
            
            <p className="text-xs text-slate-500 mb-3">
              {t.uploadPhotoPrompt}. {t.photoUploadTip}
            </p>

            {/* Photo preview or dropzone */}
            {photoUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-white p-2 flex flex-col items-center">
                <img
                  src={photoUrl}
                  alt="Medicine strip preview"
                  className="max-h-48 w-auto object-contain rounded-lg shadow-xs"
                />
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t.replacePhoto}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.deletePhoto}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-teal-500 bg-white rounded-xl p-6 text-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-700 text-xs sm:text-sm">
                  Click to browse and upload medicine strip or package photo
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Upload clear photo showing brand name and strength on blister strip.
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {uploadError && (
              <p className="text-xs text-rose-600 font-semibold mt-2">
                {uploadError}
              </p>
            )}

            {isProcessingPhoto && (
              <p className="text-xs text-teal-600 font-semibold mt-2 animate-pulse">
                Optimizing medicine photo for crisp viewing...
              </p>
            )}

            <div className="mt-2.5 p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Safety Rule: The admin must manually verify medicine name and strength. No automated AI guessing is used.
              </span>
            </div>
          </div>

          {/* Medicine Name & Strength */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.medicineName} *
              </label>
              <input
                id="input-med-name"
                type="text"
                required
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                placeholder={t.medicineNamePlaceholder}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.strengthDosage} *
              </label>
              <input
                id="input-med-strength"
                type="text"
                required
                value={strengthText}
                onChange={(e) => setStrengthText(e.target.value)}
                placeholder={t.strengthDosagePlaceholder}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Tamil Name Optional */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ta' ? 'மருந்தின் பெயர் (தமிழில்)' : 'Medicine Name in Tamil (Optional for elderly):'}
            </label>
            <input
              id="input-med-name-ta"
              type="text"
              value={medicineNameTa}
              onChange={(e) => setMedicineNameTa(e.target.value)}
              placeholder="எ.கா: கிளைகோமெட் 500 எஸ்.ஆர்"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          {/* Prescribed Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.instructions} (English) *
            </label>
            <textarea
              id="input-med-instructions"
              required
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={t.instructionsPlaceholder}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ta' ? 'மருத்துவரின் வழிமுறைகள் (தமிழில்)' : 'Instructions in Tamil (for elderly):'}
            </label>
            <textarea
              id="input-med-instructions-ta"
              rows={2}
              value={instructionsTa}
              onChange={(e) => setInstructionsTa(e.target.value)}
              placeholder="எ.கா: காலை உணவிற்குப் பிறகு வெதுவெதுப்பான நீரில் 1 மாத்திரை எடுக்கவும்"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          {/* Schedule Time & Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.scheduleTime}
              </label>
              <select
                id="select-med-schedule"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value as MedicationScheduleTime)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              >
                <option value="morning">{t.morning}</option>
                <option value="afternoon">{t.afternoon}</option>
                <option value="evening">{t.evening}</option>
                <option value="night">{t.night}</option>
                <option value="custom">{t.customTime}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.specificTime} *
              </label>
              <input
                id="input-med-time"
                type="text"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="08:00 AM"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.frequency}
              </label>
              <select
                id="select-med-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as MedicationFrequency)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              >
                <option value="once_daily">{t.freqOnce}</option>
                <option value="twice_daily">{t.freqTwice}</option>
                <option value="thrice_daily">{t.freqThrice}</option>
                <option value="custom">{t.freqCustom}</option>
              </select>
            </div>
          </div>

          {/* Doctor info & Start date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.prescribingDoctor}
              </label>
              <input
                id="input-med-doctor"
                type="text"
                value={prescribingDoctor}
                onChange={(e) => setPrescribingDoctor(e.target.value)}
                placeholder={t.prescribingDoctorPlaceholder}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Start Date
              </label>
              <input
                id="input-med-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Caregiver Reference Notes (Optional)
            </label>
            <input
              id="input-med-notes"
              type="text"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g., Do not crush tablet, keep in dry place"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              id="btn-cancel-med-modal"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
            >
              {t.btnCancel}
            </button>
            <button
              id="btn-save-med-modal"
              type="submit"
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-sm transition-colors"
            >
              {t.saveChanges}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
