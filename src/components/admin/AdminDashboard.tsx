import React, { useState } from 'react';
import { 
  Users, 
  Pill, 
  Syringe, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Plus, 
  Edit3, 
  Power, 
  Phone, 
  BellRing, 
  FileText, 
  History, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { 
  ParentProfile, 
  Medication, 
  InsulinSchedule, 
  MedicationLog, 
  InsulinLog, 
  Language, 
  AuditLog, 
  AppNotification,
  MedicationStatus 
} from '../../types';
import { getTranslation } from '../../locales/translations';
import { SafetyBanner } from '../common/SafetyBanner';
import { PhotoModal } from '../common/PhotoModal';
import { MedicationModal } from './MedicationModal';
import { InsulinModal } from './InsulinModal';
import { ParentModal } from './ParentModal';

interface AdminDashboardProps {
  parents: ParentProfile[];
  activeParent: ParentProfile;
  medications: Medication[];
  insulinSchedules: InsulinSchedule[];
  medicationLogs: MedicationLog[];
  insulinLogs: InsulinLog[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  language: Language;
  onSelectParent: (parent: ParentProfile) => void;
  onSaveMedication: (med: Medication) => void;
  onToggleMedicationStatus: (id: string, active: boolean) => void;
  onSaveInsulinSchedule: (schedule: InsulinSchedule) => void;
  onSaveParent: (parent: ParentProfile) => void;
  onMarkNotificationRead: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  parents,
  activeParent,
  medications,
  insulinSchedules,
  medicationLogs,
  insulinLogs,
  notifications,
  auditLogs,
  language,
  onSelectParent,
  onSaveMedication,
  onToggleMedicationStatus,
  onSaveInsulinSchedule,
  onSaveParent,
  onMarkNotificationRead,
}) => {
  const t = getTranslation(language);
  const [adminTab, setAdminTab] = useState<'overview' | 'medications' | 'insulin' | 'history' | 'audit'>('overview');

  // Modal states
  const [medModalOpen, setMedModalOpen] = useState(false);
  const [medToEdit, setMedToEdit] = useState<Medication | null>(null);

  const [insulinModalOpen, setInsulinModalOpen] = useState(false);
  const [insulinToEdit, setInsulinToEdit] = useState<InsulinSchedule | null>(null);

  const [parentModalOpen, setParentModalOpen] = useState(false);
  const [parentToEdit, setParentToEdit] = useState<ParentProfile | null>(null);

  const [photoPreviewState, setPhotoPreviewState] = useState<{
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

  const todayIso = new Date().toISOString().split('T')[0];

  // Filter items for currently selected parent
  const parentMeds = medications.filter(m => m.parentId === activeParent.id);
  const parentActiveMeds = parentMeds.filter(m => m.active);
  const parentInsulin = insulinSchedules.filter(s => s.parentId === activeParent.id);
  const parentActiveInsulin = parentInsulin.filter(s => s.active);

  const todayMedLogs = medicationLogs.filter(
    l => l.parentId === activeParent.id && l.scheduledDate === todayIso
  );
  const todayInsulinLogs = insulinLogs.filter(
    l => l.parentId === activeParent.id && l.scheduledDate === todayIso
  );

  // Stats
  const totalScheduledToday = parentActiveMeds.length;
  const takenCount = todayMedLogs.filter(l => l.status === 'taken').length;
  const skippedCount = todayMedLogs.filter(l => l.status === 'skipped').length;
  const unableCount = todayMedLogs.filter(l => l.status === 'unable_to_complete').length;
  const pendingCount = todayMedLogs.filter(l => l.status === 'pending').length;
  const overdueCount = todayMedLogs.filter(l => l.status === 'overdue' || l.status === 'needs_review').length;

  const insulinTakenCount = todayInsulinLogs.filter(l => l.status === 'taken').length;

  // Active follow-up alerts (pending notifications for admin)
  const pendingAlerts = notifications.filter(
    n => n.recipientId === 'admin_child' && (!n.readAt || n.readAt === '')
  );

  // Past 7 days adherence calculation
  const past7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', { weekday: 'short' });
    
    const logsOnDay = medicationLogs.filter(
      l => l.parentId === activeParent.id && l.scheduledDate === dateStr
    );
    const taken = logsOnDay.filter(l => l.status === 'taken').length;
    const total = logsOnDay.length || parentActiveMeds.length || 1;
    const rate = Math.min(100, Math.round((taken / total) * 100));

    return { dateStr, dayLabel, taken, total, rate };
  });

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Banner: Active Caregiver Overview */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {t.roleAdmin}
              </span>
              <span className="text-xs text-slate-400">
                Remote Family Health Monitor
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.adminDashboard}
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Remotely monitor your parents' medication routines and verified strip photos. Receive follow-up reminders when routine is delayed.
            </p>
          </div>

          {/* Quick Action: Add Medication / Add Parent */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="btn-admin-add-med"
              type="button"
              onClick={() => {
                setMedToEdit(null);
                setMedModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addMedication}</span>
            </button>

            <button
              id="btn-admin-add-parent"
              type="button"
              onClick={() => {
                setParentToEdit(null);
                setParentModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold border border-slate-700 transition-colors"
            >
              <Users className="w-4 h-4 text-teal-400" />
              <span>Add Parent</span>
            </button>
          </div>
        </div>

        {/* Parent Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-semibold mr-1">
            {t.activeParent}:
          </span>
          {parents.map((p) => {
            const isSelected = p.id === activeParent.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectParent(p)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 shadow-md ring-2 ring-teal-300'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{language === 'ta' ? p.nameTa : `${p.name} (${p.relationship})`}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Safety Notice for Admin */}
      <SafetyBanner language={language} variant="admin" />

      {/* Follow-up Alerts Section (Neutral Non-Alarming Wording) */}
      {pendingAlerts.length > 0 && (
        <div 
          id="admin-followup-alerts-box"
          className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-amber-950 flex items-center gap-2 text-sm sm:text-base">
              <BellRing className="w-5 h-5 text-amber-700 animate-bounce" />
              <span>{t.alertsTitle}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-200 text-amber-900">
                {pendingAlerts.length}
              </span>
            </h3>
            <span className="text-xs text-amber-800 font-medium">
              Neutral Caregiver Verification Notice
            </span>
          </div>

          <div className="space-y-2.5">
            {pendingAlerts.map((alert) => (
              <div 
                key={alert.id}
                className="bg-white p-3.5 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">
                      {language === 'ta' && alert.messageTa ? alert.messageTa : alert.message}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Received at {new Date(alert.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {activeParent.phoneNumber && (
                    <a
                      href={`tel:${activeParent.phoneNumber}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call Parent</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => onMarkNotificationRead(alert.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Mark Verified
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          id="tab-admin-overview"
          type="button"
          onClick={() => setAdminTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            adminTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          id="tab-admin-medications"
          type="button"
          onClick={() => setAdminTab('medications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            adminTab === 'medications'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Medications ({parentMeds.length})</span>
        </button>

        <button
          id="tab-admin-insulin"
          type="button"
          onClick={() => setAdminTab('insulin')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            adminTab === 'insulin'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Syringe className="w-4 h-4" />
          <span>Insulin Tracking ({parentInsulin.length})</span>
        </button>

        <button
          id="tab-admin-history"
          type="button"
          onClick={() => setAdminTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            adminTab === 'history'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Parent History & Notes</span>
        </button>

        <button
          id="tab-admin-audit"
          type="button"
          onClick={() => setAdminTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
            adminTab === 'audit'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Audit Log</span>
        </button>
      </div>

      {/* Tab 1: Dashboard Overview */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            
            {/* Scheduled */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {t.summaryScheduledToday}
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {totalScheduledToday}
                </span>
                <span className="text-xs text-slate-400 font-medium">doses</span>
              </div>
            </div>

            {/* Taken */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                {t.summaryTakenToday}
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                  {takenCount}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* Pending */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                {t.summaryPendingToday}
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-700">
                  {pendingCount}
                </span>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Skipped */}
            <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                {t.summarySkippedToday}
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-700">
                  {skippedCount}
                </span>
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
            </div>

            {/* Unable */}
            <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/30 shadow-xs">
              <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block">
                {t.summaryUnableToday}
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-700">
                  {unableCount}
                </span>
                <XCircle className="w-4 h-4 text-rose-600" />
              </div>
            </div>

            {/* Insulin Given */}
            <div className="bg-white p-4 rounded-2xl border border-purple-200 bg-purple-50/30 shadow-xs">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                {t.summaryInsulinToday}
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-purple-700">
                  {insulinTakenCount}
                </span>
                <Syringe className="w-4 h-4 text-purple-600" />
              </div>
            </div>

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 7-Day Medication Adherence History Chart (Accessible SVG/HTML) */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-base sm:text-lg text-slate-900">
                    {t.sevenDayTrend}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Daily confirmation percentage for {activeParent.name}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500" /> Taken
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <span className="w-3 h-3 rounded-sm bg-slate-200" /> Total
                  </span>
                </div>
              </div>

              {/* Bar Chart Bars */}
              <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4 pb-2 items-end h-48 border-b border-slate-100">
                {past7DaysData.map((d, idx) => {
                  const barHeight = Math.max(12, Math.min(100, d.rate));
                  const isToday = idx === 6;
                  return (
                    <div key={d.dateStr} className="flex flex-col items-center h-full justify-end group">
                      <span className="text-[11px] font-bold text-slate-600 mb-1.5 opacity-80 group-hover:opacity-100">
                        {d.rate}%
                      </span>
                      <div className="w-full max-w-[40px] bg-slate-100 rounded-t-lg h-36 flex items-end p-1">
                        <div 
                          style={{ height: `${barHeight}%` }}
                          className={`w-full rounded-md transition-all ${
                            isToday 
                              ? 'bg-teal-600 group-hover:bg-teal-700' 
                              : d.rate >= 80 
                              ? 'bg-emerald-500 group-hover:bg-emerald-600' 
                              : 'bg-amber-400 group-hover:bg-amber-500'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-semibold mt-2 ${isToday ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
                        {d.dayLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-xs text-slate-400 text-center">
                * Note: Adherence records encourage family follow-up; not a diagnostic health metric.
              </div>
            </div>

            {/* Today's Status Distribution Chart */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-base sm:text-lg text-slate-900 mb-1">
                  {t.statusDistribution}
                </h4>
                <p className="text-xs text-slate-500 mb-5">
                  Today's schedule breakdown
                </p>

                <div className="space-y-3">
                  {/* Confirmed / Taken */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {t.status_taken}
                      </span>
                      <span className="text-slate-900 font-bold">{takenCount}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${totalScheduledToday ? (takenCount / totalScheduledToday) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Pending */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {t.status_pending}
                      </span>
                      <span className="text-slate-900 font-bold">{pendingCount}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-slate-400 h-full rounded-full"
                        style={{ width: `${totalScheduledToday ? (pendingCount / totalScheduledToday) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Skipped */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-amber-800 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        {t.status_skipped}
                      </span>
                      <span className="text-slate-900 font-bold">{skippedCount}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${totalScheduledToday ? (skippedCount / totalScheduledToday) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Unable */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-rose-800 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        {t.status_unable_to_complete}
                      </span>
                      <span className="text-slate-900 font-bold">{unableCount}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-rose-500 h-full rounded-full"
                        style={{ width: `${totalScheduledToday ? (unableCount / totalScheduledToday) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency info quick bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-700 block mb-1">Assigned Doctor:</span>
                <p className="text-slate-600">
                  {activeParent.emergencyDoctorName || 'Not specified'} 
                  {activeParent.emergencyDoctorPhone && ` (${activeParent.emergencyDoctorPhone})`}
                </p>
              </div>

            </div>

          </div>

          {/* Today's Schedule Live List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-700" />
                <span>Today's Live Routine Status</span>
              </h4>
              <span className="text-xs text-slate-500">
                Auto-synced with parent app
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parentActiveMeds.map((med) => {
                const log = todayMedLogs.find(l => l.medicationId === med.id);
                return (
                  <div
                    key={med.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-slate-900 text-base">{med.medicineName}</p>
                          <p className="text-xs text-teal-700 font-semibold">{med.strengthText}</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200">
                          {med.scheduledTime}
                        </span>
                      </div>
                      
                      {/* Photo Thumbnail */}
                      <div 
                        onClick={() => setPhotoPreviewState({
                          isOpen: true,
                          photoUrl: med.photoUrl,
                          medicineName: med.medicineName,
                          strengthText: med.strengthText,
                        })}
                        className="mt-3 cursor-pointer relative group rounded-lg overflow-hidden border border-slate-200 bg-white h-24 flex items-center justify-center"
                      >
                        {med.photoUrl ? (
                          <img
                            src={med.photoUrl}
                            alt={med.medicineName}
                            className="max-h-full max-w-full object-contain p-1 group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-xs text-slate-400">No Photo</span>
                        )}
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Maximize2 className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {log?.note && (
                        <p className="mt-2 text-xs text-teal-800 bg-teal-50 p-2 rounded-lg border border-teal-200 font-medium">
                          Note: "{log.note}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Status:</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                        log?.status === 'taken'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log?.status === 'skipped'
                          ? 'bg-amber-100 text-amber-800'
                          : log?.status === 'unable_to_complete'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {log?.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Medications Management */}
      {adminTab === 'medications' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                Prescribed Medications for {activeParent.name}
              </h3>
              <p className="text-xs text-slate-500">
                Upload entire medicine strip or box photos. Admin manually verifies details from prescription.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMedToEdit(null);
                setMedModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addMedication}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {parentMeds.map((med) => (
              <div
                key={med.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                  med.active ? 'border-slate-200' : 'border-slate-300 opacity-60 bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-lg text-slate-900">{med.medicineName}</h4>
                      <p className="text-xs text-slate-500">{med.medicineNameTa}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      med.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {med.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Photo & Specs */}
                  <div className="grid grid-cols-12 gap-4 my-4">
                    <div 
                      onClick={() => setPhotoPreviewState({
                        isOpen: true,
                        photoUrl: med.photoUrl,
                        medicineName: med.medicineName,
                        strengthText: med.strengthText,
                      })}
                      className="col-span-5 relative group cursor-pointer bg-slate-100 rounded-xl overflow-hidden border border-slate-200 aspect-4/3 flex items-center justify-center shadow-inner"
                    >
                      {med.photoUrl ? (
                        <img
                          src={med.photoUrl}
                          alt={med.medicineName}
                          className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">No Photo</span>
                      )}
                      <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="col-span-7 text-xs space-y-1.5">
                      <p className="font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md inline-block">
                        {med.strengthText}
                      </p>
                      <p className="text-slate-700">
                        <span className="font-bold">Time:</span> {med.scheduledTime} ({med.schedule})
                      </p>
                      <p className="text-slate-700">
                        <span className="font-bold">Freq:</span> {med.frequency.replace('_', ' ')}
                      </p>
                      {med.prescribingDoctor && (
                        <p className="text-slate-600">
                          <span className="font-bold">Doctor:</span> {med.prescribingDoctor}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block mb-0.5">Doctor Instructions:</span>
                    <p>{med.instructions}</p>
                  </div>
                </div>

                {/* Card footer controls */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setMedToEdit(med);
                      setMedModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 p-1.5 rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit & Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleMedicationStatus(med.id, !med.active)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                      med.active
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{med.active ? 'Deactivate' : 'Activate'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Insulin Tracking */}
      {adminTab === 'insulin' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                Prescribed Insulin Tracking for {activeParent.name}
              </h3>
              <p className="text-xs text-slate-500">
                Follows strict medical protocol: exact doctor prescription only; no automatic dose alterations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setInsulinToEdit(null);
                setInsulinModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-bold shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addInsulinSchedule}</span>
            </button>
          </div>

          <SafetyBanner language={language} variant="insulin" />

          <div className="space-y-4">
            {parentInsulin.map((sched) => (
              <div
                key={sched.id}
                className="bg-white rounded-2xl border border-purple-200 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-bold text-xl text-slate-900">{sched.insulinName}</h4>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-900">
                      {sched.scheduledTime}
                    </span>
                  </div>

                  <div className="mt-3 p-3.5 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-1">
                    <p className="font-bold text-purple-900">Prescribed Regimen:</p>
                    <p className="text-sm font-semibold">{sched.prescribedScheduleText}</p>
                    <p className="text-purple-800 pt-1">{sched.instructions}</p>
                    {sched.prescribingDoctor && (
                      <p className="text-slate-500 font-medium pt-1">
                        Prescribing Doctor: {sched.prescribingDoctor}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setInsulinToEdit(sched);
                      setInsulinModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-purple-800 hover:text-purple-900 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Schedule</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Parent History & Notes */}
      {adminTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-teal-700" />
            <span>Medication Logs & Parent Notes ({activeParent.name})</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {medicationLogs
              .filter(l => l.parentId === activeParent.id)
              .slice(0, 25)
              .map((log) => {
                const med = medications.find(m => m.id === log.medicationId);
                return (
                  <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {med ? med.medicineName : 'Medication'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {log.scheduledDate} • {log.scheduledTime}
                        </span>
                      </div>
                      {log.confirmedAt && (
                        <p className="text-xs text-slate-400">
                          Confirmed: {new Date(log.confirmedAt).toLocaleDateString()} at {new Date(log.confirmedAt).toLocaleTimeString()}
                        </p>
                      )}
                      {log.note && (
                        <div className="mt-1 text-xs text-teal-900 bg-teal-50 px-2.5 py-1.5 rounded-lg border border-teal-200 inline-block">
                          <span className="font-bold">Parent Note: </span>"{log.note}"
                        </div>
                      )}
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${
                      log.status === 'taken'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.status === 'skipped'
                        ? 'bg-amber-100 text-amber-800'
                        : log.status === 'unable_to_complete'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Tab 5: Audit Log */}
      {adminTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-700" />
              <span>Immutable System Audit Trail</span>
            </h3>
            <span className="text-xs text-slate-400">
              Captures all caregiver & parent actions
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.slice(0, 30).map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.actorName}</span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{log.summary}</p>
                </div>
                <span className="text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medication Create/Edit Modal */}
      <MedicationModal
        isOpen={medModalOpen}
        parentId={activeParent.id}
        medicationToEdit={medToEdit}
        language={language}
        onSave={onSaveMedication}
        onClose={() => setMedModalOpen(false)}
      />

      {/* Insulin Modal */}
      <InsulinModal
        isOpen={insulinModalOpen}
        parentId={activeParent.id}
        scheduleToEdit={insulinToEdit}
        language={language}
        onSave={onSaveInsulinSchedule}
        onClose={() => setInsulinModalOpen(false)}
      />

      {/* Parent Create/Edit Modal */}
      <ParentModal
        isOpen={parentModalOpen}
        language={language}
        parentToEdit={parentToEdit}
        onSave={onSaveParent}
        onClose={() => setParentModalOpen(false)}
      />

      {/* Photo Enlargement Modal */}
      <PhotoModal
        isOpen={photoPreviewState.isOpen}
        photoUrl={photoPreviewState.photoUrl}
        medicineName={photoPreviewState.medicineName}
        strengthText={photoPreviewState.strengthText}
        language={language}
        onClose={() => setPhotoPreviewState({ ...photoPreviewState, isOpen: false })}
      />

    </div>
  );
};
