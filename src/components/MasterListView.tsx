import React, { useState } from 'react';
import { Asset, User } from '../types/asset';
import api from '../api';
import { MasterListFilterBar } from './masterlist/MasterListFilterBar';
import { AssetTable } from './masterlist/AssetTable';
import { AssetCardList } from './masterlist/AssetCardList';
// import { generatePdfReport } from '../services/excelService'; // we need to fix this later or keep it

interface MasterListViewProps {
  assets: Asset[];
  currentUser: User;
  onEditAsset: (asset: Asset) => void;
  onOpenDepreciation: (asset: Asset) => void;
  onOpenHistory: (asset: Asset) => void;
  onResetData: () => void;
  onImportAssets: () => void; // changed signature
}

export const MasterListView: React.FC<MasterListViewProps> = ({
  assets,
  currentUser,
  onEditAsset,
  onOpenDepreciation,
  onOpenHistory,
  onResetData,
  onImportAssets,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPlant, setSelectedPlant] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filter Assets
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.owner.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'ALL' || asset.machineType === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || asset.status === selectedStatus;
    const matchesPlant = selectedPlant === 'ALL' || asset.plant === selectedPlant;

    return matchesSearch && matchesType && matchesStatus && matchesPlant;
  });

  const handleExport = async () => {
    try {
      const response = await api.get('/assets/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      link.setAttribute('download', `QM_Asset_Master_List_${date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/assets/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(`นำเข้าข้อมูลสำเร็จจำนวน ${response.data.count} รายการ`);
      onImportAssets(); // refresh data
      e.target.value = '';
    } catch (err: any) {
      console.error('Import failed:', err);
      const msg = err.response?.data?.message || err.message || 'เกิดข้อผิดพลาดในการอ่านไฟล์';
      alert(`Import Failed: ${msg}`);
    }
  };

  const uniquePlants = Array.from(new Set(assets.map((a) => a.plant))).filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Modular Filter and Action Bar */}
      <MasterListFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPlant={selectedPlant}
        onPlantChange={setSelectedPlant}
        uniquePlants={uniquePlants}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExportExcel={handleExport}
        onImportFile={handleFileChange}
        onPrintPdf={() => alert('PDF export is disabled due to excelService removal')} // or implement pdf later
        onResetData={onResetData}
        totalFiltered={filteredAssets.length}
      />

      {/* Conditional View: High-density Table vs Responsive Diagnostic Cards */}
      {viewMode === 'table' ? (
        <AssetTable
          assets={filteredAssets}
          currentUser={currentUser}
          onEditAsset={onEditAsset}
          onOpenDepreciation={onOpenDepreciation}
          onOpenHistory={onOpenHistory}
        />
      ) : (
        <AssetCardList
          assets={filteredAssets}
          currentUser={currentUser}
          onEditAsset={onEditAsset}
          onOpenDepreciation={onOpenDepreciation}
          onOpenHistory={onOpenHistory}
        />
      )}
    </div>
  );
};
