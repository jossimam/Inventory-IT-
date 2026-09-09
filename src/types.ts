/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  SUPER_ADMIN = "Super Admin",
  ENTRY_DATA = "Entry Data",
  KAKONLI = "Kakonli"
}

export interface User {
  id: string;
  email: string;
  username?: string;
  password?: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  phone?: string;
  status?: "Active" | "Inactive";
  lastLogin?: string;
  permissions?: string[];
}

export interface ModulePermission {
  key: string;
  name: string;
  description: string;
  roles: Record<UserRole, {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    export: boolean;
  }>;
}

export interface Asset {
  id: string;
  inventoryNumber: string; // Format: RSIA-BM/IT/INV/YYYY/XXXX
  assetCode: string; // Unique Barcode or label identifier
  assetName: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  hostname: string;
  ipAddress: string;
  macAddress: string;
  
  // Specifications
  processor: string;
  ram: string;
  storage: string;
  graphics: string;
  operatingSystem: string;
  windowsLicense: string;
  officeLicense: string;
  antivirus: string;

  // Acquisition
  purchaseDate: string;
  purchasePrice: number;
  vendor: string;
  warrantyStart: string;
  warrantyEnd: string;

  // Location
  building: string;
  floor: string;
  room: string;
  department: string;
  pic: string;
  currentUser: string;

  // Status & Condition
  status: "Active" | "Maintenance" | "Borrowed" | "Broken" | "Scrapped";
  condition: "Good" | "Needs Repair" | "Damaged";
  description: string;
  
  // Attachments (Simulated urls/flags)
  photoUrl?: string;
  invoiceFile?: string;
  manualBook?: string;
  warrantyDocument?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface MasterItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export interface MaintenanceLog {
  id: string;
  assetId: string;
  assetName: string;
  type: "Preventive" | "Corrective";
  date: string;
  description: string;
  cost: number;
  vendor: string;
  technicianName: string;
  beforePhoto?: string;
  afterPhoto?: string;
  status: "In Progress" | "Completed" | "Pending Parts";
  notes?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // Format: TKT-YYYYMMDD-XXXX
  date: string;
  category: string; // Software, Hardware, Network, Printer, HIS (SIMRS)
  priority: "Low" | "Medium" | "High" | "Critical";
  requester: string;
  department: string;
  room: string;
  floor: string;
  description: string;
  assignedTechnician: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  attachment?: string;
  comments: TicketComment[];
  closedDate?: string;
}

export interface TicketComment {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  text: string;
  timestamp: string;
}

export interface BorrowingLog {
  id: string;
  assetId: string;
  assetName: string;
  assetCode: string;
  borrower: string;
  department: string;
  borrowDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: "Borrowed" | "Returned" | "Overdue";
  notes?: string;
  approvedBy: string;
}

export interface AssetMovementLog {
  id: string;
  assetId: string;
  assetName: string;
  oldLocation: {
    building: string;
    floor: string;
    room: string;
    department: string;
  };
  newLocation: {
    building: string;
    floor: string;
    room: string;
    department: string;
  };
  reason: string;
  approvedBy: string;
  date: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  timestamp: string;
  details: string;
}

export interface TrainingMaterial {
  id: string;
  title: string;
  category: "SIMRS & EMR" | "SATUSEHAT & BPJS" | "Hardware & Scanner" | "Keamanan Akses & Identitas" | "Farmasi & E-Resep" | "Kasir & Billing";
  format: "Video Tutorial" | "Panduan PDF" | "Release Notes" | "SOP & Flowchart";
  systemVersion: string; // e.g. "SIMRS V2.4"
  targetRoles: string[]; // e.g. ["Dokter", "Perawat", "Farmasi", "Staff IT", "Kasir"]
  durationOrPages: string; // e.g. "08:45 Min" or "12 Halaman"
  releaseDate: string;
  updatedBy: string;
  description: string;
  videoUrl?: string;
  downloadUrl?: string;
  isMandatory?: boolean;
  steps?: { title: string; desc: string; image?: string }[];
  completedByUsers?: string[]; // Array of user IDs who completed the training
}

export interface SystemChangeRelease {
  id: string;
  version: string;
  releaseDate: string;
  title: string;
  impactLevel: "Critical Update" | "Major Feature" | "Patch Fix" | "SOP Amendment";
  affectedModules: string[];
  summary: string;
  keyChanges: string[];
  tutorialIds?: string[];
}

