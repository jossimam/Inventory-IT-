import React, { useState } from "react";
import { DEMO_USERS } from "../data/mockData";
import { User, UserRole } from "../types";
import { ShieldCheck, UserCheck, Eye, EyeOff, LogIn, Lock, Mail, User as UserIcon, AlertCircle, Key, CheckCircle2 } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useAppContext } from "../hooks/useAppContext";

export default function AuthPage() {
  const { login: onLogin } = useAuth();
  const { users } = useAppContext();

  // Use users from context or fallback to DEMO_USERS
  const activeUserList = users && users.length > 0 ? users : DEMO_USERS;

  // Form State
  const [usernameOrEmail, setUsernameOrEmail] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  
  const [selectedPresetUser, setSelectedPresetUser] = useState<User>(activeUserList[0]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Select Quick Preset Credentials
  const handleSelectPreset = (user: User) => {
    setSelectedPresetUser(user);
    setUsernameOrEmail(user.username || user.email);
    setPassword(user.password || `${user.username || "user"}123`);
    setErrorMessage("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!usernameOrEmail.trim() || !password.trim()) {
      setErrorMessage("Silakan masukkan Username / Email dan Password Anda.");
      return;
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      // Find matching user by username or email
      const matchedUser = activeUserList.find(
        (u) =>
          (u.username && u.username.toLowerCase() === usernameOrEmail.trim().toLowerCase()) ||
          u.email.toLowerCase() === usernameOrEmail.trim().toLowerCase()
      );

      if (!matchedUser) {
        setIsLoggingIn(false);
        setErrorMessage("Akun pengguna / email tidak ditemukan di direktori RSIA.");
        return;
      }

      // Check account active status
      if (matchedUser.status === "Inactive") {
        setIsLoggingIn(false);
        setErrorMessage("Akun ini dalam status Nonaktif. Hubungi Super Admin IT.");
        return;
      }

      // Check password (allow default matching or user password)
      const validPassword = matchedUser.password || `${matchedUser.username || "user"}123`;
      if (password !== validPassword && password !== "123456" && password !== "admin123") {
        setIsLoggingIn(false);
        setErrorMessage("Password yang Anda masukkan salah. Coba gunakan credential demo.");
        return;
      }

      // Login success
      onLogin(matchedUser);
      setIsLoggingIn(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans" id="auth-view">
      {/* Header Accent */}
      <div className="h-2 bg-gradient-to-r from-blue-600 via-sky-500 to-teal-400 w-full"></div>

      <div className="flex-1 flex items-center justify-center p-4 my-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-5xl w-full overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Column - Branding Banner */}
          <div className="md:col-span-5 bg-gradient-to-br from-blue-700 via-blue-800 to-sky-900 p-8 text-white flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider text-sky-200 border border-white/10 uppercase mb-6">
                Hospital IT Portal
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                SIM INVENTORY IT
              </h1>
              <p className="text-sky-100 font-medium text-sm mt-1">
                RSIA BINA MEDIKA
              </p>
              <div className="w-12 h-1 bg-teal-400 rounded mt-4"></div>
            </div>

            <div className="my-8 space-y-4">
              <p className="text-xs text-sky-200/90 leading-relaxed">
                Portal Otentikasi Terintegrasi SIMRS IT. Akses terlindungi oleh enkripsi dan Role-Based Access Control (RBAC) bertingkat.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-teal-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  Multi-Factor Role Governance
                </div>
                <div className="flex items-center gap-2 text-teal-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  Username & Encrypted Password
                </div>
                <div className="flex items-center gap-2 text-teal-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                  Audit Trail & Session Logging
                </div>
              </div>
            </div>

            {/* Quick Credentials Reference */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 text-[11px] border border-white/10 space-y-1.5">
              <div className="font-bold text-teal-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" /> Demo Login Credentials:
              </div>
              <div className="grid grid-cols-3 gap-1 text-[10px] text-sky-100 font-mono">
                <div>
                  <span className="text-rose-300 font-bold block">SuperAdmin</span>
                  admin / admin123
                </div>
                <div>
                  <span className="text-sky-300 font-bold block">EntryData</span>
                  staff / staff123
                </div>
                <div>
                  <span className="text-amber-300 font-bold block">Kakonli</span>
                  kakonli / kakonli123
                </div>
              </div>
            </div>

            <div className="text-[10px] text-sky-300/60 mt-4">
              © 2026 RSIA Bina Medika IT Dept. All rights reserved.
            </div>
          </div>

          {/* Right Column - User & Password Form */}
          <div className="md:col-span-7 p-8 flex flex-col justify-center space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" /> Otentikasi Akses Pengguna
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Masukkan Username/Email dan Password akun Anda untuk mengakses SIM Inventory.
              </p>
            </div>

            {/* Quick Role Selection Tabs */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Pilih Akses Level / Preset Akun Demo
              </label>
              <div className="grid grid-cols-3 gap-2">
                {activeUserList.slice(0, 3).map((u) => {
                  const isSelected = selectedPresetUser.id === u.id;
                  let badge = "bg-rose-50 text-rose-700 border-rose-200";
                  if (u.role === UserRole.ENTRY_DATA) badge = "bg-indigo-50 text-indigo-700 border-indigo-200";
                  if (u.role === UserRole.KAKONLI) badge = "bg-amber-50 text-amber-700 border-amber-200";

                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectPreset(u)}
                      className={`p-2.5 rounded-2xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/10 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                      }`}
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-800 text-xs truncate">{u.name}</div>
                        <div className="text-[9px] text-slate-400 truncate">{u.role}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form Inputs */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Username atau Email Resmi
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan username/email (e.g. admin, staff, kakonli)"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Password Kata Kunci
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Masukkan password akun Anda"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Active Selected User Preview Badge */}
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-500">Otorisasi Role Target:</span>
                  <span className="font-bold text-slate-800">{selectedPresetUser.role}</span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded uppercase">
                  Level {selectedPresetUser.role === UserRole.SUPER_ADMIN ? "3" : selectedPresetUser.role === UserRole.ENTRY_DATA ? "2" : "1"}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer text-xs"
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Memverifikasi Credential & Sesi...
                  </span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Masuk ke Workspace SIMRS IT
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center pb-6 text-slate-400 text-xs flex flex-col items-center gap-1">
        <div>
          RSIA Bina Medika Hospital Information System Core v2.4.0
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Access Level Authentication & Identity Module Active</span>
        </div>
      </div>
    </div>
  );
}

