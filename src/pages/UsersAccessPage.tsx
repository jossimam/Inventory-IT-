import React, { useState } from "react";
import { User, UserRole } from "../types";
import { DEPARTMENTS } from "../data/mockData";
import { useAppContext } from "../hooks/useAppContext";
import { useAuth } from "../hooks/useAuth";
import {
  Users,
  ShieldCheck,
  UserPlus,
  KeyRound,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Lock,
  UserCheck,
  ShieldAlert,
  Building,
  Mail,
  Phone,
  Clock,
  Sliders,
  Check,
  X,
  RefreshCw,
  Info,
  BadgeCheck,
  Zap,
  Upload,
  Camera
} from "lucide-react";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
];

export default function UsersAccessPage() {
  const {
    users,
    addUser,
    editUser,
    deleteUser,
    updateUserProfile,
    permissions,
    updatePermissions
  } = useAppContext();

  const { currentUser, login: onSwitchUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"users" | "matrix" | "my-profile" | "policy">("users");

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modal states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Form states for New / Edit User
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    username: "",
    password: "",
    role: UserRole.ENTRY_DATA,
    department: DEPARTMENTS[0],
    phone: "",
    status: "Active",
    avatar: AVATAR_PRESETS[0]
  });

  // Self Profile Edit State
  const [myProfileData, setMyProfileData] = useState<{
    name: string;
    email: string;
    username: string;
    password: string;
    department: string;
    phone: string;
    avatar: string;
  }>({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    username: currentUser?.username || currentUser?.email?.split("@")[0] || "",
    password: currentUser?.password || "123456",
    department: currentUser?.department || DEPARTMENTS[0],
    phone: currentUser?.phone || "0812-3456-7890",
    avatar: currentUser?.avatar || AVATAR_PRESETS[0]
  });
  const [showSelfPassword, setShowSelfPassword] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");

  if (!currentUser) return null;

  // Filter Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesStatus = statusFilter === "All" || (u.status || "Active") === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate Metrics
  const totalUsers = users.length;
  const activeCount = users.filter((u) => (u.status || "Active") === "Active").length;
  const superAdminCount = users.filter((u) => u.role === UserRole.SUPER_ADMIN).length;
  const entryCount = users.filter((u) => u.role === UserRole.ENTRY_DATA).length;
  const kakonliCount = users.filter((u) => u.role === UserRole.KAKONLI).length;

  // Handle Add New User Submission
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const derivedUsername = formData.username?.trim() || formData.email.split("@")[0].toLowerCase();
    const derivedPassword = formData.password?.trim() || `${derivedUsername}123`;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      username: derivedUsername,
      password: derivedPassword,
      role: (formData.role as UserRole) || UserRole.ENTRY_DATA,
      department: formData.department || DEPARTMENTS[0],
      phone: formData.phone || "-",
      status: (formData.status as "Active" | "Inactive") || "Active",
      lastLogin: "Baru Dibuat",
      avatar: formData.avatar || AVATAR_PRESETS[0]
    };

    addUser(newUser);
    setIsAddUserOpen(false);
    resetForm();
  };

  // Handle Update User Submission
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !formData.name || !formData.email) return;

    const updated: User = {
      ...editingUser,
      name: formData.name,
      email: formData.email,
      username: formData.username?.trim() || editingUser.username || editingUser.email.split("@")[0],
      password: formData.password?.trim() || editingUser.password || "123456",
      role: (formData.role as UserRole) || editingUser.role,
      department: formData.department || editingUser.department,
      phone: formData.phone || editingUser.phone,
      status: (formData.status as "Active" | "Inactive") || editingUser.status,
      avatar: formData.avatar || editingUser.avatar
    };

    editUser(updated);
    setEditingUser(null);
    resetForm();
  };

  // Handle Confirm Delete User
  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    deleteUser(deletingUser.id);
    setDeletingUser(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      role: UserRole.ENTRY_DATA,
      department: DEPARTMENTS[0],
      phone: "",
      status: "Active",
      avatar: AVATAR_PRESETS[0]
    });
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      username: u.username || u.email.split("@")[0],
      password: u.password || `${u.username || "user"}123`,
      role: u.role,
      department: u.department || DEPARTMENTS[0],
      phone: u.phone || "",
      status: u.status || "Active",
      avatar: u.avatar || AVATAR_PRESETS[0]
    });
  };

  // Permission Matrix Toggle Helper
  const handleTogglePermission = (
    moduleKey: string,
    role: UserRole,
    permType: "read" | "create" | "update" | "delete" | "export"
  ) => {
    const updated = permissions.map((m) => {
      if (m.key === moduleKey) {
        const currentRolePerm = m.roles[role];
        return {
          ...m,
          roles: {
            ...m.roles,
            [role]: {
              ...currentRolePerm,
              [permType]: !currentRolePerm[permType]
            }
          }
        };
      }
      return m;
    });

    updatePermissions(updated);
  };

  // Save Self Profile Update
  const handleMyProfileFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file foto melebihi batas 5MB. Silakan pilih file foto yang lebih kecil.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setMyProfileData((prev) => ({ ...prev, avatar: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFormAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file foto melebihi batas 5MB. Silakan pilih file foto yang lebih kecil.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSelfProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(currentUser.id, {
      name: myProfileData.name,
      email: myProfileData.email,
      username: myProfileData.username,
      password: myProfileData.password,
      department: myProfileData.department,
      phone: myProfileData.phone,
      avatar: myProfileData.avatar
    });
    setProfileSuccessMsg("Profil identitas dan kredensial login pengguna berhasil diperbarui.");
    setTimeout(() => setProfileSuccessMsg(""), 3500);
  };

  return (
    <div className="space-y-6" id="users-access-control-view">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" /> Pengaturan Access Level & Identitas Pengguna
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Manajemen direktori akun pengguna, otorisasi level akses bertingkat, dan matriks hak akses modul SIMRS IT.
          </p>
        </div>

        {currentUser.role === UserRole.SUPER_ADMIN && (
          <button
            onClick={() => {
              resetForm();
              setIsAddUserOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Tambah Akun Pengguna
          </button>
        )}
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-800">{totalUsers}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Total Terdaftar</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-800">{activeCount}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Status Aktif</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-800">{superAdminCount}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Super Admin</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-800">{entryCount}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Entry Data</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-800">{kakonliCount}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Kakonli (Ka. Unit)</div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "users"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4" /> Direktori Identitas Akun ({filteredUsers.length})
        </button>

        <button
          onClick={() => setActiveTab("matrix")}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "matrix"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders className="w-4 h-4" /> Matriks Hak Akses Modul (RBAC)
        </button>

        <button
          onClick={() => setActiveTab("my-profile")}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "my-profile"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <UserCheck className="w-4 h-4" /> Profil Saya ({currentUser.name})
        </button>

        <button
          onClick={() => setActiveTab("policy")}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
            activeTab === "policy"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Info className="w-4 h-4" /> SOP & Kebijakan Keamanan
        </button>
      </div>

      {/* ==================== TAB 1: USERS DIRECTORY ==================== */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Search & Filters toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama staff, email, atau unit kerja..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto shrink-0">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 font-medium">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent text-slate-700 font-bold outline-none cursor-pointer"
                >
                  <option value="All">Semua Role</option>
                  <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                  <option value={UserRole.ENTRY_DATA}>Entry Data</option>
                  <option value={UserRole.KAKONLI}>Kakonli</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-xl text-xs">
                <span className="text-slate-400 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-slate-700 font-bold outline-none cursor-pointer"
                >
                  <option value="All">Semua Status</option>
                  <option value="Active">Aktif</option>
                  <option value="Inactive">Nonaktif</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((u) => {
              const isCurrentSession = currentUser.id === u.id;
              const isSuper = u.role === UserRole.SUPER_ADMIN;
              const isEntry = u.role === UserRole.ENTRY_DATA;
              const isActive = (u.status || "Active") === "Active";

              return (
                <div
                  key={u.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm transition-all relative flex flex-col justify-between ${
                    isCurrentSession
                      ? "border-blue-500/50 ring-2 ring-blue-500/10"
                      : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div>
                    {/* Header: Status Badge & Session Tag */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide border ${
                          isSuper
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : isEntry
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {u.role}
                      </span>

                      <div className="flex items-center gap-2">
                        {isCurrentSession && (
                          <span className="text-[9px] bg-blue-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase">
                            Sesi Anda
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold flex items-center gap-1 ${
                            isActive ? "text-emerald-600" : "text-slate-400"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                            }`}
                          ></span>
                          {isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                    </div>

                    {/* Main Avatar & User Details */}
                    <div className="flex items-start gap-3.5 mb-4">
                      <img
                        src={u.avatar || AVATAR_PRESETS[0]}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-800 text-sm truncate">{u.name}</h3>
                        <div className="text-slate-500 text-xs flex items-center gap-1.5 mt-0.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{u.email}</span>
                        </div>
                        <div className="text-slate-500 text-xs flex items-center gap-1.5 mt-0.5 truncate">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{u.department || "Unit Kerja Umum"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Meta info: Phone, Username, Password, Last Login */}
                    <div className="bg-slate-50 rounded-xl p-3 text-[11px] space-y-1.5 text-slate-600 font-medium mb-4 border border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1">
                          <KeyRound className="w-3 h-3 text-blue-500" /> Username:
                        </span>
                        <span className="font-bold text-slate-800 font-mono bg-blue-50/80 text-blue-800 px-1.5 py-0.5 rounded">
                          {u.username || u.email.split("@")[0]}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-500" /> Password:
                        </span>
                        <span className="font-bold text-slate-700 font-mono bg-slate-200/60 text-slate-800 px-1.5 py-0.5 rounded">
                          {u.password || "••••••"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Kontak HP:
                        </span>
                        <span className="font-semibold text-slate-700">{u.phone || "0812-XXXX-XXXX"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Login Terakhir:
                        </span>
                        <span className="font-semibold text-slate-700">{u.lastLogin || "Hari ini"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSwitchUser(u)}
                      disabled={isCurrentSession}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                        isCurrentSession
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-blue-50 hover:bg-blue-100 text-blue-700"
                      }`}
                      title="Ganti Sesi Login Aktif ke User Ini"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {isCurrentSession ? "Sesi Aktif" : "Switch User"}
                    </button>

                    {currentUser.role === UserRole.SUPER_ADMIN && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                          title="Sunting Identitas & Role"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingUser(u)}
                          disabled={isCurrentSession}
                          className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Revoke / Hapus Akun"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: RBAC PERMISSION MATRIX ==================== */}
      {activeTab === "matrix" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Matriks Otorisasi Level Akses Modular (Role-Based Access Control)</p>
              <p className="mt-0.5 text-amber-700">
                Pengaturan hak akses menentukan otorisasi operasi CRUD (Create, Read, Update, Delete, Export) untuk setiap tipe role di RSIA Bina Medika. Super Admin memiliki hak modifikasi matriks.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                    <th className="p-4 w-1/4">Modul Sistem IT</th>
                    <th className="p-4 text-center border-l border-slate-800 bg-rose-950/40 text-rose-200">
                      Super Admin
                    </th>
                    <th className="p-4 text-center border-l border-slate-800 bg-indigo-950/40 text-indigo-200">
                      Entry Data
                    </th>
                    <th className="p-4 text-center border-l border-slate-800 bg-amber-950/40 text-amber-200">
                      Kakonli (Ka. Unit)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {permissions.map((mod) => (
                    <tr key={mod.key} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-800 text-xs">{mod.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                          {mod.description}
                        </div>
                      </td>

                      {/* Super Admin Column */}
                      <td className="p-4 border-l border-slate-100 text-center bg-rose-50/20">
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {(["read", "create", "update", "delete", "export"] as const).map((pType) => {
                            const isAllowed = mod.roles[UserRole.SUPER_ADMIN][pType];
                            return (
                              <button
                                key={pType}
                                disabled={currentUser.role !== UserRole.SUPER_ADMIN}
                                onClick={() => handleTogglePermission(mod.key, UserRole.SUPER_ADMIN, pType)}
                                className={`px-2 py-1 rounded text-[10px] font-bold uppercase cursor-pointer transition-all ${
                                  isAllowed
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : "bg-slate-100 text-slate-400 border border-slate-200 line-through"
                                }`}
                              >
                                {pType}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Entry Data Column */}
                      <td className="p-4 border-l border-slate-100 text-center bg-indigo-50/20">
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {(["read", "create", "update", "delete", "export"] as const).map((pType) => {
                            const isAllowed = mod.roles[UserRole.ENTRY_DATA][pType];
                            return (
                              <button
                                key={pType}
                                disabled={currentUser.role !== UserRole.SUPER_ADMIN}
                                onClick={() => handleTogglePermission(mod.key, UserRole.ENTRY_DATA, pType)}
                                className={`px-2 py-1 rounded text-[10px] font-bold uppercase cursor-pointer transition-all ${
                                  isAllowed
                                    ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                                    : "bg-slate-100 text-slate-400 border border-slate-200 line-through"
                                }`}
                              >
                                {pType}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Kakonli Column */}
                      <td className="p-4 border-l border-slate-100 text-center bg-amber-50/20">
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {(["read", "create", "update", "delete", "export"] as const).map((pType) => {
                            const isAllowed = mod.roles[UserRole.KAKONLI][pType];
                            return (
                              <button
                                key={pType}
                                disabled={currentUser.role !== UserRole.SUPER_ADMIN}
                                onClick={() => handleTogglePermission(mod.key, UserRole.KAKONLI, pType)}
                                className={`px-2 py-1 rounded text-[10px] font-bold uppercase cursor-pointer transition-all ${
                                  isAllowed
                                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                                    : "bg-slate-100 text-slate-400 border border-slate-200 line-through"
                                }`}
                              >
                                {pType}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: MY PROFILE SETTINGS ==================== */}
      {activeTab === "my-profile" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col items-center text-center space-y-4">
            <img
              src={myProfileData.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 shadow-md"
            />
            <div>
              <h3 className="font-bold text-slate-800 text-base">{currentUser.name}</h3>
              <p className="text-slate-500 text-xs mt-0.5">{currentUser.email}</p>
              <div className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-full uppercase">
                {currentUser.role}
              </div>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Unit Kerja:</span>
                <span className="font-bold text-slate-700">{currentUser.department || "IT Dept"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">No. Telepon:</span>
                <span className="font-bold text-slate-700">{currentUser.phone || "0812-3456-7890"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Status Sesi:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Authorized
                </span>
              </div>
            </div>
          </div>

          {/* Self Edit Profile Form */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Sunting Informasi Identitas Saya</h3>
              <p className="text-slate-400 text-xs">Perbarui informasi nama, unit kerja, dan kontak pribadi akun Anda.</p>
            </div>

            {profileSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {profileSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveSelfProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    required
                    value={myProfileData.name}
                    onChange={(e) => setMyProfileData({ ...myProfileData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Alamat Email Resmi</label>
                  <input
                    type="email"
                    required
                    value={myProfileData.email}
                    onChange={(e) => setMyProfileData({ ...myProfileData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Username Login</label>
                  <input
                    type="text"
                    required
                    value={myProfileData.username}
                    onChange={(e) => setMyProfileData({ ...myProfileData, username: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Password Login</label>
                  <div className="relative">
                    <input
                      type={showSelfPassword ? "text" : "password"}
                      required
                      value={myProfileData.password}
                      onChange={(e) => setMyProfileData({ ...myProfileData, password: e.target.value })}
                      className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSelfPassword(!showSelfPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showSelfPassword ? <Lock className="w-4 h-4 text-blue-600" /> : <Lock className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Unit Kerja / Departemen</label>
                  <select
                    value={myProfileData.department}
                    onChange={(e) => setMyProfileData({ ...myProfileData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={myProfileData.phone}
                    onChange={(e) => setMyProfileData({ ...myProfileData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Avatar Preset & Upload Selector */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-slate-800 font-bold text-xs">Foto Profil & Avatar</label>
                    <p className="text-slate-400 text-[11px]">Upload foto dari galeri HP/PC Anda atau pilih avatar preset</p>
                  </div>

                  <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto Profil</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleMyProfileFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {!AVATAR_PRESETS.includes(myProfileData.avatar) && (
                    <div className="relative rounded-xl overflow-hidden border-2 border-blue-600 ring-2 ring-blue-500/20 shrink-0">
                      <img src={myProfileData.avatar} alt="Custom Upload Avatar" className="w-12 h-12 object-cover" />
                      <span className="absolute bottom-0 right-0 bg-blue-600 text-white p-0.5 rounded-tl text-[9px] font-bold">
                        Upload
                      </span>
                    </div>
                  )}

                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMyProfileData({ ...myProfileData, avatar: url })}
                      className={`relative rounded-xl overflow-hidden border-2 cursor-pointer shrink-0 transition-all ${
                        myProfileData.avatar === url ? "border-blue-600 ring-2 ring-blue-500/20 scale-105" : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img src={url} alt={`Avatar ${idx}`} className="w-12 h-12 object-cover" referrerPolicy="no-referrer" />
                      {myProfileData.avatar === url && (
                        <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center text-white">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Simpan Perubahan Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: SOP SECURITY POLICY ==================== */}
      {activeTab === "policy" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6 text-xs text-slate-600 leading-relaxed">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">SOP Keamanan Akses IT & Identitas RSIA Bina Medika</h3>
              <p className="text-slate-400 text-xs">Dokumen Referensi SOP-IT-SEC-004 versi 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Super Admin Privileges
              </div>
              <p className="text-slate-500 text-[11px]">
                Diberikan khusus untuk Tim Management IT & System Architect. Berhak melakukan provision user, mengubah skema database Supabase, dan menghapus inventaris.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Entry Data Privileges
              </div>
              <p className="text-slate-500 text-[11px]">
                Diberikan kepada Teknisi Field IT & Staff Inventaris. Berhak mendaftarkan alat baru, menginput maintenance, memproses loan alat, dan menangani helpdesk SLA.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Kakonli Privileges
              </div>
              <p className="text-slate-500 text-[11px]">
                Diberikan kepada Kepala Unit Kerja & Dokter Penanggung Jawab. Memiliki akses monitoring helpdesk, pelaporan masalah SIMRS, dan view inventaris alat unitnya.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD NEW USER ==================== */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" /> Registrasi Akun & Identitas Baru
              </h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap Staff</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: dr. Anita Wijaya, Sp.A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email Resmi RSIA</label>
                <input
                  type="email"
                  required
                  placeholder="anita@binamedika.co.id"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Username Login</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. anita"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Password Login</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. anita123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Role Otorisasi</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value={UserRole.ENTRY_DATA}>Entry Data</option>
                    <option value={UserRole.KAKONLI}>Kakonli</option>
                    <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Unit Kerja / Dept</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">No. Telepon</label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status Akun</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="Active">Aktif</option>
                    <option value="Inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-700 font-bold text-xs">Foto Profil / Avatar</label>
                  <label className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] cursor-pointer shadow-sm transition-all">
                    <Upload className="w-3 h-3" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFormAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {!AVATAR_PRESETS.includes(formData.avatar) && formData.avatar && (
                    <div className="relative rounded-lg overflow-hidden border-2 border-blue-600 shrink-0">
                      <img src={formData.avatar} alt="Uploaded Avatar" className="w-9 h-9 object-cover" />
                    </div>
                  )}
                  {AVATAR_PRESETS.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Preset"
                      onClick={() => setFormData({ ...formData, avatar: url })}
                      referrerPolicy="no-referrer"
                      className={`w-9 h-9 rounded-lg object-cover cursor-pointer border-2 transition-all ${
                        formData.avatar === url ? "border-blue-600 scale-105" : "border-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm"
                >
                  Buat Akun User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: EDIT USER ==================== */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-600" /> Sunting Akun: {editingUser.name}
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap Staff</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email Resmi</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Username Login</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Password Login</label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Role Otorisasi</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value={UserRole.ENTRY_DATA}>Entry Data</option>
                    <option value={UserRole.KAKONLI}>Kakonli</option>
                    <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Unit Kerja / Dept</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">No. Telepon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status Akun</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="Active">Aktif</option>
                    <option value="Inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-700 font-bold text-xs">Foto Profil / Avatar</label>
                  <label className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] cursor-pointer shadow-sm transition-all">
                    <Upload className="w-3 h-3" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFormAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {!AVATAR_PRESETS.includes(formData.avatar) && formData.avatar && (
                    <div className="relative rounded-lg overflow-hidden border-2 border-blue-600 shrink-0">
                      <img src={formData.avatar} alt="Uploaded Avatar" className="w-9 h-9 object-cover" />
                    </div>
                  )}
                  {AVATAR_PRESETS.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Preset"
                      onClick={() => setFormData({ ...formData, avatar: url })}
                      referrerPolicy="no-referrer"
                      className={`w-9 h-9 rounded-lg object-cover cursor-pointer border-2 transition-all ${
                        formData.avatar === url ? "border-blue-600 scale-105" : "border-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: DELETE CONFIRMATION ==================== */}
      {deletingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Cabut & Hapus Akun User?</h3>
              <p className="text-slate-500 mt-1">
                Akun pengguna <b className="text-slate-800">{deletingUser.name}</b> ({deletingUser.email}) akan dicabut otorisasi loginnya secara permanen.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-sm"
              >
                Hapus Akun Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
