import React, { useState } from "react";
import { AssetMovementLog, Asset, User, UserRole } from "../types";
import { DEPARTMENTS } from "../data/mockData";
import { FolderSync, Plus, ArrowRight, MapPin, ShieldAlert, X } from "lucide-react";

import { useAppContext } from "../hooks/useAppContext";
import { useAuth } from "../hooks/useAuth";

export default function MovementPage() {
  const {
    movements,
    assets,
    addMovement: onAddMovement,
    floors,
    rooms
  } = useAppContext();
  const { currentUser } = useAuth();

  if (!currentUser) return null;
  
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form Fields
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [targetFloor, setTargetFloor] = useState(floors[0] || "Floor 1");
  const [targetRoom, setTargetRoom] = useState((rooms[floors[0] || "Floor 1"] || [])[0] || "Registration");
  const [targetDept, setTargetDept] = useState(DEPARTMENTS[0]);
  const [reason, setReason] = useState("");

  const isReadOnly = currentUser.role === UserRole.KAKONLI;

  // Find selected asset to pre-display old location in Form
  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  React.useEffect(() => {
    if (assets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(assets[0].id);
    }
  }, [assets]);

  // Handle auto pre-fill of target rooms when floor changes
  const targetRoomsList = rooms[targetFloor] || [];
  React.useEffect(() => {
    if (targetRoomsList.length > 0) {
      setTargetRoom(targetRoomsList[0]);
    } else {
      setTargetRoom("");
    }
  }, [targetFloor, rooms]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    const newLog: AssetMovementLog = {
      id: `mov-${Date.now()}`,
      assetId: selectedAsset.id,
      assetName: selectedAsset.assetName,
      oldLocation: {
        building: selectedAsset.building,
        floor: selectedAsset.floor,
        room: selectedAsset.room,
        department: selectedAsset.department
      },
      newLocation: {
        building: "Main Building",
        floor: targetFloor,
        room: targetRoom,
        department: targetDept
      },
      reason,
      approvedBy: currentUser.name,
      date: new Date().toISOString().split("T")[0]
    };

    onAddMovement(newLog);
    setIsFormOpen(false);
    
    // Clear
    setReason("");
  };

  return (
    <div className="space-y-6" id="movement-view">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Physical Location Movement Logs</h2>
          <p className="text-slate-500 text-xs mt-1">
            Trace the chain of custody and physical relocation history of hardware across RSIA Bina Medika's 5 floors.
          </p>
        </div>
        
        {!isReadOnly && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-sm hover:shadow transition-all cursor-pointer font-bold"
          >
            <Plus className="w-4 h-4" /> Relocate Hospital Equipment
          </button>
        )}
      </div>

      {/* Movement List Timeline layout */}
      <div className="space-y-4 max-w-4xl">
        {movements.map((log) => (
          <div
            key={log.id}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow transition-shadow grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
          >
            
            {/* Timeline date bullet */}
            <div className="md:col-span-2 text-center md:text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Relocation Date</span>
              <div className="font-bold text-sm text-slate-800 mt-0.5">{log.date}</div>
            </div>

            {/* Asset details */}
            <div className="md:col-span-3 space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50 inline-block">
                Chain of Custody
              </span>
              <div className="font-bold text-xs text-slate-800 line-clamp-1">{log.assetName}</div>
            </div>

            {/* Flow old -> new location */}
            <div className="md:col-span-4 flex items-center justify-center md:justify-start gap-3.5">
              
              {/* Old Location */}
              <div className="text-center md:text-left">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Source</span>
                <span className="text-xs text-slate-700 font-semibold block">{log.oldLocation.floor} • {log.oldLocation.room}</span>
              </div>

              {/* Arrow */}
              <div className="p-1 bg-blue-50 text-blue-600 rounded-full">
                <ArrowRight className="w-4 h-4" />
              </div>

              {/* New Location */}
              <div className="text-center md:text-left">
                <span className="text-[9px] text-blue-500 font-bold block uppercase">Destination</span>
                <span className="text-xs text-slate-950 font-bold block">{log.newLocation.floor} • {log.newLocation.room}</span>
              </div>

            </div>

            {/* Reason & approval info */}
            <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 space-y-1 text-xs">
              <p className="text-slate-600 font-medium line-clamp-1 italic">"{log.reason}"</p>
              <div className="text-[10px] text-slate-400">
                Approved: <b className="text-slate-600">{log.approvedBy}</b>
              </div>
            </div>

          </div>
        ))}

        {movements.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 text-xs italic">
            No equipment relocation history cataloged yet.
          </div>
        )}
      </div>

      {/* --- EQUIPMENT RELOCATION FORM MODAL --- */}
      {isFormOpen && selectedAsset && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 animate-in fade-in-50 zoom-in-95 duration-200">
            
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold tracking-tight">Relocate Equipment & Update DB</h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              
              {/* Select Asset */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Select Target Asset</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-semibold"
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  required
                >
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      [{asset.assetCode}] {asset.assetName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Read-only Current location summary */}
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl space-y-1">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Current Asset Location (Source):</span>
                <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedAsset.floor} / {selectedAsset.room}</span>
                </div>
                <div className="text-[10px] text-slate-500">Dept: {selectedAsset.department}</div>
              </div>

              {/* Set Destination Floor & Room & Department */}
              <div className="border border-slate-100 p-3.5 rounded-2xl bg-blue-50/20 space-y-3.5">
                <span className="text-[9px] text-blue-600 font-bold block uppercase tracking-wide">Target Destination parameters:</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Floor</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                      value={targetFloor}
                      onChange={(e) => setTargetFloor(e.target.value)}
                    >
                      {floors.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Room</label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                      value={targetRoom}
                      onChange={(e) => setTargetRoom(e.target.value)}
                    >
                      {targetRoomsList.map((rm) => (
                        <option key={rm} value={rm}>{rm}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Department Allocation</label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                    value={targetDept}
                    onChange={(e) => setTargetDept(e.target.value)}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Reason for movement</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  rows={2}
                  placeholder="e.g., Repurposing lobby PC to ER pediatric registration desk due to patient loads..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Execute Relocation
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
