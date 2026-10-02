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
  Users
} from 'lucide-react';
import { Button } from './common/Button';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAddModal: () => void;
  waitingListCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenAddModal,
  waitingListCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const isAdmin = currentUser?.role === 'Level 2 Admin';

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
            <span className="hidden md:inline text-slate-400">System Mode:</span>
            <span className="px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono">
              ONLINE
            </span>
            <span className="text-slate-400 font-mono text-[10px]">v1.0.0-PRO</span>
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
            <Button
              variant="primary"
              size="sm"
              icon={<PlusCircle className="w-4 h-4" />}
              onClick={onOpenAddModal}
              className="hidden sm:inline-flex"
            >
              Add Asset
            </Button>

            {/* Current User Info */}
            <div className="hidden md:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-none">{currentUser?.name}</span>
                <span className="text-[10px] text-slate-500">{currentUser?.role}</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="ออกจากระบบ"
              className="hidden md:flex p-1.5 rounded text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>

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

          {/* Mobile Quick Add Button */}
          <div className="mb-3">
            <Button
              variant="primary"
              size="md"
              icon={<PlusCircle className="w-4 h-4" />}
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAddModal();
              }}
              className="w-full justify-center"
            >
              Add New Asset
            </Button>
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
    </header>
  );
};
