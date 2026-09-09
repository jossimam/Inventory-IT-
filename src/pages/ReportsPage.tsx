import React, { useState } from "react";
import { Asset, MaintenanceLog, SupportTicket, BorrowingLog, AssetMovementLog } from "../types";
import { DEPARTMENTS, CONDITIONS } from "../data/mockData";
import { FileSpreadsheet, Printer, Search, Download, CheckSquare, ListFilter, HelpCircle, Layers, MapPin } from "lucide-react";
import * as XLSX from "xlsx";

import { useAppContext } from "../hooks/useAppContext";

type ReportType = "assets" | "maintenance" | "tickets" | "warranty" | "borrowings" | "movements";

export default function ReportsPage() {
  const {
    assets,
    maintenance,
    tickets,
    borrowings,
    movements,
    floors
  } = useAppContext();
  
  const [reportType, setReportType] = useState<ReportType>("assets");
  const [filterFloor, setFilterFloor] = useState("All");
  const [filterDept, setFilterDept] = useState("All");
  const [filterCondition, setFilterCondition] = useState("All");

  // 1. Filter data based on selections
  const getReportData = () => {
    switch (reportType) {
      case "assets":
        return assets.filter((a) => {
          const fFloor = filterFloor === "All" || a.floor === filterFloor;
          const fDept = filterDept === "All" || a.department === filterDept;
          const fCond = filterCondition === "All" || a.condition === filterCondition;
          return fFloor && fDept && fCond;
        });
      
      case "maintenance":
        return maintenance.filter((m) => {
          // Look up asset floor and dept for cross-filtering maintenance
          const asset = assets.find((a) => a.id === m.assetId);
          if (!asset) return true;
          const fFloor = filterFloor === "All" || asset.floor === filterFloor;
          const fDept = filterDept === "All" || asset.department === filterDept;
          const fCond = filterCondition === "All" || asset.condition === filterCondition;
          return fFloor && fDept && fCond;
        });

      case "tickets":
        return tickets.filter((t) => {
          const fFloor = filterFloor === "All" || t.floor === filterFloor;
          const fDept = filterDept === "All" || t.department === filterDept;
          return fFloor && fDept;
        });

      case "warranty":
        // Assets with expiring or active warranty
        return assets.filter((a) => {
          const fFloor = filterFloor === "All" || a.floor === filterFloor;
          const fDept = filterDept === "All" || a.department === filterDept;
          const fCond = filterCondition === "All" || a.condition === filterCondition;
          return fFloor && fDept && fCond;
        });

      case "borrowings":
        return borrowings.filter((b) => {
          const fDept = filterDept === "All" || b.department === filterDept;
          return fDept;
        });

      case "movements":
        return movements.filter((m) => {
          const fFloor = filterFloor === "All" || m.newLocation.floor === filterFloor;
          const fDept = filterDept === "All" || m.newLocation.department === filterDept;
          return fFloor && fDept;
        });

      default:
        return [];
    }
  };

  const reportRecords = getReportData();

  // 2. Export Excel using SheetJS (XLSX)
  const handleExportExcel = () => {
    let rawSheetData: any[] = [];
    let title = "Report_Export";

    if (reportType === "assets") {
      title = "RSIA_BinaMedika_IT_Assets_Report";
      rawSheetData = reportRecords.map((a: any) => ({
        "Inventory Number": a.inventoryNumber,
        "Asset Code": a.assetCode,
        "Asset Name": a.assetName,
        "Category": a.category,
        "Brand": a.brand,
        "Model": a.model,
        "Serial Number": a.serialNumber,
        "Floor": a.floor,
        "Room": a.room,
        "Department": a.department,
        "IP Address": a.ipAddress,
        "Status": a.status,
        "Condition": a.condition,
        "Purchase Date": a.purchaseDate,
        "Purchase Cost": a.purchasePrice,
        "Vendor": a.vendor
      }));
    } else if (reportType === "maintenance") {
      title = "RSIA_BinaMedika_IT_Maintenance_Report";
      rawSheetData = reportRecords.map((m: any) => ({
        "Asset ID": m.assetId,
        "Asset Name": m.assetName,
        "Type": m.type,
        "Date": m.date,
        "Description": m.description,
        "Overhead Cost": m.cost,
        "Vendor": m.vendor,
        "Technician": m.technicianName,
        "Status": m.status
      }));
    } else if (reportType === "tickets") {
      title = "RSIA_BinaMedika_IT_Helpdesk_Tickets";
      rawSheetData = reportRecords.map((t: any) => ({
        "Ticket Number": t.ticketNumber,
        "Date": t.date,
        "Category": t.category,
        "Priority": t.priority,
        "Requester": t.requester,
        "Floor": t.floor,
        "Room": t.room,
        "Department": t.department,
        "Technician": t.assignedTechnician,
        "Status": t.status,
        "Description": t.description
      }));
    } else if (reportType === "warranty") {
      title = "RSIA_BinaMedika_IT_Warranty_Watchlist";
      rawSheetData = reportRecords.map((a: any) => ({
        "Asset Code": a.assetCode,
        "Asset Name": a.assetName,
        "Vendor": a.vendor,
        "Warranty Start": a.warrantyStart,
        "Warranty End": a.warrantyEnd,
        "Floor": a.floor,
        "Department": a.department,
        "Condition": a.condition
      }));
    } else if (reportType === "borrowings") {
      title = "RSIA_BinaMedika_IT_Equipment_Loans";
      rawSheetData = reportRecords.map((b: any) => ({
        "Asset Code": b.assetCode,
        "Asset Name": b.assetName,
        "Borrower": b.borrower,
        "Borrower Department": b.department,
        "Loan Date": b.borrowDate,
        "Expected Return": b.expectedReturnDate,
        "Actual Return": b.actualReturnDate || "Lent",
        "Authorized By": b.approvedBy,
        "Status": b.status
      }));
    } else if (reportType === "movements") {
      title = "RSIA_BinaMedika_IT_Equipment_Relocations";
      rawSheetData = reportRecords.map((m: any) => ({
        "Asset Name": m.assetName,
        "Old Floor": m.oldLocation.floor,
        "Old Room": m.oldLocation.room,
        "New Floor": m.newLocation.floor,
        "New Room": m.newLocation.room,
        "Reason": m.reason,
        "Approved By": m.approvedBy,
        "Relocation Date": m.date
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(rawSheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "IT_Report");
    XLSX.writeFile(workbook, `${title}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  // 3. Print Report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="reports-view">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-800">IT Analytics & Export Center</h2>
          <p className="text-slate-500 text-xs mt-1">
            Generate and export tailored hospital operational reports instantly. Supports XLSX files and PDF print layouts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <FileSpreadsheet className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Report Selection HUD */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 print:hidden">
        
        {/* Assets */}
        <button
          onClick={() => setReportType("assets")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            reportType === "assets"
              ? "bg-blue-600 text-white border-blue-700 shadow-md font-bold"
              : "bg-white hover:bg-slate-50 text-slate-700 border-slate-100 shadow-sm"
          }`}
        >
          <div className="text-[9px] uppercase tracking-wider font-bold opacity-80">Catalog</div>
          <div className="text-xs font-bold mt-1">IT Asset Directory</div>
        </button>

        {/* Maintenance */}
        <button
          onClick={() => setReportType("maintenance")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            reportType === "maintenance"
              ? "bg-blue-600 text-white border-blue-700 shadow-md font-bold"
              : "bg-white hover:bg-slate-50 text-slate-700 border-slate-100 shadow-sm"
          }`}
        >
          <div className="text-[9px] uppercase tracking-wider font-bold opacity-80">Overhead</div>
          <div className="text-xs font-bold mt-1">Maintenance Ledger</div>
        </button>

        {/* Tickets */}
        <button
          onClick={() => setReportType("tickets")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            reportType === "tickets"
              ? "bg-blue-600 text-white border-blue-700 shadow-md font-bold"
              : "bg-white hover:bg-slate-50 text-slate-700 border-slate-100 shadow-sm"
          }`}
        >
          <div className="text-[9px] uppercase tracking-wider font-bold opacity-80">Support SLA</div>
          <div className="text-xs font-bold mt-1">Helpdesk SLA Tickets</div>
        </button>

        {/* Warranty */}
        <button
          onClick={() => setReportType("warranty")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            reportType === "warranty"
              ? "bg-blue-600 text-white border-blue-700 shadow-md font-bold"
              : "bg-white hover:bg-slate-50 text-slate-700 border-slate-100 shadow-sm"
          }`}
        >
          <div className="text-[9px] uppercase tracking-wider font-bold opacity-80">Validity</div>
          <div className="text-xs font-bold mt-1">Warranty watchlists</div>
        </button>

        {/* Borrowings */}
        <button
          onClick={() => setReportType("borrowings")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            reportType === "borrowings"
              ? "bg-blue-600 text-white border-blue-700 shadow-md font-bold"
              : "bg-white hover:bg-slate-50 text-slate-700 border-slate-100 shadow-sm"
          }`}
        >
          <div className="text-[9px] uppercase tracking-wider font-bold opacity-80">Lendings</div>
          <div className="text-xs font-bold mt-1">Equipment Loans</div>
        </button>

        {/* Movements */}
        <button
          onClick={() => setReportType("movements")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            reportType === "movements"
              ? "bg-blue-600 text-white border-blue-700 shadow-md font-bold"
              : "bg-white hover:bg-slate-50 text-slate-700 border-slate-100 shadow-sm"
          }`}
        >
          <div className="text-[9px] uppercase tracking-wider font-bold opacity-80">Custodian</div>
          <div className="text-xs font-bold mt-1">Location Movements</div>
        </button>

      </div>

      {/* Filter Options Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        
        <div className="grid grid-cols-3 gap-3 flex-1">
          {/* Floor Directory */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Floor filter:</span>
            <select
              value={filterFloor}
              disabled={reportType === "borrowings"}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 w-full"
            >
              <option value="All">All Floors</option>
              {floors.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Department filter:</span>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 w-full"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d.split(" (")[0]}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Condition filter:</span>
            <select
              value={filterCondition}
              disabled={reportType === "tickets" || reportType === "borrowings" || reportType === "movements"}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 w-full"
            >
              <option value="All">All Conditions</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-sm hover:shadow transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export XLSX
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-sm hover:shadow transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>

      </div>

      {/* --- REPORT PRINT WRAPPER AND LIVE PREVIEW CANVAS --- */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6" id="printable-report">
        
        {/* Printable Header - Visible in print media or inside report canvas */}
        <div className="border-b-4 border-double border-slate-800 pb-5 text-center space-y-1 flex flex-col items-center">
          <div className="text-xl font-bold tracking-tight text-slate-950 uppercase">
            RUMAH SAKIT IBU ANAK BINA MEDIKA
          </div>
          <p className="text-[10px] text-slate-500 tracking-wider font-semibold uppercase">
            IT Department • Jl. Bina Medika No. 12, Jakarta, Indonesia
          </p>
          <div className="w-24 h-1 bg-blue-600 rounded my-2"></div>
          
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest pt-2">
            {reportType === "assets" && "Official IT Hardware Assets Inventory Directory"}
            {reportType === "maintenance" && "Official Equipment Maintenance Ledger & Operational Overhead Costing"}
            {reportType === "tickets" && "Official Helpdesk Incident Tickets & Resolution SLA Performance"}
            {reportType === "warranty" && "Warranty Coverage Watchlist & Device Expiration Schedules"}
            {reportType === "borrowings" && "Lent Hardware Borrowing Registry & Chain of Custody Audit"}
            {reportType === "movements" && "Physical Equipment Movement Logs & Physical Relocation Directory"}
          </h3>

          <div className="text-[10px] text-slate-400 font-bold uppercase pt-1">
            Generated: {new Date().toLocaleDateString("id-ID")} • Status filters: {filterFloor}/{filterDept}/{filterCondition}
          </div>
        </div>

        {/* Live preview table content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 text-slate-500 uppercase text-[9px] tracking-wider font-bold bg-slate-50/50">
                {reportType === "assets" && (
                  <>
                    <th className="py-2.5 px-3">Asset Code</th>
                    <th className="py-2.5 px-3">Asset Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">IP Address</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Condition</th>
                  </>
                )}
                {reportType === "maintenance" && (
                  <>
                    <th className="py-2.5 px-3">Log Date</th>
                    <th className="py-2.5 px-3">Asset Name</th>
                    <th className="py-2.5 px-3">Workorder Type</th>
                    <th className="py-2.5 px-3">Contractor Vendor</th>
                    <th className="py-2.5 px-3">Diagnostic Scope</th>
                    <th className="py-2.5 px-3">Service cost</th>
                    <th className="py-2.5 px-3">State</th>
                  </>
                )}
                {reportType === "tickets" && (
                  <>
                    <th className="py-2.5 px-3">Ticket ID</th>
                    <th className="py-2.5 px-3">Filing Date</th>
                    <th className="py-2.5 px-3">Staff Requester</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Urgency</th>
                    <th className="py-2.5 px-3">Incident scope</th>
                    <th className="py-2.5 px-3">SLA State</th>
                  </>
                )}
                {reportType === "warranty" && (
                  <>
                    <th className="py-2.5 px-3">Asset Code</th>
                    <th className="py-2.5 px-3">Hardware Name</th>
                    <th className="py-2.5 px-3">Vendor</th>
                    <th className="py-2.5 px-3">Warranty Start</th>
                    <th className="py-2.5 px-3">Warranty Expiry</th>
                    <th className="py-2.5 px-3">Physical Floor</th>
                    <th className="py-2.5 px-3">Condition</th>
                  </>
                )}
                {reportType === "borrowings" && (
                  <>
                    <th className="py-2.5 px-3">Asset Code</th>
                    <th className="py-2.5 px-3">Hardware Name</th>
                    <th className="py-2.5 px-3">Borrowing Staff</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Loan Date</th>
                    <th className="py-2.5 px-3">Expected Return</th>
                    <th className="py-2.5 px-3">Authorization</th>
                    <th className="py-2.5 px-3">Status</th>
                  </>
                )}
                {reportType === "movements" && (
                  <>
                    <th className="py-2.5 px-3">Movement Date</th>
                    <th className="py-2.5 px-3">Asset Name</th>
                    <th className="py-2.5 px-3">Old Location (Source)</th>
                    <th className="py-2.5 px-3">New Location (Dest)</th>
                    <th className="py-2.5 px-3">Relocation Reason</th>
                    <th className="py-2.5 px-3">Authorized By</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px] font-semibold text-slate-700">
              
              {/* Assets rendering */}
              {reportType === "assets" && (reportRecords as Asset[]).map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/20">
                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">{a.assetCode}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">{a.assetName}</td>
                  <td className="py-2.5 px-3 text-slate-500">{a.category}</td>
                  <td className="py-2.5 px-3 text-slate-500">{a.floor} / {a.room}</td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">{a.ipAddress || "N/A"}</td>
                  <td className="py-2.5 px-3">{a.status}</td>
                  <td className="py-2.5 px-3">{a.condition}</td>
                </tr>
              ))}

              {/* Maintenance rendering */}
              {reportType === "maintenance" && (reportRecords as MaintenanceLog[]).map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/20">
                  <td className="py-2.5 px-3 font-bold">{m.date}</td>
                  <td className="py-2.5 px-3">{m.assetName}</td>
                  <td className="py-2.5 px-3">{m.type}</td>
                  <td className="py-2.5 px-3 text-slate-500">{m.vendor}</td>
                  <td className="py-2.5 px-3 text-slate-500 truncate max-w-xs">{m.description}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-600">Rp {m.cost.toLocaleString("id-ID")}</td>
                  <td className="py-2.5 px-3">{m.status}</td>
                </tr>
              ))}

              {/* Helpdesk tickets rendering */}
              {reportType === "tickets" && (reportRecords as SupportTicket[]).map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/20">
                  <td className="py-2.5 px-3 font-mono font-bold">{t.ticketNumber}</td>
                  <td className="py-2.5 px-3">{t.date}</td>
                  <td className="py-2.5 px-3 text-slate-500">{t.requester}</td>
                  <td className="py-2.5 px-3 text-slate-500">{t.category}</td>
                  <td className="py-2.5 px-3 font-bold text-rose-700">{t.priority}</td>
                  <td className="py-2.5 px-3 text-slate-500 truncate max-w-xs">{t.description}</td>
                  <td className="py-2.5 px-3">{t.status}</td>
                </tr>
              ))}

              {/* Warranty watchlists */}
              {reportType === "warranty" && (reportRecords as Asset[]).map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/20">
                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">{a.assetCode}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">{a.assetName}</td>
                  <td className="py-2.5 px-3 text-slate-500">{a.vendor}</td>
                  <td className="py-2.5 px-3">{a.warrantyStart}</td>
                  <td className="py-2.5 px-3 font-bold text-blue-600">{a.warrantyEnd}</td>
                  <td className="py-2.5 px-3 text-slate-500">{a.floor}</td>
                  <td className="py-2.5 px-3">{a.condition}</td>
                </tr>
              ))}

              {/* Borrowings rendering */}
              {reportType === "borrowings" && (reportRecords as BorrowingLog[]).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/20">
                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">{b.assetCode}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">{b.assetName}</td>
                  <td className="py-2.5 px-3">{b.borrower}</td>
                  <td className="py-2.5 px-3 text-slate-500">{b.department.split(" (")[0]}</td>
                  <td className="py-2.5 px-3">{b.borrowDate}</td>
                  <td className="py-2.5 px-3 font-bold text-blue-600">{b.expectedReturnDate}</td>
                  <td className="py-2.5 px-3 text-slate-500">{b.approvedBy}</td>
                  <td className="py-2.5 px-3">{b.status}</td>
                </tr>
              ))}

              {/* Relocation movements rendering */}
              {reportType === "movements" && (reportRecords as AssetMovementLog[]).map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/20">
                  <td className="py-2.5 px-3 font-bold">{m.date}</td>
                  <td className="py-2.5 px-3">{m.assetName}</td>
                  <td className="py-2.5 px-3 text-slate-500">{m.oldLocation.floor} • {m.oldLocation.room}</td>
                  <td className="py-2.5 px-3 font-bold text-blue-600">{m.newLocation.floor} • {m.newLocation.room}</td>
                  <td className="py-2.5 px-3 text-slate-500 truncate max-w-xs">"{m.reason}"</td>
                  <td className="py-2.5 px-3 text-slate-500">{m.approvedBy}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {/* Report Summary Footer panel */}
        <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wider text-center sm:text-left">
          <div>
            Total report records parsed: <b className="text-slate-800">{reportRecords.length} items</b>
          </div>
          
          {reportType === "maintenance" && (
            <div className="text-blue-600 font-bold mt-1 sm:mt-0">
              Sum Total Maintenance Overhead:{" "}
              <b className="text-slate-900 font-extrabold text-sm ml-1">
                Rp {reportRecords.reduce((sum, item: any) => sum + item.cost, 0).toLocaleString("id-ID")}
              </b>
            </div>
          )}

          <div>
            Authorized signatory: <span className="text-slate-800 font-bold">SIM IT Director</span>
          </div>
        </div>

      </div>

    </div>
  );
}
