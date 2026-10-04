import express from 'express';
import { getAssets, addAsset, updateAsset, exportExcel, importExcel, deleteAsset } from '../controllers/assetController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Apply auth middleware to all asset routes
router.use(authMiddleware);

// @route   GET /api/assets
// @desc    Get all assets
router.get('/', getAssets);

// @route   POST /api/assets
// @desc    Add a new asset
router.post('/', addAsset);

import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

// @route   GET /api/assets/export
// @desc    Export assets to Excel
router.get('/export', exportExcel);

// @route   POST /api/assets/import
// @desc    Import assets from Excel
router.post('/import', upload.single('file'), importExcel);

// @route   PUT /api/assets/:id
// @desc    Update an asset
router.put('/:id', updateAsset);

// @route   DELETE /api/assets/:id
// @desc    Delete an asset
router.delete('/:id', deleteAsset);

export default router;
