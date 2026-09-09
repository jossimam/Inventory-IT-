import React, { useState } from "react";
import { AppContextProvider } from "./contexts/AppContext";
import { useAppContext } from "./hooks/useAppContext";
import { useAuth } from "./hooks/useAuth";
import EditProfileModal from "./components/EditProfileModal";
import { UserCog, UserCheck } from "lucide-react";

// Core Layout components
import Sidebar from "./components/Sidebar";

// Pages
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import MasterDataPage from "./pages/MasterDataPage";
import MaintenancePage from "./pages/MaintenancePage";
import HelpdeskPage from "./pages/HelpdeskPage";
import BorrowingPage from "./pages/BorrowingPage";
import MovementPage from "./pages/MovementPage";
import ReportsPage from "./pages/ReportsPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import UsersAccessPage from "./pages/UsersAccessPage";
import TrainingTutorialsPage from "./pages/TrainingTutorialsPage";
import BlueprintPage from "./pages/BlueprintPage";

function AppContent() {
  const { activeTab } = useAppContext();
  const { currentUser } = useAuth();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // 1. If session is not logged in, render the Auth login screen
  if (!currentUser) {
    return <AuthPage />;
  }

  // 2. Define dynamic header title based on activeTab state
  const getHeaderTitle = () => {
    switch (activeTab) {
      case "dashboard": return "IT Analytics Board";
      case "inventory": return "Active IT Asset Inventory Register";
      case "master-data": return "Static Lookups & Master Settings Directory";
      case "maintenance": return "Workorder Diagnostics & Service Ledger";
      case "helpdesk": return "Technical Support Incident & SLA Console";
      case "borrowing": return "Temporary Loan & Hardware Custody Board";
      case "movement": return "Chain of Custody Location Movement Ledger";
      case "reports": return "Audit PDF & Spreadsheet Export Center";
      case "audit-logs": return "Operational System Changes & Activity Trails";
      case "access-control": return "Pengaturan Otorisasi Level Akses & Identitas Pengguna";
      case "tutorials": return "Pusat Materi Pelatihan & Tutorial IT Perubahan Sistem RS";
      case "blueprint": return "Developer Supabase Cloud Architect Handbook";
      default: return "Hospital Workspace Console";
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Global Dashboard Header */}
        <header className="bg-white border-b border-slate-100 h-16 shrink-0 flex items-center justify-between px-6 z-10 print:hidden">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-6 bg-blue-600 rounded"></span>
            <h1 className="text-sm font-bold text-slate-800 tracking-tight uppercase">
              {getHeaderTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            {/* System health state indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-150 rounded-xl text-[10px] text-slate-600 font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Local storage synced</span>
            </div>

            {/* Quick Edit Profile Badge */}
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 rounded-xl transition-all cursor-pointer text-slate-700 group"
              title="Klik untuk Edit Profil Saya"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover border border-slate-300 group-hover:border-blue-500"
              />
              <span className="font-bold text-xs truncate max-w-[120px] text-slate-800 group-hover:text-blue-700">
                {currentUser.name}
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.5 rounded uppercase hidden md:inline-block">
                {currentUser.role}
              </span>
              <UserCog className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </button>
          </div>
        </header>

        {/* Edit Profile Modal Triggered from Header or Sidebar */}
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
        />

        {/* Inner Workspace Panel */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          
          {/* Active Page Dispatch */}
          {activeTab === "dashboard" && <DashboardPage />}
          {activeTab === "inventory" && <InventoryPage />}
          {activeTab === "master-data" && <MasterDataPage />}
          {activeTab === "maintenance" && <MaintenancePage />}
          {activeTab === "helpdesk" && <HelpdeskPage />}
          {activeTab === "borrowing" && <BorrowingPage />}
          {activeTab === "movement" && <MovementPage />}
          {activeTab === "reports" && <ReportsPage />}
          {activeTab === "audit-logs" && <AuditLogsPage />}
          {activeTab === "access-control" && <UsersAccessPage />}
          {activeTab === "tutorials" && <TrainingTutorialsPage />}
          {activeTab === "blueprint" && <BlueprintPage />}

        </main>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}
