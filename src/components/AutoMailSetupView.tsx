import React, { useState } from 'react';
import { Mail, Calendar, CheckCircle2, Send, ExternalLink, BellRing } from 'lucide-react';
import { Button } from './common/Button';

export const AutoMailSetupView: React.FC = () => {
  const [testMailSent, setTestMailSent] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('owner.hana@hana.co.th');

  const handleTestSend = (e: React.FormEvent) => {
    e.preventDefault();
    setTestMailSent(true);
    setTimeout(() => setTestMailSent(false), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="glass-panel p-4 sm:p-6 bg-gradient-to-r from-sky-50/90 via-slate-50/70 to-white border border-slate-200 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-[#006194]" />
            <span className="text-[11px] font-bold text-[#006194] uppercase tracking-wider">
              Auto Mail System
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Setup Auto Mail Notifications
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            ตั้งค่าระบบส่งอีเมลแจ้งเตือนอัตโนมัติถึง Owner ของเครื่องจักรเพื่อทบทวนสถานะและข้อมูลสินทรัพย์ตามรอบที่กำหนด
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Status: Cron Service Active</span>
        </div>
      </div>

      {/* Rules & Conditions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rules Card */}
        <div className="glass-panel p-4 sm:p-5 space-y-3 bg-white border border-slate-200 rounded-md">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
            <Calendar className="w-4 h-4 text-[#006194]" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              เงื่อนไขระบบ Auto Mail ถึง Owner (Business Rules)
            </h3>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start space-x-2.5 bg-slate-50 p-3 rounded border border-slate-200/80">
              <span className="w-5 h-5 rounded bg-sky-100 text-[#006194] flex items-center justify-center font-bold text-xs shrink-0">
                1
              </span>
              <div>
                <strong className="text-slate-900">Notify Owner 2 ครั้งต่อปี (ล่วงหน้า 1 เดือน):</strong>
                <p className="text-slate-600 mt-0.5">
                  ส่งแจ้งเตือนในเดือน <strong>เมษายน</strong> (สำหรับรอบทบทวนพฤษภาคม) และ เดือน <strong>สิงหาคม</strong> (สำหรับรอบทบทวนกันยายน)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 bg-slate-50 p-3 rounded border border-slate-200/80">
              <span className="w-5 h-5 rounded bg-sky-100 text-[#006194] flex items-center justify-center font-bold text-xs shrink-0">
                2
              </span>
              <div>
                <strong className="text-slate-900">Email Follow-up ถี่ขึ้น (D-7 ถึง D-0):</strong>
                <p className="text-slate-600 mt-0.5">
                  ติดตามอีเมลรายวันในช่วง 7 วันก่อนครบกำหนด จนกว่าจะไม่มีรายการค้างใน Waiting List Review
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Email Trigger Card */}
        <div className="glass-panel p-4 sm:p-5 space-y-3 bg-white border border-slate-200 rounded-md">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
            <Send className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              ทดสอบการส่ง Auto Mail Notification
            </h3>
          </div>

          <form onSubmit={handleTestSend} className="space-y-3 text-xs">
            <div>
              <label className="form-label font-semibold">Email ผู้รับทดสอบ:</label>
              <input
                type="email"
                required
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                className="form-input"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Send className="w-4 h-4" />}
              className="w-full justify-center"
            >
              ส่ง Email ทดสอบ (Trigger Test Email)
            </Button>

            {testMailSent && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">ส่ง Email ไปยัง {testEmailAddress} สำเร็จเรียบร้อย!</span>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Email Template Preview Card */}
      <div className="glass-panel p-4 sm:p-6 space-y-4 bg-white border border-slate-200 rounded-md">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <BellRing className="w-4 h-4 text-[#006194]" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              ตัวอย่าง Email Template (Auto Mail to Owner)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium font-mono">
            Match Excel Sheet 'Setup Auto Mail'
          </span>
        </div>

        {/* Email Mock Container */}
        <div className="bg-slate-50 rounded p-4 sm:p-6 border border-slate-200 space-y-3 max-w-2xl mx-auto shadow-xs">
          <div className="border-b border-slate-200 pb-2.5 space-y-1 text-xs">
            <div className="text-slate-600">
              <strong className="text-slate-800">From:</strong> QM ADMIN &lt;qm.admin@hana.co.th&gt;
            </div>
            <div className="text-slate-600">
              <strong className="text-slate-800">To:</strong> K' Owner &lt;owner.hana@hana.co.th&gt;
            </div>
            <div className="text-slate-600">
              <strong className="text-slate-800">Subject:</strong> [QM Asset Notification] Reminder: Review QM Asset Master List & Active Status
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-800 leading-relaxed py-1">
            <p>Dear K'.... (Owner),</p>
            <p className="pl-3 border-l-2 border-[#006194] text-slate-700 font-medium">
              Your Machine/Equipment should be review QM Asset Master list and active status.
            </p>

            <div className="py-1">
              <a
                href="#review"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#0284c7] text-white font-semibold rounded text-xs hover:bg-[#0369a1] transition"
              >
                <span>Click for review</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="pt-3 text-slate-500 text-[11px] space-y-0.5 border-t border-slate-200">
              <p>WBRs,</p>
              <p className="font-bold text-slate-800">QM ADMIN</p>
              <p>Hana Microelectronics Public Co., Ltd. (Lamphun)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
