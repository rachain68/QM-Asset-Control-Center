export type MachineType = 'Analysis Equipment' | 'Measuring&Test Equipment' | 'Machine';
export type Currency = 'THB' | 'USD' | 'EUR' | 'JPY';
export type AssetStatus = 'Good' | 'Fair' | 'Poor' | 'Discontinue part' | 'Written off';
export type ReviewStatus = 'Waiting List' | 'Active' | 'Rejected';
export type SourceSystem = 'QM PM Web' | 'Hana Equipment Online Web' | 'Machine Buy-off Web' | 'Manual Fill up';
export type UserRole = 'Level 1 Owner' | 'Level 2 Admin';

export type AuditAction = 'CREATED' | 'UPDATED' | 'APPROVED' | 'IMPORTED' | 'STATUS_CHANGED';

export interface AuditFieldChange {
  field: string;
  oldValue: any;
  newValue: any;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  assetId: string;
  assetName: string;
  assetNo: string;
  action: AuditAction;
  performedBy: string;
  performedByRole: string;
  details: string;
  changes?: AuditFieldChange[];
}

export interface Asset {
  id: string;
  itemNo: number;
  machineName: string;
  brand: string;
  model: string;
  serialNo: string;
  boiNo: string;
  assetNo: string;
  machineNo: string;
  calibrationId: string;
  machineType: MachineType;
  receivedDate: string; // ISO date string YYYY-MM-DD
  ageYr: number; // Dynamically computed from receivedDate
  invoiceNo: string;
  invCost: number;
  currency: Currency;
  exchangeRateToThb: number;
  amountThb: number; // Computed invCost * exchangeRateToThb
  owner: string;
  location: string;
  plant: string;
  floor: string;
  area: string;
  bookValueThb: number | null; // Filled during CAL review
  status: AssetStatus;
  requireYN: 'Y' | 'N';
  remark: string;
  reviewStatus: ReviewStatus;
  sourceSystem: SourceSystem;
  lastUpdated: string;
  usefulLifeYears: number; // Default 7 years for QM Assets
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  location: string;
}

export interface DepreciationDetails {
  originalCostThb: number;
  usefulLifeYears: number;
  ageYears: number;
  accumulatedDepreciationThb: number;
  currentBookValueThb: number;
  annualDepreciationThb: number;
  isFullyDepreciated: boolean;
  remainingLifeYears: number;
}
