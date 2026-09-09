import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User, Asset, SupportTicket, MaintenanceLog, BorrowingLog, AssetMovementLog, AuditLog, UserRole } from "../types";
import { dataService } from "../services/dataService";
import { DEFAULT_MODULE_PERMISSIONS, FLOORS, ROOMS_BY_FLOOR } from "../data/mockData";

export interface AppContextType {
  currentUser: User | null;
  activeTab: string;
  sidebarCollapsed: boolean;
  assets: Asset[];
  tickets: SupportTicket[];
  maintenance: MaintenanceLog[];
  borrowings: BorrowingLog[];
  movements: AssetMovementLog[];
  auditLogs: AuditLog[];
  users: User[];
  permissions: typeof DEFAULT_MODULE_PERMISSIONS;
  floors: string[];
  rooms: Record<string, string[]>;
  
  setCurrentUser: (user: User | null) => void;
  setActiveTab: (tab: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
  addAsset: (asset: Asset) => void;
  editAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;
  addMaintenance: (log: MaintenanceLog) => void;
  updateMaintenanceStatus: (id: string, status: "In Progress" | "Completed" | "Pending Parts", notes?: string) => void;
  addTicket: (ticket: SupportTicket) => void;
  updateTicketStatus: (id: string, status: "Open" | "In Progress" | "Resolved" | "Closed") => void;
  addComment: (ticketId: string, commentText: string) => void;
  addBorrowing: (log: BorrowingLog) => void;
  returnAsset: (borrowingId: string, returnNotes?: string) => void;
  addMovement: (log: AssetMovementLog) => void;
  triggerMaintenance: (asset: Asset) => void;
  triggerBorrow: (asset: Asset) => void;
  triggerMove: (asset: Asset) => void;
  
  addUser: (user: User) => void;
  editUser: (user: User) => void;
  deleteUser: (id: string) => void;
  updateUserProfile: (id: string, updatedFields: Partial<User>) => void;
  updatePermissions: (permissions: typeof DEFAULT_MODULE_PERMISSIONS) => void;

  // Floors & Rooms management
  addFloor: (floorName: string, initialRooms?: string[]) => boolean;
  deleteFloor: (floorName: string) => boolean;
  addRoom: (floorName: string, roomName: string) => boolean;
  deleteRoom: (floorName: string, roomName: string) => boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Core database state
  const [assets, setAssets] = useState<Asset[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceLog[]>([]);
  const [borrowings, setBorrowings] = useState<BorrowingLog[]>([]);
  const [movements, setMovements] = useState<AssetMovementLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<typeof DEFAULT_MODULE_PERMISSIONS>(DEFAULT_MODULE_PERMISSIONS);
  const [floors, setFloors] = useState<string[]>(FLOORS);
  const [rooms, setRooms] = useState<Record<string, string[]>>(ROOMS_BY_FLOOR);

  // Initialize and load stored state
  useEffect(() => {
    const data = dataService.getStoredData();
    setAssets(data.assets);
    setTickets(data.tickets);
    setMaintenance(data.maintenance);
    setBorrowings(data.borrowings);
    setMovements(data.movements);
    setAuditLogs(data.auditLogs);
    setUsers(data.users);
    setPermissions(data.permissions);
    setFloors(data.floors || FLOORS);
    setRooms(data.rooms || ROOMS_BY_FLOOR);
    
    if (data.user) {
      setCurrentUserState(data.user);
    }
  }, []);

  // Helper method to synchronize and persist updates to localStorage
  const syncAndSave = (updatedData: {
    assets?: Asset[];
    tickets?: SupportTicket[];
    maintenance?: MaintenanceLog[];
    borrowings?: BorrowingLog[];
    movements?: AssetMovementLog[];
    auditLogs?: AuditLog[];
    users?: User[];
    permissions?: typeof DEFAULT_MODULE_PERMISSIONS;
    user?: User | null;
    floors?: string[];
    rooms?: Record<string, string[]>;
  }) => {
    dataService.saveStoredData({
      assets: updatedData.assets !== undefined ? updatedData.assets : assets,
      tickets: updatedData.tickets !== undefined ? updatedData.tickets : tickets,
      maintenance: updatedData.maintenance !== undefined ? updatedData.maintenance : maintenance,
      borrowings: updatedData.borrowings !== undefined ? updatedData.borrowings : borrowings,
      movements: updatedData.movements !== undefined ? updatedData.movements : movements,
      auditLogs: updatedData.auditLogs !== undefined ? updatedData.auditLogs : auditLogs,
      users: updatedData.users !== undefined ? updatedData.users : users,
      permissions: updatedData.permissions !== undefined ? updatedData.permissions : permissions,
      user: updatedData.user !== undefined ? updatedData.user : currentUser,
      floors: updatedData.floors !== undefined ? updatedData.floors : floors,
      rooms: updatedData.rooms !== undefined ? updatedData.rooms : rooms
    });
  };

  const login = (user: User) => {
    setCurrentUserState(user);
    const updatedAudits = dataService.logAction(user, "User Login", "Auth", `Successful login session authorized as role: ${user.role}`);
    setAuditLogs(updatedAudits);
    syncAndSave({ user, auditLogs: updatedAudits });
  };

  const logout = () => {
    if (!currentUser) return;
    const updatedAudits = dataService.logAction(currentUser, "User Logout", "Auth", "Active session closed safely by user.");
    setAuditLogs(updatedAudits);
    setCurrentUserState(null);
    syncAndSave({ user: null, auditLogs: updatedAudits });
  };

  const addAsset = (newAsset: Asset) => {
    if (!currentUser) return;
    const updatedAssets = [newAsset, ...assets];
    setAssets(updatedAssets);
    
    const updatedAudits = dataService.logAction(
      currentUser,
      "Create Asset",
      "Inventory",
      `Registered new hospital hardware: [${newAsset.assetCode}] ${newAsset.assetName} allocated to ${newAsset.floor}/${newAsset.room}.`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ assets: updatedAssets, auditLogs: updatedAudits });
  };

  const editAsset = (editedAsset: Asset) => {
    if (!currentUser) return;
    const updatedAssets = assets.map((a) => (a.id === editedAsset.id ? editedAsset : a));
    setAssets(updatedAssets);

    const updatedAudits = dataService.logAction(
      currentUser,
      "Update Asset",
      "Inventory",
      `Modified attributes and metrics for asset: [${editedAsset.assetCode}] ${editedAsset.assetName}.`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ assets: updatedAssets, auditLogs: updatedAudits });
  };

  const deleteAsset = (id: string) => {
    if (!currentUser) return;
    const assetToDelete = assets.find((a) => a.id === id);
    if (!assetToDelete) return;

    const updatedAssets = assets.filter((a) => a.id !== id);
    setAssets(updatedAssets);

    const updatedAudits = dataService.logAction(
      currentUser,
      "Delete Asset",
      "Inventory",
      `Permanently purged equipment record from DB: [${assetToDelete.assetCode}] ${assetToDelete.assetName}.`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ assets: updatedAssets, auditLogs: updatedAudits });
  };

  const addMaintenance = (newLog: MaintenanceLog) => {
    if (!currentUser) return;
    const updatedMaintenance = [newLog, ...maintenance];
    setMaintenance(updatedMaintenance);

    const updatedAssets = assets.map((a) => {
      if (a.id === newLog.assetId) {
        return {
          ...a,
          status: "Maintenance" as const,
          condition: newLog.type === "Corrective" ? ("Needs Repair" as const) : a.condition
        };
      }
      return a;
    });
    setAssets(updatedAssets);

    const updatedAudits = dataService.logAction(
      currentUser,
      "Log Maintenance",
      "Maintenance",
      `Opened ${newLog.type} workorder for asset: ${newLog.assetName}. Assigned: ${newLog.technicianName}.`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ maintenance: updatedMaintenance, assets: updatedAssets, auditLogs: updatedAudits });
  };

  const updateMaintenanceStatus = (id: string, status: "In Progress" | "Completed" | "Pending Parts", notes?: string) => {
    if (!currentUser) return;
    const logToUpdate = maintenance.find((m) => m.id === id);
    if (!logToUpdate) return;

    const updatedMaintenance = maintenance.map((m) => {
      if (m.id === id) {
        return { ...m, status, notes };
      }
      return m;
    });
    setMaintenance(updatedMaintenance);

    let updatedAssets = assets;
    if (status === "Completed") {
      updatedAssets = assets.map((a) => {
        if (a.id === logToUpdate.assetId) {
          return {
            ...a,
            status: "Active" as const,
            condition: "Good" as const
          };
        }
        return a;
      });
      setAssets(updatedAssets);
    }

    const updatedAudits = dataService.logAction(
      currentUser,
      "Resolve Workorder",
      "Maintenance",
      `Updated service ticket for ${logToUpdate.assetName} to status: ${status}.`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ maintenance: updatedMaintenance, assets: updatedAssets, auditLogs: updatedAudits });
  };

  const addTicket = (newTicket: SupportTicket) => {
    if (!currentUser) return;
    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);

    const updatedAudits = dataService.logAction(
      currentUser,
      "File Ticket",
      "Helpdesk",
      `Logged support incident [${newTicket.ticketNumber}] from department ${newTicket.department}.`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ tickets: updatedTickets, auditLogs: updatedAudits });
  };

  const updateTicketStatus = (id: string, status: "Open" | "In Progress" | "Resolved" | "Closed") => {
    if (!currentUser) return;
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return;

    const updatedTickets = tickets.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status,
          closedDate: status === "Closed" || status === "Resolved" ? new Date().toISOString().split("T")[0] : undefined
        };
      }
      return t;
    });
    setTickets(updatedTickets);

    const updatedAudits = dataService.logAction(
      currentUser,
      "Update Ticket Status",
      "Helpdesk",
      `Transitioned SLA incident ticket [${ticket.ticketNumber}] to state: ${status}.`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ tickets: updatedTickets, auditLogs: updatedAudits });
  };

  const addComment = (ticketId: string, commentText: string) => {
    if (!currentUser) return;
    const newComment = {
      id: `c-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      text: commentText,
      timestamp: new Date().toISOString()
    };

    const updatedTickets = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          comments: [...t.comments, newComment]
        };
      }
      return t;
    });
    setTickets(updatedTickets);

    const ticket = tickets.find((t) => t.id === ticketId);
    const updatedAudits = dataService.logAction(
      currentUser,
      "Add Ticket Comment",
      "Helpdesk",
      `Wrote technical resolution log on incident [${ticket?.ticketNumber}].`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ tickets: updatedTickets, auditLogs: updatedAudits });
  };

  const addBorrowing = (newLog: BorrowingLog) => {
    if (!currentUser) return;
    const updatedBorrowings = [newLog, ...borrowings];
    setBorrowings(updatedBorrowings);

    const updatedAssets = assets.map((a) => {
      if (a.id === newLog.assetId) {
        return { ...a, status: "Borrowed" as const };
      }
      return a;
    });
    setAssets(updatedAssets);

    const updatedAudits = dataService.logAction(
      currentUser,
      "Lend Equipment",
      "Borrowing",
      `Lent hardware [${newLog.assetCode}] to staff ${newLog.borrower} (${newLog.department}).`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ borrowings: updatedBorrowings, assets: updatedAssets, auditLogs: updatedAudits });
  };

  const returnAsset = (borrowingId: string, returnNotes?: string) => {
    if (!currentUser) return;
    const borrowingLog = borrowings.find((b) => b.id === borrowingId);
    if (!borrowingLog) return;

    const updatedBorrowings = borrowings.map((b) => {
      if (b.id === borrowingId) {
        return {
          ...b,
          status: "Returned" as const,
          actualReturnDate: new Date().toISOString().split("T")[0],
          notes: returnNotes || b.notes
        };
      }
      return b;
    });
    setBorrowings(updatedBorrowings);

    const updatedAssets = assets.map((a) => {
      if (a.id === borrowingLog.assetId) {
        return { ...a, status: "Active" as const, condition: "Good" as const };
      }
      return a;
    });
    setAssets(updatedAssets);

    const updatedAudits = dataService.logAction(
      currentUser,
      "Verify Safe Return",
      "Borrowing",
      `Registered equipment return for asset: ${borrowingLog.assetName} to stock cupboards.`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ borrowings: updatedBorrowings, assets: updatedAssets, auditLogs: updatedAudits });
  };

  const addMovement = (newLog: AssetMovementLog) => {
    if (!currentUser) return;
    const updatedMovements = [newLog, ...movements];
    setMovements(updatedMovements);

    const updatedAssets = assets.map((a) => {
      if (a.id === newLog.assetId) {
        return {
          ...a,
          floor: newLog.newLocation.floor,
          room: newLog.newLocation.room,
          department: newLog.newLocation.department,
          pic: newLog.approvedBy,
          currentUser: newLog.approvedBy
        };
      }
      return a;
    });
    setAssets(updatedAssets);

    const updatedAudits = dataService.logAction(
      currentUser,
      "Relocate Equipment",
      "Movement",
      `Physically relocated asset ${newLog.assetName} from ${newLog.oldLocation.floor} to target destination: ${newLog.newLocation.floor}/${newLog.newLocation.room}.`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ movements: updatedMovements, assets: updatedAssets, auditLogs: updatedAudits });
  };

  const triggerMaintenance = (asset: Asset) => {
    setActiveTab("maintenance");
  };

  const triggerBorrow = (asset: Asset) => {
    setActiveTab("borrowing");
  };

  const triggerMove = (asset: Asset) => {
    setActiveTab("movement");
  };

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    syncAndSave({ user });
  };

  const addUser = (newUser: User) => {
    if (!currentUser) return;
    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);

    const updatedAudits = dataService.logAction(
      currentUser,
      "Provision User Account",
      "Access Control",
      `Created user identity: ${newUser.name} (${newUser.email}) assigned role: ${newUser.role} in department: ${newUser.department || "General"}.`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ users: updatedUsers, auditLogs: updatedAudits });
  };

  const editUser = (updatedUser: User) => {
    if (!currentUser) return;
    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedUsers);

    // If edited user is the logged in user, update currentUser state as well
    let updatedCurrentUser = currentUser;
    if (currentUser.id === updatedUser.id) {
      updatedCurrentUser = updatedUser;
      setCurrentUserState(updatedUser);
    }

    const updatedAudits = dataService.logAction(
      currentUser,
      "Update User Account",
      "Access Control",
      `Modified privileges and profile attributes for: ${updatedUser.name} (${updatedUser.role}).`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ users: updatedUsers, user: updatedCurrentUser, auditLogs: updatedAudits });
  };

  const deleteUser = (id: string) => {
    if (!currentUser) return;
    const targetUser = users.find((u) => u.id === id);
    if (!targetUser) return;

    const updatedUsers = users.filter((u) => u.id !== id);
    setUsers(updatedUsers);

    const updatedAudits = dataService.logAction(
      currentUser,
      "Revoke User Account",
      "Access Control",
      `Revoked user identity and credentials for: ${targetUser.name} (${targetUser.email}).`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ users: updatedUsers, auditLogs: updatedAudits });
  };

  const updateUserProfile = (id: string, updatedFields: Partial<User>) => {
    if (!currentUser) return;
    const updatedUsers = users.map((u) => {
      if (u.id === id) {
        return { ...u, ...updatedFields };
      }
      return u;
    });
    setUsers(updatedUsers);

    let updatedCurrentUser = currentUser;
    if (currentUser.id === id) {
      updatedCurrentUser = { ...currentUser, ...updatedFields };
      setCurrentUserState(updatedCurrentUser);
    }

    const updatedAudits = dataService.logAction(
      currentUser,
      "Update Profile Identity",
      "Access Control",
      `Self-service profile update performed by user: ${currentUser.name}.`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ users: updatedUsers, user: updatedCurrentUser, auditLogs: updatedAudits });
  };

  const updatePermissions = (updatedPermissions: typeof DEFAULT_MODULE_PERMISSIONS) => {
    if (!currentUser) return;
    setPermissions(updatedPermissions);

    const updatedAudits = dataService.logAction(
      currentUser,
      "Update RBAC Permissions Matrix",
      "Access Control",
      `Updated role permission matrix rules across system modules.`
    );
    setAuditLogs(updatedAudits);
    syncAndSave({ permissions: updatedPermissions, auditLogs: updatedAudits });
  };

  const addFloor = (floorName: string, initialRooms?: string[]): boolean => {
    const trimmed = floorName.trim();
    if (!trimmed) return false;
    if (floors.includes(trimmed)) return false;

    const cleanedRooms = (initialRooms || [])
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const updatedFloors = [...floors, trimmed];
    const updatedRooms = {
      ...rooms,
      [trimmed]: cleanedRooms
    };

    setFloors(updatedFloors);
    setRooms(updatedRooms);

    let updatedAudits = auditLogs;
    if (currentUser) {
      updatedAudits = dataService.logAction(
        currentUser,
        "Tambah Lantai Baru",
        "Master Data",
        `Menambahkan lantai baru: "${trimmed}" dengan ${cleanedRooms.length} ruangan awal.`
      );
      setAuditLogs(updatedAudits);
    }

    syncAndSave({ floors: updatedFloors, rooms: updatedRooms, auditLogs: updatedAudits });
    return true;
  };

  const deleteFloor = (floorName: string): boolean => {
    if (!floors.includes(floorName)) return false;

    const updatedFloors = floors.filter((f) => f !== floorName);
    const updatedRooms = { ...rooms };
    delete updatedRooms[floorName];

    setFloors(updatedFloors);
    setRooms(updatedRooms);

    let updatedAudits = auditLogs;
    if (currentUser) {
      updatedAudits = dataService.logAction(
        currentUser,
        "Hapus Lantai",
        "Master Data",
        `Menghapus lantai: "${floorName}" dari direktori master.`
      );
      setAuditLogs(updatedAudits);
    }

    syncAndSave({ floors: updatedFloors, rooms: updatedRooms, auditLogs: updatedAudits });
    return true;
  };

  const addRoom = (floorName: string, roomName: string): boolean => {
    const trimmedRoom = roomName.trim();
    if (!trimmedRoom || !floorName) return false;

    const currentRooms = rooms[floorName] || [];
    if (currentRooms.includes(trimmedRoom)) return false;

    const updatedFloorRooms = [...currentRooms, trimmedRoom];
    const updatedRooms = {
      ...rooms,
      [floorName]: updatedFloorRooms
    };

    setRooms(updatedRooms);

    let updatedAudits = auditLogs;
    if (currentUser) {
      updatedAudits = dataService.logAction(
        currentUser,
        "Tambah Ruangan",
        "Master Data",
        `Menambahkan ruangan "${trimmedRoom}" ke ${floorName}.`
      );
      setAuditLogs(updatedAudits);
    }

    syncAndSave({ rooms: updatedRooms, auditLogs: updatedAudits });
    return true;
  };

  const deleteRoom = (floorName: string, roomName: string): boolean => {
    const currentRooms = rooms[floorName] || [];
    if (!currentRooms.includes(roomName)) return false;

    const updatedFloorRooms = currentRooms.filter((r) => r !== roomName);
    const updatedRooms = {
      ...rooms,
      [floorName]: updatedFloorRooms
    };

    setRooms(updatedRooms);

    let updatedAudits = auditLogs;
    if (currentUser) {
      updatedAudits = dataService.logAction(
        currentUser,
        "Hapus Ruangan",
        "Master Data",
        `Menghapus ruangan "${roomName}" dari ${floorName}.`
      );
      setAuditLogs(updatedAudits);
    }

    syncAndSave({ rooms: updatedRooms, auditLogs: updatedAudits });
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeTab,
        sidebarCollapsed,
        assets,
        tickets,
        maintenance,
        borrowings,
        movements,
        auditLogs,
        users,
        permissions,
        floors,
        rooms,
        setCurrentUser,
        setActiveTab,
        setSidebarCollapsed,
        login,
        logout,
        addAsset,
        editAsset,
        deleteAsset,
        addMaintenance,
        updateMaintenanceStatus,
        addTicket,
        updateTicketStatus,
        addComment,
        addBorrowing,
        returnAsset,
        addMovement,
        triggerMaintenance,
        triggerBorrow,
        triggerMove,
        addUser,
        editUser,
        deleteUser,
        updateUserProfile,
        updatePermissions,
        addFloor,
        deleteFloor,
        addRoom,
        deleteRoom
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
