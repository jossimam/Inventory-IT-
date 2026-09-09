import React from "react";
import { Asset, MaintenanceLog, SupportTicket, BorrowingLog } from "../types";
import AuthAccessBanner from "../components/AuthAccessBanner";
import {
  Laptop,
  AlertTriangle,
  Wrench,
  HelpCircle,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

import { useAppContext } from "../hooks/useAppContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#a4de6c"];

export default function DashboardPage() {
  const { assets, tickets, maintenance, borrowings, setActiveTab } = useAppContext();
  
  // 1. Calculate KPI Metrics
  const totalAssets = assets.length;
  const activeAssets = assets.filter((a) => a.status === "Active").length;
  const brokenAssets = assets.filter((a) => a.status === "Broken" || a.condition === "Damaged").length;
  const inMaintenance = assets.filter((a) => a.status === "Maintenance" || a.condition === "Needs Repair").length;
  const borrowedAssets = assets.filter((a) => a.status === "Borrowed").length;

  // Check how many warranties are expiring in 2026 or past
  const now = new Date("2026-07-18");
  const expiringWarranty = assets.filter((a) => {
    if (!a.warrantyEnd) return false;
    const wDate = new Date(a.warrantyEnd);
    const diffTime = wDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 180; // Expiring within 6 months
  }).length;

  // 2. Data Preparation for Charts

  // Assets per Floor
  const floorCounts: Record<string, number> = {};
  assets.forEach((a) => {
    floorCounts[a.floor] = (floorCounts[a.floor] || 0) + 1;
  });
  const floorData = Object.keys(floorCounts).map((floor) => ({
    name: floor,
    Assets: floorCounts[floor]
  })).sort((a, b) => a.name.localeCompare(b.name));

  // Assets per Department
  const deptCounts: Record<string, number> = {};
  assets.forEach((a) => {
    // Shorten dept name for labels
    const shortName = a.department.split(" (")[0];
    deptCounts[shortName] = (deptCounts[shortName] || 0) + 1;
  });
  const deptData = Object.keys(deptCounts).map((dept) => ({
    name: dept,
    Assets: deptCounts[dept]
  })).sort((a, b) => b.Assets - a.Assets);

  // Assets per Category
  const catCounts: Record<string, number> = {};
  assets.forEach((a) => {
    catCounts[a.category] = (catCounts[a.category] || 0) + 1;
  });
  const catData = Object.keys(catCounts).map((cat) => ({
    name: cat,
    value: catCounts[cat]
  })).sort((a, b) => b.value - a.value);

  // Monthly Maintenance Cost & Tickets (Simulated trend for last 6 months)
  const monthlyTrends = [
    { month: "Feb 26", Cost: 1200000, Tickets: 14, Purchases: 18000000 },
    { month: "Mar 26", Cost: 2500000, Tickets: 18, Purchases: 22000000 },
    { month: "Apr 26", Cost: 950000,  Tickets: 12, Purchases: 10500000 },
    { month: "May 26", Cost: 3800000, Tickets: 22, Purchases: 34000000 },
    { month: "Jun 26", Cost: 1800000, Tickets: 15, Purchases: 15000000 },
    { month: "Jul 26", Cost: 2250000, Tickets: 19, Purchases: 28500000 }
  ];

  // Vendor distribution
  const vendorCounts: Record<string, number> = {};
  assets.forEach((a) => {
    if (a.vendor) vendorCounts[a.vendor] = (vendorCounts[a.vendor] || 0) + 1;
  });
  const vendorData = Object.keys(vendorCounts).map((vendor) => ({
    name: vendor.split(". ")[1] || vendor,
    value: vendorCounts[vendor]
  }));

  // Helpdesk status distribution
  const openTickets = tickets.filter((t) => t.status !== "Closed" && t.status !== "Resolved").length;

  return (
    <div className="space-y-6" id="dashboard-view">
      
      {/* Prominent Authentication & Role Access Status Banner */}
      <AuthAccessBanner />

      {/* Upper Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-sky-900 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-blue-900/10">
        <div>
          <h2 className="text-xl font-bold tracking-tight">SIM IT Dashboard</h2>
          <p className="text-sky-200 text-xs mt-1 leading-relaxed">
            Real-time status overview, telemetry records, and inventory metrics of RSIA Bina Medika.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm text-center">
            <div className="text-[10px] text-sky-200 uppercase tracking-widest font-semibold">Active Tickets</div>
            <div className="text-lg font-bold text-teal-300">{openTickets}</div>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm text-center">
            <div className="text-[10px] text-sky-200 uppercase tracking-widest font-semibold">System Assets</div>
            <div className="text-lg font-bold text-white">{totalAssets}</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* KPI 1: Total Asset */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Asset</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold text-slate-800">{totalAssets}</h3>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-teal-500" /> Cataloged Hardware
            </p>
          </div>
        </div>

        {/* KPI 2: Asset Active */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Active</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse"></span>
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold text-slate-800">{activeAssets}</h3>
            <p className="text-[10px] text-slate-400 mt-1">
              {Math.round((activeAssets / (totalAssets || 1)) * 100)}% of total deployment
            </p>
          </div>
        </div>

        {/* KPI 3: In Maintenance */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Maintenance</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold text-slate-800">{inMaintenance}</h3>
            <p className="text-[10px] text-slate-400 mt-1">
              Pending corrective/preventive
            </p>
          </div>
        </div>

        {/* KPI 4: Borrowed */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Borrowed</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold text-slate-800">{borrowedAssets}</h3>
            <p className="text-[10px] text-slate-400 mt-1">
              Active loan assignments
            </p>
          </div>
        </div>

        {/* KPI 5: Broken */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">Broken</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold text-slate-800">{brokenAssets}</h3>
            <p className="text-[10px] text-slate-400 mt-1 text-rose-600 font-medium">
              Immediate replacement needed
            </p>
          </div>
        </div>

        {/* KPI 6: Expiring Warranty */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Exp. Warranty</span>
            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-bold text-slate-800">{expiringWarranty}</h3>
            <p className="text-[10px] text-slate-400 mt-1">
              Within next 6 months
            </p>
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Floor Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Assets Distributed per Floor</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Asset load in physical hospital floors (1 - 5)</p>
            </div>
            <span className="p-1.5 bg-slate-50 text-slate-400 rounded-lg">
              <MapPin className="w-4 h-4" />
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={floorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "10px", border: "none", color: "#fff" }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Bar dataKey="Assets" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Mix */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Assets per Hardware Category</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Categorized breakdown of deployed devices</p>
            </div>
            <span className="p-1.5 bg-slate-50 text-slate-400 rounded-lg">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="h-60 flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={catData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {catData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "10px", border: "none", color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend layout */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-xl font-extrabold text-slate-800">{totalAssets}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Total Devices</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-50">
            {catData.slice(0, 4).map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="truncate">{item.name} ({item.value})</span>
              </div>
            ))}
            {catData.length > 4 && (
              <div className="col-span-2 text-center text-[10px] text-slate-400 pt-1">
                + {catData.length - 4} other categories
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Row 2: Secondary Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 3: Monthly Maintenance Cost & Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Operational Overhead Trends</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">6-month tracking of procurement and maintenance expenditure</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-1.5 bg-blue-500 rounded"></span>
                <span>Purchases</span>
              </div>
              <div className="flex items-center gap-1.5 text-teal-600">
                <span className="w-2.5 h-1.5 bg-teal-500 rounded"></span>
                <span>Maint. Costs</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `Rp ${val/1000000}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "10px", border: "none", color: "#fff" }}
                  formatter={(val: number) => `Rp ${val.toLocaleString("id-ID")}`}
                />
                <Area type="monotone" dataKey="Purchases" stroke="#2563eb" fillOpacity={1} fill="url(#colorPurchases)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="Cost" stroke="#0d9488" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Department Loads (Quick Grid ranking) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-800">Top Department Deploys</h4>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">Ranking</span>
            </div>
            
            <div className="space-y-3">
              {deptData.slice(0, 5).map((dept, index) => {
                const max = Math.max(...deptData.map((d) => d.Assets));
                const percent = Math.round((dept.Assets / (max || 1)) * 100);
                return (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-700 truncate">{dept.name}</span>
                      <span className="text-slate-950 font-bold">{dept.Assets} units</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveTab("inventory")}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-semibold py-2 rounded-xl text-xs mt-4 transition-all cursor-pointer"
          >
            Manage Hardware Inventory <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Row 3: Live System Operations Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Box 1: Recent Critical Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Critical & High Priority Helpdesk</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Tickets requiring immediate nurse-station intervention</p>
            </div>
            <button
              onClick={() => setActiveTab("helpdesk")}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View Helpdesk <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="space-y-3">
            {tickets.filter((t) => t.priority === "High" || t.priority === "Critical").slice(0, 3).map((t) => (
              <div key={t.id} className="p-3 bg-rose-50/40 rounded-xl border border-rose-100/50 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{t.ticketNumber}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded font-semibold bg-rose-100 text-rose-800 uppercase tracking-wider">
                      {t.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium line-clamp-1">{t.description}</p>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>Dept: <b className="text-slate-600">{t.department}</b></span>
                    <span>•</span>
                    <span>Assigned: <b className="text-slate-600">{t.assignedTechnician}</b></span>
                  </div>
                </div>
                <div className={`text-[10px] px-2 py-1 rounded-full font-bold border ${
                  t.status === "Open" ? "bg-red-50 text-red-700 border-red-200" :
                  t.status === "In Progress" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>
                  {t.status}
                </div>
              </div>
            ))}
            {tickets.filter((t) => t.priority === "High" || t.priority === "Critical").length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400">
                No active critical/high tickets found. All systems healthy.
              </div>
            )}
          </div>
        </div>

        {/* Box 2: Maintenance Schedules */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800">Active Maintenance Queue</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Devices currently undergoing technical diagnostics</p>
            </div>
            <button
              onClick={() => setActiveTab("maintenance")}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View Maintenance <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {maintenance.slice(0, 3).map((m) => (
              <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[200px] block">{m.assetName}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
                      m.type === "Preventive" ? "bg-teal-100 text-teal-800" : "bg-orange-100 text-orange-800"
                    }`}>
                      {m.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{m.description}</p>
                  <div className="text-[10px] text-slate-400">
                    <span>Date: <b className="text-slate-600">{m.date}</b></span>
                    <span className="mx-1.5">•</span>
                    <span>Cost: <b className="text-slate-600">Rp {m.cost.toLocaleString("id-ID")}</b></span>
                  </div>
                </div>
                <div className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                  m.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {m.status}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
