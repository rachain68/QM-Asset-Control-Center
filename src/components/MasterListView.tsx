import React, { useState, useEffect } from 'react';
import { Asset, User } from '../types/asset';
import api from '../api';
import { MasterListFilterBar } from './masterlist/MasterListFilterBar';
import { AssetTable } from './masterlist/AssetTable';
import { AssetCardList } from './masterlist/AssetCardList';
import { Button } from './common/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { generatePdfReport } from '../services/excelService'; // we need to fix this later or keep it

interface MasterListViewProps {
  assets: Asset[];
  currentUser: User;
  onEditAsset: (asset: Asset) => void;
  onOpenDepreciation: (asset: Asset) => void;
  onOpenHistory: (asset: Asset) => void;
  onResetData: () => void;
  onImportAssets: () => void; // changed signature
  onDeleteAsset: (id: string) => void;
}

export const MasterListView: React.FC<MasterListViewProps> = ({
  assets,
  currentUser,
  onEditAsset,
  onOpenDepreciation,
  onOpenHistory,
  onResetData,
  onImportAssets,
  onDeleteAsset,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPlant, setSelectedPlant] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedStatus, selectedPlant, selectedLocation, itemsPerPage]);

  // Filter Assets
  const filteredAssets = assets.filter((asset) => {
    // Only show Active or items that are not in Waiting List
    if (asset.reviewStatus === 'Waiting List') return false;

    const matchesSearch =
      (asset.machineName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.assetNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.serialNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.owner || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.location || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'ALL' || asset.machineType === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || asset.status === selectedStatus;
    const matchesPlant = selectedPlant === 'ALL' || asset.plant === selectedPlant;
    const matchesLocation = selectedLocation === 'ALL' || asset.location === selectedLocation;

    return matchesSearch && matchesType && matchesStatus && matchesPlant && matchesLocation;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssets = filteredAssets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage) || 1;

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
  const uniqueLocations = Array.from(new Set(assets.map((a) => a.location))).filter(Boolean);

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
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        uniqueLocations={uniqueLocations}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExportExcel={handleExport}
        onImportFile={handleFileChange}
        onPrintPdf={() => alert('PDF export is disabled due to excelService removal')} // or implement pdf later
        totalFiltered={filteredAssets.length}
      />

      {/* Conditional View: High-density Table vs Responsive Diagnostic Cards */}
      {viewMode === 'table' ? (
        <AssetTable
          assets={currentAssets}
          currentUser={currentUser}
          onEditAsset={onEditAsset}
          onOpenDepreciation={onOpenDepreciation}
          onOpenHistory={onOpenHistory}
          onDeleteAsset={onDeleteAsset}
        />
      ) : (
        <AssetCardList
          assets={currentAssets}
          currentUser={currentUser}
          onEditAsset={onEditAsset}
          onOpenDepreciation={onOpenDepreciation}
          onOpenHistory={onOpenHistory}
          onDeleteAsset={onDeleteAsset}
        />
      )}

      {/* Pagination Controls */}
      {filteredAssets.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4 bg-white border border-slate-200 rounded-md shadow-sm mt-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 font-medium">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="text-sm border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-slate-500 hidden sm:inline">
              entries (Total {filteredAssets.length})
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <span className="text-sm font-medium px-2 text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
