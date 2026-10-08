import React, { useState } from 'react';
import { Asset, User } from '../types/asset';
import { calculateDepreciation, formatCurrency } from '../services/depreciation';
import { Clock, CheckCircle, ExternalLink, ShieldCheck, Tag, MapPin, UserCheck, Calendar } from 'lucide-react';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { StatusBadge } from './common/StatusBadge';

interface WaitingListReviewViewProps {
  assets: Asset[];
  currentUser: User;
  onApproveAsset: (id: string, bookValueThb: number) => void;
  onRejectAsset: (id: string, reason: string) => void;
}

export const WaitingListReviewView: React.FC<WaitingListReviewViewProps> = ({
  assets,
  currentUser,
  onApproveAsset,
  onRejectAsset,
}) => {
  const waitingAssets = assets.filter((a) => a.reviewStatus === 'Waiting List');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedAssetForReview, setSelectedAssetForReview] = useState<Asset | null>(null);
  const [inputBookValue, setInputBookValue] = useState<string>('');
  const [rejectReason, setRejectReason] = useState<string>('');

  const filteredWaiting = waitingAssets.filter((a) => {
    if (selectedSource === 'ALL') return true;
    return a.sourceSystem === selectedSource;
  });

  const handleOpenReviewModal = (asset: Asset) => {
    setRejectReason('');
    setSelectedAssetForReview(asset);
    const dep = calculateDepreciation(asset.amountThb, asset.receivedDate, asset.usefulLifeYears);
    setInputBookValue(
      asset.bookValueThb !== null
        ? asset.bookValueThb.toString()
        : dep.currentBookValueThb.toString()
    );
  };

  
  const handleReject = () => {
    if (!selectedAssetForReview) return;
    if (!rejectReason.trim()) {
      alert('กรุณาระบุเหตุผลที่ไม่อนุมัติ (Reject Reason)');
      return;
    }
    onRejectAsset(selectedAssetForReview.id, rejectReason.trim());
    setSelectedAssetForReview(null);
  };

  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetForReview) return;
    const val = parseFloat(inputBookValue);
    if (isNaN(val) || val < 0) {
      alert('กรุณากรอก Book Value (THB) เป็นตัวเลขที่ถูกต้อง');
      return;
    }
    onApproveAsset(selectedAssetForReview.id, val);
    setSelectedAssetForReview(null);
  };

  return (
    <div className="space-y-4">
      {/* Header Notice Banner */}
      <div className="glass-panel p-4 sm:p-6 bg-gradient-to-r from-sky-50/90 via-slate-50/70 to-white border border-slate-200 rounded-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#006194]" />
              <span className="text-[11px] font-bold text-[#006194] uppercase tracking-wider">
                CAL Review Workflow
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Waiting List Review (รายการรอดำเนินการทบทวน)
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              รายการลงทะเบียนสินทรัพย์ใหม่จากระบบออนไลน์ (QM PM Web, Hana Equipment Web, Machine
              Buy-off Web) และ Manual Fill-up เพื่อตรวจสอบและระบุ Book Value (THB)
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded border border-slate-200 text-xs shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Reviewer: {currentUser.name}</span>
          </div>
        </div>
      </div>

      {/* External Integration Links Bar */}
      <div className="glass-panel p-3 bg-white border border-slate-200 rounded-md flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <span className="font-semibold text-slate-500">External Integration Sources:</span>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="http://194.10.10.48/PMQM_Online/Default"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-sky-50 text-[#006194] font-semibold border border-slate-200 transition"
          >
            <span>QM PM Web</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="http://194.10.10.48:86/hanalpn_equipment/Default.aspx"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-sky-50 text-[#006194] font-semibold border border-slate-200 transition"
          >
            <span>Hana Equipment Online</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="http://194.10.10.48/QMseupMasterdata/Default"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-sky-50 text-[#006194] font-semibold border border-slate-200 transition"
          >
            <span>QM Center Admin Setup</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Filter Tabs by Source */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
        {['ALL', 'QM PM Web', 'Hana Equipment Online Web', 'Machine Buy-off Web', 'Manual Fill up'].map(
          (source) => (
            <button
              key={source}
              onClick={() => setSelectedSource(source)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition ${
                selectedSource === source
                  ? 'bg-[#006194] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {source === 'ALL' ? `All Pending (${waitingAssets.length})` : source}
            </button>
          )
        )}
      </div>

      {/* Responsive Cards for Mobile/Tablet (< 1024px) */}
      <div className="block lg:hidden space-y-3">
        {filteredWaiting.length === 0 ? (
          <div className="glass-panel p-8 text-center bg-white border border-slate-200 rounded-md">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-semibold text-slate-600">
              ไม่มีรายการค้างใน Waiting List Review สำหรับเงื่อนไขนี้
            </p>
          </div>
        ) : (
          filteredWaiting.map((asset, index) => {
            const dep = calculateDepreciation(
              asset.amountThb,
              asset.receivedDate,
              asset.usefulLifeYears
            );

            return (
              <div
                key={asset.id}
                className="glass-panel p-4 bg-white border border-slate-200 rounded-md shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        #{index + 1}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 font-semibold border border-sky-200 whitespace-nowrap">
                        {asset.sourceSystem}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{asset.machineName}</h4>
                    <p className="text-xs text-slate-500">
                      {asset.brand} • {asset.model}
                    </p>
                  </div>
                  <StatusBadge status="Waiting List" size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-sky-700 font-semibold">{asset.assetNo}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>{asset.owner}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{asset.plant} - {asset.location}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{asset.receivedDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200/70 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Original Cost</span>
                    <span className="font-bold text-slate-800 data-mono">
                      {formatCurrency(asset.amountThb)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">Est. Book Value</span>
                    <span className="font-bold text-amber-600 data-mono">
                      {formatCurrency(dep.currentBookValueThb)}
                    </span>
                  </div>
                </div>

                {currentUser.role === 'Level 2 Admin' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenReviewModal(asset)}
                    className="w-full justify-center"
                  >
                    Review Details
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View (>= 1024px) */}
      <div className="hidden lg:block overflow-x-auto rounded-md border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse custom-table">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center w-12">
                ITEM
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center">
                Action
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Source System
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Machine Name & Details
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Serial / Asset No
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Owner / Plant
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-right">
                Cost (THB)
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-right">
                Est. Book Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredWaiting.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-500 text-xs">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
                  ไม่มีรายการค้างใน Waiting List Review สำหรับเงื่อนไขนี้
                </td>
              </tr>
            ) : (
              filteredWaiting.map((asset, index) => {
                const dep = calculateDepreciation(
                  asset.amountThb,
                  asset.receivedDate,
                  asset.usefulLifeYears
                );

                return (
                  <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {currentUser.role === 'Level 2 Admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReviewModal(asset)}
                        >
                          Review Details
                        </Button>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200 whitespace-nowrap">
                        {asset.sourceSystem}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 leading-tight">
                        {asset.machineName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {asset.brand} • {asset.model} ({asset.machineType})
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-mono text-sky-700 font-bold">{asset.assetNo}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        SN: {asset.serialNo}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{asset.owner}</div>
                      <div className="text-[11px] text-slate-500">
                        {asset.plant} - {asset.location}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800 font-semibold">
                      {formatCurrency(asset.amountThb)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-600">
                      {asset.bookValueThb !== null
                        ? formatCurrency(asset.bookValueThb)
                        : `Est. ${formatCurrency(dep.currentBookValueThb)}`}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Review Book Value */}
      {selectedAssetForReview && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAssetForReview(null)}
          title="Review & Approve Book Value"
          subtitle="การอนุมัติและระบุมูลค่าตามบัญชีสำหรับสินทรัพย์ใหม่"
          icon={<ShieldCheck className="w-5 h-5 text-sky-700" />}
          maxWidth="md"
        >

          <div className="space-y-4 text-xs text-slate-700">
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <span className="text-slate-500 font-medium">Machine Name</span>
                <span className="font-bold text-slate-900">{selectedAssetForReview.machineName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500 font-medium">Brand / Model</span>
                <span>{selectedAssetForReview.brand} / {selectedAssetForReview.model}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500 font-medium">Asset / Serial No</span>
                <span className="font-mono text-sky-700">{selectedAssetForReview.assetNo} / {selectedAssetForReview.serialNo}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500 font-medium">Cost (THB)</span>
                <span className="font-mono font-semibold">{formatCurrency(selectedAssetForReview.amountThb)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500 font-medium">Owner / Location</span>
                <span>{selectedAssetForReview.owner} • {selectedAssetForReview.location}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500 font-medium text-amber-600">Requester (ผู้ร้องขอ)</span>
                <span className="font-bold">{selectedAssetForReview.requester || selectedAssetForReview.owner}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <label className="block text-slate-700 font-bold mb-1.5">
                Book Value (THB) <span className="text-red-500">*</span>
                <span className="text-slate-400 font-normal ml-2">
                  (ระบบคำนวณเบื้องต้นให้ที่ {formatCurrency(calculateDepreciation(selectedAssetForReview.amountThb, selectedAssetForReview.receivedDate, selectedAssetForReview.usefulLifeYears).currentBookValueThb)})
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={inputBookValue}
                onChange={(e) => setInputBookValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#006194] focus:border-[#006194]"
                placeholder="ระบุมูลค่า Book Value ที่ต้องการอนุมัติ"
              />
            </div>

            <div className="border-t border-slate-100 pt-3">
              <label className="block text-slate-700 font-bold mb-1.5 text-rose-600">
                Reject Reason (เหตุผลกรณีไม่อนุมัติ)
              </label>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border border-rose-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
                placeholder="ระบุเหตุผลเพื่อส่งกลับให้ผู้ร้องขอแก้ไข..."
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedAssetForReview(null)}>
                ยกเลิก
              </Button>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleReject} className="border-rose-200 text-rose-600 hover:bg-rose-50">
                  ส่งกลับ (Reject)
                </Button>
                <Button type="button" variant="primary" size="sm" onClick={handleConfirmApproval} icon={<CheckCircle className="w-4 h-4" />}>
                  อนุมัติ (Approve)
                </Button>
              </div>
            </div>
          </div>
        
        </Modal>
      )}
    </div>
  );
};
