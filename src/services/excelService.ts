import * as XLSX from 'xlsx';
import { Asset, MachineType, AssetStatus, Currency } from '../types/asset';
import { calculateAgeInYears, convertToThb, calculateDepreciation, formatCurrency } from './depreciation';

/**
 * Export assets array to an formatted Excel (.xlsx) file matching QM Master list structure
 */
export function exportAssetsToExcel(assets: Asset[], fileName: string = 'QM_Asset_Master_List.xlsx'): void {
  const exportData = assets.map((a) => {
    const dep = calculateDepreciation(a.amountThb, a.receivedDate, a.usefulLifeYears, a.bookValueThb);

    return {
      'ITEM': a.itemNo,
      'Machine Name': a.machineName,
      'Brand': a.brand,
      'Model': a.model,
      'Serial No.': a.serialNo,
      'BOI No.': a.boiNo,
      'Asset No.': a.assetNo,
      'Machine No.': a.machineNo,
      'Calibration ID': a.calibrationId,
      'Machine Type': a.machineType,
      'Received Date': a.receivedDate,
      'AGE (YR)': a.ageYr,
      'Invoice No.': a.invoiceNo,
      'INV. COST': a.invCost,
      'CURRENCY': a.currency,
      'AMOUNT (THB)': a.amountThb,
      'Owner': a.owner,
      'Location': a.location,
      'Plant': a.plant,
      'Floor': a.floor,
      'Area': a.area,
      'Book Value (THB)': a.bookValueThb !== null ? a.bookValueThb : dep.currentBookValueThb,
      'Status': a.status,
      'Require (Y/N)': a.requireYN,
      'REMARK': a.remark,
      'Review Status': a.reviewStatus,
      'Source System': a.sourceSystem,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'QM Asset Master List');

  // Trigger file download
  XLSX.writeFile(workbook, fileName);
}

/**
 * Parse an uploaded Excel (.xlsx, .xls, .csv) file and return Asset objects
 */
export function importAssetsFromExcel(file: File): Promise<Omit<Asset, 'id' | 'itemNo'>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

        const importedAssets: Omit<Asset, 'id' | 'itemNo'>[] = rawJson.map((row) => {
          const machineName = row['Machine Name'] || row['machineName'] || 'Unnamed Machine';
          const brand = row['Brand'] || row['brand'] || 'N/A';
          const model = row['Model'] || row['model'] || 'N/A';
          const serialNo = String(row['Serial No.'] || row['serialNo'] || 'N/A');
          const boiNo = String(row['BOI No.'] || row['boiNo'] || 'N/A');
          const assetNo = String(row['Asset No.'] || row['assetNo'] || 'N/A');
          const machineNo = String(row['Machine No.'] || row['machineNo'] || 'N/A');
          const calibrationId = String(row['Calibration ID'] || row['calibrationId'] || 'N/A');
          const machineType = (row['Machine Type'] || 'Analysis Equipment') as MachineType;
          const receivedDate = row['Received Date'] ? String(row['Received Date']) : new Date().toISOString().split('T')[0];
          const invoiceNo = String(row['Invoice No.'] || 'N/A');
          const invCost = parseFloat(row['INV. COST'] || row['invCost'] || '0') || 0;
          const currency = (row['CURRENCY'] || row['currency'] || 'THB') as Currency;
          const owner = row['Owner'] || row['owner'] || 'QM Staff';
          const location = row['Location'] || row['location'] || 'FA Lab';
          const plant = row['Plant'] || row['plant'] || 'FA';
          const floor = String(row['Floor'] || '1');
          const area = String(row['Area'] || 'Main');
          const bookValueThb = row['Book Value (THB)'] !== undefined && row['Book Value (THB)'] !== null ? parseFloat(row['Book Value (THB)']) : null;
          const status = (row['Status'] || 'Good') as AssetStatus;
          const requireYN = (row['Require (Y/N)'] || 'Y') as 'Y' | 'N';
          const remark = row['REMARK'] || row['remark'] || 'Imported via Excel';

          const rate = currency === 'USD' ? 34.5 : currency === 'EUR' ? 37.2 : currency === 'JPY' ? 0.23 : 1.0;
          const amountThb = convertToThb(invCost, currency, rate);
          const ageYr = calculateAgeInYears(receivedDate);

          return {
            machineName,
            brand,
            model,
            serialNo,
            boiNo,
            assetNo,
            machineNo,
            calibrationId,
            machineType,
            receivedDate,
            ageYr,
            invoiceNo,
            invCost,
            currency,
            exchangeRateToThb: rate,
            amountThb,
            owner,
            location,
            plant,
            floor,
            area,
            bookValueThb,
            status,
            requireYN,
            remark,
            reviewStatus: bookValueThb !== null ? 'Active' : 'Waiting List',
            sourceSystem: 'Manual Fill up',
            lastUpdated: new Date().toISOString().split('T')[0],
            usefulLifeYears: 7,
          };
        });

        resolve(importedAssets);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Generate printable PDF report window for QM Asset Control Center
 */
export function generatePdfReport(assets: Asset[], title: string = 'QM Asset Control Master Report'): void {
  const activeAssets = assets.filter((a) => a.reviewStatus === 'Active');
  const totalPurchaseCost = assets.reduce((sum, a) => sum + a.amountThb, 0);

  const totalBookValue = assets.reduce((sum, a) => {
    const dep = calculateDepreciation(a.amountThb, a.receivedDate, a.usefulLifeYears, a.bookValueThb);
    return sum + dep.currentBookValueThb;
  }, 0);

  const rowsHtml = assets
    .map(
      (a, index) => `
    <tr>
      <td style="text-align: center;">${index + 1}</td>
      <td><strong>${a.machineName}</strong><br><small style="color: #64748b;">${a.brand} ${a.model}</small></td>
      <td>${a.assetNo}<br><small style="color: #64748b;">SN: ${a.serialNo}</small></td>
      <td>${a.machineType}</td>
      <td>${a.receivedDate} (${a.ageYr} Yrs)</td>
      <td>${a.owner}</td>
      <td>${a.plant} - ${a.location}</td>
      <td style="text-align: right; font-weight: bold;">${formatCurrency(a.amountThb)}</td>
      <td style="text-align: right; font-weight: bold; color: #059669;">${a.bookValueThb !== null ? formatCurrency(a.bookValueThb) : 'Pending CAL'}</td>
      <td style="text-align: center;"><span style="padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; background: #e0f2fe; color: #0369a1;">${a.status}</span></td>
    </tr>
  `
    )
    .join('');

  const reportWindow = window.open('', '_blank');
  if (!reportWindow) {
    alert('โปรดอนุญาตให้เปิด Pop-up เพื่อพิมพ์เอกสาร PDF');
    return;
  }

  const reportContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Prompt', sans-serif; padding: 25px; color: #1e293b; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
        .title { font-size: 20px; font-weight: 700; color: #0f172a; }
        .subtitle { font-size: 12px; color: #2563eb; font-weight: 600; text-transform: uppercase; }
        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
        .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; }
        .kpi-label { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; }
        .kpi-val { font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px; }
        th { background: #0f172a; color: #fff; text-align: left; padding: 10px 8px; font-size: 11px; text-transform: uppercase; }
        td { border-bottom: 1px solid #e2e8f0; padding: 10px 8px; }
        tr:nth-child(even) { background: #f8fafc; }
        .signatures { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; margin-top: 40px; page-break-inside: avoid; }
        .sig-box { text-align: center; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="subtitle">Hana Microelectronics Public Co., Ltd. (Lamphun)</div>
          <div class="title">${title}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">QM Department • Asset Control System Report</div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #64748b;">
          Date Generated: ${new Date().toLocaleDateString('th-TH')}<br>
          Generated By: System Administrator
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Total Assets</div>
          <div class="kpi-val">${assets.length} Items</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Active Items</div>
          <div class="kpi-val">${activeAssets.length} Items</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Total Purchase Cost</div>
          <div class="kpi-val" style="color: #2563eb;">${formatCurrency(totalPurchaseCost)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Current Book Value</div>
          <div class="kpi-val" style="color: #059669;">${formatCurrency(totalBookValue)}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;">No</th>
            <th>Machine Name & Model</th>
            <th>Asset No & Serial</th>
            <th>Type</th>
            <th>Received (Age)</th>
            <th>Owner</th>
            <th>Location</th>
            <th style="text-align: right;">Cost (THB)</th>
            <th style="text-align: right;">Book Value (THB)</th>
            <th style="text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="signatures">
        <div class="sig-box">
          <br><br>
          ________________________________________<br>
          <strong>( Authorized CAL / Admin Team )</strong><br>
          Date: _____ / _____ / ________
        </div>
        <div class="sig-box">
          <br><br>
          ________________________________________<br>
          <strong>( QM Department Head )</strong><br>
          Date: _____ / _____ / ________
        </div>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  reportWindow.document.write(reportContent);
  reportWindow.document.close();
}
