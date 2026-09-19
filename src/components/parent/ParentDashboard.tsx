import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Volume2, 
  VolumeX,
  MessageSquare, 
  Maximize2, 
  Phone, 
  Syringe, 
  Pill, 
  History, 
  Calendar,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { 
  ParentProfile, 
  Medication, 
  InsulinSchedule, 
  MedicationLog, 
  InsulinLog, 
  Language, 
  TextSize, 
  MedicationStatus 
} from '../../types';
import { getTranslation } from '../../locales/translations';
import { SafetyBanner } from '../common/SafetyBanner';
import { PhotoModal } from '../common/PhotoModal';
import { NoteModal } from '../common/NoteModal';
import { speakReminder, stopSpeaking } from '../../utils/speech';

interface ParentDashboardProps {
  parent: ParentProfile;
  medications: Medication[];
  insulinSchedules: InsulinSchedule[];
  medicationLogs: MedicationLog[];
  insulinLogs: InsulinLog[];
  language: Language;
  textSize: TextSize;
  onUpdateMedicationStatus: (logId: string, status: MedicationStatus, note?: string) => void;
  onUpdateInsulinStatus: (logId: string, status: MedicationStatus, note?: string) => void;
  onEnsureMedLog: (med: Medication) => MedicationLog;
  onEnsureInsulinLog: (sched: InsulinSchedule) => InsulinLog;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  parent,
  medications,
  insulinSchedules,
  medicationLogs,
  insulinLogs,
  language,
  textSize,
  onUpdateMedicationStatus,
  onUpdateInsulinStatus,
  onEnsureMedLog,
  onEnsureInsulinLog,
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [photoModalState, setPhotoModalState] = useState<{
    isOpen: boolean;
    photoUrl: string;
    medicineName: string;
    strengthText: string;
  }>({
    isOpen: false,
    photoUrl: '',
    medicineName: '',
    strengthText: '',
  });

  const [noteModalState, setNoteModalState] = useState<{
    isOpen: boolean;
    logId: string;
    title: string;
    initialNote: string;
    targetType: 'medication' | 'insulin';
    targetStatus?: MedicationStatus;
  }>({
    isOpen: false,
    logId: '',
    title: '',
    initialNote: '',
    targetType: 'medication',
  });

  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // Text size classes
  const fontMultiplier = textSize === 'xlarge' ? 'text-lg sm:text-xl' : textSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base';
  const headingMultiplier = textSize === 'xlarge' ? 'text-2xl sm:text-3xl' : textSize === 'large' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl';
  const buttonHeight = textSize === 'xlarge' ? 'py-4 text-lg' : textSize === 'large' ? 'py-3.5 text-base' : 'py-3 text-sm sm:text-base';

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 
    ? t.greetingMorning 
    : hour < 17 
    ? t.greetingAfternoon 
    : hour < 21 
    ? t.greetingEvening 
    : t.greetingNight;

  const todayFormatted = new Intl.DateTimeFormat(language === 'ta' ? 'ta-IN' : 'en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  // Active meds for this parent
  const activeMeds = medications.filter(m => m.active);

  const handleSpeak = (id: string, text: string) => {
    if (activeSpeakingId === id) {
      stopSpeaking();
      setActiveSpeakingId(null);
      return;
    }
    setActiveSpeakingId(id);
    speakReminder(
      text,
      language,
      () => setActiveSpeakingId(id),
      () => setActiveSpeakingId(null),
      () => setActiveSpeakingId(null)
    );
  };

  const getStatusBadge = (status: MedicationStatus) => {
    switch (status) {
      case 'taken':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {t.status_taken}
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            {t.status_skipped}
          </span>
        );
      case 'unable_to_complete':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            {t.status_unable_to_complete}
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <Clock className="w-4 h-4 text-purple-600 shrink-0" />
            {t.status_overdue}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <Clock className="w-4 h-4 text-slate-500 shrink-0" />
            {t.status_pending}
          </span>
        );
    }
  };

  return (
    <div id="parent-dashboard-container" className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Elderly Greeting Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-teal-200 text-xs sm:text-sm font-semibold uppercase tracking-wider block mb-1">
              {t.todaysDate}: {todayFormatted}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {greeting}, {language === 'ta' ? parent.nameTa : parent.name}!
            </h2>
            <p className="text-teal-100/90 text-sm sm:text-base mt-1 max-w-xl">
              {language === 'ta'
                ? 'இன்றைய உங்கள் மருந்து அட்டவணை கீழே உள்ளது. மருத்துவர் கூறியபடி தவறாமல் உட்கொள்ளுங்கள்.'
                : 'Your daily prescribed medication routine is listed below. Take your medicines as instructed by your doctor.'}
            </p>
          </div>

          {/* Emergency / Contact Caregiver Fast Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {parent.phoneNumber && (
              <a
                id="btn-call-caregiver"
                href={`tel:${parent.phoneNumber}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-sm font-bold border border-white/20 transition-colors backdrop-blur-xs"
              >
                <Phone className="w-4 h-4 text-teal-300" />
                <span>{t.btnContactChild}</span>
              </a>
            )}
            {parent.emergencyDoctorPhone && (
              <a
                id="btn-call-doctor"
                href={`tel:${parent.emergencyDoctorPhone}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-100 rounded-xl text-sm font-bold border border-emerald-400/30 transition-colors backdrop-blur-xs"
              >
                <Phone className="w-4 h-4 text-emerald-300" />
                <span>{t.btnEmergencyDoctor}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <SafetyBanner language={language} variant="general" />

      {/* View Switcher: Today's Schedule vs Medication History */}
      <div className="flex items-center gap-3 my-6 border-b border-slate-200 pb-2">
        <button
          id="tab-parent-today"
          type="button"
          onClick={() => setActiveTab('today')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'today'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          } ${textSize === 'xlarge' ? 'text-lg' : 'text-base'}`}
        >
          <Calendar className="w-5 h-5" />
          <span>{t.parentDashboard}</span>
          <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'today' ? 'bg-teal-900 text-teal-100' : 'bg-slate-200 text-slate-700'
          }`}>
            {activeMeds.length}
          </span>
        </button>

        <button
          id="tab-parent-history"
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          } ${textSize === 'xlarge' ? 'text-lg' : 'text-base'}`}
        >
          <History className="w-5 h-5" />
          <span>{t.medicationHistory}</span>
        </button>
      </div>

      {activeTab === 'today' ? (
        <div className="space-y-8">
          
          {/* Section: Today's Prescribed Medications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-extrabold text-slate-900 flex items-center gap-2.5 ${headingMultiplier}`}>
                <Pill className="w-6 h-6 text-teal-700" />
                <span>{language === 'ta' ? 'இன்றைய மாத்திரைகள்' : 'Prescribed Medications Today'}</span>
              </h3>
              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                {activeMeds.length} {language === 'ta' ? 'மருந்துகள்' : 'Scheduled'}
              </span>
            </div>

            {activeMeds.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
                <Pill className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="text-base font-semibold">
                  {language === 'ta' ? 'தற்போது புதிய மருந்துகள் ஏதுமில்லை.' : 'No active medications scheduled for this profile.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {activeMeds.map((med) => {
                  const log = onEnsureMedLog(med);
                  const isCurrentSpeaking = activeSpeakingId === med.id;

                  const voiceScript = language === 'ta'
                    ? `மருந்து எடுத்துக்கொள்ள வேண்டிய நேரம் இது. ${med.medicineNameTa || med.medicineName}. ${med.instructionsTa || med.instructions}`
                    : `It is time to take ${med.medicineName}, ${med.strengthText}. ${med.instructions}`;

                  return (
                    <div
                      key={med.id}
                      id={`med-card-${med.id}`}
                      className={`bg-white rounded-2xl border-2 transition-all overflow-hidden shadow-xs ${
                        log.status === 'taken'
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : log.status === 'skipped'
                          ? 'border-amber-300 bg-amber-50/20'
                          : log.status === 'unable_to_complete'
                          ? 'border-rose-300 bg-rose-50/20'
                          : 'border-slate-200 hover:border-teal-400'
                      }`}
                    >
                      <div className="p-5 sm:p-7">
                        
                        {/* Top Bar: Schedule time & status badge */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-teal-50 text-teal-800 border border-teal-200">
                              <Clock className="w-4 h-4 text-teal-600" />
                              {med.scheduledTime}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              {language === 'ta' ? (med.schedule === 'morning' ? 'காலை' : med.schedule === 'afternoon' ? 'மதியம்' : med.schedule === 'evening' ? 'மாலை' : 'இரவு') : med.schedule}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Status Badge */}
                            {getStatusBadge(log.status)}

                            {/* Voice button */}
                            <button
                              id={`btn-voice-${med.id}`}
                              type="button"
                              onClick={() => handleSpeak(med.id, voiceScript)}
                              className={`p-2 rounded-xl border transition-all ${
                                isCurrentSpeaking
                                  ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-800'
                              }`}
                              title={t.btnHearReminder}
                              aria-label={t.btnHearReminder}
                            >
                              {isCurrentSpeaking ? (
                                <VolumeX className="w-5 h-5 text-amber-700" />
                              ) : (
                                <Volume2 className="w-5 h-5 text-teal-700" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Main Body: Prominent Actual Strip Photo + Medicine Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 py-5">
                          
                          {/* Medicine Strip Photo Section (Large & Prominent) */}
                          <div className="sm:col-span-4 flex flex-col">
                            <div 
                              id={`photo-wrapper-${med.id}`}
                              onClick={() => setPhotoModalState({
                                isOpen: true,
                                photoUrl: med.photoUrl,
                                medicineName: med.medicineName,
                                strengthText: med.strengthText,
                              })}
                              className="relative group cursor-pointer bg-slate-900/5 rounded-xl overflow-hidden border border-slate-200 aspect-4/3 flex items-center justify-center shadow-inner hover:border-teal-500 transition-all"
                            >
                              {med.photoUrl ? (
                                <img
                                  src={med.photoUrl}
                                  alt={med.medicineName}
                                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="p-4 text-center text-slate-400">
                                  <Pill className="w-8 h-8 mx-auto mb-1 opacity-50" />
                                  <span className="text-xs">No Photo</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="flex items-center gap-1 text-white bg-slate-900/80 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-xs">
                                  <Maximize2 className="w-3.5 h-3.5" />
                                  {t.btnViewPhoto}
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] text-slate-500 text-center mt-1.5 flex items-center justify-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-teal-600" />
                              {language === 'ta' ? 'அசல் மருந்து அட்டை புகைப்படம்' : 'Actual medicine strip photo'}
                            </span>
                          </div>

                          {/* Medicine Information */}
                          <div className="sm:col-span-8 flex flex-col justify-between">
                            <div>
                              <h4 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                {language === 'ta' && med.medicineNameTa ? med.medicineNameTa : med.medicineName}
                              </h4>
                              {language === 'ta' && med.medicineNameTa && (
                                <p className="text-xs text-slate-500 font-medium">({med.medicineName})</p>
                              )}
                              
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className="inline-block px-3 py-1 bg-teal-50 text-teal-900 border border-teal-200 rounded-lg text-xs sm:text-sm font-extrabold">
                                  {med.strengthText}
                                </span>
                                {med.prescribingDoctor && (
                                  <span className="text-xs text-slate-600 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                                    Rx: {med.prescribingDoctor}
                                  </span>
                                )}
                              </div>

                              {/* Prescribed Instructions */}
                              <div className="mt-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                  {t.instructions}:
                                </p>
                                <p className={`text-slate-800 font-semibold leading-relaxed ${fontMultiplier}`}>
                                  {language === 'ta' && med.instructionsTa ? med.instructionsTa : med.instructions}
                                </p>
                              </div>

                              {/* Parent Note display if present */}
                              {log.note && (
                                <div className="mt-3 p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-start gap-2 text-xs sm:text-sm text-teal-900">
                                  <MessageSquare className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold">{t.noteByParent}: </span>
                                    <span>"{log.note}"</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Confirmation timestamp if taken */}
                            {log.confirmedAt && (
                              <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                                <Check className="w-4 h-4 text-emerald-600" />
                                <span>{t.timeRecorded}: {new Date(log.confirmedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Large, Elderly-Friendly Action Buttons (Touch Target >= 48px) */}
                        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3">
                          
                          {/* 1. Taken Button (Green) */}
                          <button
                            id={`btn-taken-${med.id}`}
                            type="button"
                            onClick={() => onUpdateMedicationStatus(log.id, 'taken')}
                            className={`flex items-center justify-center gap-2 rounded-xl font-extrabold transition-all ${buttonHeight} ${
                              log.status === 'taken'
                                ? 'bg-emerald-700 text-white ring-4 ring-emerald-200'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                            }`}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            <span>{t.btnTaken}</span>
                          </button>

                          {/* 2. Skipped Button (Amber) */}
                          <button
                            id={`btn-skipped-${med.id}`}
                            type="button"
                            onClick={() => {
                              setNoteModalState({
                                isOpen: true,
                                logId: log.id,
                                title: `${t.btnSkipped}: ${med.medicineName}`,
                                initialNote: log.note || '',
                                targetType: 'medication',
                                targetStatus: 'skipped',
                              });
                            }}
                            className={`flex items-center justify-center gap-2 rounded-xl font-bold transition-all ${buttonHeight} ${
                              log.status === 'skipped'
                                ? 'bg-amber-600 text-white ring-4 ring-amber-200'
                                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            <AlertCircle className="w-5 h-5 text-amber-700" />
                            <span>{t.btnSkipped}</span>
                          </button>

                          {/* 3. Unable to Complete Button (Rose) */}
                          <button
                            id={`btn-unable-${med.id}`}
                            type="button"
                            onClick={() => {
                              setNoteModalState({
                                isOpen: true,
                                logId: log.id,
                                title: `${t.btnUnable}: ${med.medicineName}`,
                                initialNote: log.note || '',
                                targetType: 'medication',
                                targetStatus: 'unable_to_complete',
                              });
                            }}
                            className={`flex items-center justify-center gap-2 rounded-xl font-bold transition-all ${buttonHeight} ${
                              log.status === 'unable_to_complete'
                                ? 'bg-rose-700 text-white ring-4 ring-rose-200'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300'
                            }`}
                          >
                            <XCircle className="w-5 h-5 text-rose-600" />
                            <span>{t.btnUnable}</span>
                          </button>

                          {/* 4. Add/Edit Note */}
                          <button
                            id={`btn-note-${med.id}`}
                            type="button"
                            onClick={() => {
                              setNoteModalState({
                                isOpen: true,
                                logId: log.id,
                                title: `${t.btnAddNote}: ${med.medicineName}`,
                                initialNote: log.note || '',
                                targetType: 'medication',
                              });
                            }}
                            className={`flex items-center justify-center gap-1.5 rounded-xl font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-all ${buttonHeight}`}
                          >
                            <MessageSquare className="w-4 h-4 text-slate-500" />
                            <span>{log.note ? (language === 'ta' ? 'குறிப்பு மாற்று' : 'Edit Note') : t.btnAddNote}</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Prescribed Insulin Administration */}
          {insulinSchedules.filter(s => s.active).length > 0 && (
            <div className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-extrabold text-slate-900 flex items-center gap-2.5 ${headingMultiplier}`}>
                  <Syringe className="w-6 h-6 text-purple-700" />
                  <span>{t.insulinSectionTitle}</span>
                </h3>
              </div>

              {/* Insulin Safety Banner */}
              <SafetyBanner language={language} variant="insulin" />

              <div className="space-y-4">
                {insulinSchedules.filter(s => s.active).map((sched) => {
                  const log = onEnsureInsulinLog(sched);
                  const isCurrentSpeaking = activeSpeakingId === sched.id;

                  const voiceScript = language === 'ta'
                    ? `இன்சுலின் எடுத்துக்கொள்ள வேண்டிய நேரம் இது. ${sched.insulinNameTa || sched.insulinName}. ${sched.instructionsTa || sched.instructions}`
                    : `It is time for prescribed insulin: ${sched.insulinName}. ${sched.instructions}`;

                  return (
                    <div
                      key={sched.id}
                      id={`insulin-card-${sched.id}`}
                      className={`bg-white rounded-2xl border-2 p-5 sm:p-7 shadow-xs transition-all ${
                        log.status === 'taken'
                          ? 'border-emerald-300 bg-emerald-50/20'
                          : log.status === 'skipped'
                          ? 'border-amber-300 bg-amber-50/20'
                          : 'border-purple-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-lg text-xs sm:text-sm font-bold bg-purple-50 text-purple-900 border border-purple-200">
                            {sched.scheduledTime}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">
                            {language === 'ta' ? 'பரிந்துரைக்கப்பட்ட இன்சுலின்' : 'Prescribed Regimen'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(log.status)}
                          <button
                            id={`btn-voice-insulin-${sched.id}`}
                            type="button"
                            onClick={() => handleSpeak(sched.id, voiceScript)}
                            className={`p-2 rounded-xl border transition-all ${
                              isCurrentSpeaking
                                ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50'
                            }`}
                            title={t.btnHearReminder}
                          >
                            <Volume2 className="w-5 h-5 text-purple-700" />
                          </button>
                        </div>
                      </div>

                      <div className="py-4">
                        <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                          {language === 'ta' && sched.insulinNameTa ? sched.insulinNameTa : sched.insulinName}
                        </h4>
                        
                        <div className="mt-3 p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl text-purple-950">
                          <p className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-1">
                            {language === 'ta' ? 'மருத்துவர் அளித்த அளவு விவரம்:' : 'Prescribed Schedule Text:'}
                          </p>
                          <p className={`font-semibold ${fontMultiplier}`}>
                            {sched.prescribedScheduleText}
                          </p>
                          <p className="text-xs text-purple-900/80 mt-1">
                            {language === 'ta' && sched.instructionsTa ? sched.instructionsTa : sched.instructions}
                          </p>
                        </div>

                        {log.note && (
                          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700">
                            <span className="font-bold">{t.noteByParent}: </span>"{log.note}"
                          </div>
                        )}
                      </div>

                      {/* Large Action Buttons for Insulin */}
                      <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          id={`btn-insulin-taken-${sched.id}`}
                          type="button"
                          onClick={() => onUpdateInsulinStatus(log.id, 'taken')}
                          className={`flex items-center justify-center gap-2 rounded-xl font-extrabold transition-all ${buttonHeight} ${
                            log.status === 'taken'
                              ? 'bg-emerald-700 text-white ring-4 ring-emerald-200'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          <span>{t.confirmInsulinAdministered}</span>
                        </button>

                        <button
                          id={`btn-insulin-skipped-${sched.id}`}
                          type="button"
                          onClick={() => {
                            setNoteModalState({
                              isOpen: true,
                              logId: log.id,
                              title: `${t.skipInsulin}: ${sched.insulinName}`,
                              initialNote: log.note || '',
                              targetType: 'insulin',
                              targetStatus: 'skipped',
                            });
                          }}
                          className={`flex items-center justify-center gap-2 rounded-xl font-bold transition-all ${buttonHeight} ${
                            log.status === 'skipped'
                              ? 'bg-amber-600 text-white ring-4 ring-amber-200'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          <AlertCircle className="w-5 h-5 text-amber-700" />
                          <span>{t.skipInsulin}</span>
                        </button>

                        <button
                          id={`btn-insulin-note-${sched.id}`}
                          type="button"
                          onClick={() => {
                            setNoteModalState({
                              isOpen: true,
                              logId: log.id,
                              title: `${t.btnAddNote}: ${sched.insulinName}`,
                              initialNote: log.note || '',
                              targetType: 'insulin',
                            });
                          }}
                          className={`flex items-center justify-center gap-2 rounded-xl font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 ${buttonHeight}`}
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{log.note ? (language === 'ta' ? 'குறிப்பு மாற்று' : 'Edit Note') : t.btnAddNote}</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* History Tab */
        <div id="parent-history-view" className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-teal-700" />
              <span>{t.medicationHistory}</span>
            </h3>

            <div className="space-y-3">
              {medicationLogs
                .filter(l => l.parentId === parent.id)
                .slice(0, 15)
                .map((log) => {
                  const med = medications.find(m => m.id === log.medicationId);
                  return (
                    <div
                      key={log.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-base">
                            {med ? med.medicineName : 'Medication'}
                          </span>
                          <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                            {log.scheduledTime}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {log.scheduledDate} {log.confirmedAt && `• Confirmed at ${new Date(log.confirmedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        </p>
                        {log.note && (
                          <p className="text-xs text-teal-800 font-medium mt-1 bg-teal-50 px-2 py-1 rounded-md inline-block">
                            "{log.note}"
                          </p>
                        )}
                      </div>
                      <div className="shrink-0">
                        {getStatusBadge(log.status)}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      <PhotoModal
        isOpen={photoModalState.isOpen}
        photoUrl={photoModalState.photoUrl}
        medicineName={photoModalState.medicineName}
        strengthText={photoModalState.strengthText}
        language={language}
        onClose={() => setPhotoModalState({ ...photoModalState, isOpen: false })}
      />

      {/* Note Adding Modal */}
      <NoteModal
        isOpen={noteModalState.isOpen}
        title={noteModalState.title}
        initialNote={noteModalState.initialNote}
        language={language}
        onSave={(note) => {
          if (noteModalState.targetType === 'medication') {
            const status = noteModalState.targetStatus || 'pending';
            onUpdateMedicationStatus(
              noteModalState.logId,
              noteModalState.targetStatus ? noteModalState.targetStatus : 'pending',
              note
            );
          } else {
            onUpdateInsulinStatus(
              noteModalState.logId,
              noteModalState.targetStatus ? noteModalState.targetStatus : 'pending',
              note
            );
          }
        }}
        onClose={() => setNoteModalState({ ...noteModalState, isOpen: false })}
      />

    </div>
  );
};
