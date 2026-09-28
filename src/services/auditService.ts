import { AuditLog, AuditAction, AuditFieldChange } from '../types/asset';

const AUDIT_STORAGE_KEY = 'qm_asset_audit_logs_v1';

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-03-05 14:30:15',
    assetId: 'ast-005',
    assetName: 'Coordinate Measuring Machine CMM',
    assetNo: 'HM19823',
    action: 'CREATED',
    performedBy: 'CHATCHAI S.',
    performedByRole: 'Level 1 Owner',
    details: 'ลงทะเบียนสินทรัพย์ใหม่จากระบบ Machine Buy-off Web (เข้าสู่ Waiting List Review)',
  },
  {
    id: 'log-102',
    timestamp: '2026-03-01 10:15:00',
    assetId: 'ast-001',
    assetName: 'Micro XRF',
    assetNo: 'HM22063',
    action: 'CREATED',
    performedBy: 'APICHAYA P.',
    performedByRole: 'Level 1 Owner',
    details: 'ดึงข้อมูลสินทรัพย์จากการลงทะเบียนใน QM PM Web',
  },
  {
    id: 'log-103',
    timestamp: '2026-01-10 16:45:22',
    assetId: 'ast-004',
    assetName: 'Vision measuring Machine',
    assetNo: 'HM23373',
    action: 'APPROVED',
    performedBy: 'QM ADMIN (Authorized CAL Team)',
    performedByRole: 'Level 2 Admin',
    details: 'ทบทวนและระบุมูลค่า Book Value (THB) 713,500 THB และย้ายเข้า Master List',
    changes: [
      { field: 'bookValueThb', oldValue: null, newValue: 713500 },
      { field: 'reviewStatus', oldValue: 'Waiting List', newValue: 'Active' },
    ],
  },
  {
    id: 'log-104',
    timestamp: '2025-11-20 09:20:10',
    assetId: 'ast-003',
    assetName: 'Measuring Microscope.1',
    assetNo: 'HM1190',
    action: 'STATUS_CHANGED',
    performedBy: 'JAREE P.',
    performedByRole: 'Level 1 Owner',
    details: 'ปรับเปลี่ยนสภาพเครื่องจาก Good เป็น Fair หลังการตรวจสอบซ่อมบำรุงประจำปี',
    changes: [
      { field: 'status', oldValue: 'Good', newValue: 'Fair' },
    ],
  },
];

export function getAuditLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load audit logs:', err);
    return INITIAL_AUDIT_LOGS;
  }
}

export function saveAuditLogs(logs: AuditLog[]): void {
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save audit logs:', err);
  }
}

export function logActivity(
  assetId: string,
  assetName: string,
  assetNo: string,
  action: AuditAction,
  performedBy: string,
  performedByRole: string,
  details: string,
  changes?: AuditFieldChange[]
): AuditLog {
  const currentLogs = getAuditLogs();
  const now = new Date();
  const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    timestamp: formattedTime,
    assetId,
    assetName,
    assetNo,
    action,
    performedBy,
    performedByRole,
    details,
    changes,
  };

  const updatedLogs = [newLog, ...currentLogs];
  saveAuditLogs(updatedLogs);
  return newLog;
}

export function getAuditLogsForAsset(assetId: string): AuditLog[] {
  const logs = getAuditLogs();
  return logs.filter((l) => l.assetId === assetId);
}
