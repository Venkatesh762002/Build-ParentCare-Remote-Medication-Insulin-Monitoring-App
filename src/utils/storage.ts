import {
  ParentProfile,
  Medication,
  InsulinSchedule,
  MedicationLog,
  InsulinLog,
  AppNotification,
  AuditLog,
  MedicationStatus,
} from '../types';
import {
  INITIAL_PARENTS,
  INITIAL_MEDICATIONS,
  INITIAL_INSULIN_SCHEDULES,
  INITIAL_MEDICATION_LOGS,
  INITIAL_INSULIN_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from './sampleData';

const STORAGE_KEYS = {
  PARENTS: 'parentcare_parents',
  MEDICATIONS: 'parentcare_medications',
  INSULIN_SCHEDULES: 'parentcare_insulin_schedules',
  MEDICATION_LOGS: 'parentcare_medication_logs',
  INSULIN_LOGS: 'parentcare_insulin_logs',
  NOTIFICATIONS: 'parentcare_notifications',
  AUDIT_LOGS: 'parentcare_audit_logs',
  SETTINGS: 'parentcare_settings',
};

function getStorageItem<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultVal;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Error reading localStorage key ${key}:`, e);
    return defaultVal;
  }
}

function setStorageItem<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn(`Error writing localStorage key ${key}:`, e);
  }
}

export class DataStore {
  // Load parents
  static getParents(): ParentProfile[] {
    const stored = getStorageItem<ParentProfile[]>(STORAGE_KEYS.PARENTS, []);
    if (!stored || stored.length === 0) {
      setStorageItem(STORAGE_KEYS.PARENTS, INITIAL_PARENTS);
      return INITIAL_PARENTS;
    }
    return stored;
  }

  static saveParent(parent: ParentProfile, actorName = 'Admin'): ParentProfile {
    const parents = this.getParents();
    const existingIndex = parents.findIndex((p) => p.id === parent.id);
    let updatedParents: ParentProfile[];
    if (existingIndex >= 0) {
      updatedParents = [...parents];
      updatedParents[existingIndex] = { ...parent, updatedAt: new Date().toISOString() };
      this.addAuditLog({
        actorId: 'admin_user',
        actorName,
        action: 'UPDATE_PARENT',
        recordType: 'parent_profile',
        recordId: parent.id,
        summary: `Updated profile details for parent ${parent.name}.`,
      });
    } else {
      updatedParents = [...parents, parent];
      this.addAuditLog({
        actorId: 'admin_user',
        actorName,
        action: 'CREATE_PARENT',
        recordType: 'parent_profile',
        recordId: parent.id,
        summary: `Registered new parent profile: ${parent.name}.`,
      });
    }
    setStorageItem(STORAGE_KEYS.PARENTS, updatedParents);
    return parent;
  }

  // Medications
  static getMedications(parentId?: string): Medication[] {
    const stored = getStorageItem<Medication[]>(STORAGE_KEYS.MEDICATIONS, []);
    let meds = stored;
    if (!stored || stored.length === 0) {
      setStorageItem(STORAGE_KEYS.MEDICATIONS, INITIAL_MEDICATIONS);
      meds = INITIAL_MEDICATIONS;
    }
    if (parentId) {
      return meds.filter((m) => m.parentId === parentId);
    }
    return meds;
  }

  static saveMedication(med: Medication, actorName = 'Admin'): Medication {
    const meds = this.getMedications();
    const existingIndex = meds.findIndex((m) => m.id === med.id);
    let updated: Medication[];
    if (existingIndex >= 0) {
      updated = [...meds];
      updated[existingIndex] = { ...med, updatedAt: new Date().toISOString() };
      this.addAuditLog({
        actorId: 'admin_user',
        actorName,
        action: 'UPDATE_MEDICATION',
        recordType: 'medication',
        recordId: med.id,
        summary: `Updated schedule/photo for ${med.medicineName} (${med.strengthText}).`,
      });
    } else {
      updated = [...meds, med];
      this.addAuditLog({
        actorId: 'admin_user',
        actorName,
        action: 'CREATE_MEDICATION',
        recordType: 'medication',
        recordId: med.id,
        summary: `Created medication record for ${med.medicineName} (${med.strengthText}) with package photo.`,
      });
    }
    setStorageItem(STORAGE_KEYS.MEDICATIONS, updated);
    return med;
  }

  static toggleMedicationStatus(id: string, active: boolean, actorName = 'Admin'): void {
    const meds = this.getMedications();
    const med = meds.find((m) => m.id === id);
    if (!med) return;
    med.active = active;
    med.updatedAt = new Date().toISOString();
    setStorageItem(STORAGE_KEYS.MEDICATIONS, meds);
    this.addAuditLog({
      actorId: 'admin_user',
      actorName,
      action: active ? 'ACTIVATE_MEDICATION' : 'DEACTIVATE_MEDICATION',
      recordType: 'medication',
      recordId: id,
      summary: `${active ? 'Activated' : 'Deactivated'} ${med.medicineName}.`,
    });
  }

  // Insulin Schedules
  static getInsulinSchedules(parentId?: string): InsulinSchedule[] {
    const stored = getStorageItem<InsulinSchedule[]>(STORAGE_KEYS.INSULIN_SCHEDULES, []);
    let schedules = stored;
    if (!stored || stored.length === 0) {
      setStorageItem(STORAGE_KEYS.INSULIN_SCHEDULES, INITIAL_INSULIN_SCHEDULES);
      schedules = INITIAL_INSULIN_SCHEDULES;
    }
    if (parentId) {
      return schedules.filter((s) => s.parentId === parentId);
    }
    return schedules;
  }

  static saveInsulinSchedule(schedule: InsulinSchedule, actorName = 'Admin'): InsulinSchedule {
    const list = this.getInsulinSchedules();
    const idx = list.findIndex((s) => s.id === schedule.id);
    let updated: InsulinSchedule[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = { ...schedule, updatedAt: new Date().toISOString() };
      this.addAuditLog({
        actorId: 'admin_user',
        actorName,
        action: 'UPDATE_INSULIN_SCHEDULE',
        recordType: 'insulin',
        recordId: schedule.id,
        summary: `Modified insulin schedule: ${schedule.insulinName}.`,
      });
    } else {
      updated = [...list, schedule];
      this.addAuditLog({
        actorId: 'admin_user',
        actorName,
        action: 'CREATE_INSULIN_SCHEDULE',
        recordType: 'insulin',
        recordId: schedule.id,
        summary: `Added prescribed insulin schedule: ${schedule.insulinName}.`,
      });
    }
    setStorageItem(STORAGE_KEYS.INSULIN_SCHEDULES, updated);
    return schedule;
  }

  // Medication Logs
  static getMedicationLogs(parentId?: string): MedicationLog[] {
    const stored = getStorageItem<MedicationLog[]>(STORAGE_KEYS.MEDICATION_LOGS, []);
    let logs = stored;
    if (!stored || stored.length === 0) {
      setStorageItem(STORAGE_KEYS.MEDICATION_LOGS, INITIAL_MEDICATION_LOGS);
      logs = INITIAL_MEDICATION_LOGS;
    }
    if (parentId) {
      return logs.filter((l) => l.parentId === parentId);
    }
    return logs;
  }

  static updateMedicationLogStatus(
    logId: string,
    status: MedicationStatus,
    note?: string,
    confirmedBy = 'parent'
  ): MedicationLog | null {
    const logs = this.getMedicationLogs();
    const idx = logs.findIndex((l) => l.id === logId);
    if (idx < 0) return null;

    const currentLog = logs[idx];
    const nowIso = new Date().toISOString();
    const updatedLog: MedicationLog = {
      ...currentLog,
      status,
      confirmedAt: status === 'pending' ? undefined : nowIso,
      confirmedBy,
      note: note !== undefined ? note : currentLog.note,
      updatedAt: nowIso,
    };

    logs[idx] = updatedLog;
    setStorageItem(STORAGE_KEYS.MEDICATION_LOGS, logs);

    // Fetch med name for clear audit log
    const meds = this.getMedications();
    const med = meds.find((m) => m.id === currentLog.medicationId);
    const medName = med ? med.medicineName : 'Medication';

    this.addAuditLog({
      actorId: confirmedBy,
      actorName: confirmedBy.includes('parent') ? 'Parent' : 'Caregiver',
      action: `STATUS_${status.toUpperCase()}`,
      recordType: 'log_status',
      recordId: logId,
      summary: `Marked ${medName} (${currentLog.scheduledTime}) as ${status}.${note ? ` Note: "${note}"` : ''}`,
    });

    // If status is skipped or unable to complete, create caregiver follow-up notification
    if (status === 'skipped' || status === 'unable_to_complete') {
      this.addNotification({
        recipientId: 'admin_child',
        parentId: currentLog.parentId,
        relatedRecordId: logId,
        notificationType: 'admin_followup',
        message: `Parent marked ${medName} as ${status.replace('_', ' ')}.${note ? ` Reason: ${note}` : ''} Please contact parent to verify.`,
        messageTa: `பெற்றோர் ${medName} மருந்தை "${status === 'skipped' ? 'தவிர்க்கப்பட்டது' : 'எடுக்க முடியவில்லை'}" என்று பதிவு செய்துள்ளனர். தயவுசெய்து அழைத்து சரிபார்க்கவும்.`,
        deliveryStatus: 'delivered',
      });
    }

    return updatedLog;
  }

  // Create or get today's log for a medication
  static ensureTodayMedicationLog(med: Medication): MedicationLog {
    const todayIso = new Date().toISOString().split('T')[0];
    const logs = this.getMedicationLogs();
    const existing = logs.find(
      (l) => l.medicationId === med.id && l.scheduledDate === todayIso && l.scheduledTime === med.scheduledTime
    );
    if (existing) return existing;

    const newLog: MedicationLog = {
      id: `log_${med.id}_${todayIso}`,
      medicationId: med.id,
      parentId: med.parentId,
      scheduledDate: todayIso,
      scheduledTime: med.scheduledTime,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    logs.push(newLog);
    setStorageItem(STORAGE_KEYS.MEDICATION_LOGS, logs);
    return newLog;
  }

  // Insulin Logs
  static getInsulinLogs(parentId?: string): InsulinLog[] {
    const stored = getStorageItem<InsulinLog[]>(STORAGE_KEYS.INSULIN_LOGS, []);
    let logs = stored;
    if (!stored || stored.length === 0) {
      setStorageItem(STORAGE_KEYS.INSULIN_LOGS, INITIAL_INSULIN_LOGS);
      logs = INITIAL_INSULIN_LOGS;
    }
    if (parentId) {
      return logs.filter((l) => l.parentId === parentId);
    }
    return logs;
  }

  static updateInsulinLogStatus(
    logId: string,
    status: MedicationStatus,
    note?: string,
    confirmedBy = 'parent'
  ): InsulinLog | null {
    const logs = this.getInsulinLogs();
    const idx = logs.findIndex((l) => l.id === logId);
    if (idx < 0) return null;

    const current = logs[idx];
    const nowIso = new Date().toISOString();
    const updated: InsulinLog = {
      ...current,
      status,
      confirmedAt: status === 'pending' ? undefined : nowIso,
      confirmedBy,
      note: note !== undefined ? note : current.note,
      updatedAt: nowIso,
    };

    logs[idx] = updated;
    setStorageItem(STORAGE_KEYS.INSULIN_LOGS, logs);

    const insulinList = this.getInsulinSchedules();
    const schedule = insulinList.find((s) => s.id === current.insulinScheduleId);
    const insulinName = schedule ? schedule.insulinName : 'Insulin';

    this.addAuditLog({
      actorId: confirmedBy,
      actorName: confirmedBy.includes('parent') ? 'Parent' : 'Caregiver',
      action: `INSULIN_${status.toUpperCase()}`,
      recordType: 'insulin',
      recordId: logId,
      summary: `Insulin ${insulinName} marked as ${status}.${note ? ` Note: "${note}"` : ''}`,
    });

    if (status === 'skipped' || status === 'unable_to_complete') {
      this.addNotification({
        recipientId: 'admin_child',
        parentId: current.parentId,
        relatedRecordId: logId,
        notificationType: 'admin_followup',
        message: `Insulin entry marked as ${status.replace('_', ' ')} by parent for ${insulinName}. Please verify with parent.`,
        messageTa: `இன்சுலின் பதிவு "${status === 'skipped' ? 'தவிர்க்கப்பட்டது' : 'எடுக்க முடியவில்லை'}" என குறிக்கப்பட்டுள்ளது. தயவுசெய்து பெற்றோரை தொடர்பு கொள்ளவும்.`,
        deliveryStatus: 'delivered',
      });
    }

    return updated;
  }

  static ensureTodayInsulinLog(schedule: InsulinSchedule): InsulinLog {
    const todayIso = new Date().toISOString().split('T')[0];
    const logs = this.getInsulinLogs();
    const existing = logs.find(
      (l) => l.insulinScheduleId === schedule.id && l.scheduledDate === todayIso
    );
    if (existing) return existing;

    const newLog: InsulinLog = {
      id: `insulin_log_${schedule.id}_${todayIso}`,
      insulinScheduleId: schedule.id,
      parentId: schedule.parentId,
      scheduledDate: todayIso,
      scheduledTime: schedule.scheduledTime,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    logs.push(newLog);
    setStorageItem(STORAGE_KEYS.INSULIN_LOGS, logs);
    return newLog;
  }

  // Notifications
  static getNotifications(): AppNotification[] {
    return getStorageItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  static addNotification(item: Omit<AppNotification, 'id' | 'sentAt' | 'createdAt'>): AppNotification {
    const list = this.getNotifications();
    const nowIso = new Date().toISOString();
    const notif: AppNotification = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sentAt: nowIso,
      createdAt: nowIso,
    };
    const updated = [notif, ...list].slice(0, 50); // Keep latest 50
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, updated);
    return notif;
  }

  static markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const idx = list.findIndex((n) => n.id === id);
    if (idx >= 0) {
      list[idx].readAt = new Date().toISOString();
      setStorageItem(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  }

  // Audit Logs
  static getAuditLogs(): AuditLog[] {
    return getStorageItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  static addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const list = this.getAuditLogs();
    const log: AuditLog = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [log, ...list].slice(0, 100);
    setStorageItem(STORAGE_KEYS.AUDIT_LOGS, updated);
  }

  // Reset to factory demo data if requested
  static resetDemoData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.PARENTS);
    localStorage.removeItem(STORAGE_KEYS.MEDICATIONS);
    localStorage.removeItem(STORAGE_KEYS.INSULIN_SCHEDULES);
    localStorage.removeItem(STORAGE_KEYS.MEDICATION_LOGS);
    localStorage.removeItem(STORAGE_KEYS.INSULIN_LOGS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
  }
}
