import { Language } from '../types';

export const translations = {
  en: {
    appName: 'ParentCare',
    appTagline: 'Remote Medication & Insulin Monitoring for Families',
    
    // Safety notices
    safetyNoticeTitle: 'Important Medical Safety Notice',
    safetyNoticeDesc: 'ParentCare is a tracking and caregiver communication tool. It does NOT diagnose conditions, calculate insulin doses, or recommend medication changes. Always adhere strictly to your doctor\'s prescription.',
    insulinSafetyNotice: 'Use insulin only according to the instructions provided by your healthcare professional. Contact your healthcare professional if you are unsure what to do.',
    adminFollowupNotice: 'Missed or unconfirmed medication alerts are reminders to contact the parent. Never assume medication was missed solely because it was not marked.',
    photoVerifyNotice: 'Verify the medicine name and instructions against the prescription or packaging.',

    // Roles & Navigation
    roleAdmin: 'Caregiver (Admin)',
    roleParent: 'Parent View',
    switchRole: 'Switch View / Role',
    adminDashboard: 'Caregiver Dashboard',
    parentDashboard: 'Today\'s Medicine Schedule',
    medicationHistory: 'History & Logs',
    insulinHistory: 'Insulin History',
    auditLogs: 'Audit Trail',
    settings: 'Settings',
    logout: 'Log Out',
    activeParent: 'Monitoring Parent',
    allParents: 'All Parents',

    // Greetings & Times
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    greetingNight: 'Good night',
    todaysDate: 'Today is',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
    customTime: 'Custom Time',

    // Medication statuses
    status_pending: 'Pending',
    status_reminder_sent: 'Reminder Sent',
    status_taken: 'Taken',
    status_skipped: 'Skipped',
    status_unable_to_complete: 'Unable to Complete',
    status_overdue: 'Overdue',
    status_needs_review: 'Needs Review',

    // Parent UI buttons
    btnTaken: 'Taken',
    btnSkipped: 'Skipped',
    btnUnable: 'Unable to Take',
    btnAddNote: 'Add Note',
    btnConfirm: 'Confirm',
    btnCancel: 'Cancel',
    btnContactChild: 'Call Caregiver',
    btnEmergencyDoctor: 'Call Doctor',
    btnHearReminder: 'Listen Reminder',
    btnTestVoice: 'Test Tamil Voice',
    btnViewPhoto: 'View Package Photo',
    btnClosePhoto: 'Close Photo',
    
    // Notes & Presets
    notePlaceholder: 'Optional note for your caregiver (e.g., felt mild nausea, took 15 mins late...)',
    quickNotes: [
      'Took with warm water',
      'Took after food as advised',
      'Felt slightly dizzy today',
      'Doctor suggested pausing today',
      'Ran out of tablets - need refill',
      'Sleeping, will take after waking up'
    ],
    noteAddedSuccess: 'Note sent to your caregiver successfully.',
    statusUpdatedSuccess: 'Medication status recorded securely.',

    // Insulin section
    insulinSectionTitle: 'Prescribed Insulin Administration',
    insulinSectionDesc: 'Follow only the specific schedule and instructions provided by your doctor.',
    confirmInsulinAdministered: 'Confirm Insulin Administered',
    skipInsulin: 'Skipped Insulin',
    unableInsulin: 'Unable to Administer',
    lastInsulinRecorded: 'Last recorded',

    // Admin Dashboard
    summaryTotalParents: 'Monitored Parents',
    summaryScheduledToday: 'Scheduled Medicines',
    summaryTakenToday: 'Confirmed Taken',
    summarySkippedToday: 'Skipped',
    summaryUnableToday: 'Unable to Complete',
    summaryPendingToday: 'Pending Confirmation',
    summaryOverdueReview: 'Requires Follow-up',
    summaryInsulinToday: 'Insulin Administered',
    alertsTitle: 'Caregiver Follow-up Alerts',
    noAlerts: 'All scheduled routines are on track. No pending parent alerts.',
    adherenceRate: 'Adherence Rate',
    sevenDayTrend: '7-Day Medication Adherence',
    statusDistribution: 'Today\'s Status Breakdown',
    recentActivity: 'Recent Parent Activity',
    viewAllActivity: 'View All Logs',

    // Medication management
    addMedication: 'Add New Medication',
    editMedication: 'Edit Medication',
    deactivateMedication: 'Deactivate',
    activateMedication: 'Activate',
    medicineName: 'Medicine Name',
    medicineNamePlaceholder: 'e.g. Metformin, Amlodipine...',
    strengthDosage: 'Strength / Dosage text',
    strengthDosagePlaceholder: 'e.g. 500 mg, 1 tablet...',
    instructions: 'Prescribed Instructions',
    instructionsPlaceholder: 'e.g. Take after breakfast with warm water',
    scheduleTime: 'Time of Day',
    specificTime: 'Scheduled Time',
    frequency: 'Frequency',
    freqOnce: 'Once Daily',
    freqTwice: 'Twice Daily',
    freqThrice: 'Three Times Daily',
    freqCustom: 'Custom Schedule',
    prescribingDoctor: 'Prescribing Doctor',
    prescribingDoctorPlaceholder: 'e.g. Dr. K. Ramanathan, MD',
    medicinePhoto: 'Medicine Strip / Box Photo',
    uploadPhotoPrompt: 'Upload actual photo of medicine strip, blister pack, or box',
    replacePhoto: 'Replace Photo',
    deletePhoto: 'Remove Photo',
    photoUploadTip: 'Clear photo showing brand name and strength on the strip.',

    // Insulin schedule management
    addInsulinSchedule: 'Add Insulin Schedule',
    editInsulinSchedule: 'Edit Insulin Schedule',
    insulinName: 'Insulin Brand / Name',
    insulinNamePlaceholder: 'e.g. Lantus SoloStar, Mixtard...',
    prescribedScheduleText: 'Schedule Instructions (from Doctor)',
    prescribedSchedulePlaceholder: 'e.g. 10 Units subcutaneous once daily at 08:30 AM before dinner as per Dr. prescribed regimen',

    // Accessibility & Language
    language: 'Language',
    english: 'English',
    tamil: 'தமிழ் (Tamil)',
    textSize: 'Text Size',
    textSizeNormal: 'Standard',
    textSizeLarge: 'Large (Elderly)',
    textSizeXLarge: 'Extra Large',
    voiceReminders: 'Voice Reminders',
    voiceEnabled: 'Voice Reminders On',
    voiceDisabled: 'Voice Reminders Off',

    // Voice scripts
    voiceReminderTemplate: (name: string, time: string) => 
      `It is time to take your scheduled medicine, ${name}. Please take it as instructed by your doctor.`,
    insulinVoiceTemplate: (name: string) =>
      `It is time for your prescribed insulin, ${name}. Please follow your doctor's exact instructions.`,
    
    // Status text
    verifiedRecord: 'Recorded & Synced',
    timeRecorded: 'Time Recorded',
    noteByParent: 'Parent Note',
    noNotes: 'No note provided',
    viewDetail: 'View Details',
    saveChanges: 'Save Changes',
    deleteConfirm: 'Are you sure you want to proceed?',
  },

  ta: {
    appName: 'பேரண்ட்கேர் (ParentCare)',
    appTagline: 'பெற்றோருக்கான தொலைதூர மருந்து & இன்சுலின் கண்காணிப்பு செயலி',

    // Safety notices
    safetyNoticeTitle: 'முக்கிய மருத்துவப் பாதுகாப்பு அறிவிப்பு',
    safetyNoticeDesc: 'பேரண்ட்கேர் என்பது மருந்து கண்காணிப்பு மற்றும் குடும்பத்தினர் தொடர்புக்கான கருவி மட்டுமே. இது நோயறிதல் செய்யாது, இன்சுலின் அளவை பரிந்துரைக்காது அல்லது மாற்றாது. எப்போதும் உங்கள் மருத்துவர் வழங்கிய மருந்துச்சீட்டு வழிமுறைகளை மட்டுமே சரியாகப் பின்பற்றவும்.',
    insulinSafetyNotice: 'மருத்துவர் அளித்த வழிமுறைகளின்படி மட்டுமே இன்சுலின் பயன்படுத்தவும். ஏதேனும் சந்தேகம் இருந்தால் உடனே மருத்துவரைத் தொடர்பு கொள்ளவும்.',
    adminFollowupNotice: 'மருந்து எடுக்காதது போன்ற அறிவிப்புகள் வந்தால், உடனடியாக பெற்றோரை தொலைபேசியில் அழைத்து நிலவரத்தை அறியவும். பெற்றோர் உறுதி செய்யவில்லை என்பதற்காகவே மருந்து எடுக்கவில்லை என கருத வேண்டாம்.',
    photoVerifyNotice: 'மருந்தின் பெயர் மற்றும் வழிமுறைகளை மருந்து அட்டை அல்லது பாக்கெட்டுடன் ஒப்பிட்டு சரிபார்க்கவும்.',

    // Roles & Navigation
    roleAdmin: 'கவனிப்பாளர் (மகன்/மகள்)',
    roleParent: 'பெற்றோர் பார்வை',
    switchRole: 'பார்வை / பங்கை மாற்றுக',
    adminDashboard: 'கவனிப்பாளர் பலகை',
    parentDashboard: 'இன்றைய மருந்துகள் அட்டவணை',
    medicationHistory: 'மருந்து பதிவுகள் & வரலாறு',
    insulinHistory: 'இன்சுலின் பதிவுகள்',
    auditLogs: 'செயல்பாட்டு வரலாறு',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
    activeParent: 'கண்காணிக்கும் பெற்றோர்',
    allParents: 'அனைத்து பெற்றோர்கள்',

    // Greetings & Times
    greetingMorning: 'இனிய காலை வணக்கம்',
    greetingAfternoon: 'இனிய மதிய வணக்கம்',
    greetingEvening: 'இனிய மாலை வணக்கம்',
    greetingNight: 'இனிய இரவு வணக்கம்',
    todaysDate: 'இன்றைய தேதி',
    morning: 'காலை',
    afternoon: 'மதியம்',
    evening: 'மாலை',
    night: 'இரவு',
    customTime: 'குறிப்பிட்ட நேரம்',

    // Medication statuses
    status_pending: 'நிலுவையில் உள்ளது',
    status_reminder_sent: 'நினைவூட்டல் அனுப்பப்பட்டது',
    status_taken: 'எடுத்தாயிற்று',
    status_skipped: 'தவிர்க்கப்பட்டது',
    status_unable_to_complete: 'எடுக்க முடியவில்லை',
    status_overdue: 'நேரம் கடந்துவிட்டது',
    status_needs_review: 'கவனிக்கப்பட வேண்டும்',

    // Parent UI buttons
    btnTaken: 'எடுத்தாயிற்று',
    btnSkipped: 'தவிர்க்கப்பட்டது',
    btnUnable: 'எடுக்க முடியவில்லை',
    btnAddNote: 'குறிப்பு சேர்க்க',
    btnConfirm: 'உறுதி செய்',
    btnCancel: 'ரத்து செய்',
    btnContactChild: 'மகனை / மகளை அழைக்கவும்',
    btnEmergencyDoctor: 'மருத்துவரை அழைக்கவும்',
    btnHearReminder: 'குரல் வழிகாட்டல் கேட்க',
    btnTestVoice: 'தமிழ் குரல் பரிசோதனை',
    btnViewPhoto: 'மருந்து அட்டை படம் பார்க்க',
    btnClosePhoto: 'படத்தை மூடுக',

    // Notes & Presets
    notePlaceholder: 'உங்கள் பிள்ளைக்கு ஏதேனும் தகவல் தெரிவிக்க விரும்பினால் எழுதவும் (எ.கா: லேசான தலைசுற்றல், உணவு தாமதம்...)',
    quickNotes: [
      'வெந்நீருடன் எடுத்தேன்',
      'உணவுக்குப் பின் முறையாக எடுத்தேன்',
      'இன்று லேசான தலைசுற்றல் இருந்தது',
      'மருத்துவர் இன்று வேண்டாம் என்றார்',
      'மாத்திரைகள் தீர்ந்துவிட்டன - வாங்க வேண்டும்',
      'தூங்கிக் கொண்டிருந்தேன், விழித்தவுடன் எடுப்பேன்'
    ],
    noteAddedSuccess: 'உங்கள் குறிப்பு பிள்ளைக்கு பாதுகாப்பாக அனுப்பப்பட்டது.',
    statusUpdatedSuccess: 'மருந்து விபரம் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது.',

    // Insulin section
    insulinSectionTitle: 'பரிந்துரைக்கப்பட்ட இன்சுலின் விவரம்',
    insulinSectionDesc: 'மருத்துவர் கூறிய சரியான அளவு மற்றும் நேரத்தை மட்டுமே பின்பற்றவும்.',
    confirmInsulinAdministered: 'இன்சுலின் செலுத்தப்பட்டது என உறுதி செய்',
    skipInsulin: 'இன்சுலின் தவிர்க்கப்பட்டது',
    unableInsulin: 'இன்சுலின் செலுத்த முடியவில்லை',
    lastInsulinRecorded: 'கடைசியாக பதிவு செய்யப்பட்டது',

    // Admin Dashboard
    summaryTotalParents: 'கண்காணிக்கும் பெற்றோர்கள்',
    summaryScheduledToday: 'இன்றைய மொத்த மருந்துகள்',
    summaryTakenToday: 'எடுத்த மருந்துகள்',
    summarySkippedToday: 'தவிர்க்கப்பட்டவை',
    summaryUnableToday: 'எடுக்க முடியாதவை',
    summaryPendingToday: 'நிலுவையில் உள்ளவை',
    summaryOverdueReview: 'கவனிக்க வேண்டியவை',
    summaryInsulinToday: 'இன்சுலின் செலுத்தப்பட்டது',
    alertsTitle: 'கவனிப்பாளர் கவனிக்க வேண்டியவை',
    noAlerts: 'அனைத்து மருந்துகளும் முறையாக எடுக்கப்பட்டுள்ளன. நிலுவை எச்சரிக்கைகள் ஏதுமில்லை.',
    adherenceRate: 'மருந்து எடுத்த விகிதம்',
    sevenDayTrend: '7-நாள் மருந்து உட்கொள்ளல் போக்கு',
    statusDistribution: 'இன்றைய நிலை வரைபடம்',
    recentActivity: 'சமீபத்திய பெற்றோர் செயல்பாடு',
    viewAllActivity: 'அனைத்து பதிவுகளையும் காண்க',

    // Medication management
    addMedication: 'புதிய மருந்து சேர்க்க',
    editMedication: 'மருந்தை திருத்துக',
    deactivateMedication: 'செயலிழக்கச் செய்',
    activateMedication: 'செயலாக்கு',
    medicineName: 'மருந்தின் பெயர்',
    medicineNamePlaceholder: 'எ.கா: மெட்ஃபார்மின், ஆம்லோடிபின்...',
    strengthDosage: 'அளவு / டோசேஜ் விவரம்',
    strengthDosagePlaceholder: 'எ.கா: 500 மி.கி, 1 மாத்திரை...',
    instructions: 'பரிந்துரைக்கப்பட்ட வழிமுறைகள்',
    instructionsPlaceholder: 'எ.கா: காலை உணவிற்குப் பிறகு வெதுவெதுப்பான நீரில் எடுக்கவும்',
    scheduleTime: 'பகுதி நேரம்',
    specificTime: 'குறிப்பிட்ட நேரம்',
    frequency: 'எடுத்துக்கொள்ளும் முறை',
    freqOnce: 'தினமும் ஒரு முறை',
    freqTwice: 'தினமும் இரு முறை',
    freqThrice: 'தினமும் மூன்று முறை',
    freqCustom: 'தனிப்பயன் அட்டவணை',
    prescribingDoctor: 'பரிந்துரைத்த மருத்துவர்',
    prescribingDoctorPlaceholder: 'எ.கா: டாக்டர் கே. ராமநாதன்',
    medicinePhoto: 'மருந்து அட்டை / பாக்கெட் புகைப்படம்',
    uploadPhotoPrompt: 'முழு மருந்து அட்டை, மாத்திரை பாக்கெட் அல்லது பாட்டிலின் தெளிவான புகைப்படம் பதிவேற்றவும்',
    replacePhoto: 'படத்தை மாற்றுக',
    deletePhoto: 'படத்தை நீக்குக',
    photoUploadTip: 'மருந்தின் பெயரும் அளவும் அட்டையில் தெளிவாகத் தெரிய வேண்டும்.',

    // Insulin schedule management
    addInsulinSchedule: 'இன்சுலின் அட்டவணை சேர்க்க',
    editInsulinSchedule: 'இன்சுலின் அட்டவணை திருத்துக',
    insulinName: 'இன்சுலின் பெயர்',
    insulinNamePlaceholder: 'எ.கா: லான்டஸ் சோலோஸ்டார், மிக்ஸ்டார்ட்...',
    prescribedScheduleText: 'பரிந்துரைக்கப்பட்ட அளவு விவரம் (மருத்துவர் கூறியபடி)',
    prescribedSchedulePlaceholder: 'எ.கா: இரவு உணவிற்கு முன் மருத்துவர் கூறியபடி 10 யூனிட் எடுத்துக்கொள்ளவும்',

    // Accessibility & Language
    language: 'மொழி (Language)',
    english: 'English (ஆங்கிலம்)',
    tamil: 'தமிழ் (Tamil)',
    textSize: 'எழுத்து அளவு',
    textSizeNormal: 'சாதாரண அளவு',
    textSizeLarge: 'பெரிய எழுத்து (முதியோருக்கு)',
    textSizeXLarge: 'மிகப் பெரிய எழுத்து',
    voiceReminders: 'குரல் நினைவூட்டல்',
    voiceEnabled: 'குரல் நினைவூட்டல் ஆன்',
    voiceDisabled: 'குரல் நினைவூட்டல் ஆஃப்',

    // Voice scripts
    voiceReminderTemplate: (name: string, time: string) => 
      `மருந்து எடுத்துக்கொள்ள வேண்டிய நேரம் இது. ${name} மருந்தை மருத்துவர் கூறியபடி சரியாக எடுத்துக்கொள்ளுங்கள்.`,
    insulinVoiceTemplate: (name: string) =>
      `இன்சுலின் எடுத்துக்கொள்ள வேண்டிய நேரம் இது. ${name} இன்சுலினை மருத்துவர் கூறிய வழிமுறையின்படி எடுத்துக்கொள்ளுங்கள்.`,

    // Status text
    verifiedRecord: 'பாதுகாப்பாகப் பதிவு செய்யப்பட்டது',
    timeRecorded: 'பதிவு செய்யப்பட்ட நேரம்',
    noteByParent: 'பெற்றோர் எழுதிய குறிப்பு',
    noNotes: 'குறிப்புகள் ஏதுமில்லை',
    viewDetail: 'விவரம் காண்க',
    saveChanges: 'சேமிக்க',
    deleteConfirm: 'உறுதியாக இதை நீக்க விரும்புகிறீர்களா?',
  }
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.en;
}
