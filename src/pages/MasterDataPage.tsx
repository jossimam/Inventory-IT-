import React, { useState } from "react";
import { User, UserRole } from "../types";
import {
  BUILDINGS,
  DEPARTMENTS,
  CATEGORIES,
  BRANDS,
  VENDORS,
  CONDITIONS,
  STATUSES,
  MAINTENANCE_TYPES,
  TICKET_CATEGORIES
} from "../data/mockData";
import { Database, Plus, Search, MapPin, Building, Home, HelpCircle, ShieldAlert, Check, Trash2, Layers, X, AlertCircle, Sparkles } from "lucide-react";

import { useAppContext } from "../hooks/useAppContext";
import { useAuth } from "../hooks/useAuth";

const FLOOR_PRESETS = [
  "Floor 6",
  "Floor 7",
  "Floor 8",
  "Basement B1",
  "Basement B2",
  "Lantai Mezanin",
  "Rooftop IT Datacenter",
  "Gedung Penunjang Lt 1"
];

export default function MasterDataPage() {
  const { currentUser } = useAuth();
  const { 
    floors, 
    rooms, 
    addFloor, 
    deleteFloor, 
    addRoom, 
    deleteRoom,
    assets 
  } = useAppContext();

  if (!currentUser) return null;
  const [activeSubTab, setActiveSubTab] = useState<"location" | "org" | "catalog" | "vendors">("location");
  
  // Location sub-mode in right column ("room" vs "floor")
  const [locationFormMode, setLocationFormMode] = useState<"floor" | "room">("floor");
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);

  // New Floor inputs
  const [newFloorName, setNewFloorName] = useState("");
  const [newFloorRoomsInput, setNewFloorRoomsInput] = useState("");
  const [floorFeedback, setFloorFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Local state for non-floor master data items
  const [departments, setDepartments] = useState<string[]>(DEPARTMENTS);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [brands, setBrands] = useState<string[]>(BRANDS);
  const [vendorsList, setVendorsList] = useState(VENDORS);

  // New Item states
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomFloor, setNewRoomFloor] = useState(floors[0] || "Floor 1");
  const [newDeptName, setNewDeptName] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [newVendorName, setNewVendorName] = useState("");
  const [newVendorContact, setNewVendorContact] = useState("");
  const [newVendorType, setNewVendorType] = useState("Hardware Supplier");

  const [searchQuery, setSearchQuery] = useState("");

  const isReadOnly = currentUser.role === UserRole.KAKONLI;

  // Floor creation handler
  const handleCreateFloor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newFloorName.trim();
    if (!trimmed) {
      setFloorFeedback({ type: "error", message: "Nama lantai tidak boleh kosong." });
      return;
    }

    if (floors.includes(trimmed)) {
      setFloorFeedback({ type: "error", message: `Lantai "${trimmed}" sudah terdaftar dalam direktori.` });
      return;
    }

    const initialRooms = newFloorRoomsInput
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const success = addFloor(trimmed, initialRooms);
    if (success) {
      setFloorFeedback({
        type: "success",
        message: `Lantai "${trimmed}" berhasil ditambahkan${initialRooms.length > 0 ? ` bersama ${initialRooms.length} ruangan awal` : ""}!`
      });
      setNewFloorName("");
      setNewFloorRoomsInput("");
      setNewRoomFloor(trimmed); // Select newly added floor in room form
      setTimeout(() => setFloorFeedback(null), 4000);
      setIsFloorModalOpen(false);
    }
  };

  const handleDeleteFloor = (floorName: string) => {
    const assetsOnFloor = assets.filter((a) => a.floor === floorName);
    if (assetsOnFloor.length > 0) {
      const confirmDelete = window.confirm(
        `Perhatian: Terdapat ${assetsOnFloor.length} aset terdaftar di "${floorName}".\n\nApakah Anda tetap yakin ingin menghapus lantai ini dari master direktori?`
      );
      if (!confirmDelete) return;
    } else {
      const confirmDelete = window.confirm(`Hapus "${floorName}" dari master direktori rumah sakit?`);
      if (!confirmDelete) return;
    }

    deleteFloor(floorName);
    setFloorFeedback({ type: "success", message: `Lantai "${floorName}" telah dihapus.` });
    setTimeout(() => setFloorFeedback(null), 3000);
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    const success = addRoom(newRoomFloor, newRoomName.trim());
    if (success) {
      setFloorFeedback({ type: "success", message: `Ruangan "${newRoomName.trim()}" ditambahkan ke ${newRoomFloor}.` });
      setNewRoomName("");
      setTimeout(() => setFloorFeedback(null), 3000);
    } else {
      setFloorFeedback({ type: "error", message: `Ruangan "${newRoomName.trim()}" sudah ada di ${newRoomFloor}.` });
    }
  };

  const handleDeleteRoom = (floorName: string, roomName: string) => {
    if (window.confirm(`Hapus ruangan "${roomName}" dari ${floorName}?`)) {
      deleteRoom(floorName, roomName);
    }
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    setDepartments([...departments, newDeptName.trim()]);
    setNewDeptName("");
  };

  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCategories([...categories, newCatName.trim()]);
    setNewCatName("");
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    setBrands([...brands, newBrandName.trim()]);
    setNewBrandName("");
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;
    setVendorsList([
      ...vendorsList,
      { name: newVendorName.trim(), contact: newVendorContact.trim() || "N/A", type: newVendorType }
    ]);
    setNewVendorName("");
    setNewVendorContact("");
  };

  return (
    <div className="space-y-6" id="master-data-view">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Master Data Configuration</h2>
          <p className="text-slate-500 text-xs mt-1">Configure hospital buildings, floor directories, department maps, categories, and vendors.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Database className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Hospital Structural Flow Alert */}
      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-3">
        <MapPin className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-xs text-blue-800 leading-relaxed">
          <span className="font-semibold">Bina Medika Structural Topology:</span> Asset traces are bounded by physical constraints. The layout maps assets from: <b>Building</b> &rarr; <b>Floor</b> &rarr; <b>Room</b> &rarr; <b>Department</b> &rarr; <b>Target Asset PIC</b>. Modifying master directories updates inventory lookup dropdowns immediately.
        </div>
      </div>

      {/* Sub-tabs Selection */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-1">
        <button
          onClick={() => { setActiveSubTab("location"); setSearchQuery(""); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeSubTab === "location" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Buildings, Floors & Rooms
        </button>
        <button
          onClick={() => { setActiveSubTab("org"); setSearchQuery(""); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeSubTab === "org" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Hospital Departments
        </button>
        <button
          onClick={() => { setActiveSubTab("catalog"); setSearchQuery(""); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeSubTab === "catalog" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Device Categories & Brands
        </button>
        <button
          onClick={() => { setActiveSubTab("vendors"); setSearchQuery(""); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeSubTab === "vendors" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Suppliers & Vendors
        </button>
      </div>

      {/* Tab Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column - List of Master Data (Dynamic based on sub-tab) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 capitalize">
              {activeSubTab === "location" && "Hospital Floor directories"}
              {activeSubTab === "org" && "Hospital Department Registries"}
              {activeSubTab === "catalog" && "Standardized Hardware Catalog"}
              {activeSubTab === "vendors" && "Contracted Vendors Directory"}
            </h3>
            
            {/* Search filter */}
            <div className="relative w-48">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Filter entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* SubTab 1: Location Directories */}
          {activeSubTab === "location" && (
            <div className="space-y-4">
              {/* Building & Quick Add Floor Action Banner */}
              <div className="p-4 bg-gradient-to-r from-blue-50/80 to-slate-50 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      Master Building
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active Campus
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      RSIA Bina Medika Jakarta • <span className="font-semibold text-blue-700">{floors.length} Lantai</span> •{" "}
                      <span className="font-semibold text-slate-600">
                        {Object.values(rooms).reduce((acc, curr) => acc + (curr ? curr.length : 0), 0)} Ruangan
                      </span>
                    </div>
                  </div>
                </div>

                {!isReadOnly && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setLocationFormMode("floor");
                        setIsFloorModalOpen(true);
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Lantai Baru
                    </button>
                  </div>
                )}
              </div>

              {/* Feedback toast */}
              {floorFeedback && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 animate-fadeIn ${
                    floorFeedback.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  {floorFeedback.type === "success" ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{floorFeedback.message}</span>
                </div>
              )}

              {/* Floors Cards List */}
              <div className="space-y-3">
                {floors
                  .filter((floor) => {
                    const floorRooms = rooms[floor] || [];
                    const matchesFloor = floor.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesRoom = floorRooms.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));
                    return matchesFloor || matchesRoom;
                  })
                  .map((floor) => {
                    const floorRooms = rooms[floor] || [];
                    const filteredRooms = floorRooms.filter((r) =>
                      r.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    const assetsOnFloor = assets.filter((a) => a.floor === floor);

                    return (
                      <div
                        key={floor}
                        className="border border-slate-150 hover:border-slate-300 rounded-2xl p-4 space-y-3 bg-white transition-all shadow-xs"
                      >
                        {/* Floor Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                              <Layers className="w-4 h-4" />
                            </span>
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">
                                {floor}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {floorRooms.length} ruangan terdaftar
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-600">
                              {assetsOnFloor.length} aset
                            </span>
                            {!isReadOnly && (
                              <>
                                <button
                                  type="button"
                                  title="Tambah ruangan ke lantai ini"
                                  onClick={() => {
                                    setNewRoomFloor(floor);
                                    setLocationFormMode("room");
                                  }}
                                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" /> Ruang
                                </button>
                                <button
                                  type="button"
                                  title={`Hapus ${floor}`}
                                  onClick={() => handleDeleteFloor(floor)}
                                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Rooms List */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {filteredRooms.map((room) => (
                            <span
                              key={room}
                              className="group bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1.5"
                            >
                              {room}
                              {!isReadOnly && (
                                <button
                                  type="button"
                                  title={`Hapus ${room}`}
                                  onClick={() => handleDeleteRoom(floor, room)}
                                  className="opacity-40 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-opacity cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </span>
                          ))}
                          {floorRooms.length === 0 && (
                            <span className="text-[11px] text-slate-400 italic">
                              Belum ada ruangan di lantai ini. Klik "+ Ruang" untuk menambahkan.
                            </span>
                          )}
                          {floorRooms.length > 0 && filteredRooms.length === 0 && (
                            <span className="text-[10px] text-slate-400 italic">
                              Tidak ada ruangan cocok dengan "{searchQuery}"
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                {floors.length === 0 && (
                  <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl">
                    <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-semibold">Belum ada data lantai.</p>
                    <button
                      type="button"
                      onClick={() => setIsFloorModalOpen(true)}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Tambah Lantai Sekarang
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SubTab 2: Department Mappings */}
          {activeSubTab === "org" && (
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {departments
                  .filter((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((dept) => (
                    <div
                      key={dept}
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 transition-all"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                        <span className="truncate">{dept}</span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/50">
                        Operational
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* SubTab 3: Categories & Brands */}
          {activeSubTab === "catalog" && (
            <div className="space-y-6">
              
              {/* Categories block */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">Standardized Categories</div>
                <div className="flex flex-wrap gap-2">
                  {categories
                    .filter((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((cat) => (
                      <span
                        key={cat}
                        className="bg-blue-50/50 text-blue-800 border border-blue-100 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3 text-blue-600" />
                        {cat}
                      </span>
                    ))}
                </div>
              </div>

              {/* Brands block */}
              <div className="space-y-2.5 pt-4 border-t border-slate-50">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">Whitelisted OEM Brands</div>
                <div className="flex flex-wrap gap-2">
                  {brands
                    .filter((b) => b.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((brand) => (
                      <span
                        key={brand}
                        className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold"
                      >
                        {brand}
                      </span>
                    ))}
                </div>
              </div>

              {/* Immutable parameters info */}
              <div className="pt-4 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Device Conditions</div>
                  <div className="flex gap-2 text-xs">
                    {CONDITIONS.map((c) => (
                      <span key={c} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-semibold">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deployment Statuses</div>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {STATUSES.map((s) => (
                      <span key={s} className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-semibold">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SubTab 4: Vendors and Suppliers */}
          {activeSubTab === "vendors" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendorsList
                  .filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.type.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((vendor) => (
                    <div
                      key={vendor.name}
                      className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-150 space-y-1.5 transition-colors"
                    >
                      <div className="text-xs font-bold text-slate-800">{vendor.name}</div>
                      <div className="text-[11px] text-slate-600 flex items-center justify-between">
                        <span>Contact: <b>{vendor.contact}</b></span>
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-teal-700 font-semibold bg-teal-50 border border-teal-200/50 px-2 py-0.5 rounded inline-block">
                        {vendor.type}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column - Create/Add Module form (Respect role logic) */}
        <div className="lg:col-span-4 space-y-4">
          
          {isReadOnly ? (
            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200/60 text-center space-y-3">
              <ShieldAlert className="w-8 h-8 text-amber-600 mx-auto" />
              <div>
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Read Only Privilege</h4>
                <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                  As <b>Kakonli</b>, you have read-only permissions and cannot create or modify Master Data directories.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="border-b border-slate-50 pb-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Add New Entry</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Extend Master lookup table fields</p>
              </div>

              {/* Form 1: Add Floor or Add Room */}
              {activeSubTab === "location" && (
                <div className="space-y-4">
                  {/* Segmented Mode Switch */}
                  <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setLocationFormMode("floor")}
                      className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        locationFormMode === "floor"
                          ? "bg-white text-blue-700 shadow-xs font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" /> + Lantai (Floor)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationFormMode("room")}
                      className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        locationFormMode === "room"
                          ? "bg-white text-blue-700 shadow-xs font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Home className="w-3.5 h-3.5" /> + Ruangan (Room)
                    </button>
                  </div>

                  {/* Mode A: Form Add Floor */}
                  {locationFormMode === "floor" && (
                    <form onSubmit={handleCreateFloor} className="space-y-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-between">
                          <span>Nama Lantai (Floor Label) *</span>
                          <span className="text-[9px] text-blue-600 font-semibold lowercase">harus unik</span>
                        </label>
                        <input
                          type="text"
                          placeholder="contoh: Floor 6, Basement B1, Lantai Mezanin"
                          value={newFloorName}
                          onChange={(e) => setNewFloorName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none focus:border-blue-500 focus:bg-white font-medium"
                          required
                        />
                      </div>

                      {/* Quick Presets */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
                          Pilihan Cepat (Klik untuk isi):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {FLOOR_PRESETS.map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setNewFloorName(preset)}
                              className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                                newFloorName === preset
                                  ? "bg-blue-600 text-white border-blue-600 font-bold"
                                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Optional Initial Rooms */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          Ruangan Awal (Opsional)
                        </label>
                        <input
                          type="text"
                          placeholder="contoh: Ruang Server, Ruang Rapat, Gudang IT (pisahkan koma)"
                          value={newFloorRoomsInput}
                          onChange={(e) => setNewFloorRoomsInput(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                        />
                        <p className="text-[10px] text-slate-400">
                          Pisahkan beberapa ruangan dengan tanda koma.
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-xs cursor-pointer shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> Simpan & Tambah Lantai
                      </button>
                    </form>
                  )}

                  {/* Mode B: Form Add Room */}
                  {locationFormMode === "room" && (
                    <form onSubmit={handleAddRoom} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Target Lantai (Floor)</label>
                        <select
                          value={newRoomFloor}
                          onChange={(e) => setNewRoomFloor(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                        >
                          {floors.map((f) => (
                            <option key={f} value={f}>
                              {f} ({rooms[f] ? rooms[f].length : 0} ruangan)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Nama Ruangan</label>
                        <input
                          type="text"
                          placeholder="contoh: PICU, Ruang Server, Poliklinik Anak"
                          value={newRoomName}
                          onChange={(e) => setNewRoomName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl text-xs cursor-pointer transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> Petakan Ruang ke {newRoomFloor}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Form 2: Add Department */}
              {activeSubTab === "org" && (
                <form onSubmit={handleAddDept} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Department Name</label>
                    <input
                      type="text"
                      placeholder="e.g., ICU Nursing, CSSD"
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl text-xs cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Registry Department
                  </button>
                </form>
              )}

              {/* Form 3: Add Category/Brand */}
              {activeSubTab === "catalog" && (
                <div className="space-y-4">
                  <form onSubmit={handleAddCat} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">New Category</label>
                      <input
                        type="text"
                        placeholder="e.g., Thermal Camera, NAS Storage"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 rounded-xl text-xs cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Category
                    </button>
                  </form>

                  <div className="border-t border-slate-50 pt-3">
                    <form onSubmit={handleAddBrand} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">New Whitelisted Brand</label>
                        <input
                          type="text"
                          placeholder="e.g., Synology, Samsung"
                          value={newBrandName}
                          onChange={(e) => setNewBrandName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 rounded-xl text-xs cursor-pointer transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> Whitelist OEM Brand
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Form 4: Add Vendor */}
              {activeSubTab === "vendors" && (
                <form onSubmit={handleAddVendor} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Vendor Name</label>
                    <input
                      type="text"
                      placeholder="e.g., PT. Global Technology"
                      value={newVendorName}
                      onChange={(e) => setNewVendorName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Contact/Phone</label>
                    <input
                      type="text"
                      placeholder="e.g., Pak Budi (0812...)"
                      value={newVendorContact}
                      onChange={(e) => setNewVendorContact(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Service Specialization</label>
                    <select
                      value={newVendorType}
                      onChange={(e) => setNewVendorType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                    >
                      <option value="Hardware Supplier">Hardware Supplier</option>
                      <option value="Network Integrator">Network Integrator</option>
                      <option value="HIS SIMRS Vendor">HIS SIMRS Vendor</option>
                      <option value="Printers & Service">Printers & Service</option>
                      <option value="General Maintenance">General Maintenance</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl text-xs cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Registry Vendor Contract
                  </button>
                </form>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Quick Modal: Tambah Lantai Baru */}
      {isFloorModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-150 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Tambah Lantai Baru</h3>
                  <p className="text-[10px] text-slate-500">Daftarkan level lantai ke master direktori rumah sakit</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFloorModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFloor} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Nama Lantai (Floor Name / Label) *
                </label>
                <input
                  type="text"
                  placeholder="contoh: Floor 6, Basement B1, Lantai Mezanin"
                  value={newFloorName}
                  onChange={(e) => setNewFloorName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white font-medium"
                  required
                  autoFocus
                />
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                  Pilihan Cepat:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {FLOOR_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNewFloorName(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        newFloorName === preset
                          ? "bg-blue-600 text-white border-blue-600 font-bold shadow-xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Initial Rooms */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Ruangan Awal (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="contoh: Ruang Server, Ruang Rapat, Gudang IT (pisahkan koma)"
                  value={newFloorRoomsInput}
                  onChange={(e) => setNewFloorRoomsInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
                <p className="text-[10px] text-slate-400">
                  Ketik nama-nama ruangan yang langsung dipetakan ke lantai ini, dipisahkan koma.
                </p>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-800 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Lantai yang Anda tambahkan akan langsung muncul di formulir inventaris aset, pemindahan lokasi, tiket helpdesk, dan laporan.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFloorModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Simpan & Tambahkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
