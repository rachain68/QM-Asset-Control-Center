import React, { useRef } from 'react';
import { Search, Download, Upload, Printer, RefreshCw, LayoutGrid, Table, X } from 'lucide-react';
import { Button } from '../common/Button';

interface MasterListFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedPlant: string;
  onPlantChange: (value: string) => void;
  uniquePlants: string[];
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  uniqueLocations: string[];
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  onExportExcel: () => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrintPdf: () => void;
  onResetData: () => void;
  totalFiltered: number;
}

export const MasterListFilterBar: React.FC<MasterListFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  selectedPlant,
  onPlantChange,
  uniquePlants,
  selectedLocation,
  onLocationChange,
  uniqueLocations,
  viewMode,
  onViewModeChange,
  onExportExcel,
  onImportFile,
  onPrintPdf,
  onResetData,
  totalFiltered,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      {/* Top Action Bar: Export, Import, PDF, Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Export Excel Button */}
          <Button
            variant="action-emerald"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={onExportExcel}
          >
            Export Excel
          </Button>

          {/* Import Excel Button */}
          <Button
            variant="outline"
            size="sm"
            icon={<Upload className="w-4 h-4 text-sky-600" />}
            onClick={() => fileInputRef.current?.click()}
          >
            Import Excel
          </Button>

          {/* Download Template Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onExportExcel}
            title="Download Template (ใช้ไฟล์ Export เป็น Template สำหรับ Import)"
          >
            Download Template
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImportFile}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />

          {/* PDF Report Button */}
          <Button
            variant="action-purple"
            size="sm"
            icon={<Printer className="w-4 h-4" />}
            onClick={onPrintPdf}
          >
            Print PDF
          </Button>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          {/* View Mode Toggle (Table vs Cards) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-[#006194] shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View (มุมมองตาราง)"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-[#006194] shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Cards View (มุมมองการ์ด)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Data Button */}
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={onResetData}
            title="Reset to initial Excel dataset"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Filter and Search Row */}
      <div className="glass-panel p-3 bg-white border border-slate-200 rounded-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Machine, Brand, Model..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="form-input pl-9 pr-8"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="form-input cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="Measuring Equipment">Measuring Equipment</option>
              <option value="FA Testing Equipment">FA Testing Equipment</option>
              <option value="Chemical Testing Machine">Chemical Testing Machine</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="form-input cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
              <option value="Discontinue part">Discontinue part</option>
              <option value="Written off">Written off</option>
            </select>
          </div>

          {/* Plant Filter */}
          <div className="lg:col-span-1">
            <select
              value={selectedPlant}
              onChange={(e) => onPlantChange(e.target.value)}
              className="form-input cursor-pointer"
            >
              <option value="ALL">All Plants</option>
              {uniquePlants.map((plant) => (
                <option key={plant} value={plant}>
                  {plant}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="form-input cursor-pointer"
            >
              <option value="ALL">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Counter Tag */}
          <div className="lg:col-span-1 text-right sm:text-center text-xs font-mono text-slate-500">
            <span className="font-bold text-sky-700">{totalFiltered}</span> items
          </div>
        </div>
      </div>
    </div>
  );
};
