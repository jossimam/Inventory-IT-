import React, { useState, useEffect } from "react";
import { User } from "../types";
import { DEPARTMENTS } from "../data/mockData";
import { useAppContext } from "../hooks/useAppContext";
import { useAuth } from "../hooks/useAuth";
import {
  UserCheck,
  X,
  Check,
  Mail,
  User as UserIcon,
  Lock,
  Phone,
  Building,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Upload,
  Camera,
  Image
} from "lucide-react";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { updateUserProfile } = useAppContext();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    username: currentUser?.username || currentUser?.email?.split("@")[0] || "",
    password: currentUser?.password || "123456",
    department: currentUser?.department || DEPARTMENTS[0],
    phone: currentUser?.phone || "0812-3456-7890",
    avatar: currentUser?.avatar || AVATAR_PRESETS[0]
  });

  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        username: currentUser.username || currentUser.email.split("@")[0],
        password: currentUser.password || "123456",
        department: currentUser.department || DEPARTMENTS[0],
        phone: currentUser.phone || "0812-3456-7890",
        avatar: currentUser.avatar || AVATAR_PRESETS[0]
      });
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.username) return;

    updateUserProfile(currentUser.id, {
      name: formData.name.trim(),
      email: formData.email.trim(),
      username: formData.username.trim(),
      password: formData.password.trim(),
      department: formData.department,
      phone: formData.phone.trim(),
      avatar: formData.avatar
    });

    setSuccessMsg("Profil akun berhasil diperbarui dan disinkronkan ke sistem!");
    setTimeout(() => {
      setSuccessMsg("");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-xs max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Sunting Profil Pengguna</h3>
              <p className="text-slate-400 text-[11px]">Perbarui informasi identitas, foto avatar, dan kredensial login Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* User Card Preview */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white flex items-center gap-4 shadow-sm border border-slate-700">
          <img
            src={formData.avatar}
            alt={formData.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-full object-cover border-2 border-white/20 shadow shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="font-bold text-sm truncate text-white">{formData.name || "Nama Pengguna"}</div>
            <div className="text-slate-300 text-[11px] truncate font-mono">{formData.email}</div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
                {currentUser.role}
              </span>
              <span className="text-slate-400 text-[10px] font-medium">
                Unit: {formData.department}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Avatar Selector */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-slate-800 font-bold text-xs">Foto Profil & Avatar</label>
                <p className="text-slate-400 text-[11px]">Upload foto diri dari galeri perangkat atau pilih preset avatar RS</p>
              </div>

              {/* File Upload Button */}
              <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm transition-all cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Foto Baru</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
              {/* If current avatar is a custom upload (Data URL or non-preset), show custom uploaded item */}
              {!AVATAR_PRESETS.includes(formData.avatar) && (
                <div className="relative rounded-xl overflow-hidden border-2 border-blue-600 ring-2 ring-blue-500/20 shrink-0">
                  <img src={formData.avatar} alt="Custom Upload" className="w-11 h-11 object-cover" />
                  <span className="absolute bottom-0 right-0 bg-blue-600 text-white p-0.5 rounded-tl text-[9px] font-bold">
                    Upload
                  </span>
                </div>
              )}

              {AVATAR_PRESETS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: url })}
                  className={`relative rounded-xl overflow-hidden border-2 cursor-pointer shrink-0 transition-all ${
                    formData.avatar === url
                      ? "border-blue-600 ring-2 ring-blue-500/20 scale-105"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <img src={url} alt={`Avatar Preset ${idx}`} className="w-11 h-11 object-cover" referrerPolicy="no-referrer" />
                  {formData.avatar === url && (
                    <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center text-white">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap & Gelar</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: dr. Ahmad Rifai"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Alamat Email Resmi</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="email@rsiabinamedika.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Username Login</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. anita"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Password Login</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password akun Anda"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Unit Kerja / Departemen</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Nomor Kontak / WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="0812-3456-7890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Otorisasi Hak Akses: <b className="text-slate-800">{currentUser.role}</b></span>
            </div>
            <span className="text-slate-400 italic">Dikunci oleh Super Admin</span>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" /> Simpan Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
