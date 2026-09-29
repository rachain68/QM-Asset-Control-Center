import React from 'react';
import { Asset, User } from '../../types/asset';
import { calculateDepreciation, formatCurrency } from '../../services/depreciation';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { Calculator, History, Edit3 } from 'lucide-react';

interface AssetTableProps {
  assets: Asset[];
  currentUser: User;
  onEditAsset: (asset: Asset) => void;
  onOpenDepreciation: (asset: Asset) => void;
  onOpenHistory: (asset: Asset) => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  currentUser,
  onEditAsset,
  onOpenDepreciation,
  onOpenHistory,
}) => {
  const isEditable = (asset: Asset) => {
    if (currentUser.role === 'Level 2 Admin') return true;
    return (asset.owner || '').toLowerCase().trim() === (currentUser.name || '').toLowerCase().trim();
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
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left border-collapse custom-table">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider w-12 text-center">
              #
            </th>
            <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Asset Details / Serial No.
            </th>
            <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Type / Category
            </th>
            <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Plant / Location
            </th>
            <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Owner / Dept
            </th>
            <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Status
            </th>
            <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center">
              Age (Yrs)
            </th>
            <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-right">
              Purchase Cost
            </th>
            <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-right">
              Current Book Value
            </th>
            <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {assets.map((asset, index) => {
            const dep = calculateDepreciation(
              asset.amountThb,
              asset.receivedDate,
              asset.usefulLifeYears,
              asset.bookValueThb
            );
            const canEdit = isEditable(asset);

            return (
              <tr
                key={asset.id}
                className="hover:bg-slate-50/80 transition-colors duration-100 group"
              >
                {/* Index No */}
                <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                  {index + 1}
                </td>

                {/* Machine Name & Serial */}
                <td className="py-2.5 px-3">
                  <div className="font-bold text-slate-900 leading-tight">
                    {asset.machineName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1 font-mono">
                    <span className="text-sky-700 font-semibold">{asset.assetNo}</span>
                    <span>•</span>
                    <span className="text-slate-600">{asset.brand}</span>
                    <span>({asset.model})</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    SN: {asset.serialNo}
                  </div>
                </td>

                {/* Machine Type */}
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {asset.machineType}
                  </span>
                </td>

                {/* Location */}
                <td className="py-2.5 px-3">
                  <div className="font-semibold text-slate-800">{asset.plant}</div>
                  <div className="text-[11px] text-slate-500">{asset.location}</div>
                </td>

                {/* Owner */}
                <td className="py-2.5 px-3">
                  <div className="font-medium text-slate-800">{asset.owner}</div>
                  <div className="text-[11px] text-slate-500">{asset.area}</div>
                </td>

                {/* Status Badge */}
                <td className="py-2.5 px-3">
                  <StatusBadge status={asset.status} size="sm" />
                </td>

                {/* Age */}
                <td className="py-2.5 px-3 text-center font-mono">
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded font-semibold ${
                      asset.ageYr >= 7
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'text-slate-700'
                    }`}
                  >
                    {asset.ageYr} Yrs
                  </span>
                </td>

                {/* Purchase Cost */}
                <td className="py-2.5 px-3 text-right font-mono text-slate-800">
                  {formatCurrency(asset.amountThb)}
                </td>

                {/* Book Value */}
                <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                  {formatCurrency(dep.currentBookValueThb)}
                </td>

                {/* Actions */}
                <td className="py-2.5 px-3 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="action-cyan"
                      size="sm"
                      title="Calculate Depreciation"
                      icon={<Calculator className="w-3.5 h-3.5" />}
                      onClick={() => onOpenDepreciation(asset)}
                    >
                      Calc
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      title="View Audit Log History"
                      icon={<History className="w-3.5 h-3.5 text-slate-500" />}
                      onClick={() => onOpenHistory(asset)}
                    />

                    {canEdit && (
                      <Button
                        variant="action-purple"
                        size="sm"
                        title="Edit Asset Details"
                        icon={<Edit3 className="w-3.5 h-3.5" />}
                        onClick={() => onEditAsset(asset)}
                      />
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
