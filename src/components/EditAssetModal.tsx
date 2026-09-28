import React, { useState, useEffect } from 'react';
import { Asset, MachineType, Currency, AssetStatus } from '../types/asset';
import { Edit3, CheckCircle } from 'lucide-react';
import { calculateAgeInYears } from '../services/depreciation';
import { Modal } from './common/Modal';
import { Button } from './common/Button';

interface EditAssetModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAsset: Asset) => void;
}

export const EditAssetModal: React.FC<EditAssetModalProps> = ({
  asset,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Asset | null>(null);

  useEffect(() => {
    if (asset) {
      setFormData({ ...asset });
    }
  }, [asset]);

  if (!isOpen || !formData) return null;

  const calculatedAge = calculateAgeInYears(formData.receivedDate);

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
      title="Edit QM Asset Information"
      subtitle={`แก้ไขข้อมูลสินทรัพย์ #${formData.itemNo} - ${formData.machineName} (${formData.assetNo})`}
      icon={<Edit3 className="w-5 h-5 text-[#006194]" />}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Machine Name */}
          <div>
            <label className="form-label">Machine Name *</label>
            <input
              type="text"
              required
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
              value={formData.serialNo}
              onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
              className="form-input font-mono"
            />
          </div>

          {/* Asset No */}
          <div>
            <label className="form-label">Asset No. *</label>
            <input
              type="text"
              required
              value={formData.assetNo}
              onChange={(e) => setFormData({ ...formData, assetNo: e.target.value })}
              className="form-input font-mono"
            />
          </div>

          {/* Machine No */}
          <div>
            <label className="form-label">Machine No.</label>
            <input
              type="text"
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
              value={formData.calibrationId}
              onChange={(e) => setFormData({ ...formData, calibrationId: e.target.value })}
              className="form-input"
            />
          </div>

          {/* Status */}
          <div>
            <label className="form-label">Equipment Status *</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as AssetStatus })
              }
              className="form-input"
            >
              <option value="Good">Good (ปกติ/พร้อมใช้งาน)</option>
              <option value="Fair">Fair (ใช้งานได้/เฝ้าระวัง)</option>
              <option value="Poor">Poor (รอซ่อม/ขัดข้อง)</option>
              <option value="Discontinue part">Discontinue part (เลิกผลิตอะไหล่)</option>
              <option value="Written off">Written off (จำหน่ายออก)</option>
            </select>
          </div>

          {/* Machine Type */}
          <div>
            <label className="form-label">Machine Type</label>
            <select
              value={formData.machineType}
              onChange={(e) =>
                setFormData({ ...formData, machineType: e.target.value as MachineType })
              }
              className="form-input"
            >
              <option value="Measuring Equipment">Measuring Equipment</option>
              <option value="FA Testing Equipment">FA Testing Equipment</option>
              <option value="Chemical Testing Machine">Chemical Testing Machine</option>
            </select>
          </div>

          {/* Owner */}
          <div>
            <label className="form-label">Owner *</label>
            <input
              type="text"
              required
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
                value={formData.plant}
                onChange={(e) => setFormData({ ...formData, plant: e.target.value })}
                className="form-input w-1/2"
                placeholder="Plant"
              />
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="form-input w-1/2"
                placeholder="Location"
              />
            </div>
          </div>

          {/* Floor & Area */}
          <div>
            <label className="form-label">Floor & Area</label>
            <div className="flex space-x-1.5">
              <input
                type="text"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="form-input w-1/2"
                placeholder="Floor"
              />
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="form-input w-1/2"
                placeholder="Area"
              />
            </div>
          </div>
        </div>

        {/* Remark */}
        <div>
          <label className="form-label">Remark</label>
          <textarea
            rows={2}
            value={formData.remark}
            onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
            className="form-input text-xs"
            placeholder="หมายเหตุหรือข้อมูลเพิ่มเติม..."
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
            icon={<CheckCircle className="w-4 h-4" />}
          >
            บันทึกการแก้ไข
          </Button>
        </div>
      </form>
    </Modal>
  );
};
