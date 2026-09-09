import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAppContext } from "../hooks/useAppContext";
import { UserRole, User } from "../types";
import EditProfileModal from "./EditProfileModal";
import {
  ShieldCheck,
  UserCheck,
  KeyRound,
  Lock,
  UserCog,
  LogOut,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Building,
  Mail,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  SlidersHorizontal,
  X
} from "lucide-react";

export default function AuthAccessBanner() {
  const { currentUser, login, logout } = useAuth();
  const { users } = useAppContext();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSwitchUserOpen, setIsSwitchUserOpen] = useState(false);

  if (!currentUser) return null;

  // Active users list
  const activeUserList = users && users.length > 0 ? users : [];

  // Define role specific permissions details
  const getRoleDetails = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return {
          title: "Super Admin (Akses Otorisasi Level 3)",
          color: "bg-rose-500/20 text-rose-200 border-rose-400/30",
          badgeBg: "bg-rose-600 text-white",
          description: "Hak Akses Penuh: Manajemen User, Hak Akses, Master Data, Audit Log & Developer Blueprint.",
          permissions: [
            { name: "Pengaturan Access Control", allowed: true, type: "Full Write" },
            { name: "Master Data & Lookups", allowed: true, type: "Full Write" },
            { name: "Audit Trail & System Logs", allowed: true, type: "Full Read/Export" },
            { name: "Registrasi & Mutasi Aset", allowed: true, type: "Full Write" },
            { name: "Developer Cloud Blueprint", allowed: true, type: "Full Config" }
          ]
        };
      case UserRole.ENTRY_DATA:
        return {
          title: "Entry Data Staff (Akses Otorisasi Level 2)",
          color: "bg-indigo-500/20 text-indigo-200 border-indigo-400/30",
          badgeBg: "bg-indigo-600 text-white",
          description: "Hak Akses Operasional: Input Aset Baru, Maintenance Log, Helpdesk Ticket & Peminjaman Hardware.",
          permissions: [
            { name: "Input & Update Inventaris", allowed: true, type: "Write" },
            { name: "Maintenance & Service Ledger", allowed: true, type: "Write" },
            { name: "Helpdesk Ticket Console", allowed: true, type: "Write" },
            { name: "Pengaturan Access Control", allowed: false, type: "Restricted" },
            { name: "Developer Cloud Blueprint", allowed: false, type: "Restricted" }
          ]
        };
      case UserRole.KAKONLI:
      default:
        return {
          title: "Kakonli / Kepala Unit (Akses Otorisasi Level 1)",
          color: "bg-amber-500/20 text-amber-200 border-amber-400/30",
          badgeBg: "bg-amber-600 text-white",
          description: "Hak Akses Eksekutif: Monitoring Dashboard Analytics, Telemetri Aset & Export Laporan PDF/Excel.",
          permissions: [
            { name: "Dashboard IT Telemetry", allowed: true, type: "Read-Only" },
            { name: "Export Laporan PDF/Excel", allowed: true, type: "Full Export" },
            { name: "Katalog Aset RS", allowed: true, type: "Read-Only" },
            { name: "Pengubahan Data Master", allowed: false, type: "Restricted" },
            { name: "Pengaturan Access Control", allowed: false, type: "Restricted" }
          ]
        };
    };
  };

  const roleInfo = getRoleDetails(currentUser.role);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-5 md:p-6 text-white shadow-xl border border-slate-800 space-y-4 relative overflow-hidden">
      
      {/* Decorative ambient background glow */}
      <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-10 -top-10 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Banner Header Flex Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        
        {/* User Identity Column */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Sesi Otentikasi Aktif"></span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white truncate">{currentUser.name}</h2>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${roleInfo.badgeBg} shadow-sm`}>
                {currentUser.role}
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Terverifikasi
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-300 text-xs mt-1 flex-wrap">
              <span className="flex items-center gap-1 font-mono text-slate-400">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> {currentUser.email}
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Building className="w-3.5 h-3.5 text-teal-400" /> {currentUser.department}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & Switch Role Button */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          
          <button
            onClick={() => setIsSwitchUserOpen(true)}
            className="px-3.5 py-2 bg-blue-600/80 hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 border border-blue-400/30 shadow-sm cursor-pointer"
            title="Ganti atau Switch Akun Otentikasi Role Pengguna"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-200" />
            <span>Ganti Akun Role</span>
          </button>

          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
          >
            <UserCog className="w-3.5 h-3.5 text-teal-300" />
            <span>Sunting Profil</span>
          </button>

          <button
            onClick={logout}
            className="px-3 py-2 bg-rose-950/50 hover:bg-rose-900/80 text-rose-200 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 border border-rose-800/40 cursor-pointer"
            title="Keluar dari Sesi Otentikasi"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Role Capabilities & Module Access Summary Bar */}
      <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs relative z-10">
        
        {/* Role summary message */}
        <div className="md:col-span-5 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-slate-200 text-[11px] mb-0.5">{roleInfo.title}</div>
            <p className="text-slate-400 text-[10px] leading-relaxed">{roleInfo.description}</p>
          </div>
        </div>

        {/* Live Permission Badges Grid */}
        <div className="md:col-span-7 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-full mb-1 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3 h-3 text-teal-400" /> Otorisasi Akses Modul Aktif:
          </div>
          
          {roleInfo.permissions.map((p, idx) => (
            <span
              key={idx}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border flex items-center gap-1.5 ${
                p.allowed
                  ? "bg-emerald-950/50 text-emerald-300 border-emerald-800/50"
                  : "bg-slate-950/50 text-slate-500 border-slate-800/60 line-through opacity-70"
              }`}
            >
              {p.allowed ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : (
                <Lock className="w-3 h-3 text-slate-500 shrink-0" />
              )}
              <span>{p.name}</span>
              <span className="text-[9px] font-mono opacity-80 font-normal">({p.type})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* Quick Switch Role Modal */}
      {isSwitchUserOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-slate-800 shadow-2xl space-y-4 border border-slate-100 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Ganti Akun & Access Role</h3>
                  <p className="text-slate-500 text-xs">Pilih akun pengguna terdaftar untuk simulasi otentikasi role</p>
                </div>
              </div>
              <button
                onClick={() => setIsSwitchUserOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Registered Accounts */}
            <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin pr-1">
              {activeUserList.map((user) => {
                const isCurrent = user.id === currentUser.id;
                let badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
                if (user.role === UserRole.ENTRY_DATA) badgeClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
                if (user.role === UserRole.KAKONLI) badgeClass = "bg-amber-50 text-amber-700 border-amber-200";

                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      login(user);
                      setIsSwitchUserOpen(false);
                    }}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-sm"
                        : "bg-slate-50/70 hover:bg-slate-100/80 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-xs flex items-center gap-2">
                          <span className="truncate">{user.name}</span>
                          {isCurrent && (
                            <span className="bg-blue-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                              AKUN AKTIF
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate">{user.email}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Unit: {user.department}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${badgeClass}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px]">Sistem RSIA Bina Medika Multi-Role RBAC</span>
              <button
                onClick={() => setIsSwitchUserOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
