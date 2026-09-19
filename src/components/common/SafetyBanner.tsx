import React from 'react';
import { ShieldAlert, Stethoscope } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from '../../locales/translations';

interface SafetyBannerProps {
  language: Language;
  variant?: 'general' | 'insulin' | 'admin';
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ language, variant = 'general' }) => {
  const t = getTranslation(language);

  if (variant === 'insulin') {
    return (
      <div 
        id="safety-banner-insulin"
        className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-xs my-4 flex items-start gap-3"
      >
        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-amber-950">
          <p className="font-semibold text-sm sm:text-base mb-1">
            {language === 'ta' ? 'இன்சுலின் பாதுகாப்பு வழிகாட்டல்' : 'Prescribed Insulin Safety Guidance'}
          </p>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            {t.insulinSafetyNotice}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'admin') {
    return (
      <div 
        id="safety-banner-admin"
        className="bg-sky-50 border border-sky-200 p-3 sm:p-4 rounded-xl shadow-xs my-3 flex items-start gap-3"
      >
        <Stethoscope className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="text-sky-950 text-xs sm:text-sm">
          <span className="font-semibold">{t.photoVerifyNotice} </span>
          <span className="text-sky-800">{t.adminFollowupNotice}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="safety-banner-general"
      className="bg-teal-50/90 border border-teal-200/80 p-3 sm:p-4 rounded-xl shadow-xs my-3 flex items-start gap-3"
    >
      <Stethoscope className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
      <div className="text-teal-950 text-xs sm:text-sm leading-relaxed">
        <span className="font-semibold">{t.safetyNoticeTitle}: </span>
        <span className="text-teal-900">{t.safetyNoticeDesc}</span>
      </div>
    </div>
  );
};
