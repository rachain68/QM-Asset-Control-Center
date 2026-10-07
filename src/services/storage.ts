import { Asset, User } from '../types/asset';
import { MOCK_USERS, INITIAL_ASSETS } from '../data/mockAssets';
import { calculateAgeInYears, convertToThb } from './depreciation';
import { logActivity } from './auditService';
import api from '../api';

const CURRENT_USER_KEY = 'qm_asset_control_center_user_v1';

export async function getStoredAssets(): Promise<Asset[]> {
  try {
    const response = await api.get('/assets');
    const assets: Asset[] = response.data;
    
    // Fallback to initial assets if db is empty just for preview purposes
    if (assets.length === 0) {
      return INITIAL_ASSETS.map((asset) => ({
        ...asset,
        ageYr: calculateAgeInYears(asset.receivedDate),
      }));
    }

    return assets.map((asset) => ({
      ...asset,
      ageYr: calculateAgeInYears(asset.receivedDate),
    }));
  } catch (err) {
    console.error('Failed to load assets from backend:', err);
    return [];
  }
}

export function getCurrentUser(): User {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      const defaultUser = MOCK_USERS[3]; // Level 2 Admin by default
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch (err) {
    return MOCK_USERS[3];
  }
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export async function addAsset(newAssetData: Omit<Asset, 'id' | 'itemNo' | 'ageYr' | 'amountThb' | 'lastUpdated'>): Promise<Asset> {
  const amountThb = convertToThb(newAssetData.invCost, newAssetData.currency, newAssetData.exchangeRateToThb);
  const currentUser = getCurrentUser();

  const fullAsset = {
    ...newAssetData,
    amountThb,
    requester: currentUser.name,
    reviewStatus: 'Waiting List',
  };

  try {
    const response = await api.post('/assets', fullAsset);
    const id = response.data.id || response.data.assetId;
    
    // Automatically Record Audit Log
 await logActivity(
      id,
      fullAsset.machineName,
      fullAsset.assetNo,
      'CREATED',
      currentUser.name,
      currentUser.role,
      `ลงทะเบียนสินทรัพย์ใหม่ (${fullAsset.machineName}) เข้าสู่ระบบ (${fullAsset.sourceSystem})`
    );

    return { ...fullAsset, id, itemNo: 0, ageYr: calculateAgeInYears(newAssetData.receivedDate), lastUpdated: new Date().toISOString() } as Asset;
  } catch (error) {
    console.error('Error adding asset to backend:', error);
    throw error;
  }
}

export async function updateAsset(updatedAsset: Asset): Promise<Asset> {
  const currentUser = getCurrentUser();
  const amountThb = convertToThb(updatedAsset.invCost, updatedAsset.currency, updatedAsset.exchangeRateToThb);

  const processed = {
    ...updatedAsset,
    amountThb,
  };

  try {
    await api.put(`/assets/${updatedAsset.id}`, processed);

 await logActivity(
      processed.id,
      processed.machineName,
      processed.assetNo,
      'UPDATED',
      currentUser.name,
      currentUser.role,
      `แก้ไขรายละเอียดสินทรัพย์ ${processed.machineName} (${processed.assetNo})`
    );

    return { ...processed, ageYr: calculateAgeInYears(updatedAsset.receivedDate) };
  } catch (error) {
    console.error('Error updating asset to backend:', error);
    throw error;
  }
}

export async function approveWaitingListAsset(id: string, bookValueThb: number, asset: Asset): Promise<Asset | null> {
  const currentUser = getCurrentUser();
  
  const approved = {
    ...asset,
    bookValueThb,
    reviewStatus: 'Active' as const,
  };

  try {
    await api.put(`/assets/${id}`, approved);

 await logActivity(
      id,
      asset.machineName,
      asset.assetNo,
      'APPROVED',
      currentUser.name,
      currentUser.role,
      `ทบทวนและอนุมัติระบุมูลค่า Book Value เป็น ${bookValueThb.toLocaleString()} THB และย้ายเข้า Master List`,
      [
        { field: 'bookValueThb', oldValue: asset.bookValueThb, newValue: bookValueThb },
        { field: 'reviewStatus', oldValue: asset.reviewStatus, newValue: 'Active' },
      ]
    );

    return { ...approved, ageYr: calculateAgeInYears(asset.receivedDate) };
  } catch (error) {
    console.error('Error approving asset:', error);
    return null;
  }
}

export function resetToInitialData(): Asset[] {
  // Not supported via API yet, just returning mock data
  return INITIAL_ASSETS;
}


export async function rejectWaitingListAsset(id: string, remark: string, asset: Asset): Promise<Asset | null> {
  const currentUser = getCurrentUser();
  const rejected = {
    ...asset,
    remark,
    reviewStatus: 'Rejected' as const,
  };
  try {
    await api.put(`/assets/${id}`, rejected);
    await logActivity(
      id,
      asset.machineName,
      asset.assetNo,
      'STATUS_CHANGED',
      currentUser.name,
      currentUser.role,
      `ไม่อนุมัติ (Rejected) เหตุผล: ${remark}`
    );
    return rejected;
  } catch (error) {
    console.error('Error rejecting asset:', error);
    throw error;
  }
}

export async function deleteAssetAPI(id: string): Promise<void> {
  try {
    await api.delete(`/assets/${id}`);
    const currentUser = getCurrentUser();
    if (currentUser) {
      await logActivity(
        id,
        'Unknown', // Ideally pass asset name
        'Unknown',
        'STATUS_CHANGED',
        currentUser.name,
        currentUser.role,
        `Deleted asset ${id}`
      );
    }
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
}
