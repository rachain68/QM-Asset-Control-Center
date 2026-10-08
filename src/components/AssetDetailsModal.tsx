import React from 'react';
import { Asset, User } from '../types/asset';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { StatusBadge } from './common/StatusBadge';
import { calculateDepreciation, formatCurrency } from '../services/depreciation';
import {
  Edit3,
  Trash2,
  Calculator,
  History,
  FileText,
  MapPin,
  Tag,
  Calendar,
  CreditCard,
  Building,
  Monitor,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

interface AssetDetailsModalProps {
  asset: Asset;
  currentUser: User;
  onClose: () => void;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
  onHistory: (asset: Asset) => void;
  onDepreciation: (asset: Asset) => void;
}

export const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({
  asset,
  currentUser,
  onClose,
  onEdit,
  onDelete,
  onHistory,
  onDepreciation
}) => {
  const canEdit = currentUser.role === 'Level 2 Admin' || 
    (asset.location || '').toLowerCase().trim() === (currentUser.location || '').toLowerCase().trim();

  const dep = calculateDepreciation(
    asset.amountThb,
    asset.receivedDate,
    asset.usefulLifeYears,
    asset.bookValueThb
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Asset Details"
      subtitle="ข้อมูลรายละเอียดเชิงลึกของสินทรัพย์"
      icon={<Info className="w-5 h-5 text-sky-700" />}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-slate-50 p-4 rounded-md border border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs px-2 py-0.5 bg-slate-200 text-slate-700 rounded border border-slate-300">
                {asset.machineType}
              </span>
              <StatusBadge status={asset.status} />
              <StatusBadge status={asset.reviewStatus} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              {asset.machineName}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {asset.brand} • {asset.model}
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Asset Number</div>
            <div className="text-xl font-mono font-bold text-sky-700">{asset.assetNo}</div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Identification */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-500" />
              <h4 className="text-xs font-bold text-slate-700 uppercase">Identification</h4>
            </div>
            <div className="p-3 text-sm space-y-2">
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-500">Serial No (SN):</span>
                <span className="font-mono font-medium text-slate-800">{asset.serialNo}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-500">Machine No:</span>
                <span className="font-mono font-medium text-slate-800">{asset.machineNo || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-500">BOI No:</span>
                <span className="font-mono font-medium text-slate-800">{asset.boiNo || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Calibration ID:</span>
                <span className="font-mono font-medium text-slate-800">{asset.calibrationId || '-'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Location & Ownership */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <h4 className="text-xs font-bold text-slate-700 uppercase">Location & Ownership</h4>
            </div>
            <div className="p-3 text-sm space-y-2">
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-500">Owner:</span>
                <span className="font-semibold text-slate-800">{asset.owner}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-500">Plant / Location:</span>
                <span className="font-medium text-slate-800">{asset.plant} - {asset.location}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-500">Floor:</span>
                <span className="font-medium text-slate-800">{asset.floor || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Area:</span>
                <span className="font-medium text-slate-800">{asset.area || '-'}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Purchasing Info */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-500" />
              <h4 className="text-xs font-bold text-slate-700 uppercase">Purchasing Details</h4>
            </div>
            <div className="p-3 text-sm space-y-2">
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-500">Invoice No:</span>
                <span className="font-mono font-medium text-slate-800">{asset.invoiceNo}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-500">Original Cost:</span>
                <span className="font-mono font-medium text-slate-800">
                  {formatCurrency(asset.invCost)} <span className="text-[10px] text-slate-500">{asset.currency}</span>
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-500">Exchange Rate:</span>
                <span className="font-mono font-medium text-slate-800">{asset.exchangeRateToThb} THB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Total Cost (THB):</span>
                <span className="font-mono font-bold text-sky-700">{formatCurrency(asset.amountThb)}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Depreciation */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <h4 className="text-xs font-bold text-slate-700 uppercase">Depreciation</h4>
            </div>
            <div className="p-3 text-sm space-y-2">
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-500">Received Date:</span>
                <span className="font-medium text-slate-800">{asset.receivedDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-500">Useful Life:</span>
                <span className="font-medium text-slate-800">{asset.usefulLifeYears} Years</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-500">Current Age:</span>
                <span className={`font-medium ${asset.ageYr >= 7 ? 'text-red-600' : 'text-slate-800'}`}>
                  {asset.ageYr} Years
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Est. Book Value:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {formatCurrency(dep.currentBookValueThb)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Remark */}
        {asset.remark && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm">
            <span className="font-bold text-amber-800 block mb-1">Remark / Note:</span>
            <p className="text-amber-900/80">{asset.remark}</p>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { onClose(); onHistory(asset); }}>
              <History className="w-4 h-4 mr-2" />
              Audit Log
            </Button>
            <Button variant="outline" onClick={() => { onClose(); onDepreciation(asset); }}>
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Dep.
            </Button>
          </div>

          <div className="flex gap-2">
            {canEdit && (
              <Button variant="action-purple" onClick={() => { onClose(); onEdit(asset); }}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Asset
              </Button>
            )}
            {currentUser.role === 'Level 2 Admin' && (
              <Button 
                className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200"
                onClick={() => { onClose(); onDelete(asset.id); }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
};
