import React, { useState } from "react";
import { Asset, User, UserRole, MaintenanceLog, BorrowingLog, AssetMovementLog } from "../types";
import {
  CATEGORIES,
  BRANDS,
  DEPARTMENTS,
  VENDORS,
  CONDITIONS,
  STATUSES
} from "../data/mockData";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  Download,
  Filter,
  Grid,
  List,
  Layers,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  UserCheck,
  Cpu,
  Monitor,
  CheckCircle,
  X,
  History,
  Wrench,
  ChevronRight,
  FolderSync
} from "lucide-react";
import QRCode from "react-qr-code";

import { useAppContext } from "../hooks/useAppContext";
import { useAuth } from "../hooks/useAuth";

export default function InventoryPage() {
  const {
    assets,
    addAsset: onAddAsset,
    editAsset: onEditAsset,
    deleteAsset: onDeleteAsset,
    maintenance: maintenanceLogs,
    borrowings: borrowingLogs,
    movements: movementLogs,
    triggerMaintenance: onTriggerMaintenance,
    triggerBorrow: onTriggerBorrow,
    triggerMove: onTriggerMove,
    floors,
    rooms
  } = useAppContext();
  const { currentUser } = useAuth();

  if (!currentUser) return null;
  
  // Search & Filters State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFloor, setSelectedFloor] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  
  // View mode
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Selected asset for details modal
  const [detailedAsset, setDetailedAsset] = useState<Asset | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<"specs" | "acquisition" | "location" | "history">("specs");

  // Form states (Add/Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);

  // Form inputs
  const [formData, setFormData] = useState<Partial<Asset>>({
    assetName: "",
    category: CATEGORIES[0],
    brand: BRANDS[0],
    model: "",
    serialNumber: "",
    hostname: "",
    ipAddress: "",
    macAddress: "",
    processor: "",
    ram: "",
    storage: "",
    graphics: "",
    operatingSystem: "",
    windowsLicense: "",
    officeLicense: "",
    antivirus: "Windows Defender",
    purchaseDate: new Date().toISOString().split("T")[0],
    purchasePrice: 0,
    vendor: VENDORS[0].name,
    warrantyStart: new Date().toISOString().split("T")[0],
    warrantyEnd: new Date().toISOString().split("T")[0],
    building: "Main Building",
    floor: floors[0] || "Floor 1",
    room: (rooms[floors[0] || "Floor 1"] || [])[0] || "Registration",
    department: DEPARTMENTS[0],
    pic: "",
    currentUser: "",
    status: "Active",
    condition: "Good",
    description: "",
    photoUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=300"
  });

  // Derived room list for selected floor in Form
  const formRooms = rooms[formData.floor || floors[0] || "Floor 1"] || [];

  const handleOpenAddForm = () => {
    setFormMode("add");
    setEditingAssetId(null);
    setFormData({
      assetName: "",
      category: CATEGORIES[0],
      brand: BRANDS[0],
      model: "",
      serialNumber: "",
      hostname: "",
      ipAddress: "",
      macAddress: "",
      processor: "",
      ram: "",
      storage: "",
      graphics: "",
      operatingSystem: "Windows 11 Pro",
      windowsLicense: "",
      officeLicense: "",
      antivirus: "Windows Defender",
      purchaseDate: new Date().toISOString().split("T")[0],
      purchasePrice: 0,
      vendor: VENDORS[0].name,
      warrantyStart: new Date().toISOString().split("T")[0],
      warrantyEnd: new Date().toISOString().split("T")[0],
      building: "Main Building",
      floor: "Floor 1",
      room: "Registration",
      department: DEPARTMENTS[0],
      pic: "",
      currentUser: "",
      status: "Active",
      condition: "Good",
      description: "",
      photoUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=300"
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormMode("edit");
    setEditingAssetId(asset.id);
    setFormData(asset);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formMode === "add") {
      const year = new Date(formData.purchaseDate || "").getFullYear();
      const randHex = Math.floor(1000 + Math.random() * 9000);
      const inventoryNumber = `RSIA-BM/IT/INV/${year}/${randHex}`;
      const assetCode = `BM-IT-${formData.category?.substring(0, 3).toUpperCase() || "GEN"}-${randHex}`;

      const newAsset: Asset = {
        ...(formData as Asset),
        id: `ast-${Date.now()}`,
        inventoryNumber,
        assetCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onAddAsset(newAsset);
    } else {
      const updatedAsset: Asset = {
        ...(formData as Asset),
        id: editingAssetId!,
        updatedAt: new Date().toISOString()
      };
      onEditAsset(updatedAsset);
    }
    setIsFormOpen(false);
  };

  const handleDownloadQR = (assetCode: string) => {
    const svgElement = document.getElementById(`qr-${assetCode}`);
    if (!svgElement) return;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const blobURL = window.URL.createObjectURL(svgBlob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 250;
      canvas.height = 250;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, 250, 250);
        context.drawImage(image, 10, 10, 230, 230);
        const png = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = png;
        downloadLink.download = `${assetCode}-QR.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    image.src = blobURL;
  };

  // 3. Filter asset list
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.assetName.toLowerCase().includes(search.toLowerCase()) ||
      asset.assetCode.toLowerCase().includes(search.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      asset.hostname.toLowerCase().includes(search.toLowerCase()) ||
      asset.ipAddress.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "All" || asset.category === selectedCategory;
    const matchesFloor = selectedFloor === "All" || asset.floor === selectedFloor;
    const matchesDept = selectedDept === "All" || asset.department === selectedDept;
    const matchesStatus = selectedStatus === "All" || asset.status === selectedStatus;
    const matchesCondition = selectedCondition === "All" || asset.condition === selectedCondition;

    return matchesSearch && matchesCategory && matchesFloor && matchesDept && matchesStatus && matchesCondition;
  });

  return (
    <div className="space-y-6" id="inventory-view">
      
      {/* Upper Module header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">IT Hardware Inventory</h2>
          <p className="text-slate-500 text-xs mt-1">
            Browse, filter, and trace the lifecycle of hospital physical components. Mapped across 5 floors.
          </p>
        </div>
        
        {currentUser.role !== UserRole.KAKONLI && (
          <button
            onClick={handleOpenAddForm}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Register New Asset
          </button>
        )}
      </div>

      {/* Multilevel Filters Board */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        
        {/* Row 1: Search & Layout toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by name, code, S/N, hostname, or IP address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
            />
          </div>
          
          <div className="flex items-center gap-2 border border-slate-100 p-1 bg-slate-50 rounded-xl self-end md:self-auto shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid" ? "bg-white text-blue-600 shadow-sm font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "table" ? "bg-white text-blue-600 shadow-sm font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Select parameters filters dropdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-50">
          
          {/* Category */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Floor */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Floor Directory</span>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
            >
              <option value="All">All Floors</option>
              {floors.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Department</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept.split(" (")[0]}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Usage Status</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Device Condition</span>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
            >
              <option value="All">All Conditions</option>
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Asset Display Segment */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <div>
            <h4 className="text-sm font-bold text-slate-700">No Assets Mapped</h4>
            <p className="text-slate-400 text-xs mt-1">Try adjusting your filters or query to find the desired hardware.</p>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        
        /* Grid Layout Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => {
            let statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
            if (asset.status === "Maintenance") statusColor = "bg-amber-50 text-amber-700 border-amber-200";
            if (asset.status === "Borrowed") statusColor = "bg-indigo-50 text-indigo-700 border-indigo-200";
            if (asset.status === "Broken") statusColor = "bg-rose-50 text-rose-700 border-rose-200";
            if (asset.status === "Scrapped") statusColor = "bg-slate-50 text-slate-700 border-slate-200";

            return (
              <div
                key={asset.id}
                onClick={() => { setDetailedAsset(asset); setActiveDetailTab("specs"); }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Photo Header */}
                <div className="h-32 bg-slate-100 relative overflow-hidden shrink-0">
                  <img
                    src={asset.photoUrl || "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=300"}
                    alt={asset.assetName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${statusColor}`}>
                      {asset.status}
                    </span>
                  </div>
                  
                  {/* Category icon overlay */}
                  <span className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white font-medium">
                    {asset.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 space-y-3.5">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">
                      {asset.assetCode}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1 hover:text-blue-600 transition-colors">
                      {asset.assetName}
                    </h3>
                  </div>

                  {/* Locations */}
                  <div className="space-y-1 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{asset.floor} • {asset.room}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{asset.department.split(" (")[0]}</span>
                    </div>
                  </div>

                  {/* Quick specs */}
                  <div className="p-2 bg-slate-50 rounded-xl text-[10px] text-slate-500 font-mono flex flex-col gap-0.5 border border-slate-100">
                    <div className="truncate"><b>H:</b> {asset.hostname || "N/A"}</div>
                    <div className="truncate"><b>IP:</b> {asset.ipAddress || "N/A"}</div>
                  </div>
                </div>

                {/* Card Actions Bottom */}
                <div className="p-3 bg-slate-50 border-t border-slate-50 flex items-center justify-between gap-1 shrink-0">
                  <button className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Specs Trace
                  </button>
                  
                  {currentUser.role !== UserRole.KAKONLI && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleOpenEditForm(asset, e)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {currentUser.role === UserRole.SUPER_ADMIN && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteAsset(asset.id); }}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        
        /* Table Layout List */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4 font-bold">Asset Label</th>
                  <th className="py-3 px-4 font-bold">Name</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Location</th>
                  <th className="py-3 px-4 font-bold">IP Address</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Condition</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                {filteredAssets.map((asset) => {
                  let statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                  if (asset.status === "Maintenance") statusColor = "bg-amber-50 text-amber-700 border-amber-200";
                  if (asset.status === "Borrowed") statusColor = "bg-indigo-50 text-indigo-700 border-indigo-200";
                  if (asset.status === "Broken") statusColor = "bg-rose-50 text-rose-700 border-rose-200";

                  let condColor = "text-emerald-600";
                  if (asset.condition === "Needs Repair") condColor = "text-amber-600";
                  if (asset.condition === "Damaged") condColor = "text-rose-600";

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => { setDetailedAsset(asset); setActiveDetailTab("specs"); }}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-mono text-[10px] text-slate-400">{asset.assetCode}</td>
                      <td className="py-3 px-4 text-slate-800">{asset.assetName}</td>
                      <td className="py-3 px-4 text-slate-500">{asset.category}</td>
                      <td className="py-3 px-4 text-slate-500 truncate max-w-[150px]">
                        {asset.floor} / {asset.room}
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-slate-500">{asset.ipAddress || "N/A"}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${statusColor}`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          asset.condition === "Good" ? "bg-emerald-500" : asset.condition === "Needs Repair" ? "bg-amber-500" : "bg-rose-500"
                        }`}></span>
                        <span className={`text-[11px] font-semibold ${condColor}`}>{asset.condition}</span>
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setDetailedAsset(asset); setActiveDetailTab("specs"); }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {currentUser.role !== UserRole.KAKONLI && (
                            <>
                              <button
                                onClick={(e) => handleOpenEditForm(asset, e)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              {currentUser.role === UserRole.SUPER_ADMIN && (
                                <button
                                  onClick={() => onDeleteAsset(asset.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL 1: DETAILED SPECS TRACE (DRAWER) --- */}
      {detailedAsset && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100 animate-in fade-in-50 zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="text-[10px] text-teal-400 font-mono tracking-wider font-bold">
                  {detailedAsset.inventoryNumber}
                </div>
                <h3 className="text-sm font-bold tracking-tight">{detailedAsset.assetName}</h3>
              </div>
              <button
                onClick={() => setDetailedAsset(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inner Content Grid */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 scrollbar-thin">
              
              {/* Left Column (QR & Photo info) */}
              <div className="md:col-span-4 space-y-5 text-center">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl inline-block shadow-inner">
                  {/* QR rendering */}
                  <QRCode
                    id={`qr-${detailedAsset.assetCode}`}
                    value={JSON.stringify({
                      code: detailedAsset.assetCode,
                      inv: detailedAsset.inventoryNumber,
                      name: detailedAsset.assetName,
                      room: `${detailedAsset.floor}/${detailedAsset.room}`
                    })}
                    size={160}
                    level="H"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 font-mono">
                    {detailedAsset.assetCode}
                  </div>
                  <button
                    onClick={() => handleDownloadQR(detailedAsset.assetCode)}
                    className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-xl text-[10px] cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Download QR Code
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 text-left space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operational Quick Actions</h4>
                  
                  {currentUser.role !== UserRole.KAKONLI ? (
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => { onTriggerMaintenance(detailedAsset); setDetailedAsset(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                      >
                        <Wrench className="w-4 h-4 text-amber-600" /> Log Maintenance
                      </button>
                      <button
                        onClick={() => { onTriggerBorrow(detailedAsset); setDetailedAsset(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                      >
                        <UserCheck className="w-4 h-4 text-indigo-600" /> Log Borrow Asset
                      </button>
                      <button
                        onClick={() => { onTriggerMove(detailedAsset); setDetailedAsset(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-800 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                      >
                        <FolderSync className="w-4 h-4 text-blue-600" /> Relocate Equipment
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">No actions available for Read-Only roles.</p>
                  )}
                </div>
              </div>

              {/* Right Column (Tabs navigation info) */}
              <div className="md:col-span-8 space-y-4">
                
                {/* Tabs */}
                <div className="flex border-b border-slate-100 gap-2">
                  <button
                    onClick={() => setActiveDetailTab("specs")}
                    className={`pb-2 px-3 text-xs font-bold transition-all relative cursor-pointer ${
                      activeDetailTab === "specs" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Specifications
                    {activeDetailTab === "specs" && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded"></span>}
                  </button>
                  <button
                    onClick={() => setActiveDetailTab("acquisition")}
                    className={`pb-2 px-3 text-xs font-bold transition-all relative cursor-pointer ${
                      activeDetailTab === "acquisition" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Acquisition & Warranty
                    {activeDetailTab === "acquisition" && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded"></span>}
                  </button>
                  <button
                    onClick={() => setActiveDetailTab("location")}
                    className={`pb-2 px-3 text-xs font-bold transition-all relative cursor-pointer ${
                      activeDetailTab === "location" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Assignment & Users
                    {activeDetailTab === "location" && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded"></span>}
                  </button>
                  <button
                    onClick={() => setActiveDetailTab("history")}
                    className={`pb-2 px-3 text-xs font-bold transition-all relative cursor-pointer ${
                      activeDetailTab === "history" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Asset Timelines
                    {activeDetailTab === "history" && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded"></span>}
                  </button>
                </div>

                {/* Tab content 1: Specifications */}
                {activeDetailTab === "specs" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">Processor CPU</span>
                        <div className="font-bold text-slate-800 mt-0.5">{detailedAsset.processor || "N/A"}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">Installed RAM</span>
                        <div className="font-bold text-slate-800 mt-0.5">{detailedAsset.ram || "N/A"}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">Storage drive</span>
                        <div className="font-bold text-slate-800 mt-0.5">{detailedAsset.storage || "N/A"}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">Graphics Unit</span>
                        <div className="font-bold text-slate-800 mt-0.5">{detailedAsset.graphics || "N/A"}</div>
                      </div>
                    </div>

                    <div className="border border-slate-100 rounded-xl p-4 space-y-2 text-xs">
                      <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Operating System & Core Software</div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-semibold text-slate-600">
                        <div>OS: <span className="text-slate-800 font-bold">{detailedAsset.operatingSystem || "N/A"}</span></div>
                        <div>Antivirus: <span className="text-slate-800 font-bold">{detailedAsset.antivirus || "N/A"}</span></div>
                        <div className="truncate">Windows License: <span className="text-slate-800 font-bold font-mono text-[10px]">{detailedAsset.windowsLicense || "N/A"}</span></div>
                        <div className="truncate">Office License: <span className="text-slate-800 font-bold font-mono text-[10px]">{detailedAsset.officeLicense || "N/A"}</span></div>
                      </div>
                    </div>

                    <div className="border border-slate-100 rounded-xl p-4 space-y-2 text-xs">
                      <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Network Interfaces</div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-[11px] text-slate-600">
                        <div>Hostname: <span className="text-slate-800 font-bold">{detailedAsset.hostname || "N/A"}</span></div>
                        <div>IP Address: <span className="text-blue-600 font-bold">{detailedAsset.ipAddress || "N/A"}</span></div>
                        <div className="col-span-2">MAC Address: <span className="text-slate-800 font-bold">{detailedAsset.macAddress || "N/A"}</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab content 2: Acquisition */}
                {activeDetailTab === "acquisition" && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase block">Purchase Date</span>
                        <div className="font-bold text-slate-800 mt-0.5">{detailedAsset.purchaseDate || "N/A"}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase block">Purchase Cost</span>
                        <div className="font-bold text-slate-800 mt-0.5">
                          Rp {detailedAsset.purchasePrice ? detailedAsset.purchasePrice.toLocaleString("id-ID") : "0"}
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-100 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500">Warranty Validity</span>
                        <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          Vendor: {detailedAsset.vendor}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                        <div>Warranty Commenced: <span className="text-slate-800 block font-bold">{detailedAsset.warrantyStart || "N/A"}</span></div>
                        <div>Warranty Concluded: <span className="text-slate-800 block font-bold">{detailedAsset.warrantyEnd || "N/A"}</span></div>
                      </div>
                    </div>

                    <div className="border border-slate-100 rounded-xl p-4 space-y-2">
                      <div className="font-bold text-[10px] uppercase tracking-wider text-slate-500">Contract Attachments Mapped</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-[11px] text-slate-700">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="truncate">Invoice_BM_{detailedAsset.assetCode}.pdf</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-[11px] text-slate-700">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="truncate">Warranty_Card_OEM.pdf</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab content 3: Location */}
                {activeDetailTab === "location" && (
                  <div className="space-y-4 text-xs">
                    <div className="border border-slate-100 rounded-xl p-4 space-y-3">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Physical Deployment</div>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs font-semibold text-slate-600">
                        <div>Building: <span className="text-slate-800 block font-bold">{detailedAsset.building}</span></div>
                        <div>Floor: <span className="text-slate-800 block font-bold">{detailedAsset.floor}</span></div>
                        <div>Room: <span className="text-slate-800 block font-bold">{detailedAsset.room}</span></div>
                        <div>Department: <span className="text-slate-800 block font-bold">{detailedAsset.department}</span></div>
                      </div>
                    </div>

                    <div className="border border-slate-100 rounded-xl p-4 space-y-3">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Administrative Assignments</div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
                        <div>Primary PIC: <span className="text-slate-800 block font-bold">{detailedAsset.pic || "N/A"}</span></div>
                        <div>Active User: <span className="text-slate-800 block font-bold">{detailedAsset.currentUser || "N/A"}</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab content 4: History Timelines */}
                {activeDetailTab === "history" && (
                  <div className="space-y-5 text-xs">
                    
                    {/* Sub 1: Maintenance logs */}
                    <div className="space-y-2">
                      <div className="font-bold text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-slate-400" /> Maintenance Audits
                      </div>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {maintenanceLogs.filter((m) => m.assetId === detailedAsset.id).map((m) => (
                          <div key={m.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-start">
                            <div>
                              <div className="font-bold text-slate-800">{m.type} Service</div>
                              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{m.description}</p>
                              <div className="text-[9px] text-slate-400 mt-1">{m.date} • {m.vendor}</div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{m.status}</span>
                          </div>
                        ))}
                        {maintenanceLogs.filter((m) => m.assetId === detailedAsset.id).length === 0 && (
                          <div className="text-center py-4 text-slate-400 italic">No maintenance history mapped.</div>
                        )}
                      </div>
                    </div>

                    {/* Sub 2: Movements */}
                    <div className="space-y-2 border-t border-slate-50 pt-3">
                      <div className="font-bold text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <FolderSync className="w-3.5 h-3.5 text-slate-400" /> Relocation logs
                      </div>

                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {movementLogs.filter((m) => m.assetId === detailedAsset.id).map((m) => (
                          <div key={m.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>Moved on {m.date}</span>
                              <span>Approved by: {m.approvedBy}</span>
                            </div>
                            <div className="text-slate-800 font-semibold mt-1 flex items-center gap-1">
                              <span>{m.oldLocation.room}</span> &rarr; <span className="text-blue-600">{m.newLocation.room}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 italic">Reason: {m.reason}</p>
                          </div>
                        ))}
                        {movementLogs.filter((m) => m.assetId === detailedAsset.id).length === 0 && (
                          <div className="text-center py-4 text-slate-400 italic">No movement logs cataloged.</div>
                        )}
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD / EDIT ASSET FORM DIALOG --- */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100 animate-in fade-in-50 zoom-in-95 duration-200">
            
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold tracking-tight">
                {formMode === "add" ? "Register New Hospital Asset" : "Edit Asset Specifications"}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs scrollbar-thin">
              
              {/* Box 1: Core Specifications */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5">
                  1. Primary Hardware Details
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Asset Name</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                      placeholder="e.g., PC Pendaftaran Rawat Jalan"
                      value={formData.assetName || ""}
                      onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Hardware Category</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Manufacturer / OEM Brand</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    >
                      {BRANDS.map((br) => (
                        <option key={br} value={br}>{br}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Model / Version</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                      placeholder="e.g., ThinkCentre Tiny G9"
                      value={formData.model || ""}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Serial Number (S/N)</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                      placeholder="e.g., SN-DELL-928190"
                      value={formData.serialNumber || ""}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Device Status</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-semibold"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Box 2: Specifications details */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5">
                  2. Detailed Specifications (PCs, Laptops, Servers)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Processor CPU</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                      placeholder="e.g., Intel Core i5-12400"
                      value={formData.processor || ""}
                      onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">RAM Capacity</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                      placeholder="e.g., 16 GB DDR4"
                      value={formData.ram || ""}
                      onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Storage (SSD/HDD)</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                      placeholder="e.g., 512 GB SSD NVMe"
                      value={formData.storage || ""}
                      onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Graphics GPU</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                      placeholder="e.g., Intel Iris Xe"
                      value={formData.graphics || ""}
                      onChange={(e) => setFormData({ ...formData, graphics: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Operating System</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                      placeholder="e.g., Windows 11 Pro"
                      value={formData.operatingSystem || ""}
                      onChange={(e) => setFormData({ ...formData, operatingSystem: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Antivirus Protection</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                      placeholder="e.g., Defender / ESET"
                      value={formData.antivirus || ""}
                      onChange={(e) => setFormData({ ...formData, antivirus: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Windows License Key</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono text-[11px]"
                      placeholder="Product Key / OEM"
                      value={formData.windowsLicense || ""}
                      onChange={(e) => setFormData({ ...formData, windowsLicense: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">MS Office License</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono text-[11px]"
                      placeholder="Office Home & Business"
                      value={formData.officeLicense || ""}
                      onChange={(e) => setFormData({ ...formData, officeLicense: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Box 3: Networking and physical locations */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5">
                  3. Network Interfaces & Location Assignment
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Hostname</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono text-[11px]"
                      placeholder="e.g., BM-PC-PHARMACY-01"
                      value={formData.hostname || ""}
                      onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">IP Address</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono text-[11px]"
                      placeholder="e.g., 192.168.10.15"
                      value={formData.ipAddress || ""}
                      onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">MAC Address</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-mono text-[11px]"
                      placeholder="e.g., 00:1A:2B:3C:4D:5E"
                      value={formData.macAddress || ""}
                      onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Building</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold"
                      value="Main Building"
                      readOnly
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Floor</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                      value={formData.floor}
                      onChange={(e) => {
                        const nextFloor = e.target.value;
                        const nextRooms = rooms[nextFloor] || [];
                        setFormData({
                          ...formData,
                          floor: nextFloor,
                          room: nextRooms[0] || ""
                        });
                      }}
                    >
                      {floors.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Room Mapping</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                      value={formData.room}
                      onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    >
                      {formRooms.map((rm) => (
                        <option key={rm} value={rm}>{rm}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Department</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Equipment PIC</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                      placeholder="Primary IT contact / supervisor"
                      value={formData.pic || ""}
                      onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Active User</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                      placeholder="Nurse/Cashier/Operator"
                      value={formData.currentUser || ""}
                      onChange={(e) => setFormData({ ...formData, currentUser: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Physical Condition</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold"
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                    >
                      {CONDITIONS.map((cond) => (
                        <option key={cond} value={cond}>{cond}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Box 4: Procurement, Warranty and Vendor */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5">
                  4. Commercial Procurement & Warranty
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Procurement Vendor</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                      value={formData.vendor}
                      onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    >
                      {VENDORS.map((v) => (
                        <option key={v.name} value={v.name}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Purchase Date</label>
                    <input
                      type="date"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold"
                      value={formData.purchaseDate || ""}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Purchase Price (IDR)</label>
                    <input
                      type="number"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold"
                      placeholder="e.g., 8500000"
                      value={formData.purchasePrice || 0}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Warranty Start Date</label>
                    <input
                      type="date"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                      value={formData.warrantyStart || ""}
                      onChange={(e) => setFormData({ ...formData, warrantyStart: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase text-[10px]">Warranty Expiry Date</label>
                    <input
                      type="date"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-blue-600"
                      value={formData.warrantyEnd || ""}
                      onChange={(e) => setFormData({ ...formData, warrantyEnd: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase text-[10px]">Technical Remarks / Notes</label>
                  <textarea
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                    rows={2}
                    placeholder="Provide additional details regarding system configuration, specific hospital department guidelines, or exceptions."
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {formMode === "add" ? "Register Asset" : "Update Asset Specs"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
