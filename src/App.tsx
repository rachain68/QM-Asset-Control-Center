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
import { LoginView } from './components/LoginView';
import { UserManagementView } from './components/UserManagementView';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { CheckCircle2, Factory, Loader2 } from 'lucide-react';

export function AppContent() {
  const { isAuthenticated, currentUser } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [depreciationAsset, setDepreciationAsset] = useState<Asset | null>(null);
  const [historyAsset, setHistoryAsset] = useState<Asset | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadAssets = async () => {
    const data = await getStoredAssets();
    setAssets(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAssets();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveNewAsset = async (
    assetData: Omit<Asset, 'id' | 'itemNo' | 'ageYr' | 'amountThb' | 'lastUpdated'>
  ) => {
    try {
      const created = await addAsset(assetData);
      await loadAssets();
      showToast(`ลงทะเบียนสินทรัพย์ "${created.machineName}" เรียบร้อยแล้ว (บันทึกใน Audit Trail)`);
      setActiveTab('waitinglist');
    } catch (error) {
      showToast('Error saving asset to backend');
    }
  };

  const handleSaveEditedAsset = async (updated: Asset) => {
    try {
      await updateAsset(updated);
      await loadAssets();
      showToast(`แก้ไขข้อมูลสินทรัพย์ "${updated.machineName}" เรียบร้อยแล้ว`);
    } catch (error) {
      showToast('Error updating asset');
    }
  };

  const handleImportAssets = async () => {
    await loadAssets();
  };

  const handleApproveAsset = async (id: string, bookValueThb: number) => {
    console.log('handleApproveAsset called with id:', id, 'val:', bookValueThb);
    const assetToApprove = assets.find((a) => a.id === id);
    if (!assetToApprove) {
      console.error('Asset not found in state:', id);
      return;
    }
    try {
      console.log('Calling storage approveWaitingListAsset...');
      const approved = await approveWaitingListAsset(id, bookValueThb, assetToApprove);
      console.log('Result from storage:', approved);
      if (approved) {
        await loadAssets();
        showToast(
          `อนุมัติและระบุ Book Value (${bookValueThb.toLocaleString()} THB) บันทึก Audit Log เรียบร้อย`
        );
      }
    } catch (error) {
      console.error('Error approving asset in App.tsx:', error);
      showToast('Error approving asset');
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

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface antialiased font-sans">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        waitingListCount={waitingCount}
      />

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#006194] text-white px-4 py-3 rounded shadow-xl flex items-center space-x-2.5 border border-sky-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-sky-200 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === 'dashboard' && <DashboardView assets={assets} onNavigate={setActiveTab} />}
        
        {activeTab === 'masterlist' && (
          <MasterListView
            assets={assets}
            currentUser={currentUser!}
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
            currentUser={currentUser!}
            onApproveAsset={handleApproveAsset}
          />
        )}

        {activeTab === 'audittrail' && <AuditTrailView />}

        {activeTab === 'automail' && <AutoMailSetupView />}

        {activeTab === 'users' && currentUser?.role === 'Level 2 Admin' && <UserManagementView />}
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

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
