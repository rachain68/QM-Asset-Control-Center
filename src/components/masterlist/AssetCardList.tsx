import React from 'react';
import { Asset, User } from '../../types/asset';
import { calculateDepreciation, formatCurrency } from '../../services/depreciation';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { Calculator, History, Edit3, MapPin, Tag, Calendar, UserCheck, Trash2 } from 'lucide-react';

interface AssetCardListProps {
  assets: Asset[];
  currentUser: User;
  onEditAsset: (asset: Asset) => void;
  onOpenDepreciation: (asset: Asset) => void;
  onOpenHistory: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
}

export const AssetCardList: React.FC<AssetCardListProps> = ({
  assets,
  currentUser,
  onEditAsset,
  onOpenDepreciation,
  onOpenHistory,
  onDeleteAsset,
}) => {
  const isEditable = (asset: Asset) => {
    if (currentUser.role === 'Level 2 Admin') return true;
    return asset.owner.toLowerCase().trim() === currentUser.name.toLowerCase().trim();
  };

  if (assets.length === 0) {
    return (
      <div className="glass-panel p-8 text-center bg-white border border-slate-200 rounded-md">
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {assets.map((asset) => {
        const dep = calculateDepreciation(
          asset.amountThb,
          asset.receivedDate,
          asset.usefulLifeYears,
          asset.bookValueThb
        );
        const canEdit = isEditable(asset);

        return (
          <div
            key={asset.id}
            className="glass-panel p-4 bg-white border border-slate-200 rounded-md shadow-xs hover:border-sky-400 transition-all flex flex-col justify-between"
          >
            {/* Top row: Machine Name + Status Badge */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-1.5 flex-wrap">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      #{asset.itemNo}
                    </span>
                    <span className="text-[11px] font-mono text-sky-700 font-semibold">
                      {asset.assetNo}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                    {asset.machineName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {asset.brand} • {asset.model}
                  </p>
                </div>
                <StatusBadge status={asset.status} size="sm" />
              </div>

              {/* Asset Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {asset.plant} / {asset.location}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{asset.owner}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">SN: {asset.serialNo}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    Age: {asset.ageYr} Yrs {asset.ageYr >= 7 ? '(≥7 Yrs)' : ''}
                  </span>
                </div>
              </div>

              {/* Financial telemetry figures */}
              <div className="mt-3 p-2.5 bg-slate-50 rounded border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                    Purchase Cost
                  </span>
                  <span className="font-bold text-slate-800 data-mono">
                    {formatCurrency(asset.amountThb)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                    Current Book Value
                  </span>
                  <span className="font-bold text-emerald-700 data-mono">
                    {formatCurrency(dep.currentBookValueThb)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
              <div className="flex items-center space-x-1">
                <Button
                  variant="action-cyan"
                  size="sm"
                  icon={<Calculator className="w-3.5 h-3.5" />}
                  onClick={() => onOpenDepreciation(asset)}
                >
                  Depreciation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<History className="w-3.5 h-3.5 text-slate-500" />}
                  onClick={() => onOpenHistory(asset)}
                >
                  History
                </Button>
              </div>

              {canEdit && (
                <Button
                  variant="action-purple"
                  size="sm"
                  icon={<Edit3 className="w-3.5 h-3.5" />}
                  onClick={() => onEditAsset(asset)}
                >
                  Edit
                </Button>
              )}
              {currentUser.role === 'Level 2 Admin' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => onDeleteAsset(asset.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
