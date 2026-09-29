import React, { useState } from 'react';
import { AuditLog } from '../types/asset';
import { getAuditLogs } from '../services/auditService';
import { History, Search, Download, Clock } from 'lucide-react';
import { Button } from './common/Button';

export const AuditTrailView: React.FC = () => {
  const [logs] = useState<AuditLog[]>(getAuditLogs());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.assetNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;

    return matchesSearch && matchesAction;
  });

  const exportAuditLogsToExcel = () => {
    alert('Export Audit Logs is currently disabled as we move to the backend API.');
  };

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
    <div className="space-y-4">
      {/* Banner */}
      <div className="glass-panel p-4 sm:p-6 bg-gradient-to-r from-sky-50/90 via-slate-50/70 to-white border border-slate-200 rounded-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-[#006194]" />
              <span className="text-[11px] font-bold text-[#006194] uppercase tracking-wider">
                Audit Trail & Security Log
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              System Audit & Activity Logs
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              บันทึกประวัติการทำรายการทุกกิจกรรม (การลงทะเบียนใหม่ การอนุมัติ Book Value การปรับเปลี่ยนสภาพเครื่อง
              และการแก้ไขข้อมูล) เพื่อการตรวจสอบย้อนหลังตามมาตรฐานสากล
            </p>
          </div>

          <Button
            variant="action-emerald"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={exportAuditLogsToExcel}
            className="self-start md:self-auto shrink-0"
          >
            Export Audit Logs (.xlsx)
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white border border-slate-200 rounded-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหา Asset No, Machine Name, User..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-9"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="form-input cursor-pointer"
          >
            <option value="ALL">All Actions (ทุกกิจกรรม)</option>
            <option value="CREATED">CREATED (ลงทะเบียนใหม่)</option>
            <option value="APPROVED">APPROVED (อนุมัติ Book Value)</option>
            <option value="UPDATED">UPDATED (แก้ไขข้อมูล)</option>
            <option value="STATUS_CHANGED">STATUS CHANGED (เปลี่ยนสภาพเครื่อง)</option>
          </select>
        </div>
      </div>

      {/* Mobile/Tablet Card Stack (< 1024px) */}
      <div className="block lg:hidden space-y-2.5">
        {filteredLogs.length === 0 ? (
          <div className="glass-panel p-8 text-center bg-white border border-slate-200 rounded-md">
            <p className="text-xs text-slate-500 font-semibold">
              ไม่พบข้อมูลประวัติกิจกรรมตามเงื่อนไขค้นหา
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="glass-panel p-3.5 bg-white border border-slate-200 rounded-md shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  {getActionBadge(log.action)}
                  <span className="font-mono text-sky-700 font-bold text-xs">{log.assetNo}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {log.timestamp}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900">{log.assetName}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{log.details}</p>
              </div>

              <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                <span>By: <strong className="text-slate-800">{log.performedBy}</strong></span>
                <span className="text-slate-400">({log.performedByRole})</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Logs Table (>= 1024px) */}
      <div className="hidden lg:block overflow-x-auto rounded-md border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse custom-table">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Action
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Asset No
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Machine Name
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Performed By
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Role
              </th>
              <th className="py-2.5 px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Details & Activity Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-500 text-xs">
                  ไม่พบข้อมูลประวัติกิจกรรมตามเงื่อนไขค้นหา
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500 text-xs">{log.timestamp}</td>
                  <td className="py-2.5 px-3">{getActionBadge(log.action)}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-sky-700">{log.assetNo}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{log.assetName}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{log.performedBy}</td>
                  <td className="py-2.5 px-3 text-slate-500">{log.performedByRole}</td>
                  <td
                    className="py-2.5 px-3 text-slate-700 max-w-md truncate font-medium"
                    title={log.details}
                  >
                    {log.details}
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
