import React, { useState } from "react";
import { SupportTicket, TicketComment, User, UserRole } from "../types";
import { TICKET_CATEGORIES } from "../data/mockData";
import { HelpCircle, Plus, Send, Clock, CheckCircle, AlertTriangle, MessageSquare, ShieldAlert, UserCheck, X } from "lucide-react";

import { useAppContext } from "../hooks/useAppContext";
import { useAuth } from "../hooks/useAuth";

export default function HelpdeskPage() {
  const {
    tickets,
    addTicket: onAddTicket,
    addComment: onAddComment,
    updateTicketStatus: onUpdateTicketStatus,
    floors,
    rooms
  } = useAppContext();
  const { currentUser } = useAuth();

  if (!currentUser) return null;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");

  // Form Fields
  const [category, setCategory] = useState(TICKET_CATEGORIES[0]);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [description, setDescription] = useState("");
  const [floor, setFloor] = useState(floors[0] || "Floor 1");
  const [room, setRoom] = useState((rooms[floors[0] || "Floor 1"] || [])[0] || "Registration");
  const [requester, setRequester] = useState("");
  const [department, setDepartment] = useState("Nursing (Keperawatan)");

  // Sync room when floor changes
  React.useEffect(() => {
    const availableRooms = rooms[floor] || [];
    if (availableRooms.length > 0 && !availableRooms.includes(room)) {
      setRoom(availableRooms[0]);
    }
  }, [floor, rooms]);

  // Comment Field
  const [commentText, setCommentText] = useState("");

  const isReadOnly = currentUser.role === UserRole.KAKONLI;

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !requester.trim()) return;

    const dateStr = new Date().toISOString().split("T")[0];
    const serial = Math.floor(100 + Math.random() * 900);
    const ticketNumber = `TKT-${dateStr.replace(/-/g, "")}-${serial}`;

    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber,
      date: dateStr,
      category,
      priority,
      requester,
      department,
      room,
      floor,
      description,
      assignedTechnician: "Rizky Ramadhan", // Default assigned to IT tech
      status: "Open",
      comments: []
    };

    onAddTicket(newTicket);
    setIsFormOpen(false);
    
    // Clear
    setDescription("");
    setRequester("");
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedTicket) return;

    onAddComment(selectedTicket.id, commentText.trim());
    
    // Append locally to immediate state to prevent stale redraw lag
    const localComment: TicketComment = {
      id: `c-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      text: commentText.trim(),
      timestamp: new Date().toISOString()
    };
    setSelectedTicket({
      ...selectedTicket,
      comments: [...selectedTicket.comments, localComment]
    });

    setCommentText("");
  };

  // Filter lists
  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = filterStatus === "All" || t.status === filterStatus;
    const matchesPriority = filterPriority === "All" || t.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6" id="helpdesk-view">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">IT Helpdesk Support Tickets</h2>
          <p className="text-slate-500 text-xs mt-1">
            Nurse stations can file incident reports. Technicians track resolution timers to adhere to hospital SLAs.
          </p>
        </div>
        
        {!isReadOnly && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> File Support Ticket
          </button>
        )}
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-semibold text-slate-600"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-semibold text-slate-600"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Ticket List (Left) */}
        <div className="lg:col-span-7 space-y-4 max-h-[75vh] overflow-y-auto pr-1 scrollbar-thin">
          {filteredTickets.map((t) => {
            let priorityBadge = "bg-slate-50 text-slate-700 border-slate-200";
            if (t.priority === "Critical") priorityBadge = "bg-rose-50 text-rose-800 border-rose-200 font-extrabold animate-pulse";
            if (t.priority === "High") priorityBadge = "bg-orange-50 text-orange-800 border-orange-200 font-bold";
            if (t.priority === "Medium") priorityBadge = "bg-blue-50 text-blue-800 border-blue-200";

            let statusBadge = "bg-slate-50 text-slate-700 border-slate-200";
            if (t.status === "Open") statusBadge = "bg-red-50 text-red-700 border-red-200";
            if (t.status === "In Progress") statusBadge = "bg-amber-50 text-amber-700 border-amber-200";
            if (t.status === "Resolved") statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";

            const isCurrent = selectedTicket?.id === t.id;

            return (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white flex flex-col justify-between gap-3.5 ${
                  isCurrent ? "border-blue-600 ring-2 ring-blue-600/10 shadow-md" : "border-slate-100 hover:border-slate-200 shadow-sm"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 font-mono">{t.ticketNumber}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${priorityBadge}`}>
                        {t.priority}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${statusBadge}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 line-clamp-2 leading-relaxed">
                    {t.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <div>
                    Requester: <b className="text-slate-600">{t.requester}</b> ({t.department.split(" (")[0]})
                  </div>
                  <div className="text-slate-500">
                    Logged: {t.date}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTickets.length === 0 && (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-400 text-xs italic">
              No tickets found matching current status/priority filters.
            </div>
          )}
        </div>

        {/* Selected Ticket Comments & Operations Panel (Right) */}
        <div className="lg:col-span-5 sticky top-20">
          {selectedTicket ? (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              
              {/* Box Header */}
              <div className="border-b border-slate-50 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 font-mono">{selectedTicket.ticketNumber}</h4>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">Category: {selectedTicket.category}</div>
                </div>
                <div className="text-[10px] text-slate-500">Location: <b>{selectedTicket.floor}/{selectedTicket.room}</b></div>
              </div>

              {/* Status workflow selection */}
              {!isReadOnly && (
                <div className="space-y-1 bg-slate-50 p-2.5 rounded-2xl border border-slate-150">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Set SLA Status State:</span>
                  <div className="grid grid-cols-4 gap-1 pt-1">
                    {["Open", "In Progress", "Resolved", "Closed"].map((st) => {
                      const isActive = selectedTicket.status === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            onUpdateTicketStatus(selectedTicket.id, st as any);
                            setSelectedTicket({ ...selectedTicket, status: st as any });
                          }}
                          className={`py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                            isActive
                              ? "bg-slate-900 text-white shadow-sm font-extrabold"
                              : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-150"
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Comments stream */}
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Technical Comments Log ({selectedTicket.comments.length})
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                  {selectedTicket.comments.map((comment) => (
                    <div key={comment.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase">
                        <span>{comment.userName} ({comment.role})</span>
                        <span>{new Date(comment.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-normal">{comment.text}</p>
                    </div>
                  ))}
                  {selectedTicket.comments.length === 0 && (
                    <p className="text-center py-6 text-[10px] text-slate-400 italic">No comments filed yet. Send an update below.</p>
                  )}
                </div>
              </div>

              {/* Submit comment form */}
              <form onSubmit={handleSendComment} className="flex gap-2 border-t border-slate-50 pt-3">
                <input
                  type="text"
                  placeholder="Enter diagnostic report update..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-all shadow-sm hover:shadow shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-3xl text-center text-slate-400 text-xs font-semibold flex flex-col items-center justify-center gap-2">
              <Clock className="w-8 h-8 text-slate-300" />
              Select a helpdesk incident ticket on the left to view the technical thread, SLA timer, and comments.
            </div>
          )}
        </div>

      </div>

      {/* --- INCIDENT TICKET SUBMIT FORM --- */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100 animate-in fade-in-50 zoom-in-95 duration-200">
            
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold tracking-tight">File IT Incident Ticket</h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs scrollbar-thin">
              
              {/* Category and priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase">Ticket Category</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {TICKET_CATEGORIES.map((tc) => (
                      <option key={tc} value={tc}>{tc}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase">SLA Urgency Priority</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-rose-700"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical (Disrupts Care)</option>
                  </select>
                </div>
              </div>

              {/* Requester & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase">Filing Staff Name (Requester)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    placeholder="Ns. Maya / dr. Linda"
                    value={requester}
                    onChange={(e) => setRequester(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase">Staff Department</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="Nursing (Keperawatan)">Nursing (Keperawatan)</option>
                    <option value="Finance & Cashier">Finance & Cashier</option>
                    <option value="Pharmacy (Farmasi)">Pharmacy (Farmasi)</option>
                    <option value="Laboratory (Laboratorium)">Laboratory (Laboratorium)</option>
                    <option value="Outpatient Clinic (Poliklinik)">Outpatient Clinic (Poliklinik)</option>
                    <option value="Emergency (UGD)">Emergency (UGD)</option>
                    <option value="IT (Information Technology)">IT (Information Technology)</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase">Physical Floor</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                  >
                    {floors.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase">Room</label>
                  {rooms[floor] && rooms[floor].length > 0 ? (
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                    >
                      {rooms[floor].map((rm) => (
                        <option key={rm} value={rm}>{rm}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      placeholder="e.g., Cashier Desk 1, NICU incubators"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      required
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase">Failure Description & Impact</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  rows={4}
                  placeholder="Describe the technical failure clearly. Mention error codes or affected patient care metrics if applicable..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
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
                  File Incident Report
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
