import { Asset, MaintenanceLog, SupportTicket, BorrowingLog, AssetMovementLog, AuditLog, User } from "../types";
import { 
  INITIAL_ASSETS, 
  INITIAL_TICKETS, 
  INITIAL_MAINTENANCE, 
  INITIAL_BORROWINGS, 
  INITIAL_MOVEMENTS, 
  INITIAL_AUDIT_LOGS, 
  DEMO_USERS,
  DEFAULT_MODULE_PERMISSIONS,
  FLOORS,
  ROOMS_BY_FLOOR
} from "../data/mockData";

export const dataService = {
  getStoredData(): {
    assets: Asset[];
    tickets: SupportTicket[];
    maintenance: MaintenanceLog[];
    borrowings: BorrowingLog[];
    movements: AssetMovementLog[];
    auditLogs: AuditLog[];
    users: User[];
    permissions: typeof DEFAULT_MODULE_PERMISSIONS;
    user: User | null;
    floors: string[];
    rooms: Record<string, string[]>;
  } {
    if (typeof window === "undefined") {
      return {
        assets: INITIAL_ASSETS,
        tickets: INITIAL_TICKETS,
        maintenance: INITIAL_MAINTENANCE,
        borrowings: INITIAL_BORROWINGS,
        movements: INITIAL_MOVEMENTS,
        auditLogs: INITIAL_AUDIT_LOGS,
        users: DEMO_USERS,
        permissions: DEFAULT_MODULE_PERMISSIONS,
        user: DEMO_USERS[0],
        floors: FLOORS,
        rooms: ROOMS_BY_FLOOR,
      };
    }

    const assets = localStorage.getItem("rsia_assets") 
      ? JSON.parse(localStorage.getItem("rsia_assets")!) 
      : INITIAL_ASSETS;
    const tickets = localStorage.getItem("rsia_tickets") 
      ? JSON.parse(localStorage.getItem("rsia_tickets")!) 
      : INITIAL_TICKETS;
    const maintenance = localStorage.getItem("rsia_maintenance") 
      ? JSON.parse(localStorage.getItem("rsia_maintenance")!) 
      : INITIAL_MAINTENANCE;
    const borrowings = localStorage.getItem("rsia_borrowings") 
      ? JSON.parse(localStorage.getItem("rsia_borrowings")!) 
      : INITIAL_BORROWINGS;
    const movements = localStorage.getItem("rsia_movements") 
      ? JSON.parse(localStorage.getItem("rsia_movements")!) 
      : INITIAL_MOVEMENTS;
    const auditLogs = localStorage.getItem("rsia_audits") 
      ? JSON.parse(localStorage.getItem("rsia_audits")!) 
      : INITIAL_AUDIT_LOGS;
    const users = localStorage.getItem("rsia_users") 
      ? JSON.parse(localStorage.getItem("rsia_users")!) 
      : DEMO_USERS;
    const permissions = localStorage.getItem("rsia_permissions") 
      ? JSON.parse(localStorage.getItem("rsia_permissions")!) 
      : DEFAULT_MODULE_PERMISSIONS;
    const floors = localStorage.getItem("rsia_floors")
      ? JSON.parse(localStorage.getItem("rsia_floors")!)
      : FLOORS;
    const rooms = localStorage.getItem("rsia_rooms")
      ? JSON.parse(localStorage.getItem("rsia_rooms")!)
      : ROOMS_BY_FLOOR;
    
    const storedUser = localStorage.getItem("rsia_current_user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    return { assets, tickets, maintenance, borrowings, movements, auditLogs, users, permissions, user, floors, rooms };
  },

  saveStoredData(data: {
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
  }) {
    if (typeof window === "undefined") return;

    if (data.assets !== undefined) localStorage.setItem("rsia_assets", JSON.stringify(data.assets));
    if (data.tickets !== undefined) localStorage.setItem("rsia_tickets", JSON.stringify(data.tickets));
    if (data.maintenance !== undefined) localStorage.setItem("rsia_maintenance", JSON.stringify(data.maintenance));
    if (data.borrowings !== undefined) localStorage.setItem("rsia_borrowings", JSON.stringify(data.borrowings));
    if (data.movements !== undefined) localStorage.setItem("rsia_movements", JSON.stringify(data.movements));
    if (data.auditLogs !== undefined) localStorage.setItem("rsia_audits", JSON.stringify(data.auditLogs));
    if (data.users !== undefined) localStorage.setItem("rsia_users", JSON.stringify(data.users));
    if (data.permissions !== undefined) localStorage.setItem("rsia_permissions", JSON.stringify(data.permissions));
    if (data.floors !== undefined) localStorage.setItem("rsia_floors", JSON.stringify(data.floors));
    if (data.rooms !== undefined) localStorage.setItem("rsia_rooms", JSON.stringify(data.rooms));
    
    if (data.user === null) {
      localStorage.removeItem("rsia_current_user");
    } else if (data.user !== undefined) {
      localStorage.setItem("rsia_current_user", JSON.stringify(data.user));
    }
  },

  logAction(user: User, action: string, module: string, details: string): AuditLog[] {
    const currentLogs = localStorage.getItem("rsia_audits") 
      ? JSON.parse(localStorage.getItem("rsia_audits")!) 
      : INITIAL_AUDIT_LOGS;
      
    const newLog: AuditLog = {
      id: `lg-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      module,
      timestamp: new Date().toISOString(),
      details
    };
    
    const updatedLogs = [newLog, ...currentLogs];
    localStorage.setItem("rsia_audits", JSON.stringify(updatedLogs));
    return updatedLogs;
  }
};
