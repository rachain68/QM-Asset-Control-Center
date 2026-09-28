import { Asset, User } from '../types/asset';
import { INITIAL_ASSETS, MOCK_USERS } from '../data/mockAssets';
import { calculateAgeInYears, convertToThb } from './depreciation';
import { logActivity } from './auditService';

const STORAGE_KEY = 'qm_asset_control_center_assets_v1';
const CURRENT_USER_KEY = 'qm_asset_control_center_user_v1';

export function getStoredAssets(): Asset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ASSETS));
      return INITIAL_ASSETS;
    }
    const assets: Asset[] = JSON.parse(raw);
    return assets.map((asset) => ({
      ...asset,
      ageYr: calculateAgeInYears(asset.receivedDate),
    }));
  } catch (err) {
    console.error('Failed to load assets from storage:', err);
    return INITIAL_ASSETS;
  }
}

export function saveAssets(assets: Asset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  } catch (err) {
    console.error('Failed to save assets:', err);
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

export function addAsset(newAssetData: Omit<Asset, 'id' | 'itemNo' | 'ageYr' | 'amountThb' | 'lastUpdated'>): Asset {
  const assets = getStoredAssets();
  const nextItemNo = assets.length > 0 ? Math.max(...assets.map((a) => a.itemNo)) + 1 : 1;
  const id = `ast-${Date.now()}`;
  const amountThb = convertToThb(newAssetData.invCost, newAssetData.currency, newAssetData.exchangeRateToThb);
  const ageYr = calculateAgeInYears(newAssetData.receivedDate);
  const currentUser = getCurrentUser();

  const fullAsset: Asset = {
    ...newAssetData,
    id,
    itemNo: nextItemNo,
    amountThb,
    ageYr,
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  const updatedAssets = [fullAsset, ...assets];
  saveAssets(updatedAssets);

  // Automatically Record Audit Log
  logActivity(
    id,
    fullAsset.machineName,
    fullAsset.assetNo,
    'CREATED',
    currentUser.name,
    currentUser.role,
    `ลงทะเบียนสินทรัพย์ใหม่ (${fullAsset.machineName}) เข้าสู่ระบบ (${fullAsset.sourceSystem})`
  );

  return fullAsset;
}

export function updateAsset(updatedAsset: Asset): Asset {
  const assets = getStoredAssets();
  const currentUser = getCurrentUser();
  const amountThb = convertToThb(updatedAsset.invCost, updatedAsset.currency, updatedAsset.exchangeRateToThb);
  const ageYr = calculateAgeInYears(updatedAsset.receivedDate);

  const existing = assets.find((a) => a.id === updatedAsset.id);

  const processed: Asset = {
    ...updatedAsset,
    amountThb,
    ageYr,
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  const updatedList = assets.map((a) => (a.id === processed.id ? processed : a));
  saveAssets(updatedList);

  // Record Audit Log for Updates
  if (existing) {
    const details = existing.status !== processed.status
      ? `เปลี่ยนสถานะสภาพเครื่องจาก ${existing.status} เป็น ${processed.status}`
      : `แก้ไขรายละเอียดสินทรัพย์ ${processed.machineName} (${processed.assetNo})`;

    logActivity(
      processed.id,
      processed.machineName,
      processed.assetNo,
      existing.status !== processed.status ? 'STATUS_CHANGED' : 'UPDATED',
      currentUser.name,
      currentUser.role,
      details
    );
  }

  return processed;
}

export function approveWaitingListAsset(id: string, bookValueThb: number): Asset | null {
  const assets = getStoredAssets();
  const currentUser = getCurrentUser();
  const target = assets.find((a) => a.id === id);
  if (!target) return null;

  const approved: Asset = {
    ...target,
    bookValueThb,
    reviewStatus: 'Active',
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  saveAssets(assets.map((a) => (a.id === id ? approved : a)));

  // Record Audit Log for CAL Approval
  logActivity(
    approved.id,
    approved.machineName,
    approved.assetNo,
    'APPROVED',
    currentUser.name,
    currentUser.role,
    `ทบทวนและอนุมัติระบุมูลค่า Book Value เป็น ${bookValueThb.toLocaleString()} THB และย้ายเข้า Master List`,
    [
      { field: 'bookValueThb', oldValue: target.bookValueThb, newValue: bookValueThb },
      { field: 'reviewStatus', oldValue: target.reviewStatus, newValue: 'Active' },
    ]
  );

  return approved;
}

export function resetToInitialData(): Asset[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ASSETS));
  return INITIAL_ASSETS;
}
