import express from 'express';
import { getAuditLogs, getAuditLogsForAsset, addAuditLog } from '../controllers/auditController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Apply auth middleware to all audit routes
router.use(authMiddleware);

// @route   GET /api/audit
// @desc    Get all audit logs
router.get('/', getAuditLogs);

// @route   GET /api/audit/asset/:assetId
// @desc    Get audit logs for a specific asset
router.get('/asset/:assetId', getAuditLogsForAsset);

// @route   POST /api/audit
// @desc    Add a new audit log
router.post('/', addAuditLog);

export default router;
