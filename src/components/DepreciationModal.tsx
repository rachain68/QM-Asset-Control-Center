import React, { useState } from 'react';
import { Asset } from '../types/asset';
import { calculateDepreciation, formatCurrency } from '../services/depreciation';
import { Calculator, Calendar } from 'lucide-react';
import { Modal } from './common/Modal';
import { Button } from './common/Button';

interface DepreciationModalProps {
  asset: Asset | null;
  onClose: () => void;
}

export const DepreciationModal: React.FC<DepreciationModalProps> = ({ asset, onClose }) => {
  if (!asset) return null;

  const [simulationAge, setSimulationAge] = useState<number>(asset.ageYr);

  const dep = calculateDepreciation(
    asset.amountThb,
    asset.receivedDate,
    asset.usefulLifeYears,
    asset.bookValueThb
  );

  // Simulated depreciation at custom age
  const simUsefulLife = asset.usefulLifeYears || 7;
  const simAnnualDep = asset.amountThb / simUsefulLife;
  const simAccumulated = Math.min(asset.amountThb, simAnnualDep * simulationAge);
  const simBookValue = Math.max(0, asset.amountThb - simAccumulated);

  return (
    <Modal
      isOpen={!!asset}
      onClose={onClose}
      title="7-Year Useful Life Depreciation Breakdown"
      subtitle="ตารางวิเคราะห์และจำลองค่าเสื่อมราคาสะสมตามมาตรฐานบัญชี"
      icon={<Calculator className="w-5 h-5 text-purple-700" />}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Asset Basic Info */}
        <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Machine Name:</span>
            <span className="font-bold text-slate-900">{asset.machineName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Asset No / Serial:</span>
            <span className="font-mono text-sky-700 font-bold">
              {asset.assetNo} (SN: {asset.serialNo})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Received Date:</span>
            <span className="text-slate-800 font-semibold">{asset.receivedDate}</span>
          </div>
        </div>

        {/* Depreciation Key Metrics */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-slate-500 font-medium block">Original Cost (THB)</span>
            <span className="text-base sm:text-lg font-bold text-[#006194] mt-1 block font-mono">
              {formatCurrency(dep.originalCostThb)}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-slate-500 font-medium block">Annual Depreciation</span>
            <span className="text-base sm:text-lg font-bold text-purple-700 mt-1 block font-mono">
              {formatCurrency(dep.annualDepreciationThb)} / Yr
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-slate-500 font-medium block">Accumulated Depreciation</span>
            <span className="text-base sm:text-lg font-bold text-rose-600 mt-1 block font-mono">
              {formatCurrency(dep.accumulatedDepreciationThb)}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <span className="text-slate-500 font-medium block">Current Book Value (THB)</span>
            <span className="text-base sm:text-lg font-bold text-emerald-700 mt-1 block font-mono">
              {formatCurrency(dep.currentBookValueThb)}
            </span>
          </div>
        </div>

        {/* Interactive Year Simulator */}
        <div className="bg-sky-50/70 border border-sky-200 p-3.5 rounded space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-sky-950 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-700" />
              Simulate Future Age (0 - 10 Years):
            </span>
            <span className="font-bold text-slate-900 font-mono text-sm">
              {simulationAge} Years
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={simulationAge}
            onChange={(e) => setSimulationAge(parseFloat(e.target.value))}
            className="w-full accent-sky-700 cursor-pointer h-2 bg-sky-200 rounded-lg"
          />

          <div className="flex justify-between items-center text-xs pt-1.5 border-t border-sky-200">
            <span className="text-slate-700 font-medium">Simulated Book Value:</span>
            <span className="font-bold text-emerald-700 font-mono text-sm">
              {formatCurrency(simBookValue)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            ปิดหน้าต่าง
          </Button>
        </div>
      </div>
    </Modal>
  );
};
