import React from 'react';
import { Asset } from '../types/asset';
import { calculateDepreciation, formatCurrency } from '../services/depreciation';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ShieldAlert,
  TrendingDown,
  DollarSign,
  PackageCheck,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CalendarClock,
  Layers,
} from 'lucide-react';
import { KpiCard } from './common/KpiCard';
import { Button } from './common/Button';
import { StatusBadge } from './common/StatusBadge';
import { useAuth } from '../contexts/AuthContext';

interface DashboardViewProps {
  assets: Asset[];
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ assets: initialAssets, onNavigate }) => {
  const { currentUser } = useAuth();
  
  // Filter assets based on role
  const assets = currentUser?.role === 'Level 1 Owner' 
    ? initialAssets.filter(a => a.location === currentUser.location)
    : initialAssets;

  const activeAssets = assets.filter((a) => a.reviewStatus === 'Active');
  const waitingAssets = assets.filter((a) => a.reviewStatus === 'Waiting List');

  // Metrics
  const totalAssetsCount = assets.length;
  const totalPurchaseCostThb = assets.reduce((sum, a) => sum + a.amountThb, 0);

  const totalBookValueThb = assets.reduce((sum, a) => {
    const dep = calculateDepreciation(a.amountThb, a.receivedDate, a.usefulLifeYears, a.bookValueThb);
    return sum + dep.currentBookValueThb;
  }, 0);

  const over7YearsCount = assets.filter((a) => a.ageYr >= 7).length;

  // Chart Data: Machine Type Breakdown
  const typeMap: Record<string, number> = {};
  assets.forEach((a) => {
    typeMap[a.machineType] = (typeMap[a.machineType] || 0) + 1;
  });
  const typeChartData = Object.keys(typeMap).map((key) => ({
    name: key,
    value: typeMap[key],
  }));

  // Chart Data: Status Breakdown
  const statusMap: Record<string, number> = {};
  assets.forEach((a) => {
    statusMap[a.status] = (statusMap[a.status] || 0) + 1;
  });
  const statusChartData = Object.keys(statusMap).map((key) => ({
    name: key,
    value: statusMap[key],
  }));

  // Precise Colors from DESIGN.md
  const COLORS_TYPE = ['#006194', '#0284c7', '#7c3aed', '#545f73', '#0051d5'];
  const COLORS_STATUS: Record<string, string> = {
    Good: '#059669',
    Fair: '#d97706',
    Poor: '#e11d48',
    'Discontinue part': '#7c3aed',
    'Written off': '#545f73',
  };

  // Bar Chart Data: Age distribution
  const ageDistribution = [
    { range: '0 - 3 Yrs', count: assets.filter((a) => a.ageYr < 3).length },
    { range: '3 - 5 Yrs', count: assets.filter((a) => a.ageYr >= 3 && a.ageYr < 5).length },
    { range: '5 - 7 Yrs', count: assets.filter((a) => a.ageYr >= 5 && a.ageYr < 7).length },
    { range: '7+ Yrs (Fully Dep)', count: assets.filter((a) => a.ageYr >= 7).length },
  ];

  return (
    <div className="space-y-5">
      {/* Title & Overview Banner (Industrial Level 1 Surface) */}
      <div className="glass-panel p-4 sm:p-6 bg-gradient-to-r from-sky-50/90 via-slate-50/70 to-white border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#006194]">
                Executive Telemetry
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-sky-100 text-sky-800 border border-sky-200">
                ACTIVE CYCLE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] tracking-tight mt-1">
              Precision Asset Control Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              ภาพรวมการบริหารจัดการสินทรัพย์ มูลค่าตามบัญชี (Book Value) และแผนงบประมาณอุปกรณ์แผนก QM
              ตามเกณฑ์มาตรฐานการตรวจสอบคุณภาพฮานา ลำพูน
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="action-cyan"
              size="md"
              icon={<ArrowUpRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => onNavigate('waitinglist')}
            >
              Waiting Review ({waitingAssets.length})
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Standardized KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <KpiCard
          title="Total QM Assets"
          value={totalAssetsCount}
          unit="Items"
          subtitle={`${activeAssets.length} Active in Master List`}
          icon={<PackageCheck className="w-5 h-5 text-[#006194]" />}
          iconBgColor="bg-sky-50 border-sky-100"
          accentColor="text-[#006194]"
          trend={{
            text: '100% Monitored in System',
            isPositive: true,
          }}
          onClick={() => onNavigate('masterlist')}
        />

        <KpiCard
          title="Total Purchase Cost"
          value={formatCurrency(totalPurchaseCostThb)}
          subtitle="มูลค่าต้นทุนสั่งซื้อสินทรัพย์ทั้งหมด (THB)"
          icon={<DollarSign className="w-5 h-5 text-sky-600" />}
          iconBgColor="bg-sky-50 border-sky-100"
          accentColor="text-[#0284c7]"
          trend={{
            text: 'Original Acquisition Cost',
          }}
        />

        <KpiCard
          title="Current Book Value"
          value={formatCurrency(totalBookValueThb)}
          subtitle="มูลค่าคงเหลือหลังหักค่าเสื่อมสะสม (7-Yr Life)"
          icon={<TrendingDown className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 border-emerald-100"
          accentColor="text-emerald-600"
          trend={{
            text: `Book Ratio: ${((totalBookValueThb / (totalPurchaseCostThb || 1)) * 100).toFixed(1)}%`,
            isPositive: true,
          }}
        />

        <KpiCard
          title="Useful Life Alert"
          value={over7YearsCount}
          unit="Items (≥ 7 Yrs)"
          subtitle="ครบอายุการใช้งาน 7 ปี (ควรวางแผนงบประมาณ)"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          iconBgColor="bg-amber-50 border-amber-100"
          accentColor="text-amber-600"
          trend={{
            text: 'Replacement Budget Planning Due',
            isWarning: true,
          }}
          badge={<StatusBadge status="Calibration Due" size="sm" />}
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Chart 1: Equipment Type Distribution */}
        <div className="glass-panel p-4 sm:p-5 bg-white border border-slate-200 rounded-md">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#006194]" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
                Machine Type Breakdown
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">ประเภทเครื่องจักร</span>
          </div>
          <div className="h-60 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {typeChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS_TYPE[index % COLORS_TYPE.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.08)',
                    fontFamily: 'IBM Plex Sans',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: '11px',
                    fontFamily: 'IBM Plex Sans',
                    color: '#475569',
                    paddingTop: '6px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Health Breakdown */}
        <div className="glass-panel p-4 sm:p-5 bg-white border border-slate-200 rounded-md">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
                Equipment Operational Health
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">สถานะสภาพเครื่อง</span>
          </div>
          <div className="h-60 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusChartData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS_STATUS[entry.name] || '#64748b'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.08)',
                    fontFamily: 'IBM Plex Sans',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: '11px',
                    fontFamily: 'IBM Plex Sans',
                    color: '#475569',
                    paddingTop: '6px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Age & Useful Life Breakdown */}
        <div className="glass-panel p-4 sm:p-5 bg-white border border-slate-200 rounded-md">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <CalendarClock className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide uppercase">
                Asset Age Distribution (7-Yr Rule)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">ช่วงอายุสินทรัพย์</span>
          </div>
          <div className="h-60 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'IBM Plex Sans' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.08)',
                    fontFamily: 'IBM Plex Sans',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#006194" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Review Alert Notice */}
      {waitingAssets.length > 0 && (
        <div className="glass-panel p-4 bg-sky-50/90 border-sky-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-md">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-8 h-8 rounded bg-sky-200/60 text-sky-800 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <ShieldAlert className="w-5 h-5 text-sky-700" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-sky-950">
                มีสินทรัพย์ใหม่รอทีม CAL Review จำนวน {waitingAssets.length} รายการ
              </h4>
              <p className="text-xs text-sky-800 mt-0.5">
                กรุณาตรวจสอบความถูกต้องและระบุ Book Value (THB) เพื่อนำเข้า QM Asset Master list
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('waitinglist')}
            className="self-start sm:self-auto shrink-0"
          >
            Review Waiting List
          </Button>
        </div>
      )}
    </div>
  );
};
