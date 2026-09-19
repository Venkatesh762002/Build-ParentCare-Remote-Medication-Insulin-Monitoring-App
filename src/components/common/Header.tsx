import React from 'react';
import { 
  HeartHandshake, 
  Volume2, 
  VolumeX, 
  Users, 
  Sparkles, 
  PhoneCall, 
  UserCheck, 
  ShieldCheck,
  Languages,
  Type
} from 'lucide-react';
import { UserRole, Language, TextSize, ParentProfile } from '../../types';
import { getTranslation } from '../../locales/translations';
import { speakReminder, stopSpeaking } from '../../utils/speech';

interface HeaderProps {
  currentRole: UserRole;
  language: Language;
  textSize: TextSize;
  activeParent: ParentProfile | null;
  allParents: ParentProfile[];
  voiceEnabled: boolean;
  isSpeaking: boolean;
  onRoleChange: (role: UserRole) => void;
  onLanguageChange: (lang: Language) => void;
  onTextSizeChange: (size: TextSize) => void;
  onActiveParentChange: (parent: ParentProfile) => void;
  onToggleVoice: () => void;
  setIsSpeaking: (speaking: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  language,
  textSize,
  activeParent,
  allParents,
  voiceEnabled,
  isSpeaking,
  onRoleChange,
  onLanguageChange,
  onTextSizeChange,
  onActiveParentChange,
  onToggleVoice,
  setIsSpeaking,
}) => {
  const t = getTranslation(language);

  const handleTestVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const testText = language === 'ta'
      ? 'வணக்கம். பேரண்ட்கேர் குரல் நினைவூட்டல் இயங்குகிறது. மருந்து எடுத்துக்கொள்ள வேண்டிய நேரம் இது. தயவுசெய்து உங்கள் மருந்தை மருத்துவர் கூறியபடி எடுத்துக்கொள்ளுங்கள்.'
      : 'Hello. ParentCare voice reminder is active. It is time to take your scheduled medication as instructed by your doctor.';

    speakReminder(
      testText,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      (err) => {
        console.warn('Voice test error:', err);
        setIsSpeaking(false);
      }
    );
  };

  return (
    <header 
      id="parentcare-main-header"
      className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Brand & Active Parent indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                    {language === 'ta' ? 'பேரண்ட்கேர்' : 'ParentCare'}
                  </h1>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    currentRole === 'admin' 
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {currentRole === 'admin' ? t.roleAdmin : t.roleParent}
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  {t.appTagline}
                </p>
              </div>
            </div>

            {/* Mobile quick role switcher button */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                id="btn-mobile-switch-role"
                type="button"
                onClick={() => onRoleChange(currentRole === 'admin' ? 'parent' : 'admin')}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                {currentRole === 'admin' ? 'Switch to Parent' : 'Caregiver Admin'}
              </button>
            </div>
          </div>

          {/* Controls Bar: Parent Selector, Language, Font Size, Voice */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
            
            {/* Parent Profile Selector (if admin or to switch parent) */}
            {allParents.length > 0 && (
              <div className="flex items-center bg-slate-100/90 rounded-xl p-1 border border-slate-200">
                <Users className="w-4 h-4 text-slate-500 ml-2 mr-1 shrink-0" />
                <select
                  id="select-active-parent"
                  value={activeParent?.id || ''}
                  onChange={(e) => {
                    const found = allParents.find(p => p.id === e.target.value);
                    if (found) onActiveParentChange(found);
                  }}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 pr-2 py-1 focus:outline-none cursor-pointer"
                  aria-label={t.activeParent}
                >
                  {allParents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {language === 'ta' ? p.nameTa : `${p.name} (${p.relationship})`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                id="btn-lang-en"
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                id="btn-lang-ta"
                type="button"
                onClick={() => onLanguageChange('ta')}
                className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  language === 'ta'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Elderly Font Size Toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200" title={t.textSize}>
              <button
                id="btn-font-normal"
                type="button"
                onClick={() => onTextSizeChange('normal')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
                  textSize === 'normal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
                title="Standard Font Size"
              >
                A
              </button>
              <button
                id="btn-font-large"
                type="button"
                onClick={() => onTextSizeChange('large')}
                className={`px-2 py-1 text-sm font-bold rounded-lg transition-all ${
                  textSize === 'large' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
                title="Large Font Size (Elderly friendly)"
              >
                A+
              </button>
              <button
                id="btn-font-xlarge"
                type="button"
                onClick={() => onTextSizeChange('xlarge')}
                className={`px-2 py-1 text-base font-extrabold rounded-lg transition-all ${
                  textSize === 'xlarge' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
                title="Extra Large Font Size"
              >
                A++
              </button>
            </div>

            {/* Tamil / English Voice Reminder Test button */}
            <button
              id="btn-test-voice-reminder"
              type="button"
              onClick={handleTestVoice}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                isSpeaking
                  ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
                  : 'bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100'
              }`}
              title={t.btnTestVoice}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-700" />
                  <span className="hidden md:inline">Stop Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-teal-700" />
                  <span className="hidden md:inline">{t.btnTestVoice}</span>
                </>
              )}
            </button>

            {/* Role Switcher Button (Desktop) */}
            <button
              id="btn-desktop-switch-role"
              type="button"
              onClick={() => onRoleChange(currentRole === 'admin' ? 'parent' : 'admin')}
              className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors shadow-xs ${
                currentRole === 'admin'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>{currentRole === 'admin' ? t.roleParent : t.roleAdmin}</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
