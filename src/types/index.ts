export type UserRole = 'admin' | 'parent';

export type Language = 'en' | 'ta';

export type TextSize = 'normal' | 'large' | 'xlarge';

export type MedicationStatus = 
  | 'pending'
  | 'reminder_sent'
  | 'taken'
  | 'skipped'
  | 'unable_to_complete'
  | 'overdue'
  | 'needs_review';

export type MedicationFrequency = 
  | 'once_daily'
  | 'twice_daily'
  | 'thrice_daily'
  | 'custom';

export type MedicationScheduleTime = 
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'
  | 'custom';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  language: Language;
  textSize?: TextSize;
  voiceEnabled: boolean;
  active: boolean;
  linkedParentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParentProfile {
  id: string;
  name: string;
  nameTa: string;
  relationship: 'Father' | 'Mother' | 'In-Law' | 'Other';
  relationshipTa: string;
  linkedUserId?: string;
  authorizedAdminIds: string[];
  phoneNumber?: string;
  emergencyDoctorName?: string;
  emergencyDoctorPhone?: string;
  notes?: string;
  active: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  parentId: string;
  medicineName: string;
  medicineNameTa?: string;
  strengthText: string;
  photoUrl: string;
  photoStoragePath?: string;
  instructions: string;
  instructionsTa?: string;
  schedule: MedicationScheduleTime;
  scheduledTime: string; // e.g., "08:00 AM" or "20:00"
  frequency: MedicationFrequency;
  startDate: string;
  endDate?: string;
  active: boolean;
  prescribingDoctor?: string;
  additionalNotes?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  parentId: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string;
  status: MedicationStatus;
  confirmedAt?: string;
  confirmedBy?: string; // parent ID or admin ID
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsulinSchedule {
  id: string;
  parentId: string;
  insulinName: string;
  insulinNameTa?: string;
  prescribedScheduleText: string;
  scheduledTime: string; // e.g. "08:30 AM"
  instructions: string;
  instructionsTa?: string;
  startDate: string;
  endDate?: string;
  active: boolean;
  prescribingDoctor?: string;
  notes?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsulinLog {
  id: string;
  insulinScheduleId: string;
  parentId: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string;
  status: MedicationStatus;
  confirmedAt?: string;
  confirmedBy?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'medication_reminder'
  | 'insulin_reminder'
  | 'admin_followup'
  | 'status_update';

export interface AppNotification {
  id: string;
  recipientId: string;
  parentId: string;
  relatedRecordId?: string;
  notificationType: NotificationType;
  message: string;
  messageTa?: string;
  deliveryStatus: 'delivered' | 'pending' | 'failed';
  sentAt: string;
  readAt?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  recordType: 'medication' | 'insulin' | 'parent_profile' | 'log_status' | 'photo' | 'system';
  recordId: string;
  timestamp: string;
  summary: string;
}
