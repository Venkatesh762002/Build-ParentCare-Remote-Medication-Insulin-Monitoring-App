/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Language, 
  TextSize, 
  ParentProfile, 
  Medication, 
  InsulinSchedule, 
  MedicationLog, 
  InsulinLog, 
  AppNotification, 
  AuditLog, 
  MedicationStatus 
} from './types';
import { DataStore } from './utils/storage';
import { Header } from './components/common/Header';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { getTranslation } from './locales/translations';
import { ShieldCheck, CloudCheck, HeartHandshake } from 'lucide-react';

export default function App() {
  // Role & UI state
  const [currentRole, setCurrentRole] = useState<UserRole>('parent');
  const [language, setLanguage] = useState<Language>('ta'); // Default to Tamil as requested for elderly-friendly context
  const [textSize, setTextSize] = useState<TextSize>('large'); // Default to large for comfortable elderly reading
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Core Data loaded from DataStore
  const [parents, setParents] = useState<ParentProfile[]>([]);
  const [activeParent, setActiveParent] = useState<ParentProfile | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [insulinSchedules, setInsulinSchedules] = useState<InsulinSchedule[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [insulinLogs, setInsulinLogs] = useState<InsulinLog[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());

  // Load initial data
  useEffect(() => {
    const loadedParents = DataStore.getParents();
    setParents(loadedParents);
    if (loadedParents.length > 0) {
      setActiveParent(loadedParents[0]);
    }
    setMedications(DataStore.getMedications());
    setInsulinSchedules(DataStore.getInsulinSchedules());
    setMedicationLogs(DataStore.getMedicationLogs());
    setInsulinLogs(DataStore.getInsulinLogs());
    setNotifications(DataStore.getNotifications());
    setAuditLogs(DataStore.getAuditLogs());
  }, []);

  const refreshData = () => {
    setMedications(DataStore.getMedications());
    setInsulinSchedules(DataStore.getInsulinSchedules());
    setMedicationLogs(DataStore.getMedicationLogs());
    setInsulinLogs(DataStore.getInsulinLogs());
    setNotifications(DataStore.getNotifications());
    setAuditLogs(DataStore.getAuditLogs());
    setLastSyncTime(new Date().toLocaleTimeString());
  };

  // Medication status update handler
  const handleUpdateMedicationStatus = (
    logId: string,
    status: MedicationStatus,
    note?: string
  ) => {
    DataStore.updateMedicationLogStatus(logId, status, note, currentRole === 'parent' ? 'parent' : 'admin');
    refreshData();
  };

  // Insulin status update handler
  const handleUpdateInsulinStatus = (
    logId: string,
    status: MedicationStatus,
    note?: string
  ) => {
    DataStore.updateInsulinLogStatus(logId, status, note, currentRole === 'parent' ? 'parent' : 'admin');
    refreshData();
  };

  // Medication schedule creation/edit
  const handleSaveMedication = (med: Medication) => {
    DataStore.saveMedication(med, currentRole === 'admin' ? 'Caregiver Admin' : 'Parent');
    refreshData();
  };

  const handleToggleMedicationStatus = (id: string, active: boolean) => {
    DataStore.toggleMedicationStatus(id, active, 'Caregiver Admin');
    refreshData();
  };

  // Insulin schedule creation/edit
  const handleSaveInsulinSchedule = (schedule: InsulinSchedule) => {
    DataStore.saveInsulinSchedule(schedule, 'Caregiver Admin');
    refreshData();
  };

  // Parent profile save
  const handleSaveParent = (parent: ParentProfile) => {
    const saved = DataStore.saveParent(parent, 'Caregiver Admin');
    const updatedParents = DataStore.getParents();
    setParents(updatedParents);
    setActiveParent(saved);
    refreshData();
  };

  const handleMarkNotificationRead = (id: string) => {
    DataStore.markNotificationRead(id);
    refreshData();
  };

  const t = getTranslation(language);

  // Global Text size wrapper class
  const textSizeClass = 
    textSize === 'xlarge' ? 'text-lg' : textSize === 'large' ? 'text-base' : 'text-sm';

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 ${textSizeClass}`}>
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        language={language}
        textSize={textSize}
        activeParent={activeParent}
        allParents={parents}
        voiceEnabled={voiceEnabled}
        isSpeaking={isSpeaking}
        onRoleChange={setCurrentRole}
        onLanguageChange={setLanguage}
        onTextSizeChange={setTextSize}
        onActiveParentChange={setActiveParent}
        onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
        setIsSpeaking={setIsSpeaking}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeParent ? (
          currentRole === 'parent' ? (
            <ParentDashboard
              parent={activeParent}
              medications={medications.filter(m => m.parentId === activeParent.id)}
              insulinSchedules={insulinSchedules.filter(s => s.parentId === activeParent.id)}
              medicationLogs={medicationLogs}
              insulinLogs={insulinLogs}
              language={language}
              textSize={textSize}
              onUpdateMedicationStatus={handleUpdateMedicationStatus}
              onUpdateInsulinStatus={handleUpdateInsulinStatus}
              onEnsureMedLog={(med) => DataStore.ensureTodayMedicationLog(med)}
              onEnsureInsulinLog={(sched) => DataStore.ensureTodayInsulinLog(sched)}
            />
          ) : (
            <AdminDashboard
              parents={parents}
              activeParent={activeParent}
              medications={medications}
              insulinSchedules={insulinSchedules}
              medicationLogs={medicationLogs}
              insulinLogs={insulinLogs}
              notifications={notifications}
              auditLogs={auditLogs}
              language={language}
              onSelectParent={setActiveParent}
              onSaveMedication={handleSaveMedication}
              onToggleMedicationStatus={handleToggleMedicationStatus}
              onSaveInsulinSchedule={handleSaveInsulinSchedule}
              onSaveParent={handleSaveParent}
              onMarkNotificationRead={handleMarkNotificationRead}
            />
          )
        ) : (
          <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
            <HeartHandshake className="w-12 h-12 text-teal-600 mx-auto mb-3" />
            <p className="font-bold text-lg text-slate-800">Initializing ParentCare...</p>
          </div>
        )}
      </main>

      {/* Bottom Sticky Safe Sync & Privacy Status Bar */}
      <footer className="bg-white border-t border-slate-200 py-3 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700">
              {t.verifiedRecord} • {lastSyncTime}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              Role-protected & secure audit logging
            </span>
            <span>•</span>
            <span>ParentCare v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
