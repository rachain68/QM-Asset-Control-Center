import React, { useState, useEffect, useRef } from 'react';
import { Asset, User } from '../../types/asset';
import { calculateDepreciation, formatCurrency } from '../../services/depreciation';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { Calculator, History, Edit3, Trash2, MoreVertical } from 'lucide-react';

interface AssetTableProps {
  assets: Asset[];
  currentUser: User;
  onEditAsset: (asset: Asset) => void;
  onOpenDepreciation: (asset: Asset) => void;
  onOpenHistory: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  currentUser,
  onEditAsset,
  onOpenDepreciation,
  onOpenHistory,
  onDeleteAsset,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isEditable = (asset: Asset) => {
    if (currentUser.role === 'Level 2 Admin') return true;
    return (asset.location || '').toLowerCase().trim() === (currentUser.location || '').toLowerCase().trim();
  };

  if (assets.length === 0) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-md">
        <p className="text-sm font-semibold text-slate-600">
          ไม่พบรายการสินทรัพย์ที่ตรงกับเงื่อนไขการค้นหา
        </p>
        <p className="text-xs text-slate-400 mt-1">
          ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองใหม่อีกครั้ง
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-xs max-h-[70vh]">
      <table className="w-full text-left border-collapse custom-table table-auto text-xs">
        <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
          <tr className="border-b border-slate-200">
            <th className="py-2.5 px-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider text-center border-r border-slate-200 w-8">#</th>
            <th className="py-2.5 px-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Machine / Details</th>
            <th className="py-2.5 px-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Identification</th>
            <th className="py-2.5 px-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Owner & Location</th>
            <th className="py-2.5 px-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200 text-center">Received & Age</th>
            <th className="py-2.5 px-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Purchasing</th>
            <th className="py-2.5 px-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider text-right border-r border-slate-200">AMOUNT (THB)</th>
            <th className="py-2.5 px-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider text-right border-r border-slate-200">Book Value (THB)</th>
            <th className="py-2.5 px-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200 text-center">Req.</th>
            <th className="py-2.5 px-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">REMARK</th>
            <th className="py-2.5 px-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider text-center bg-slate-100 sticky right-0 w-16">Actions</th>
          </tr>
        </thead>
        <tbody ref={dropdownRef} className="divide-y divide-slate-100 text-[11px]">
          {assets.map((asset, index) => {
            const dep = calculateDepreciation(
              asset.amountThb,
              asset.receivedDate,
              asset.usefulLifeYears,
              asset.bookValueThb
            );
            const canEdit = isEditable(asset);

            return (
              <tr key={asset.id} className="group hover:bg-sky-50/50 transition-colors duration-75">
                <td className="py-2 px-2 text-center text-slate-400 font-mono border-r border-slate-100 align-top">{index + 1}</td>
                
                {/* Group 1: Machine Name, Brand, Model, Serial No, Status */}
                <td className="py-2 px-2 border-r border-slate-100 align-top min-w-[140px]">
                  <div className="flex items-start justify-between gap-1">
                    <div className="font-bold text-slate-900 leading-tight whitespace-normal break-words">{asset.machineName}</div>
                    <div className="shrink-0"><StatusBadge status={asset.status} size="sm" /></div>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1 whitespace-normal break-words space-y-0.5">
                    <div><span className="text-slate-400 font-medium">Brand :</span> {asset.brand}</div>
                    <div><span className="text-slate-400 font-medium">Model :</span> {asset.model}</div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5 whitespace-nowrap">
                    SN: {asset.serialNo}
                  </div>
                </td>

                {/* Group 2: Calibration ID, Asset No., BOI No. */}
                <td className="py-2 px-2 border-r border-slate-100 align-top whitespace-nowrap">
                  <div className="font-mono text-sky-700 font-bold" title="Asset No.">{asset.assetNo}</div>
                  <div className="text-[10px] text-slate-600 font-mono mt-0.5" title="Calibration ID">
                    CAL: {asset.calibrationId}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5" title="BOI No.">
                    BOI: {asset.boiNo}
                  </div>
                </td>

                {/* Group 4: Owner, Location, Plant */}
                <td className="py-2 px-2 border-r border-slate-100 align-top min-w-[120px]">
                  <div className="font-semibold text-slate-800 whitespace-normal break-words">{asset.owner}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5 whitespace-normal break-words">{asset.location}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Plant: {asset.plant}</div>
                </td>

                {/* Group 5: Received Date & Age */}
                <td className="py-2 px-2 text-center border-r border-slate-100 align-top whitespace-nowrap">
                  <div className="text-slate-700 font-mono">
                    {asset.receivedDate ? new Date(asset.receivedDate).toLocaleDateString('en-GB') : '-'}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${asset.ageYr >= 7 ? 'bg-amber-100 text-amber-800' : 'text-slate-700 bg-slate-100'}`}>
                      {asset.ageYr} Yrs
                    </span>
                  </div>
                </td>

                {/* Group 3: Invoice No., Currency */}
                <td className="py-2 px-2 border-r border-slate-100 align-top whitespace-nowrap">
                  <div className="font-mono text-slate-700">{asset.invoiceNo}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-semibold">Cur: {asset.currency}</div>
                </td>

                {/* AMOUNT (THB) */}
                <td className="py-2 px-2 text-right font-mono text-slate-800 border-r border-slate-100 align-top whitespace-nowrap">
                  {formatCurrency(asset.amountThb)}
                </td>

                {/* Book Value (THB) */}
                <td className="py-2 px-2 text-right font-mono font-bold text-emerald-700 bg-emerald-50/30 border-r border-slate-100 align-top whitespace-nowrap">
                  {formatCurrency(dep.currentBookValueThb)}
                </td>

                {/* Require (Y/N) */}
                <td className="py-2 px-2 text-center font-semibold border-r border-slate-100 text-slate-700 align-top">
                  {asset.requireYN}
                </td>

                {/* REMARK */}
                <td className="py-2 px-2 text-slate-600 text-[10px] min-w-[100px] whitespace-normal break-words border-r border-slate-100 align-top">
                  {asset.remark}
                </td>

                {/* Actions (Show on Hover) */}
                <td className="py-2 px-1 text-center bg-white sticky right-0 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] border-l border-slate-200 align-middle">
                  <div className="grid grid-cols-2 gap-1 w-max mx-auto opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                    <Button variant="action-cyan" size="sm" className="px-1.5 py-1" title="Calculate Depreciation" onClick={() => onOpenDepreciation(asset)}>
                      <Calculator className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="px-1.5 py-1" title="View Audit Log History" onClick={() => onOpenHistory(asset)}>
                      <History className="w-3.5 h-3.5 text-slate-500" />
                    </Button>
                    {canEdit && (
                      <Button variant="action-purple" size="sm" className="px-1.5 py-1" title="Edit Asset Details" onClick={() => onEditAsset(asset)}>
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    {currentUser.role === 'Level 2 Admin' && (
                      <Button variant="outline" size="sm" className="px-1.5 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200" title="Delete Asset" onClick={() => onDeleteAsset(asset.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
