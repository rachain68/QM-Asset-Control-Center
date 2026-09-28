import React, { useState } from 'react';
import { Asset, User } from '../types/asset';
import { exportAssetsToExcel, importAssetsFromExcel, generatePdfReport } from '../services/excelService';
import { MasterListFilterBar } from './masterlist/MasterListFilterBar';
import { AssetTable } from './masterlist/AssetTable';
import { AssetCardList } from './masterlist/AssetCardList';

interface MasterListViewProps {
  assets: Asset[];
  currentUser: User;
  onEditAsset: (asset: Asset) => void;
  onOpenDepreciation: (asset: Asset) => void;
  onOpenHistory: (asset: Asset) => void;
  onResetData: () => void;
  onImportAssets: (importedAssets: Omit<Asset, 'id' | 'itemNo'>[]) => void;
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importAssetsFromExcel(file);
      if (imported.length === 0) {
        alert('ไม่พบข้อมูลสินทรัพย์ในไฟล์ Excel ที่เลือก');
        return;
      }
      onImportAssets(imported);
      e.target.value = '';
    } catch (err) {
      console.error('Import failed:', err);
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์ Excel กรุณาตรวจสอบฟอร์แมตไฟล์');
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
        onExportExcel={() => exportAssetsToExcel(filteredAssets)}
        onImportFile={handleFileChange}
        onPrintPdf={() => generatePdfReport(filteredAssets)}
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
