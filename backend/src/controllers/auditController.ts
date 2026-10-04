import { Request, Response } from 'express';
import { assetsDb } from '../config/db';

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const [logs]: any = await assetsDb.query('SELECT * FROM audit_logs ORDER BY timestamp DESC');
    res.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAuditLogsForAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assetId } = req.params;
    const [logs]: any = await assetsDb.query(
      'SELECT * FROM audit_logs WHERE assetId = ? ORDER BY timestamp DESC',
      [assetId]
    );
    res.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs for asset:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addAuditLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const log = req.body;
    const id = log.id || `log-${Date.now()}`;
    
    // Ensure changes is a stringified JSON if it exists
    let changesStr = null;
    if (log.changes) {
      changesStr = typeof log.changes === 'string' ? log.changes : JSON.stringify(log.changes);
    }

    await assetsDb.query(
      `INSERT INTO audit_logs 
        (id, assetId, assetName, assetNo, action, performedBy, performedByRole, details, changes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        log.assetId || null,
        log.assetName || null,
        log.assetNo || null,
        log.action,
        log.performedBy || null,
        log.performedByRole || null,
        log.details || null,
        changesStr
      ]
    );

    res.status(201).json({ message: 'Audit log created successfully', id });
  } catch (error) {
    console.error('Error adding audit log:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
