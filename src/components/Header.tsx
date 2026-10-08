import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  Mail,
  PlusCircle,
  LayoutDashboard,
  ListFilter,
  Clock,
  History,
  Menu,
  X,
  Factory,
  LogOut,
  Users,
  ClipboardList
} from 'lucide-react';
import { Button } from './common/Button';
import { useAuth } from '../contexts/AuthContext';
import { AssetHistoryModal } from './AssetHistoryModal';
import { Asset } from '../types/asset';
import { Bell, Search as SearchIcon } from 'lucide-react';

interface HeaderProps {
  assets: Asset[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  waitingListCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  assets,
  activeTab,
  onTabChange,
  waitingListCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const isAdmin = currentUser?.role === 'Level 2 Admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedSearchAsset, setSelectedSearchAsset] = useState<Asset | null>(null);

  const searchResults = searchQuery
    ? assets.filter(a => 
        (a.assetNo && a.assetNo.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (a.machineName && a.machineName.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const rejectedCount = assets.filter(a => 
    a.reviewStatus === 'Rejected' && a.requester && currentUser?.name && 
    (a.requester === currentUser.name || currentUser.name.includes(a.requester))
  ).length;

  const notificationCount = isAdmin ? waitingListCount : rejectedCount;
  
  const handleNotificationClick = () => {
    setShowNotifications(false);
    if (isAdmin) {
      onTabChange('waitinglist');
    } else {
      onTabChange('requests');
    }
  };


  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'masterlist',
      label: 'Master List',
      icon: <ListFilter className="w-4 h-4" />,
    },
    {
      id: 'requests',
      label: 'My Requests',
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      id: 'waitinglist',
      label: 'Waiting Review',
      icon: <Clock className="w-4 h-4 text-sky-600" />,
      badge: waitingListCount > 0 ? waitingListCount : undefined,
    },
  ];

  if (isAdmin) {
    navItems.push(
      {
        id: 'audittrail',
        label: 'Audit Trail',
        icon: <History className="w-4 h-4 text-emerald-600" />,
      },
      {
        id: 'automail',
        label: 'Auto Mail Setup',
        icon: <Mail className="w-4 h-4 text-purple-600" />,
      },
      {
        id: 'users',
        label: 'User Setup',
        icon: <Users className="w-4 h-4 text-amber-600" />,
        badge: undefined
      }
    );
  }

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Precision Industrial Top Micro-bar */}
      <div className="bg-[#0f172a] text-slate-300 text-[11px] py-1 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Factory className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold text-slate-200 tracking-wider uppercase">
              Hana Microelectronics (Lamphun)
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">Quality Management Department</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <div className="flex items-center space-x-2 border-r border-slate-700 pr-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-200 font-semibold">{currentUser?.name}</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400/90">{currentUser?.role}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-slate-400 hover:text-red-400 transition-colors"
              title="ออกจากระบบ"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 ">
          {/* Logo & Platform Title */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded bg-[#006194] text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold tracking-widest text-[#006194] uppercase">
                  QM Asset Control
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-[#0b1c30] tracking-tight">
                Asset Control Center
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/80 p-1 rounded border border-slate-200">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative flex items-center space-x-2 px-3 py-1.5 rounded text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-[#006194] shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-sky-600 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            

                        {/* Global Search */}
            <div className="relative hidden sm:block">
              <div className="relative flex items-center">
                <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="ค้นหาด่วน..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                  className="pl-9 pr-3 py-1.5 w-48 lg:w-64 text-xs rounded-full border border-slate-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
              
              {showSearch && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-md shadow-lg z-50 overflow-hidden">
                  {searchResults.map(a => (
                    <div 
                      key={a.id} 
                      onClick={() => setSelectedSearchAsset(a)}
                      className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                    >
                      <div className="text-xs font-bold text-sky-700">{a.assetNo}</div>
                      <div className="text-[10px] text-slate-600 truncate">{a.machineName}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-md shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                    การแจ้งเตือน (Notifications)
                  </div>
                  {notificationCount > 0 ? (
                    <div 
                      onClick={handleNotificationClick}
                      className="px-4 py-3 hover:bg-sky-50 cursor-pointer transition-colors"
                    >
                      <div className="text-xs font-semibold text-slate-800">
                        {isAdmin ? 'รายการรอการอนุมัติ (Waiting)' : 'รายการคำขอถูกตีกลับ (Rejected)'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        คุณมี {notificationCount} รายการที่ต้องตรวจสอบ
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-4 text-center text-xs text-slate-500">
                      ไม่มีการแจ้งเตือนใหม่
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-5 shadow-xl animate-fadeIn">
          {/* Mobile User Info */}
          <div className="mb-3 p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">{currentUser?.name}</span>
                <span className="text-xs text-slate-500">{currentUser?.role}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>



          {/* Navigation Links */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-[#006194] border border-sky-200 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <AssetHistoryModal asset={selectedSearchAsset} onClose={() => setSelectedSearchAsset(null)} />
    </header>
  );
};
