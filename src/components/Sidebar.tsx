import React, { useState } from "react";
import { UserRole } from "../types";
import { useAppContext } from "../hooks/useAppContext";
import { useAuth } from "../hooks/useAuth";
import EditProfileModal from "./EditProfileModal";
import {
  LayoutDashboard,
  Database,
  Laptop,
  Wrench,
  HelpCircle,
  RefreshCw,
  FolderSync,
  FileSpreadsheet,
  FileCode2,
  History,
  ShieldCheck,
  GraduationCap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCog
} from "lucide-react";

export default function Sidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    sidebarCollapsed: collapsed, 
    setSidebarCollapsed: setCollapsed 
  } = useAppContext();
  
  const { currentUser, logout: onLogout } = useAuth();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  if (!currentUser) return null;
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "inventory", label: "IT Asset Inventory", icon: <Laptop className="w-5 h-5" /> },
    { id: "master-data", label: "Master Data", icon: <Database className="w-5 h-5" /> },
    { id: "maintenance", label: "Asset Maintenance", icon: <Wrench className="w-5 h-5" /> },
    { id: "helpdesk", label: "Helpdesk Tickets", icon: <HelpCircle className="w-5 h-5" /> },
    { id: "borrowing", label: "Asset Borrowing", icon: <RefreshCw className="w-5 h-5" /> },
    { id: "movement", label: "Asset Movement", icon: <FolderSync className="w-5 h-5" /> },
    { id: "reports", label: "Reports & Exports", icon: <FileSpreadsheet className="w-5 h-5" /> },
    { id: "audit-logs", label: "Audit Trails", icon: <History className="w-5 h-5" /> },
    { id: "access-control", label: "Akses & Identitas", icon: <ShieldCheck className="w-5 h-5" /> },
    { id: "tutorials", label: "Pelatihan & Tutorial IT", icon: <GraduationCap className="w-5 h-5" /> },
    { id: "blueprint", label: "Supabase Blueprint Hub", icon: <FileCode2 className="w-5 h-5" />, highlight: true }
  ];

  return (
    <aside
      className={`bg-slate-900 text-slate-100 flex flex-col justify-between transition-all duration-300 border-r border-slate-800 ${
        collapsed ? "w-20" : "w-64"
      } h-screen sticky top-0 shrink-0 z-20`}
    >
      <div>
        {/* Hospital Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {!collapsed ? (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                SIM INVENTORY IT
              </span>
              <span className="text-[10px] text-teal-300 font-medium tracking-wide uppercase">
                RSIA Bina Medika
              </span>
            </div>
          ) : (
            <div className="mx-auto">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center font-bold text-xs text-white">
                BM
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer hidden md:block"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Identity Panel */}
        <div className="p-3.5 border-b border-slate-800/60 bg-slate-950/20">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsEditProfileOpen(true)}
              title="Klik untuk Sunting Profil"
            />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-xs text-slate-200 truncate">{currentUser.name}</div>
                <div className="flex items-center justify-between gap-1 mt-1">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium tracking-wider uppercase border ${
                    currentUser.role === UserRole.SUPER_ADMIN
                      ? "bg-rose-950/40 text-rose-300 border-rose-900/50"
                      : currentUser.role === UserRole.ENTRY_DATA
                      ? "bg-blue-950/40 text-blue-300 border-blue-900/50"
                      : "bg-amber-950/40 text-amber-300 border-amber-900/50"
                  }`}>
                    {currentUser.role}
                  </span>

                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="text-[10px] text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    title="Sunting Profil Saya"
                  >
                    <UserCog className="w-3 h-3" /> Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu Links */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] scrollbar-thin">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left transition-all text-xs font-medium cursor-pointer relative group ${
                  isActive
                    ? item.highlight
                      ? "bg-teal-500 text-slate-900 font-semibold"
                      : "bg-blue-600 text-white font-semibold"
                    : item.highlight
                    ? "text-teal-400 hover:bg-slate-800/80 border border-teal-500/20 bg-teal-500/[0.02]"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                }`}
              >
                <div className="shrink-0">{item.icon}</div>
                {!collapsed ? (
                  <span className="truncate">{item.label}</span>
                ) : (
                  <div className="absolute left-16 bg-slate-950 text-white text-[11px] px-2.5 py-1.5 rounded shadow-xl border border-slate-800 hidden group-hover:block whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
                
                {/* Active Tab Indicator Bar */}
                {isActive && !collapsed && (
                  <div className={`absolute right-2 w-1.5 h-1.5 rounded-full ${item.highlight ? "bg-slate-900" : "bg-white"}`}></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Log out button at bottom */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-xs font-medium cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout Session</span>}
        </button>
      </div>

      {/* Edit Self Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </aside>
  );
}
