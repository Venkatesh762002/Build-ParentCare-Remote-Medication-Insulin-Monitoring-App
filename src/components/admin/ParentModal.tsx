import React, { useState } from 'react';
import { X, UserPlus, Phone, Stethoscope, AlertCircle } from 'lucide-react';
import { ParentProfile, Language } from '../../types';
import { getTranslation } from '../../locales/translations';

interface ParentModalProps {
  isOpen: boolean;
  language: Language;
  parentToEdit?: ParentProfile | null;
  onSave: (parent: ParentProfile) => void;
  onClose: () => void;
}

export const ParentModal: React.FC<ParentModalProps> = ({
  isOpen,
  language,
  parentToEdit,
  onSave,
  onClose,
}) => {
  const t = getTranslation(language);

  const [name, setName] = useState(parentToEdit?.name || '');
  const [nameTa, setNameTa] = useState(parentToEdit?.nameTa || '');
  const [relationship, setRelationship] = useState<'Father' | 'Mother' | 'In-Law' | 'Other'>(
    parentToEdit?.relationship || 'Father'
  );
  const [phoneNumber, setPhoneNumber] = useState(parentToEdit?.phoneNumber || '');
  const [emergencyDoctorName, setEmergencyDoctorName] = useState(
    parentToEdit?.emergencyDoctorName || ''
  );
  const [emergencyDoctorPhone, setEmergencyDoctorPhone] = useState(
    parentToEdit?.emergencyDoctorPhone || ''
  );
  const [notes, setNotes] = useState(parentToEdit?.notes || '');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Parent name is required.');
      return;
    }

    const profile: ParentProfile = {
      id: parentToEdit?.id || `parent_${Date.now()}`,
      name: name.trim(),
      nameTa: nameTa.trim() || name.trim(),
      relationship,
      relationshipTa: relationship === 'Father' ? 'அப்பா' : relationship === 'Mother' ? 'அம்மா' : 'குடும்ப உறுப்பினர்',
      authorizedAdminIds: ['admin_child'],
      phoneNumber: phoneNumber.trim() || undefined,
      emergencyDoctorName: emergencyDoctorName.trim() || undefined,
      emergencyDoctorPhone: emergencyDoctorPhone.trim() || undefined,
      notes: notes.trim() || undefined,
      active: true,
      createdAt: parentToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(profile);
    onClose();
  };

  return (
    <div 
      id="parent-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="parent-modal-content"
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {parentToEdit ? 'Edit Parent Profile' : 'Add Monitored Parent'}
            </h3>
          </div>
          <button
            id="btn-close-parent-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Parent Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramaswamy Iyer"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                பெயர் (தமிழில்)
              </label>
              <input
                type="text"
                value={nameTa}
                onChange={(e) => setNameTa(e.target.value)}
                placeholder="எ.கா: இராமசுவாமி (அப்பா)"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 bg-white"
              >
                <option value="Father">Father (அப்பா)</option>
                <option value="Mother">Mother (அம்மா)</option>
                <option value="In-Law">In-Law (மாமனார்/மாமியார்)</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 94432 12345"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emergency Doctor Name
              </label>
              <input
                type="text"
                value={emergencyDoctorName}
                onChange={(e) => setEmergencyDoctorName(e.target.value)}
                placeholder="Dr. K. Ramanathan, MD"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Doctor Clinic Phone
              </label>
              <input
                type="tel"
                value={emergencyDoctorPhone}
                onChange={(e) => setEmergencyDoctorPhone(e.target.value)}
                placeholder="+91 98401 22345"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              General Medical Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Type 2 Diabetes, Mild BP, lives independently in Coimbatore"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
            >
              {t.btnCancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold transition-colors"
            >
              {t.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
