import React, { useState } from 'react';
import { Asset, MachineType, Currency } from '../types/asset';
import { PlusCircle, Info } from 'lucide-react';
import { calculateAgeInYears } from '../services/depreciation';
import { Modal } from './common/Modal';
import { Button } from './common/Button';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assetData: Omit<Asset, 'id' | 'itemNo' | 'ageYr' | 'amountThb' | 'lastUpdated'>) => void;
}

export const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    machineName: '',
    brand: '',
    model: '',
    serialNo: '',
    boiNo: 'N/A',
    assetNo: '',
    machineNo: '',
    calibrationId: 'N/A',
    machineType: 'Analysis Equipment' as MachineType,
    receivedDate: new Date().toISOString().split('T')[0],
    invoiceNo: '',
    invCost: 0,
    currency: 'THB' as Currency,
    exchangeRateToThb: 1.0,
    owner: 'APICHAYA P.',
    location: 'FA Lab',
    plant: 'FA',
    floor: '1',
    area: 'FA_Lab',
    bookValueThb: null as number | null,
    status: 'Good' as const,
    requireYN: 'Y' as const,
    remark: '',
    reviewStatus: 'Waiting List' as const,
    sourceSystem: 'Manual Fill up' as const,
    usefulLifeYears: 7,
  });

  if (!isOpen) return null;

  const calculatedAge = calculateAgeInYears(formData.receivedDate);
  const calculatedThb = Math.round(formData.invCost * formData.exchangeRateToThb * 100) / 100;

  const handleCurrencyChange = (curr: Currency) => {
    let rate = 1.0;
    if (curr === 'USD') rate = 34.5;
    if (curr === 'EUR') rate = 37.2;
    if (curr === 'JPY') rate = 0.23;
    setFormData((prev) => ({ ...prev, currency: curr, exchangeRateToThb: rate }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.machineName || !formData.serialNo || !formData.assetNo) {
      alert('กรุณากรอกข้อมูลสำคัญ (Machine Name, Serial No, Asset No) ให้ครบถ้วน');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Item in QM Asset Masterlist"
      subtitle="เพิ่มข้อมูลเครื่องจักร/เครื่องมือวัดลงในระบบ (ส่งเข้า Waiting List ให้ทีม CAL ตรวจสอบ Book Value)"
      icon={<PlusCircle className="w-5 h-5 text-[#006194]" />}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Requirements Callout */}
        <div className="bg-sky-50 border border-sky-200 p-3 rounded flex items-start space-x-2 text-xs text-sky-950">
          <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
          <div>
            <strong>*Required to fill all information except Book Value:</strong> หลังกดส่งข้อมูล รายการนี้จะแสดงใน
            <span className="text-[#006194] font-bold"> Waiting list review </span> เพื่อรอ Authorized CAL team ตรวจสอบและระบุ Book Value (THB)
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Machine Name */}
            <div>
              <label className="form-label">Machine Name *</label>
              <input
                type="text"
                required
                placeholder="เช่น Micro XRF"
                value={formData.machineName}
                onChange={(e) => setFormData({ ...formData, machineName: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="form-label">Brand *</label>
              <input
                type="text"
                required
                placeholder="เช่น Bruker, Olympus"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Model */}
            <div>
              <label className="form-label">Model *</label>
              <input
                type="text"
                required
                placeholder="เช่น M4 Tornado"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Serial No */}
            <div>
              <label className="form-label">Serial No. *</label>
              <input
                type="text"
                required
                placeholder="เช่น 411004590323"
                value={formData.serialNo}
                onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                className="form-input font-mono"
              />
            </div>

            {/* BOI No */}
            <div>
              <label className="form-label">BOI No.</label>
              <input
                type="text"
                placeholder="ระบุ N/A หากไม่มี"
                value={formData.boiNo}
                onChange={(e) => setFormData({ ...formData, boiNo: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Asset No */}
            <div>
              <label className="form-label">Asset No. *</label>
              <input
                type="text"
                required
                placeholder="เช่น HM22063"
                value={formData.assetNo}
                onChange={(e) => setFormData({ ...formData, assetNo: e.target.value })}
                className="form-input font-mono"
              />
            </div>

            {/* Machine No */}
            <div>
              <label className="form-label">Machine No. *</label>
              <input
                type="text"
                required
                placeholder="เช่น 103"
                value={formData.machineNo}
                onChange={(e) => setFormData({ ...formData, machineNo: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Calibration ID */}
            <div>
              <label className="form-label">Calibration ID</label>
              <input
                type="text"
                placeholder="เช่น MTE-3-411 หรือ N/A"
                value={formData.calibrationId}
                onChange={(e) => setFormData({ ...formData, calibrationId: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Machine Type */}
            <div>
              <label className="form-label">Machine Type *</label>
              <select
                value={formData.machineType}
                onChange={(e) =>
                  setFormData({ ...formData, machineType: e.target.value as MachineType })
                }
                className="form-input"
              >
                <option value="Analysis Equipment">Analysis Equipment</option>
                <option value="Measuring&Test Equipment">Measuring & Test Equipment</option>
                <option value="Machine">Machine</option>
              </select>
            </div>

            {/* Received Date */}
            <div>
              <label className="form-label">Received Date *</label>
              <input
                type="date"
                required
                value={formData.receivedDate}
                onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
                className="form-input font-mono"
              />
              <span className="text-[11px] text-sky-700 font-semibold mt-1 block">
                Calculated Age: <strong>{calculatedAge} Yrs</strong>
              </span>
            </div>

            {/* Invoice No */}
            <div>
              <label className="form-label">Invoice No. *</label>
              <input
                type="text"
                required
                placeholder="เช่น INV-2024-001"
                value={formData.invoiceNo}
                onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Invoice Cost & Currency */}
            <div>
              <label className="form-label">Invoice Cost & Currency *</label>
              <div className="flex space-x-1.5">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.invCost}
                  onChange={(e) =>
                    setFormData({ ...formData, invCost: parseFloat(e.target.value) || 0 })
                  }
                  className="form-input flex-1 font-mono"
                />
                <select
                  value={formData.currency}
                  onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
                  className="form-input w-20 font-mono"
                >
                  <option value="THB">THB</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
              <span className="text-[11px] text-emerald-700 mt-1 block font-bold font-mono">
                = {calculatedThb.toLocaleString()} THB
              </span>
            </div>

            {/* Owner */}
            <div>
              <label className="form-label">Owner *</label>
              <input
                type="text"
                required
                placeholder="เช่น APICHAYA P."
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Location & Plant */}
            <div>
              <label className="form-label">Plant & Location *</label>
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  required
                  placeholder="Plant (เช่น FA)"
                  value={formData.plant}
                  onChange={(e) => setFormData({ ...formData, plant: e.target.value })}
                  className="form-input w-1/2"
                />
                <input
                  type="text"
                  required
                  placeholder="Location (เช่น FA Lab)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="form-input w-1/2"
                />
              </div>
            </div>

            {/* Floor & Area */}
            <div>
              <label className="form-label">Floor & Area *</label>
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  required
                  placeholder="Floor (เช่น 1)"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className="form-input w-1/2"
                />
                <input
                  type="text"
                  required
                  placeholder="Area (เช่น FA_Lab)"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="form-input w-1/2"
                />
              </div>
            </div>
          </div>

          {/* Remark */}
          <div>
            <label className="form-label">Remark</label>
            <textarea
              rows={2}
              placeholder="หมายเหตุเพิ่มเติม..."
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              className="form-input text-xs"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<PlusCircle className="w-4 h-4" />}
            >
              Submit to Waiting List
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
