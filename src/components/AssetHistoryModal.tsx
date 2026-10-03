import React, { useState, useEffect } from 'react';
import { Asset, AuditLog } from '../types/asset';
import { getAuditLogsForAsset } from '../services/auditService';
import { History, Clock } from 'lucide-react';
import { Modal } from './common/Modal';
import { Button } from './common/Button';

interface AssetHistoryModalProps {
  asset: Asset | null;
  onClose: () => void;
}

export const AssetHistoryModal: React.FC<AssetHistoryModalProps> = ({ asset, onClose }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    let mounted = true;
    if (asset) {
      getAuditLogsForAsset(asset.id).then((fetched) => {
        if (mounted) setLogs(fetched);
      });
    }
    return () => { mounted = false; };
  }, [asset]);

  if (!asset) return null;

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            CREATED
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            APPROVED
          </span>
        );
      case 'UPDATED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            UPDATED
          </span>
        );
      case 'STATUS_CHANGED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            STATUS CHANGED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
            {action}
          </span>
        );
    }
  };

  return (
    <Modal
      isOpen={!!asset}
      onClose={onClose}
      title="Asset Audit History (ประวัติการแก้ไข)"
      subtitle={`${asset.machineName} (${asset.assetNo}) - SN: ${asset.serialNo}`}
      icon={<History className="w-5 h-5 text-[#006194]" />}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Audit Timeline */}
        <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              ไม่พบประวัติการแก้ไขเพิ่มเติมสำหรับสินทรัพย์นี้
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="relative pl-5 border-l-2 border-slate-200 space-y-1 py-0.5"
              >
                {/* Bullet */}
                <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#006194] shadow-xs" />

                <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                  <div className="flex items-center space-x-2">
                    {getActionBadge(log.action)}
                    <span className="font-bold text-slate-800">{log.performedBy}</span>
                    <span className="text-[11px] text-slate-500">({log.performedByRole})</span>
                  </div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {log.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-700 pt-0.5 font-medium">{log.details}</p>

                {log.changes && log.changes.length > 0 && (
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 space-y-0.5 mt-1 text-[11px]">
                    {log.changes.map((ch, i) => (
                      <div key={i} className="flex items-center space-x-2 text-slate-600">
                        <span className="font-mono text-sky-700 font-bold">{ch.field}:</span>
                        <span className="line-through text-slate-400">
                          {String(ch.oldValue ?? 'None')}
                        </span>
                        <span className="text-emerald-700 font-bold">➔ {String(ch.newValue)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-200">
          <Button variant="outline" size="sm" onClick={onClose}>
            ปิดหน้าต่าง
          </Button>
        </div>
      </div>
    </Modal>
  );
};
