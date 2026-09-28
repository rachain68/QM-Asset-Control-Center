import React, { useState, useEffect } from 'react';
import { Asset, User } from './types/asset';
import {
  getStoredAssets,
  getCurrentUser,
  setCurrentUser,
  addAsset,
  approveWaitingListAsset,
  resetToInitialData,
  updateAsset,
} from './services/storage';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { MasterListView } from './components/MasterListView';
import { WaitingListReviewView } from './components/WaitingListReviewView';
import { AutoMailSetupView } from './components/AutoMailSetupView';
import { AuditTrailView } from './components/AuditTrailView';
import { AddAssetModal } from './components/AddAssetModal';
import { EditAssetModal } from './components/EditAssetModal';
import { DepreciationModal } from './components/DepreciationModal';
import { AssetHistoryModal } from './components/AssetHistoryModal';
import { CheckCircle2, Factory } from 'lucide-react';

export function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [currentUser, setCurrentUserRole] = useState<User>(getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [depreciationAsset, setDepreciationAsset] = useState<Asset | null>(null);
  const [historyAsset, setHistoryAsset] = useState<Asset | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setAssets(getStoredAssets());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUserChange = (user: User) => {
    setCurrentUserRole(user);
    setCurrentUser(user);
    showToast(`เปลี่ยนสิทธิ์เป็น: ${user.name} (${user.role})`);
  };

  const handleSaveNewAsset = (
    assetData: Omit<Asset, 'id' | 'itemNo' | 'ageYr' | 'amountThb' | 'lastUpdated'>
  ) => {
    const created = addAsset(assetData);
    setAssets(getStoredAssets());
    showToast(`ลงทะเบียนสินทรัพย์ "${created.machineName}" เรียบร้อยแล้ว (บันทึกใน Audit Trail)`);
    setActiveTab('waitinglist');
  };

  const handleSaveEditedAsset = (updated: Asset) => {
    updateAsset(updated);
    setAssets(getStoredAssets());
    showToast(`แก้ไขข้อมูลสินทรัพย์ "${updated.machineName}" เรียบร้อยแล้ว`);
  };

  const handleImportAssets = (importedAssets: Omit<Asset, 'id' | 'itemNo'>[]) => {
    let importedCount = 0;
    importedAssets.forEach((data) => {
      addAsset(data);
      importedCount++;
    });

    setAssets(getStoredAssets());
    showToast(`นำเข้าข้อมูลจากไฟล์ Excel จำนวน ${importedCount} รายการสำเร็จเรียบร้อย!`);
  };

  const handleApproveAsset = (id: string, bookValueThb: number) => {
    const approved = approveWaitingListAsset(id, bookValueThb);
    if (approved) {
      setAssets(getStoredAssets());
      showToast(
        `อนุมัติและระบุ Book Value (${bookValueThb.toLocaleString()} THB) บันทึก Audit Log เรียบร้อย`
      );
    }
  };

  const handleResetData = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้นตามไฟล์ Excel หรือไม่?')) {
      const init = resetToInitialData();
      setAssets(init);
      showToast('รีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้นใน Excel เรียบร้อยแล้ว');
    }
  };

  const waitingCount = assets.filter((a) => a.reviewStatus === 'Waiting List').length;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased font-sans">
      {/* Precision Responsive Header */}
      <Header
        currentUser={currentUser}
        onUserChange={handleUserChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        waitingListCount={waitingCount}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#006194] text-white px-4 py-3 rounded shadow-xl flex items-center space-x-2.5 border border-sky-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-sky-200 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Responsive Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === 'dashboard' && (
          <DashboardView assets={assets} onNavigate={setActiveTab} />
        )}

        {activeTab === 'masterlist' && (
          <MasterListView
            assets={assets}
            currentUser={currentUser}
            onEditAsset={(asset) => setEditingAsset(asset)}
            onOpenDepreciation={(asset) => setDepreciationAsset(asset)}
            onOpenHistory={(asset) => setHistoryAsset(asset)}
            onResetData={handleResetData}
            onImportAssets={handleImportAssets}
          />
        )}

        {activeTab === 'waitinglist' && (
          <WaitingListReviewView
            assets={assets}
            currentUser={currentUser}
            onApproveAsset={handleApproveAsset}
          />
        )}

        {activeTab === 'audittrail' && <AuditTrailView />}

        {activeTab === 'automail' && <AutoMailSetupView />}
      </main>

      {/* Precision Industrial Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Factory className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">
              QM Asset Control Tracking System
            </span>
            <span className="text-slate-400">•</span>
            <span>Hana Microelectronics Public Co., Ltd. (Lamphun)</span>
          </div>
          {/* <div className="text-[11px] text-slate-400 font-mono">
            Design Spec: Precision Industrial Control • React + Tailwind CSS v4
          </div> */}
        </div>
      </footer>

      {/* Modals */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewAsset}
      />

      <EditAssetModal
        asset={editingAsset}
        isOpen={!!editingAsset}
        onClose={() => setEditingAsset(null)}
        onSave={handleSaveEditedAsset}
      />

      <DepreciationModal
        asset={depreciationAsset}
        onClose={() => setDepreciationAsset(null)}
      />

      <AssetHistoryModal
        asset={historyAsset}
        onClose={() => setHistoryAsset(null)}
      />
    </div>
  );
}

export default App;
