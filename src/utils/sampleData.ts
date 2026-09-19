import { ParentProfile, Medication, InsulinSchedule, MedicationLog, InsulinLog, AuditLog, AppNotification } from '../types';

// Helper to create realistic SVG Data-URLs representing actual medicine strips
function createMedicineStripSvg(brand: string, generic: string, strength: string, color: string, badgeColor: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="400" height="240">
    <defs>
      <linearGradient id="foilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f1f5f9"/>
        <stop offset="30%" stop-color="#cbd5e1"/>
        <stop offset="50%" stop-color="#e2e8f0"/>
        <stop offset="70%" stop-color="#94a3b8"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>
      <filter id="blisterDrop" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.25"/>
      </filter>
    </defs>
    <!-- Aluminum Blister Strip Base -->
    <rect x="10" y="10" width="380" height="220" rx="12" fill="url(#foilGrad)" stroke="#64748b" stroke-width="2"/>
    
    <!-- Top packaging banner -->
    <rect x="12" y="12" width="376" height="42" rx="10" fill="${color}"/>
    <text x="25" y="38" fill="#ffffff" font-family="Arial, sans-serif" font-size="18" font-weight="bold">${brand}</text>
    <rect x="290" y="20" width="85" height="24" rx="6" fill="${badgeColor}"/>
    <text x="332" y="36" fill="#ffffff" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">${strength}</text>
    
    <!-- Generic composition info -->
    <text x="25" y="72" fill="#1e293b" font-family="Arial, sans-serif" font-size="12" font-weight="600">${generic}</text>
    <text x="25" y="88" fill="#475569" font-family="Arial, sans-serif" font-size="10">Mfg: Cadila / Sun Pharma • Batch #BX-9042 • Exp: 12/2028</text>

    <!-- Blister Pill Pockets -->
    <!-- Row 1 -->
    <g filter="url(#blisterDrop)">
      <ellipse cx="60" cy="130" rx="28" ry="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="130" cy="130" rx="28" ry="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="200" cy="130" rx="28" ry="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="270" cy="130" rx="28" ry="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="340" cy="130" rx="28" ry="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
      <!-- Row 2 -->
      <ellipse cx="60" cy="185" rx="28" ry="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="130" cy="185" rx="28" ry="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="200" cy="185" rx="28" ry="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="270" cy="185" rx="28" ry="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="340" cy="185" rx="28" ry="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
    </g>

    <!-- Pill detail scoreline -->
    <line x1="60" y1="120" x2="60" y2="140" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="130" y1="120" x2="130" y2="140" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="200" y1="120" x2="200" y2="140" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="270" y1="120" x2="270" y2="140" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="340" y1="120" x2="340" y2="140" stroke="#cbd5e1" stroke-width="2"/>
    
    <!-- Red Rx symbol -->
    <text x="360" y="85" fill="#dc2626" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Rx</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createInsulinPenSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="400" height="240">
    <defs>
      <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6b21a8"/>
        <stop offset="40%" stop-color="#7e22ce"/>
        <stop offset="100%" stop-color="#3b0764"/>
      </linearGradient>
      <linearGradient id="penGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="50%" stop-color="#cbd5e1"/>
        <stop offset="100%" stop-color="#94a3b8"/>
      </linearGradient>
    </defs>
    <!-- Packaging Box -->
    <rect x="15" y="15" width="370" height="210" rx="10" fill="url(#boxGrad)" stroke="#4c1d95" stroke-width="2"/>
    <rect x="30" y="30" width="160" height="30" rx="6" fill="#fbbf24"/>
    <text x="110" y="50" fill="#78350f" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle">SOLOSTAR PEN</text>
    <text x="30" y="90" fill="#ffffff" font-family="Arial, sans-serif" font-size="22" font-weight="bold">Lantus SoloStar</text>
    <text x="30" y="112" fill="#e9d5ff" font-family="Arial, sans-serif" font-size="13">Insulin glargine injection 100 Units/mL</text>
    <text x="30" y="130" fill="#c084fc" font-family="Arial, sans-serif" font-size="11">Subcutaneous use only • 5 x 3 mL pre-filled pens</text>

    <!-- Stylized Pen Graphic -->
    <rect x="30" y="155" width="220" height="36" rx="6" fill="url(#penGrad)" stroke="#334155" stroke-width="1.5"/>
    <rect x="250" y="158" width="60" height="30" rx="3" fill="#a855f7" stroke="#6b21a8" stroke-width="1"/>
    <rect x="310" y="163" width="35" height="20" rx="2" fill="#1e293b"/>
    <rect x="345" y="168" width="15" height="10" rx="1" fill="#7e22ce"/>
    <!-- Window dial -->
    <rect x="190" y="163" width="40" height="20" rx="3" fill="#0f172a"/>
    <text x="210" y="177" fill="#22c55e" font-family="monospace" font-size="12" text-anchor="middle">10 U</text>
    <text x="50" y="177" fill="#1e293b" font-family="Arial, sans-serif" font-size="11" font-weight="bold">Lantus 100 U/mL</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_PARENTS: ParentProfile[] = [
  {
    id: 'parent_ramaswamy',
    name: 'Ramaswamy Iyer',
    nameTa: 'இராமசுவாமி ஐயர் (அப்பா)',
    relationship: 'Father',
    relationshipTa: 'அப்பா',
    authorizedAdminIds: ['admin_child'],
    phoneNumber: '+91 94432 18920',
    emergencyDoctorName: 'Dr. K. Ramanathan, MD',
    emergencyDoctorPhone: '+91 98401 22345',
    notes: 'Lives in Coimbatore. Monitor morning blood pressure & post-dinner insulin.',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-09-18T10:00:00.000Z',
  },
  {
    id: 'parent_meenakshi',
    name: 'Meenakshi Ramaswamy',
    nameTa: 'மீனாட்சி இராமசுவாமி (அம்மா)',
    relationship: 'Mother',
    relationshipTa: 'அம்மா',
    authorizedAdminIds: ['admin_child'],
    phoneNumber: '+91 94432 18921',
    emergencyDoctorName: 'Dr. S. Lakshmi, MS',
    emergencyDoctorPhone: '+91 98401 55678',
    notes: 'Thyroxine 50mcg on empty stomach early morning.',
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T08:00:00.000Z',
    updatedAt: '2026-09-18T10:00:00.000Z',
  },
];

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med_glycomet_500',
    parentId: 'parent_ramaswamy',
    medicineName: 'Glycomet 500 SR (Metformin HCl)',
    medicineNameTa: 'கிளைகோமெட் 500 எஸ்.ஆர் (மெட்ஃபார்மின்)',
    strengthText: '500 mg • 1 Tablet',
    photoUrl: createMedicineStripSvg('Glycomet-500 SR', 'Metformin Hydrochloride Prolonged-Release IP', '500 mg', '#b91c1c', '#991b1b'),
    instructions: 'Take 1 tablet immediately after morning breakfast with a full glass of warm water.',
    instructionsTa: 'காலை உணவிற்குப் பிறகு உடனடியாக 1 மாத்திரை வெதுவெதுப்பான தண்ணீருடன் எடுக்கவும்.',
    schedule: 'morning',
    scheduledTime: '08:00 AM',
    frequency: 'once_daily',
    startDate: '2026-01-01',
    active: true,
    prescribingDoctor: 'Dr. K. Ramanathan, MD (Diabetologist)',
    additionalNotes: 'Do not crush or chew prolonged release tablet.',
    createdBy: 'admin_child',
    updatedBy: 'admin_child',
    createdAt: '2026-01-01T06:00:00.000Z',
    updatedAt: '2026-01-01T06:00:00.000Z',
  },
  {
    id: 'med_amlong_5',
    parentId: 'parent_ramaswamy',
    medicineName: 'Amlong 5 (Amlodipine Besylate)',
    medicineNameTa: 'ஆம்லாங் 5 (ஆம்லோடிபின்)',
    strengthText: '5 mg • 1 Tablet',
    photoUrl: createMedicineStripSvg('Amlong-5', 'Amlodipine Besylate Tablets IP', '5 mg', '#0369a1', '#0284c7'),
    instructions: 'Take 1 tablet at 08:30 AM with water. Prescribed for blood pressure management.',
    instructionsTa: 'காலை 8:30 மணிக்கு தண்ணீருடன் 1 மாத்திரை எடுக்கவும். இரத்த அழுத்தத்தைக் கட்டுப்படுத்த.',
    schedule: 'morning',
    scheduledTime: '08:30 AM',
    frequency: 'once_daily',
    startDate: '2026-01-01',
    active: true,
    prescribingDoctor: 'Dr. S. Balaji, MD (Cardiologist)',
    additionalNotes: 'Check BP weekly.',
    createdBy: 'admin_child',
    updatedBy: 'admin_child',
    createdAt: '2026-01-01T06:00:00.000Z',
    updatedAt: '2026-01-01T06:00:00.000Z',
  },
  {
    id: 'med_atorva_20',
    parentId: 'parent_ramaswamy',
    medicineName: 'Atorva 20 (Atorvastatin)',
    medicineNameTa: 'அடோர்வா 20 (அடோர்வாஸ்டேடின்)',
    strengthText: '20 mg • 1 Tablet',
    photoUrl: createMedicineStripSvg('Atorva-20', 'Atorvastatin Tablets IP', '20 mg', '#7e22ce', '#6b21a8'),
    instructions: 'Take 1 tablet at night after dinner before sleeping.',
    instructionsTa: 'இரவு உணவிற்குப் பிறகு உறங்கச் செல்லும் முன் 1 மாத்திரை எடுக்கவும்.',
    schedule: 'night',
    scheduledTime: '09:00 PM',
    frequency: 'once_daily',
    startDate: '2026-01-01',
    active: true,
    prescribingDoctor: 'Dr. S. Balaji, MD (Cardiologist)',
    additionalNotes: 'Cholesterol control regimen.',
    createdBy: 'admin_child',
    updatedBy: 'admin_child',
    createdAt: '2026-01-01T06:00:00.000Z',
    updatedAt: '2026-01-01T06:00:00.000Z',
  },
  {
    id: 'med_thyronorm_50',
    parentId: 'parent_meenakshi',
    medicineName: 'Thyronorm 50 (Levothyroxine)',
    medicineNameTa: 'தைரோநார்ம் 50 (தைராக்சின்)',
    strengthText: '50 mcg • 1 Tablet',
    photoUrl: createMedicineStripSvg('Thyronorm-50', 'Levothyroxine Sodium Tablets IP', '50 mcg', '#0f766e', '#115e59'),
    instructions: 'Take 1 tablet first thing in the morning with plain water, 30 minutes before coffee or tea.',
    instructionsTa: 'காலையில் எழுந்தவுடன் காபி, டீ குடிப்பதற்கு அரை மணி நேரம் முன் வெறும் வயிற்றில் எடுக்கவும்.',
    schedule: 'morning',
    scheduledTime: '06:30 AM',
    frequency: 'once_daily',
    startDate: '2026-01-01',
    active: true,
    prescribingDoctor: 'Dr. S. Lakshmi, MS',
    additionalNotes: 'Empty stomach mandatory.',
    createdBy: 'admin_child',
    updatedBy: 'admin_child',
    createdAt: '2026-01-01T06:00:00.000Z',
    updatedAt: '2026-01-01T06:00:00.000Z',
  }
];

export const INITIAL_INSULIN_SCHEDULES: InsulinSchedule[] = [
  {
    id: 'insulin_lantus_ramaswamy',
    parentId: 'parent_ramaswamy',
    insulinName: 'Lantus SoloStar (Insulin Glargine 100 U/mL)',
    insulinNameTa: 'லான்டஸ் சோலோஸ்டார் இன்சுலின் (100 U/mL)',
    prescribedScheduleText: '10 Units Subcutaneous Injection nightly before dinner as instructed by Dr. K. Ramanathan.',
    scheduledTime: '08:30 PM',
    instructions: 'Inject into lower abdomen or thigh rotating injection sites. Never alter the prescribed dose.',
    instructionsTa: 'மருத்துவர் கூறியபடி அடிவயிறு அல்லது தொடையில் ஊசி செலுத்தவும். அளவை மாற்ற வேண்டாம்.',
    startDate: '2026-01-01',
    active: true,
    prescribingDoctor: 'Dr. K. Ramanathan, MD (Diabetologist)',
    notes: 'Keep pen refrigerated between 2°C to 8°C. Once opened, store at room temperature away from direct heat.',
    createdBy: 'admin_child',
    updatedBy: 'admin_child',
    createdAt: '2026-01-01T06:00:00.000Z',
    updatedAt: '2026-01-01T06:00:00.000Z',
  }
];

// Today's date helper
const getTodayIso = () => new Date().toISOString().split('T')[0];
const getDaysAgoIso = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

export const INITIAL_MEDICATION_LOGS: MedicationLog[] = [
  // Today's logs
  {
    id: 'log_today_glycomet',
    medicationId: 'med_glycomet_500',
    parentId: 'parent_ramaswamy',
    scheduledDate: getTodayIso(),
    scheduledTime: '08:00 AM',
    status: 'taken',
    confirmedAt: `${getTodayIso()}T08:14:22.000Z`,
    confirmedBy: 'parent_ramaswamy',
    note: 'காலை இட்லி சாப்பிட்ட பின் எடுத்தேன் (Took after breakfast)',
    createdAt: `${getTodayIso()}T08:00:00.000Z`,
    updatedAt: `${getTodayIso()}T08:14:22.000Z`,
  },
  {
    id: 'log_today_amlong',
    medicationId: 'med_amlong_5',
    parentId: 'parent_ramaswamy',
    scheduledDate: getTodayIso(),
    scheduledTime: '08:30 AM',
    status: 'pending',
    createdAt: `${getTodayIso()}T08:30:00.000Z`,
    updatedAt: `${getTodayIso()}T08:30:00.000Z`,
  },
  {
    id: 'log_today_atorva',
    medicationId: 'med_atorva_20',
    parentId: 'parent_ramaswamy',
    scheduledDate: getTodayIso(),
    scheduledTime: '09:00 PM',
    status: 'pending',
    createdAt: `${getTodayIso()}T21:00:00.000Z`,
    updatedAt: `${getTodayIso()}T21:00:00.000Z`,
  },
  // Mother today
  {
    id: 'log_today_thyronorm',
    medicationId: 'med_thyronorm_50',
    parentId: 'parent_meenakshi',
    scheduledDate: getTodayIso(),
    scheduledTime: '06:30 AM',
    status: 'taken',
    confirmedAt: `${getTodayIso()}T06:35:10.000Z`,
    confirmedBy: 'parent_meenakshi',
    note: 'Took with warm water on empty stomach',
    createdAt: `${getTodayIso()}T06:30:00.000Z`,
    updatedAt: `${getTodayIso()}T06:35:10.000Z`,
  },
  // Yesterday's logs for trend
  {
    id: 'log_yest_glycomet',
    medicationId: 'med_glycomet_500',
    parentId: 'parent_ramaswamy',
    scheduledDate: getDaysAgoIso(1),
    scheduledTime: '08:00 AM',
    status: 'taken',
    confirmedAt: `${getDaysAgoIso(1)}T08:20:00.000Z`,
    confirmedBy: 'parent_ramaswamy',
    createdAt: `${getDaysAgoIso(1)}T08:00:00.000Z`,
    updatedAt: `${getDaysAgoIso(1)}T08:20:00.000Z`,
  },
  {
    id: 'log_yest_amlong',
    medicationId: 'med_amlong_5',
    parentId: 'parent_ramaswamy',
    scheduledDate: getDaysAgoIso(1),
    scheduledTime: '08:30 AM',
    status: 'taken',
    confirmedAt: `${getDaysAgoIso(1)}T08:45:00.000Z`,
    confirmedBy: 'parent_ramaswamy',
    createdAt: `${getDaysAgoIso(1)}T08:30:00.000Z`,
    updatedAt: `${getDaysAgoIso(1)}T08:45:00.000Z`,
  },
  {
    id: 'log_yest_atorva',
    medicationId: 'med_atorva_20',
    parentId: 'parent_ramaswamy',
    scheduledDate: getDaysAgoIso(1),
    scheduledTime: '09:00 PM',
    status: 'taken',
    confirmedAt: `${getDaysAgoIso(1)}T21:15:00.000Z`,
    confirmedBy: 'parent_ramaswamy',
    createdAt: `${getDaysAgoIso(1)}T21:00:00.000Z`,
    updatedAt: `${getDaysAgoIso(1)}T21:15:00.000Z`,
  },
  // 2 days ago
  {
    id: 'log_2d_glycomet',
    medicationId: 'med_glycomet_500',
    parentId: 'parent_ramaswamy',
    scheduledDate: getDaysAgoIso(2),
    scheduledTime: '08:00 AM',
    status: 'taken',
    confirmedAt: `${getDaysAgoIso(2)}T08:10:00.000Z`,
    confirmedBy: 'parent_ramaswamy',
    createdAt: `${getDaysAgoIso(2)}T08:00:00.000Z`,
    updatedAt: `${getDaysAgoIso(2)}T08:10:00.000Z`,
  },
  {
    id: 'log_2d_amlong',
    medicationId: 'med_amlong_5',
    parentId: 'parent_ramaswamy',
    scheduledDate: getDaysAgoIso(2),
    scheduledTime: '08:30 AM',
    status: 'skipped',
    confirmedAt: `${getDaysAgoIso(2)}T09:00:00.000Z`,
    confirmedBy: 'parent_ramaswamy',
    note: 'Felt slight dizziness, called doctor clinic who asked to check BP before taking.',
    createdAt: `${getDaysAgoIso(2)}T08:30:00.000Z`,
    updatedAt: `${getDaysAgoIso(2)}T09:00:00.000Z`,
  },
  {
    id: 'log_2d_atorva',
    medicationId: 'med_atorva_20',
    parentId: 'parent_ramaswamy',
    scheduledDate: getDaysAgoIso(2),
    scheduledTime: '09:00 PM',
    status: 'taken',
    confirmedAt: `${getDaysAgoIso(2)}T21:20:00.000Z`,
    confirmedBy: 'parent_ramaswamy',
    createdAt: `${getDaysAgoIso(2)}T21:00:00.000Z`,
    updatedAt: `${getDaysAgoIso(2)}T21:20:00.000Z`,
  },
  // 3 days ago
  {
    id: 'log_3d_glycomet',
    medicationId: 'med_glycomet_500',
    parentId: 'parent_ramaswamy',
    scheduledDate: getDaysAgoIso(3),
    scheduledTime: '08:00 AM',
    status: 'taken',
    confirmedAt: `${getDaysAgoIso(3)}T08:15:00.000Z`,
    confirmedBy: 'parent_ramaswamy',
    createdAt: `${getDaysAgoIso(3)}T08:00:00.000Z`,
    updatedAt: `${getDaysAgoIso(3)}T08:15:00.000Z`,
  },
  {
    id: 'log_3d_amlong',
    medicationId: 'med_amlong_5',
    parentId: 'parent_ramaswamy',
    scheduledDate: getDaysAgoIso(3),
    scheduledTime: '08:30 AM',
    status: 'taken',
    confirmedAt: `${getDaysAgoIso(3)}T08:32:00.000Z`,
    confirmedBy: 'parent_ramaswamy',
    createdAt: `${getDaysAgoIso(3)}T08:30:00.000Z`,
    updatedAt: `${getDaysAgoIso(3)}T08:32:00.000Z`,
  },
  {
    id: 'log_3d_atorva',
    medicationId: 'med_atorva_20',
    parentId: 'parent_ramaswamy',
    scheduledDate: getDaysAgoIso(3),
    scheduledTime: '09:00 PM',
    status: 'taken',
    confirmedAt: `${getDaysAgoIso(3)}T21:05:00.000Z`,
    confirmedBy: 'parent_ramaswamy',
    createdAt: `${getDaysAgoIso(3)}T21:00:00.000Z`,
    updatedAt: `${getDaysAgoIso(3)}T21:05:00.000Z`,
  }
];

export const INITIAL_INSULIN_LOGS: InsulinLog[] = [
  {
    id: 'log_insulin_today',
    insulinScheduleId: 'insulin_lantus_ramaswamy',
    parentId: 'parent_ramaswamy',
    scheduledDate: getTodayIso(),
    scheduledTime: '08:30 PM',
    status: 'pending',
    createdAt: `${getTodayIso()}T20:30:00.000Z`,
    updatedAt: `${getTodayIso()}T20:30:00.000Z`,
  },
  {
    id: 'log_insulin_yest',
    insulinScheduleId: 'insulin_lantus_ramaswamy',
    parentId: 'parent_ramaswamy',
    scheduledDate: getDaysAgoIso(1),
    scheduledTime: '08:30 PM',
    status: 'taken',
    confirmedAt: `${getDaysAgoIso(1)}T20:45:12.000Z`,
    confirmedBy: 'parent_ramaswamy',
    note: 'Administered 10 Units on right abdomen rotating site.',
    createdAt: `${getDaysAgoIso(1)}T20:30:00.000Z`,
    updatedAt: `${getDaysAgoIso(1)}T20:45:12.000Z`,
  },
  {
    id: 'log_insulin_2d',
    insulinScheduleId: 'insulin_lantus_ramaswamy',
    parentId: 'parent_ramaswamy',
    scheduledDate: getDaysAgoIso(2),
    scheduledTime: '08:30 PM',
    status: 'taken',
    confirmedAt: `${getDaysAgoIso(2)}T20:35:00.000Z`,
    confirmedBy: 'parent_ramaswamy',
    createdAt: `${getDaysAgoIso(2)}T20:30:00.000Z`,
    updatedAt: `${getDaysAgoIso(2)}T20:35:00.000Z`,
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    recipientId: 'admin_child',
    parentId: 'parent_ramaswamy',
    notificationType: 'admin_followup',
    message: 'Medication confirmation is pending for Ramaswamy (Amlong 5mg). Please contact parent to verify.',
    messageTa: 'இராமசுவாமி அவர்களுக்கு ஆம்லாங் 5mg மருந்து நிலுவையில் உள்ளது. தயவுசெய்து அழைத்து சரிபார்க்கவும்.',
    deliveryStatus: 'delivered',
    sentAt: `${getTodayIso()}T09:00:00.000Z`,
    createdAt: `${getTodayIso()}T09:00:00.000Z`,
  },
  {
    id: 'notif_2',
    recipientId: 'parent_ramaswamy',
    parentId: 'parent_ramaswamy',
    notificationType: 'medication_reminder',
    message: 'Time for your morning medicines: Glycomet 500 SR & Amlong 5mg.',
    messageTa: 'காலை மருந்துகள் எடுக்கும் நேரம்: கிளைகோமெட் 500 & ஆம்லாங் 5mg.',
    deliveryStatus: 'delivered',
    sentAt: `${getTodayIso()}T08:00:00.000Z`,
    readAt: `${getTodayIso()}T08:14:00.000Z`,
    createdAt: `${getTodayIso()}T08:00:00.000Z`,
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_1',
    actorId: 'parent_ramaswamy',
    actorName: 'Ramaswamy Iyer',
    action: 'CONFIRM_TAKEN',
    recordType: 'log_status',
    recordId: 'log_today_glycomet',
    timestamp: `${getTodayIso()}T08:14:22.000Z`,
    summary: 'Confirmed Glycomet 500 SR taken with note: Took after breakfast.',
  },
  {
    id: 'audit_2',
    actorId: 'admin_child',
    actorName: 'Venkatesh (Son/Caregiver)',
    action: 'CREATE_MEDICATION',
    recordType: 'medication',
    recordId: 'med_atorva_20',
    timestamp: `${getDaysAgoIso(5)}T14:30:00.000Z`,
    summary: 'Added Atorva 20mg (Atorvastatin) with strip photo as prescribed by Dr. S. Balaji.',
  },
  {
    id: 'audit_3',
    actorId: 'admin_child',
    actorName: 'Venkatesh (Son/Caregiver)',
    action: 'CREATE_INSULIN_SCHEDULE',
    recordType: 'insulin',
    recordId: 'insulin_lantus_ramaswamy',
    timestamp: `${getDaysAgoIso(10)}T11:00:00.000Z`,
    summary: 'Configured Lantus SoloStar 10 Units nightly schedule from Dr. K. Ramanathan prescription.',
  }
];
