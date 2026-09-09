import React, { useState } from "react";
import { BorrowingLog, Asset, User, UserRole } from "../types";
import { DEPARTMENTS } from "../data/mockData";
import { RefreshCw, Plus, CheckCircle, Clock, AlertTriangle, ShieldAlert, X } from "lucide-react";

import { useAppContext } from "../hooks/useAppContext";
import { useAuth } from "../hooks/useAuth";

export default function BorrowingPage() {
  const {
    borrowings,
    assets,
    addBorrowing: onAddBorrowing,
    returnAsset: onReturnAsset
  } = useAppContext();
  const { currentUser } = useAuth();

  if (!currentUser) return null;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [returnNotes, setReturnNotes] = useState("");
  const [selectedBorrowingToReturn, setSelectedBorrowingToReturn] = useState<BorrowingLog | null>(null);

  // Form Fields
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [borrower, setBorrower] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [notes, setNotes] = useState("");

  const isReadOnly = currentUser.role === UserRole.KAKONLI;

  // Filter only active assets that are NOT already borrowed
  const borrowableAssets = assets.filter((a) => a.status === "Active");

  // Pre-fill asset in local state
  React.useEffect(() => {
    if (borrowableAssets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(borrowableAssets[0].id);
    }
  }, [borrowableAssets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find((a) => a.id === selectedAssetId);
    if (!asset) return;

    const newLog: BorrowingLog = {
      id: `b-${Date.now()}`,
      assetId: selectedAssetId,
      assetName: asset.assetName,
      assetCode: asset.assetCode,
      borrower,
      department,
      borrowDate: new Date().toISOString().split("T")[0],
      expectedReturnDate,
      status: "Borrowed",
      notes,
      approvedBy: currentUser.name
    };

    onAddBorrowing(newLog);
    setIsFormOpen(false);

    // Reset
    setBorrower("");
    setNotes("");
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBorrowingToReturn) return;

    onReturnAsset(selectedBorrowingToReturn.id, returnNotes);
    setSelectedBorrowingToReturn(null);
    setReturnNotes("");
  };

  return (
    <div className="space-y-6" id="borrowing-view">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">IT Hardware Borrowing Ledger</h2>
          <p className="text-slate-500 text-xs mt-1">
            Track temporary laptop or device lending logs for medical events, seminars, or backup systems replacement.
          </p>
        </div>
        
        {!isReadOnly && (
          <button
            onClick={() => setIsFormOpen(true)}
            disabled={borrowableAssets.length === 0}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-sm hover:shadow transition-all cursor-pointer font-bold"
          >
            <Plus className="w-4 h-4" /> Issue Borrowing Contract
          </button>
        )}
      </div>

      {/* Borrowing Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {borrowings.map((log) => {
          let statusBadge = "bg-amber-50 text-amber-700 border-amber-200";
          let statusIcon = <Clock className="w-3.5 h-3.5 text-amber-600" />;

          if (log.status === "Returned") {
            statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
            statusIcon = <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />;
          } else if (log.status === "Overdue") {
            statusBadge = "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
            statusIcon = <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
          }

          return (
            <div
              key={log.id}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">
                    {log.assetCode}
                  </span>
                  
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border flex items-center gap-1 ${statusBadge}`}>
                    {statusIcon}
                    {log.status}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-1">{log.assetName}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Borrower: <b className="text-slate-600">{log.borrower}</b> ({log.department.split(" (")[0]})</p>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-[10px] text-slate-500 font-semibold leading-relaxed">
                  <div className="flex justify-between">
                    <span>Lent Date:</span>
                    <b className="text-slate-700">{log.borrowDate}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Return:</span>
                    <b className="text-blue-600">{log.expectedReturnDate}</b>
                  </div>
                  {log.actualReturnDate && (
                    <div className="flex justify-between text-emerald-600 border-t border-slate-200/50 pt-1 mt-1">
                      <span>Returned On:</span>
                      <b>{log.actualReturnDate}</b>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Authorized By:</span>
                    <b className="text-slate-700">{log.approvedBy}</b>
                  </div>
                </div>

                {log.notes && (
                  <p className="text-[10px] text-slate-500 italic pl-2 border-l-2 border-slate-200">
                    Remark: {log.notes}
                  </p>
                )}
              </div>

              {/* Action Bottom */}
              {!isReadOnly && log.status === "Borrowed" && (
                <button
                  onClick={() => setSelectedBorrowingToReturn(log)}
                  className="w-full flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 rounded-xl text-xs cursor-pointer transition-all shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Return Asset to Stock
                </button>
              )}
            </div>
          );
        })}
        
        {borrowings.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-400 text-xs italic">
            No equipment loans/borrowings logs registered.
          </div>
        )}
      </div>

      {/* --- FORM 1: ISSUE BORROW CONTRACT MODAL --- */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100 animate-in fade-in-50 zoom-in-95 duration-200">
            
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold tracking-tight">Issue Asset Borrowing Contract</h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs scrollbar-thin">
              
              {/* Asset selection */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Select Available Stock Asset</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 font-semibold"
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  required
                >
                  {borrowableAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      [{asset.assetCode}] {asset.assetName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Borrower & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase">Borrower Staff Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    placeholder="e.g., dr. Linda Wijaya"
                    value={borrower}
                    onChange={(e) => setBorrower(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase">Borrower Department</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Return Schedule */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Expected Return Date</label>
                <input
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-blue-600"
                  value={expectedReturnDate}
                  onChange={(e) => setExpectedReturnDate(e.target.value)}
                  required
                />
              </div>

              {/* Purpose / Notes */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Purpose of Loan</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  rows={3}
                  placeholder="e.g., Audit presentations, backup machine due to local station PC printer breakdown..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Submit buttons */}
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
                  Confirm Loan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- FORM 2: RETURN ASSET DIALOG --- */}
      {selectedBorrowingToReturn && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full border border-slate-100 animate-in fade-in-50 zoom-in-95 duration-200">
            
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider">Confirm Asset Safe Return</h3>
              <button
                onClick={() => setSelectedBorrowingToReturn(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="p-5 space-y-4 text-xs">
              
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <div className="font-bold text-slate-800">{selectedBorrowingToReturn.assetName}</div>
                <div className="text-[10px] text-slate-500">Borrowed by: <b>{selectedBorrowingToReturn.borrower}</b></div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wide block">Return State / Condition Notes</label>
                <input
                  type="text"
                  placeholder="e.g., Returned in perfect working condition. Re-placed to stock cupboard."
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-blue-500 focus:bg-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setSelectedBorrowingToReturn(null)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Verify safe return
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
