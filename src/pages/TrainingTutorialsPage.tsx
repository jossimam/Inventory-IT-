import React, { useState, useEffect } from "react";
import { TrainingMaterial, SystemChangeRelease, UserRole } from "../types";
import { INITIAL_TRAINING_MATERIALS, SYSTEM_CHANGE_RELEASES, DEPARTMENTS } from "../data/mockData";
import { useAuth } from "../hooks/useAuth";
import {
  GraduationCap,
  Video,
  FileText,
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  Play,
  Sparkles,
  Plus,
  X,
  Tag,
  Users,
  ShieldAlert,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Award,
  Check,
  ChevronRight,
  Info,
  RefreshCcw,
  Zap
} from "lucide-react";

export default function TrainingTutorialsPage() {
  const { currentUser } = useAuth();

  // Local storage state for materials
  const [materials, setMaterials] = useState<TrainingMaterial[]>(() => {
    const saved = localStorage.getItem("rsia_training_materials");
    return saved ? JSON.parse(saved) : INITIAL_TRAINING_MATERIALS;
  });

  const [releases] = useState<SystemChangeRelease[]>(SYSTEM_CHANGE_RELEASES);

  // Tab State
  const [activeSubTab, setActiveSubTab] = useState<"catalog" | "releases" | "compliance">("catalog");

  // Filters & Search
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [formatFilter, setFormatFilter] = useState<string>("All");
  const [roleFilter, setRoleFilter] = useState<string>("All");

  // Active Selected Material for Detail/Viewer Modal
  const [selectedMaterial, setSelectedMaterial] = useState<TrainingMaterial | null>(null);

  // Add New Material Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMaterialData, setNewMaterialData] = useState<Partial<TrainingMaterial>>({
    title: "",
    category: "SIMRS & EMR",
    format: "Video Tutorial",
    systemVersion: "SIMRS Build 2026.04",
    targetRoles: ["Dokter", "Perawat", "Farmasi"],
    durationOrPages: "10:00 Min",
    description: "",
    isMandatory: false,
    videoUrl: "",
    downloadUrl: "#",
    steps: [
      { title: "1. Buka Modul SIMRS", desc: "Masuk dengan username dan password resmi Anda." },
      { title: "2. Pilih Fitur Baru", desc: "Ikuti petunjuk sesuai panduan rilis sistem rumah sakit." }
    ]
  });

  // Save to localStorage whenever materials change
  useEffect(() => {
    localStorage.setItem("rsia_training_materials", JSON.stringify(materials));
  }, [materials]);

  if (!currentUser) return null;

  // Filter Materials
  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      m.systemVersion.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === "All" || m.category === categoryFilter;
    const matchesFormat = formatFilter === "All" || m.format === formatFilter;
    const matchesRole =
      roleFilter === "All" || m.targetRoles.some((r) => r.toLowerCase().includes(roleFilter.toLowerCase()));

    return matchesSearch && matchesCategory && matchesFormat && matchesRole;
  });

  // Toggle Completion Status for Current User
  const handleToggleComplete = (materialId: string) => {
    const updated = materials.map((m) => {
      if (m.id === materialId) {
        const completed = m.completedByUsers || [];
        const isDone = completed.includes(currentUser.id);
        const newCompleted = isDone
          ? completed.filter((id) => id !== currentUser.id)
          : [...completed, currentUser.id];
        return { ...m, completedByUsers: newCompleted };
      }
      return m;
    });
    setMaterials(updated);

    // Update selected material if currently viewing
    if (selectedMaterial && selectedMaterial.id === materialId) {
      const isDone = (selectedMaterial.completedByUsers || []).includes(currentUser.id);
      const newCompleted = isDone
        ? (selectedMaterial.completedByUsers || []).filter((id) => id !== currentUser.id)
        : [...(selectedMaterial.completedByUsers || []), currentUser.id];
      setSelectedMaterial({ ...selectedMaterial, completedByUsers: newCompleted });
    }
  };

  // Create New Training Material
  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialData.title || !newMaterialData.description) return;

    const newItem: TrainingMaterial = {
      id: `trn-${Date.now()}`,
      title: newMaterialData.title,
      category: (newMaterialData.category as any) || "SIMRS & EMR",
      format: (newMaterialData.format as any) || "Video Tutorial",
      systemVersion: newMaterialData.systemVersion || "SIMRS Build 2026.04",
      targetRoles: newMaterialData.targetRoles || ["Semua Staff"],
      durationOrPages: newMaterialData.durationOrPages || "10 Halaman",
      releaseDate: new Date().toISOString().split("T")[0],
      updatedBy: `${currentUser.name} (${currentUser.role})`,
      description: newMaterialData.description,
      isMandatory: !!newMaterialData.isMandatory,
      videoUrl: newMaterialData.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ",
      downloadUrl: "#",
      completedByUsers: [],
      steps: newMaterialData.steps || [
        { title: "1. Langkah Utama", desc: "Ikuti arahan instruksi pada dokumen resmi." }
      ]
    };

    setMaterials([newItem, ...materials]);
    setIsAddModalOpen(false);
    resetNewForm();
  };

  const resetNewForm = () => {
    setNewMaterialData({
      title: "",
      category: "SIMRS & EMR",
      format: "Video Tutorial",
      systemVersion: "SIMRS Build 2026.04",
      targetRoles: ["Dokter", "Perawat", "Farmasi"],
      durationOrPages: "10:00 Min",
      description: "",
      isMandatory: false,
      videoUrl: "",
      downloadUrl: "#",
      steps: [
        { title: "1. Buka Modul SIMRS", desc: "Masuk dengan username dan password resmi Anda." },
        { title: "2. Pilih Fitur Baru", desc: "Ikuti petunjuk sesuai panduan rilis sistem rumah sakit." }
      ]
    });
  };

  // Metrics
  const totalMaterialsCount = materials.length;
  const mandatoryCount = materials.filter((m) => m.isMandatory).length;
  const myCompletedCount = materials.filter((m) => (m.completedByUsers || []).includes(currentUser.id)).length;
  const myProgressPercent = Math.round((myCompletedCount / (totalMaterialsCount || 1)) * 100);

  return (
    <div className="space-y-6" id="training-tutorials-view">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" /> Materi Pelatihan & Tutorial IT (Perubahan Sistem RS)
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Pusat edukasi digital, tutorial video, SOP, dan dokumentasi pembaruan SIMRS V2.4, RME SATUSEHAT, serta perangkat keras RSIA Bina Medika.
          </p>
        </div>

        {(currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.ENTRY_DATA) && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Tambah Modul Tutorial
          </button>
        )}
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-800">{totalMaterialsCount}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Total Modul Tutorial</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-800">{mandatoryCount}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Wajib Dipelajari (SOP)</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-800">
              {myCompletedCount} / {totalMaterialsCount}
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Progres Pembelajaran Saya</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-slate-800">SIMRS V2.4</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Versi Sistem Aktif</div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveSubTab("catalog")}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
            activeSubTab === "catalog"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Katalog Tutorial & SOP ({filteredMaterials.length})
        </button>

        <button
          onClick={() => setActiveSubTab("releases")}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
            activeSubTab === "releases"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <RefreshCcw className="w-4 h-4" /> Riwayat Perubahan Sistem (Release Notes) ({releases.length})
        </button>

        <button
          onClick={() => setActiveSubTab("compliance")}
          className={`pb-3 flex items-center gap-2 cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
            activeSubTab === "compliance"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Award className="w-4 h-4" /> Status Compliance & Sertifikat Pelatihan
        </button>
      </div>

      {/* ==================== SUBTAB 1: TUTORIAL CATALOG ==================== */}
      {activeSubTab === "catalog" && (
        <div className="space-y-4">
          {/* Search & Filters toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kata kunci tutorial, EMR, BPJS, Barcode, atau versi SIMRS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto shrink-0">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 font-medium">Kategori:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent text-slate-700 font-bold outline-none cursor-pointer"
                >
                  <option value="All">Semua Kategori</option>
                  <option value="SIMRS & EMR">SIMRS & EMR</option>
                  <option value="SATUSEHAT & BPJS">SATUSEHAT & BPJS</option>
                  <option value="Hardware & Scanner">Hardware & Scanner</option>
                  <option value="Keamanan Akses & Identitas">Keamanan Akses & Identitas</option>
                  <option value="Farmasi & E-Resep">Farmasi & E-Resep</option>
                  <option value="Kasir & Billing">Kasir & Billing</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-xl text-xs">
                <span className="text-slate-400 font-medium">Format:</span>
                <select
                  value={formatFilter}
                  onChange={(e) => setFormatFilter(e.target.value)}
                  className="bg-transparent text-slate-700 font-bold outline-none cursor-pointer"
                >
                  <option value="All">Semua Format</option>
                  <option value="Video Tutorial">Video Tutorial</option>
                  <option value="Panduan PDF">Panduan PDF</option>
                  <option value="SOP & Flowchart">SOP & Flowchart</option>
                  <option value="Release Notes">Release Notes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((mat) => {
              const isDone = (mat.completedByUsers || []).includes(currentUser.id);
              const isVideo = mat.format === "Video Tutorial";

              return (
                <div
                  key={mat.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm transition-all flex flex-col justify-between relative group hover:shadow-md ${
                    isDone ? "border-emerald-200 bg-emerald-50/10" : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                            isVideo
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {mat.format}
                        </span>
                        <span className="text-[9px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded uppercase">
                          {mat.systemVersion}
                        </span>
                      </div>

                      {mat.isMandatory && (
                        <span className="text-[9px] bg-amber-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                          <ShieldAlert className="w-2.5 h-2.5" /> Wajib
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                      {mat.title}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-3 mb-4 leading-relaxed">{mat.description}</p>

                    {/* Target Roles & Duration */}
                    <div className="space-y-2 mb-4 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">Target: {mat.targetRoles.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Durasi/Ukuran: {mat.durationOrPages}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedMaterial(mat)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      {isVideo ? <Play className="w-3.5 h-3.5 fill-current" /> : <BookOpen className="w-3.5 h-3.5" />}
                      Buka Pelatihan <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggleComplete(mat.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isDone
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? "text-emerald-600" : "text-slate-400"}`} />
                      {isDone ? "Selesai" : "Tandai Selesai"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 2: SYSTEM RELEASE NOTES ==================== */}
      {activeSubTab === "releases" && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
            <RefreshCcw className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Log Riwayat Pembaruan & Perubahan Sistem Rumah Sakit (SIMRS / EMR / Hardware)</p>
              <p className="mt-0.5 text-blue-800">
                Tim IT RSIA Bina Medika secara berkala merilis pembaruan modul, patch keamanan, serta integrasi faskes. Di bawah ini adalah daftar changelog resmi dan panduan pelatihan yang relevan.
              </p>
            </div>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8">
            {releases.map((rel) => (
              <div key={rel.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm"></div>

                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {rel.version}
                      </span>
                      <h3 className="text-base font-bold text-slate-800 mt-2">{rel.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5" /> {rel.releaseDate}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                          rel.impactLevel === "Critical Update"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : rel.impactLevel === "Major Feature"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {rel.impactLevel}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{rel.summary}</p>

                  {/* Key Changes Bullet List */}
                  <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-150 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">Rincian Perubahan Fitur:</span>
                    {rel.keyChanges.map((change, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{change}</span>
                      </div>
                    ))}
                  </div>

                  {/* Affected Modules */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400 font-semibold">Modul Terdampak:</span>
                    {rel.affectedModules.map((mod, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg text-[11px] font-medium">
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 3: COMPLIANCE & CERTIFICATES ==================== */}
      {activeSubTab === "compliance" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Sertifikasi Pemahaman & Status Pelatihan Saya
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Monitoring penyelesaian SOP dan tutorial pembaruan SIMRS oleh staff RSIA Bina Medika.
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-blue-600">{myProgressPercent}%</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Tingkat Penyelesaian</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full transition-all duration-500"
              style={{ width: `${myProgressPercent}%` }}
            ></div>
          </div>

          {/* Detailed Checklist */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Daftar Modul Wajib & Akses</h4>
            <div className="divide-y divide-slate-100 text-xs">
              {materials.map((mat) => {
                const isDone = (mat.completedByUsers || []).includes(currentUser.id);
                return (
                  <div key={mat.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          isDone ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{mat.title}</div>
                        <div className="text-[11px] text-slate-400">
                          {mat.category} • {mat.systemVersion}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleComplete(mat.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isDone ? "bg-emerald-50 text-emerald-700" : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isDone ? "Lulus / Terverifikasi" : "Tandai Selesai"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: VIEW MATERIAL / VIDEO DETAIL ==================== */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 text-xs max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    {selectedMaterial.format}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded uppercase">
                    {selectedMaterial.systemVersion}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-base">{selectedMaterial.title}</h3>
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player or Document Frame Placeholder */}
            {selectedMaterial.format === "Video Tutorial" ? (
              <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center text-white relative shadow-inner">
                <iframe
                  src={selectedMaterial.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                  title={selectedMaterial.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FileText className="w-5 h-5 text-blue-600" /> Pratinjau Panduan Operasional PDF
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">{selectedMaterial.description}</p>
              </div>
            )}

            {/* Step-by-Step Procedure */}
            {selectedMaterial.steps && selectedMaterial.steps.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Langkah-Langkah Operasional:</h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {selectedMaterial.steps.map((step, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="font-bold text-blue-800 text-xs">{step.title}</div>
                      <div className="text-slate-600 text-xs leading-relaxed">{step.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handleToggleComplete(selectedMaterial.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                {(selectedMaterial.completedByUsers || []).includes(currentUser.id)
                  ? "Sudah Dipelajari (Selesai)"
                  : "Tandai Telah Dipelajari"}
              </button>

              <button
                onClick={() => setSelectedMaterial(null)}
                className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD NEW TUTORIAL ==================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" /> Tambah Modul Tutorial & Pelatihan IT Baru
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Judul Modul Pelatihan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tutorial Penggunaan Barcode Scanner Baru di Poliklinik"
                  value={newMaterialData.title}
                  onChange={(e) => setNewMaterialData({ ...newMaterialData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kategori Sistem</label>
                  <select
                    value={newMaterialData.category}
                    onChange={(e) => setNewMaterialData({ ...newMaterialData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="SIMRS & EMR">SIMRS & EMR</option>
                    <option value="SATUSEHAT & BPJS">SATUSEHAT & BPJS</option>
                    <option value="Hardware & Scanner">Hardware & Scanner</option>
                    <option value="Keamanan Akses & Identitas">Keamanan Akses & Identitas</option>
                    <option value="Farmasi & E-Resep">Farmasi & E-Resep</option>
                    <option value="Kasir & Billing">Kasir & Billing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Format Format</label>
                  <select
                    value={newMaterialData.format}
                    onChange={(e) => setNewMaterialData({ ...newMaterialData, format: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="Video Tutorial">Video Tutorial</option>
                    <option value="Panduan PDF">Panduan PDF</option>
                    <option value="SOP & Flowchart">SOP & Flowchart</option>
                    <option value="Release Notes">Release Notes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Versi Sistem Target</label>
                  <input
                    type="text"
                    placeholder="e.g. SIMRS Build 2026.04"
                    value={newMaterialData.systemVersion}
                    onChange={(e) => setNewMaterialData({ ...newMaterialData, systemVersion: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Durasi / Jumlah Halaman</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 Min / 12 Halaman"
                    value={newMaterialData.durationOrPages}
                    onChange={(e) => setNewMaterialData({ ...newMaterialData, durationOrPages: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">URL Video Embed (Youtube / MP4)</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/..."
                  value={newMaterialData.videoUrl}
                  onChange={(e) => setNewMaterialData({ ...newMaterialData, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Deskripsi & Rangkuman Materi</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan perubahan fitur sistem RSIA Bina Medika..."
                  value={newMaterialData.description}
                  onChange={(e) => setNewMaterialData({ ...newMaterialData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="mandatory-check"
                  checked={newMaterialData.isMandatory}
                  onChange={(e) => setNewMaterialData({ ...newMaterialData, isMandatory: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="mandatory-check" className="text-slate-700 font-bold cursor-pointer">
                  Modul Wajib Selesai (Mandatory SOP Compliance)
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm"
                >
                  Publikasikan Modul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
