import { Request, Response } from 'express';
import { assetsDb } from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getAssets = async (req: Request, res: Response): Promise<void> => {
  try {
    const [assets]: any = await assetsDb.query('SELECT * FROM assets ORDER BY created_at DESC');
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const asset = req.body;
    
    // We expect the frontend to pass the generated id, or we generate one
    const id = asset.id || `ast-${Date.now()}`;
    
    let receivedDate = asset.receivedDate;
    if (receivedDate && receivedDate.trim() !== '') {
      const d = new Date(receivedDate);
      if (!isNaN(d.getTime())) {
        receivedDate = d.toISOString().slice(0, 10);
      } else {
        receivedDate = null;
      }
    } else {
      receivedDate = null;
    }

    await assetsDb.query(
      `INSERT INTO assets SET ?`,
      [{
        id,
        machineName: asset.machineName,
        brand: asset.brand,
        model: asset.model,
        serialNo: asset.serialNo,
        boiNo: asset.boiNo,
        assetNo: asset.assetNo,
        machineNo: asset.machineNo,
        calibrationId: asset.calibrationId,
        machineType: asset.machineType,
        receivedDate: receivedDate,
        invoiceNo: asset.invoiceNo,
        invCost: asset.invCost,
        currency: asset.currency,
        exchangeRateToThb: asset.exchangeRateToThb,
        amountThb: asset.amountThb,
        owner: asset.owner,
        location: asset.location,
        plant: asset.plant,
        floor: asset.floor,
        area: asset.area,
        bookValueThb: asset.bookValueThb,
        status: asset.status,
        requireYN: asset.requireYN,
        remark: asset.remark,
        reviewStatus: asset.reviewStatus,
        sourceSystem: asset.sourceSystem,
        usefulLifeYears: asset.usefulLifeYears || 7,
      }]
    );

    res.status(201).json({ message: 'Asset added successfully', id });
  } catch (error) {
    console.error('Error adding asset:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const asset = req.body;
    console.log(`Updating asset ${id} with reviewStatus = ${asset.reviewStatus}`);

    let receivedDate = asset.receivedDate;
    if (receivedDate && receivedDate.trim() !== '') {
      // Ensure it's in YYYY-MM-DD format for MySQL DATE column
      const d = new Date(receivedDate);
      if (!isNaN(d.getTime())) {
        receivedDate = d.toISOString().slice(0, 10);
      } else {
        receivedDate = null;
      }
    } else {
      receivedDate = null;
    }
    
    await assetsDb.query(
      `UPDATE assets SET ? WHERE id = ?`,
      [{
        machineName: asset.machineName,
        brand: asset.brand,
        model: asset.model,
        serialNo: asset.serialNo,
        boiNo: asset.boiNo,
        assetNo: asset.assetNo,
        machineNo: asset.machineNo,
        calibrationId: asset.calibrationId,
        machineType: asset.machineType,
        receivedDate: receivedDate,
        invoiceNo: asset.invoiceNo,
        invCost: asset.invCost,
        currency: asset.currency,
        exchangeRateToThb: asset.exchangeRateToThb,
        amountThb: asset.amountThb,
        owner: asset.owner,
        location: asset.location,
        plant: asset.plant,
        floor: asset.floor,
        area: asset.area,
        bookValueThb: asset.bookValueThb,
        status: asset.status,
        requireYN: asset.requireYN,
        remark: asset.remark,
        reviewStatus: asset.reviewStatus,
        sourceSystem: asset.sourceSystem,
        usefulLifeYears: asset.usefulLifeYears || 7,
      }, id]
    );

    res.json({ message: 'Asset updated successfully' });
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

import ExcelJS from 'exceljs';

export const exportExcel = async (req: Request, res: Response): Promise<void> => {
  try {
    const [assets]: any = await assetsDb.query('SELECT * FROM assets ORDER BY created_at DESC');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Master List');

    // Define columns based on requirements (without ITEM and Edit)
    worksheet.columns = [
      { header: 'Machine Name', key: 'machineName', width: 30 },
      { header: 'Brand', key: 'brand', width: 15 },
      { header: 'Model', key: 'model', width: 15 },
      { header: 'Serial No.', key: 'serialNo', width: 20 },
      { header: 'BOI No.', key: 'boiNo', width: 15 },
      { header: 'Asset No.', key: 'assetNo', width: 20 },
      { header: 'Machine No.', key: 'machineNo', width: 15 },
      { header: 'Calibration ID', key: 'calibrationId', width: 15 },
      { header: 'Machine Type', key: 'machineType', width: 20 },
      { header: 'Received Date', key: 'receivedDate', width: 15 },
      { header: 'AGE (YR)', key: 'ageYr', width: 10 },
      { header: 'Invoice No.', key: 'invoiceNo', width: 15 },
      { header: 'INV. COST', key: 'invCost', width: 15 },
      { header: 'Currency', key: 'currency', width: 10 },
      { header: 'AMOUNT (THB)', key: 'amountThb', width: 15 },
      { header: 'Owner', key: 'owner', width: 15 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Plant', key: 'plant', width: 15 },
      { header: 'Floor', key: 'floor', width: 15 },
      { header: 'Area', key: 'area', width: 15 },
      { header: 'Book Value (THB)', key: 'bookValueThb', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Require (Y/N)', key: 'requireYN', width: 15 },
      { header: 'REMARK', key: 'remark', width: 20 }
    ];

    // Add styling to header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF006194' } };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Add rows
    assets.forEach((asset: any) => {
      // Calculate age if possible
      let age = 0;
      if (asset.receivedDate) {
        const received = new Date(asset.receivedDate);
        const diff = Date.now() - received.getTime();
        age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      }
      
      worksheet.addRow({
        machineName: asset.machineName,
        brand: asset.brand,
        model: asset.model,
        serialNo: asset.serialNo,
        boiNo: asset.boiNo,
        assetNo: asset.assetNo,
        machineNo: asset.machineNo,
        calibrationId: asset.calibrationId,
        machineType: asset.machineType,
        receivedDate: asset.receivedDate ? new Date(asset.receivedDate).toISOString().slice(0, 10) : '',
        ageYr: age > 0 ? age : '',
        invoiceNo: asset.invoiceNo,
        invCost: asset.invCost,
        currency: asset.currency,
        amountThb: asset.amountThb,
        owner: asset.owner,
        location: asset.location,
        plant: asset.plant,
        floor: asset.floor,
        area: asset.area,
        bookValueThb: asset.bookValueThb,
        status: asset.status,
        requireYN: asset.requireYN,
        remark: asset.remark
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const date = new Date().toISOString().slice(0,10).replace(/-/g, ''); // YYYYMMDD
    res.setHeader('Content-Disposition', `attachment; filename=QM_Asset_Master_List_${date}.xlsx`);

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error('Error exporting excel:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

import { parse } from 'csv-parse/sync';

export const importExcel = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const rows: any[] = [];
    const isCsv = req.file.originalname.toLowerCase().endsWith('.csv') || req.file.mimetype === 'text/csv';

    const parseAsCsv = () => {
      const fileContent = req.file!.buffer.toString('utf-8');
      const records = parse(fileContent, { skip_empty_lines: true });
      for (let i = 1; i < records.length; i++) {
        rows.push([undefined, ...records[i]]);
      }
    };

    const parseAsXlsx = async () => {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(req.file!.buffer as any);
      const worksheet = workbook.worksheets[0];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) rows.push(row.values);
      });
    };

    try {
      if (isCsv) {
        parseAsCsv();
      } else {
        await parseAsXlsx();
      }
    } catch (err) {
      console.log('Parsing failed with primary method, trying fallback...', err);
      rows.length = 0; // reset
      try {
        if (isCsv) await parseAsXlsx();
        else parseAsCsv();
      } catch (fallbackErr) {
        throw new Error('Invalid file format. Cannot parse as XLSX or CSV.');
      }
    }

    let importedCount = 0;
    
    for (const row of rows) {
      // Mapping based on requirements (1-indexed array from exceljs) without ITEM and Edit
      // 1: Machine Name, 2: Brand, 3: Model, 4: Serial No, 5: BOI No, 6: Asset No, 7: Machine No,
      // 8: Calibration ID, 9: Machine Type, 10: Received Date, 11: AGE, 12: Invoice No, 13: INV COST,
      // 14: Currency, 15: AMOUNT THB, 16: Owner, 17: Location, 18: Plant, 19: Floor, 20: Area,
      // 21: Book Value THB, 22: Status, 23: Require Y/N, 24: REMARK
      const asset_no = row[6]?.toString().trim();
      const machineName = row[1]?.toString().trim();
      
      if (!asset_no || !machineName) continue;

      const [existing]: any = await assetsDb.query('SELECT id FROM assets WHERE assetNo = ?', [asset_no]);

      let receivedDate = null;
      if (row[10]) {
        // Handle excel dates or strings
        receivedDate = new Date(row[10]);
        if (isNaN(receivedDate.getTime())) receivedDate = null;
      }

      const assetData = {
        assetNo: asset_no,
        machineName: machineName,
        brand: row[2]?.toString() || '',
        model: row[3]?.toString() || '',
        serialNo: row[4]?.toString() || '',
        boiNo: row[5]?.toString() || '',
        machineNo: row[7]?.toString() || '',
        calibrationId: row[8]?.toString() || '',
        machineType: row[9]?.toString() || '',
        receivedDate: receivedDate,
        invoiceNo: row[12]?.toString() || '',
        invCost: parseFloat(row[13]) || 0,
        currency: row[14]?.toString() || 'THB',
        amountThb: parseFloat(row[15]) || 0,
        owner: row[16]?.toString() || req.user?.username || req.user?.employee_id || 'System',
        location: row[17]?.toString() || '',
        plant: row[18]?.toString() || '',
        floor: row[19]?.toString() || '',
        area: row[20]?.toString() || '',
        bookValueThb: parseFloat(row[21]) || 0,
        status: row[22]?.toString() || 'Good',
        requireYN: row[23]?.toString() || 'Y',
        remark: row[24]?.toString() || '',
        reviewStatus: 'Waiting List',
      };

      if (existing.length > 0) {
        await assetsDb.query(`UPDATE assets SET ? WHERE assetNo = ?`, [assetData, asset_no]);
      } else {
        const id = `ast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        await assetsDb.query(`INSERT INTO assets SET ?`, [{
          id,
          ...assetData
        }]);
      }
      importedCount++;
    }

    res.json({ message: 'Assets imported successfully', count: importedCount });
  } catch (error: any) {
    console.error('Error importing excel:', error);
    res.status(500).json({ message: 'Server error: ' + (error.message || 'Unknown error') });
  }
};


export const deleteAsset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Level 2 Admin check (if needed, though frontend also hides it)
    if (req.user?.role_id !== 2) {
      res.status(403).json({ message: 'Forbidden. Only Level 2 Admin can delete assets.' });
      return;
    }

    const [result]: any = await assetsDb.query('DELETE FROM assets WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Asset not found' });
      return;
    }

    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
