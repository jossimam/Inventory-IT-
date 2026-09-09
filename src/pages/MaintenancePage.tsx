import React, { useState } from "react";
import { MaintenanceLog, Asset, User, UserRole } from "../types";
import { VENDORS, MAINTENANCE_TYPES } from "../data/mockData";
import { Wrench, Plus, CheckCircle, Clock, AlertTriangle, ShieldAlert, Search, Trash2, HeartPulse } from "lucide-react";

import { useAppContext } from "../hooks/useAppContext";
import { useAuth } from "../hooks/useAuth";

export default function MaintenancePage() {
  const {
    maintenance,
    assets,
    addMaintenance: onAddMaintenance,
    updateMaintenanceStatus: onUpdateMaintenanceStatus
  } = useAppContext();
  const { currentUser } = useAuth();

  if (!currentUser) return null;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Form Fields
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || "");
  const [maintType, setMaintType] = useState<"Preventive" | "Corrective">("Preventive");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(0);
  const [vendor, setVendor] = useState(VENDORS[0].name);
  const [technicianName, setTechnicianName] = useState("");
  const [status, setStatus] = useState<"In Progress" | "Completed" | "Pending Parts">("In Progress");
  const [notes, setNotes] = useState("");

  const isReadOnly = currentUser.role === UserRole.KAKONLI;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find((a) => a.id === selectedAssetId);
    if (!asset) return;

    const newLog: MaintenanceLog = {
      id: `m-${Date.now()}`,
      assetId: selectedAssetId,
      assetName: asset.assetName,
      type: maintType,
      date: new Date().toISOString().split("T")[0],
      description,
      cost,
      vendor,
      technicianName,
      status,
      notes,
      beforePhoto: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=150",
      afterPhoto: status === "Completed" ? "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=150" : undefined
    };

    onAddMaintenance(newLog);
    setIsFormOpen(false);
    
    // Clear Form
    setDescription("");
    setCost(0);
    setTechnicianName("");
    setNotes("");
  };

  const filteredLogs = maintenance.filter((log) => {
    const matchesSearch = log.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "All" || log.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6" id="maintenance-view">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">IT Maintenance Ledger</h2>
          <p className="text-slate-500 text-xs mt-1">
            Track Preventive (routine checkups) & Corrective (repairing breakdowns) actions of hospital assets.
          </p>
        </div>
        
        {!isReadOnly && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Log New Workorder
          </button>
        )}
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search workorders by asset, description, vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500 w-full sm:w-40"
          >
            <option value="All">All Types</option>
            <option value="Preventive">Preventive</option>
            <option value="Corrective">Corrective</option>
          </select>
        </div>
      </div>

      {/* Grid of Workorders / Maintenance Log Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLogs.map((log) => {
          let statusBadge = "bg-amber-50 text-amber-700 border-amber-200";
          let statusIcon = <Clock className="w-3.5 h-3.5" />;
          
          if (log.status === "Completed") {
            statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
            statusIcon = <CheckCircle className="w-3.5 h-3.5" />;
          } else if (log.status === "Pending Parts") {
            statusBadge = "bg-rose-50 text-rose-700 border-rose-200";
            statusIcon = <AlertTriangle className="w-3.5 h-3.5" />;
          }

          return (
            <div
              key={log.id}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="p-4 space-y-3">
                
                {/* Upper tags */}
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    log.type === "Preventive" ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-orange-50 text-orange-700 border-orange-200"
                  }`}>
                    {log.type}
                  </span>
                  
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border flex items-center gap-1 ${statusBadge}`}>
                    {statusIcon}
                    {log.status}
                  </span>
                </div>

                {/* Info block */}
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{log.assetName}</h3>
                  <div className="text-[10px] text-slate-400 font-medium">Logged Date: <b>{log.date}</b></div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{log.description}</p>

                {/* Cost and Vendor info */}
                <div className="p-2.5 bg-slate-50 rounded-xl space-y-1 text-[10px] text-slate-500 border border-slate-100">
                  <div className="flex justify-between">
                    <span>Contracted Vendor:</span>
                    <b className="text-slate-700">{log.vendor}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Engineer:</span>
                    <b className="text-slate-700">{log.technicianName}</b>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/50 pt-1 mt-1 font-bold">
                    <span className="text-slate-700">Service Overhead:</span>
                    <span className="text-blue-600">Rp {log.cost.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                {/* Remarks/Notes */}
                {log.notes && (
                  <p className="text-[10px] text-slate-500 border-l-2 border-slate-200 pl-2 italic">
                    Note: {log.notes}
                  </p>
                )}

              </div>

              {/* Photos comparison section (if available) */}
              {(log.beforePhoto || log.afterPhoto) && (
                <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-50 flex gap-2 items-center justify-center">
                  {log.beforePhoto && (
                    <div className="text-center">
                      <img src={log.beforePhoto} alt="Before" referrerPolicy="no-referrer" className="w-12 h-12 object-cover rounded-md border border-slate-200" />
                      <span className="text-[8px] text-slate-400 block font-bold uppercase mt-0.5">Before</span>
                    </div>
                  )}
                  {log.status === "Completed" && log.afterPhoto ? (
                    <div className="text-center">
                      <img src={log.afterPhoto} alt="After" referrerPolicy="no-referrer" className="w-12 h-12 object-cover rounded-md border border-slate-200" />
                      <span className="text-[8px] text-teal-600 block font-bold uppercase mt-0.5">After</span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-md border border-dashed border-slate-200 text-slate-400">
                      <HeartPulse className="w-4 h-4 animate-pulse" />
                    </div>
                  )}
                </div>
              )}

              {/* Actions Footer */}
              {!isReadOnly && log.status !== "Completed" && (
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onUpdateMaintenanceStatus(log.id, "Pending Parts", "Waiting for replacement thermal sensor.")}
                    className="px-2.5 py-1.5 hover:bg-slate-200 border border-slate-200 text-slate-600 font-semibold rounded-lg text-[10px] cursor-pointer transition-all"
                  >
                    Pending Parts
                  </button>
                  <button
                    onClick={() => onUpdateMaintenanceStatus(log.id, "Completed", "Recalibrated and fully tested.")}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-[10px] shadow-sm cursor-pointer transition-all"
                  >
                    Resolve & Complete
                  </button>
                </div>
              )}

            </div>
          );
        })}
        
        {filteredLogs.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-400 text-xs">
            No workorders matches the current filter or search queries.
          </div>
        )}
      </div>

      {/* --- WORKORDER CREATION MODAL --- */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100 animate-in fade-in-50 zoom-in-95 duration-200">
            
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold tracking-tight">Log Asset Maintenance Workorder</h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs scrollbar-thin">
              
              {/* Asset Select */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Target Hospital Asset</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500"
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  required
                >
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      [{asset.assetCode}] {asset.assetName} ({asset.floor})
                    </option>
                  ))}
                </select>
              </div>

              {/* Maintenance Type and Vendor */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase">Maintenance Category</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    value={maintType}
                    onChange={(e) => setMaintType(e.target.value as any)}
                  >
                    <option value="Preventive">Preventive Schedule</option>
                    <option value="Corrective">Corrective Failure</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase">Contracted Vendor</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                  >
                    {VENDORS.map((v) => (
                      <option key={v.name} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cost & Technician */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase">Estimated / Actual Cost (IDR)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    placeholder="e.g., 500000"
                    value={cost}
                    onChange={(e) => setCost(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase">Technician Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    placeholder="Technician engineer"
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Action Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Task Description & Diagnostic Scope</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  rows={3}
                  placeholder="Detail exactly what tasks are to be carried out (e.g., thermal calibration, memory chip swaps, printer cleaning...)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Immediate Remarks / Logs</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  placeholder="e.g., placing backup printer in room during repair."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Submit Buttons */}
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
                  Create Workorder
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Simple close svg element placeholder
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
