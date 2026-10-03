import { AuditLog, AuditAction, AuditFieldChange } from '../types/asset';
import api from '../api';

export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    const response = await api.get('/audit');
    return response.data;
  } catch (err) {
    console.error('Failed to load audit logs:', err);
    return [];
  }
}

export async function logActivity(
  assetId: string,
  assetName: string,
  assetNo: string,
  action: AuditAction,
  performedBy: string,
  performedByRole: string,
  details: string,
  changes?: AuditFieldChange[]
): Promise<AuditLog | null> {
  const newLog = {
    assetId,
    assetName,
    assetNo,
    action,
    performedBy,
    performedByRole,
    details,
    changes,
  };

  try {
    const response = await api.post('/audit', newLog);
    return { ...newLog, id: response.data.id, timestamp: new Date().toISOString() } as AuditLog;
  } catch (err) {
    console.error('Failed to save audit log:', err);
    return null;
  }
}

export async function getAuditLogsForAsset(assetId: string): Promise<AuditLog[]> {
  try {
    const response = await api.get(`/audit/asset/${assetId}`);
    return response.data;
  } catch (err) {
    console.error(`Failed to load audit logs for asset ${assetId}:`, err);
    return [];
  }
}
