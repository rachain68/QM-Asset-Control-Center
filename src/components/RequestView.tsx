import React from 'react';
import { Asset, User } from '../types/asset';
import { PlusCircle, Edit3, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from './common/Button';
import { formatCurrency } from '../services/depreciation';

interface RequestViewProps {
  assets: Asset[];
  currentUser: User;
  onOpenAddModal: () => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
}

export const RequestView: React.FC<RequestViewProps> = ({
  assets,
  currentUser,
  onOpenAddModal,
  onEditAsset,
  onDeleteAsset,
}) => {
  // Filter for requests owned by current user (if Level 1)
  const userAssets = currentUser.role === 'Level 1 Owner'
    ? assets.filter(a => {
        const isSameLocation = a.location === currentUser.location;
        const isRequester = a.requester && (a.requester === currentUser.name || currentUser.name.includes(a.requester));
        const isOwner = a.owner === currentUser.name;
        return isSameLocation || (isRequester && a.requester !== 'Unknown') || isOwner;
      })
    : assets;

  // Only show Waiting List and Rejected
  const requests = userAssets.filter(
    (a) => a.reviewStatus === 'Waiting List' || a.reviewStatus === 'Rejected'
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-md border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            My Requests
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#006194] text-white">
              {requests.length}
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            รายการคำขอลงทะเบียนสินทรัพย์ที่กำลังรอการพิจารณา หรือถูกส่งกลับให้แก้ไข
          </p>
        </div>
        <Button variant="primary" size="md" icon={<PlusCircle className="w-4 h-4" />} onClick={onOpenAddModal}>
          Add New Asset
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse custom-table">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center w-16">
                Action
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Machine Name
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Serial / Asset No
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Requester
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-right">
                Cost (THB)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                  ไม่มีรายการคำขอในขณะนี้
                </td>
              </tr>
            ) : (
              requests.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEditAsset(asset)}
                        className="text-slate-400 hover:text-sky-600 transition"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${asset.machineName}?`)) {
                            onDeleteAsset(asset.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    {asset.reviewStatus === 'Waiting List' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3 mr-1" /> Waiting
                      </span>
                    ) : (
                      <div className="flex flex-col">
                        <span className="inline-flex items-center w-max px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3 h-3 mr-1" /> Rejected
                        </span>
                        {asset.remark && (
                          <span className="text-[10px] text-rose-600 mt-1 max-w-[150px] truncate" title={asset.remark}>
                            Reason: {asset.remark}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900 leading-tight">
                      {asset.machineName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {asset.brand} • {asset.model}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-mono text-sky-700 font-bold">{asset.assetNo}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      SN: {asset.serialNo}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-800">{asset.requester || asset.owner}</div>
                    <div className="text-[11px] text-slate-500">{asset.plant} - {asset.location}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-800 font-semibold">
                    {formatCurrency(asset.amountThb)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
