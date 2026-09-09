import { Asset, MaintenanceLog, SupportTicket, BorrowingLog, AssetMovementLog, AuditLog, User, UserRole, TrainingMaterial, SystemChangeRelease } from "../types";

// Master Data Constants
export const BUILDINGS = ["Main Building"];

export const FLOORS = [
  "Floor 1",
  "Floor 2",
  "Floor 3",
  "Floor 4",
  "Floor 5"
];

export const ROOMS_BY_FLOOR: Record<string, string[]> = {
  "Floor 1": ["Registration", "Emergency", "Cashier", "Pharmacy", "Lobby", "Security"],
  "Floor 2": ["Polyclinic", "Laboratory", "Radiology", "Administration"],
  "Floor 3": ["NICU", "Perinatology", "Maternity", "Operating Room"],
  "Floor 4": ["Inpatient Rooms", "Doctors Room", "Nurse Station"],
  "Floor 5": ["Management", "Meeting Room", "IT Room", "Server Room"]
};

export const DEPARTMENTS = [
  "IT (Information Technology)",
  "Nursing (Keperawatan)",
  "Medical Records (Rekam Medis)",
  "Finance & Cashier",
  "Pharmacy (Farmasi)",
  "Laboratory (Laboratorium)",
  "Radiology (Radiologi)",
  "Outpatient Clinic (Poliklinik)",
  "Emergency (UGD)",
  "Administration & HRD",
  "Management"
];

export const CATEGORIES = [
  "Desktop PC",
  "Laptop",
  "Server",
  "Network Switch",
  "Access Point",
  "Printer",
  "UPS",
  "Barcode Scanner",
  "Tablet",
  "Smart TV (Queue)"
];

export const BRANDS = [
  "HP",
  "Dell",
  "Lenovo",
  "Asus",
  "Cisco",
  "Ubiquiti",
  "Epson",
  "Zebra",
  "APC",
  "Synology"
];

export const VENDORS = [
  { name: "PT. Computindo Solusindo", contact: "Andi (0812-3456-7890)", type: "Hardware Supplier" },
  { name: "PT. Jaringan Nusantara", contact: "Budi (0811-9876-5432)", type: "Network Integrator" },
  { name: "PT. Medika Solusi Internasional", contact: "Santi (0813-2222-4444)", type: "HIS SIMRS Vendor" },
  { name: "Epson Indonesia Authorized", contact: "Lia (021-555666)", type: "Printers" },
  { name: "PT. Bina Mitra Abadi", contact: "Doni (0812-7777-8888)", type: "General Vendor" }
];

export const CONDITIONS = ["Good", "Needs Repair", "Damaged"];

export const STATUSES = ["Active", "Maintenance", "Borrowed", "Broken", "Scrapped"];

export const MAINTENANCE_TYPES = ["Preventive", "Corrective"];

export const TICKET_CATEGORIES = [
  "Software / SIMRS",
  "Hardware Failure",
  "Network / Wi-Fi",
  "Printer / Scanner",
  "Operating System / Virus",
  "Other"
];

// Pre-configured Users for Roles & Access Control Directory
export const DEMO_USERS: User[] = [
  {
    id: "user-superadmin",
    email: "admin@binamedika.co.id",
    username: "admin",
    password: "admin123",
    name: "Ahmad Rifai",
    role: UserRole.SUPER_ADMIN,
    department: "IT (Information Technology)",
    phone: "0812-9988-7766",
    status: "Active",
    lastLogin: "2026-07-22 08:30",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: "user-entry",
    email: "staff@binamedika.co.id",
    username: "staff",
    password: "staff123",
    name: "Rizky Ramadhan",
    role: UserRole.ENTRY_DATA,
    department: "IT (Information Technology)",
    phone: "0813-1122-3344",
    status: "Active",
    lastLogin: "2026-07-21 14:15",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: "user-kakonli",
    email: "kakonli@binamedika.co.id",
    username: "kakonli",
    password: "kakonli123",
    name: "dr. Linda Wijaya",
    role: UserRole.KAKONLI,
    department: "Outpatient Clinic (Poliklinik)",
    phone: "0811-5544-3322",
    status: "Active",
    lastLogin: "2026-07-20 10:45",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: "user-budi",
    email: "budi.santoso@binamedika.co.id",
    username: "budi",
    password: "budi123",
    name: "Budi Santoso, S.Kom",
    role: UserRole.ENTRY_DATA,
    department: "Medical Records (Rekam Medis)",
    phone: "0815-4433-2211",
    status: "Active",
    lastLogin: "2026-07-19 16:20",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: "user-siti",
    email: "siti.rahma@binamedika.co.id",
    username: "siti",
    password: "siti123",
    name: "Siti Rahma, Amd.Kep",
    role: UserRole.KAKONLI,
    department: "Nursing (Keperawatan)",
    phone: "0818-6677-8899",
    status: "Active",
    lastLogin: "2026-07-18 09:10",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100"
  },
  {
    id: "user-hendra",
    email: "hendra.kristian@binamedika.co.id",
    username: "hendra",
    password: "hendra123",
    name: "Hendra Kristian",
    role: UserRole.ENTRY_DATA,
    department: "Pharmacy (Farmasi)",
    phone: "0821-3344-5566",
    status: "Inactive",
    lastLogin: "2026-06-30 11:00",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
  }
];

export const DEFAULT_MODULE_PERMISSIONS = [
  {
    key: "dashboard",
    name: "Dashboard Analytics",
    description: "Visualisasi KPI ringkasan total aset, status garansi, dan ticket SLA",
    roles: {
      [UserRole.SUPER_ADMIN]: { read: true, create: true, update: true, delete: true, export: true },
      [UserRole.ENTRY_DATA]: { read: true, create: false, update: false, delete: false, export: true },
      [UserRole.KAKONLI]: { read: true, create: false, update: false, delete: false, export: true }
    }
  },
  {
    key: "inventory",
    name: "Aset Inventaris IT",
    description: "Registrasi, sunting, cetak QR Code, dan hapus hardware inventaris RSIA",
    roles: {
      [UserRole.SUPER_ADMIN]: { read: true, create: true, update: true, delete: true, export: true },
      [UserRole.ENTRY_DATA]: { read: true, create: true, update: true, delete: false, export: true },
      [UserRole.KAKONLI]: { read: true, create: false, update: false, delete: false, export: false }
    }
  },
  {
    key: "maintenance",
    name: "Pemeliharaan & Workorder",
    description: "Pencatatan service preventif/korektif dan update status perbaikan vendor",
    roles: {
      [UserRole.SUPER_ADMIN]: { read: true, create: true, update: true, delete: true, export: true },
      [UserRole.ENTRY_DATA]: { read: true, create: true, update: true, delete: false, export: true },
      [UserRole.KAKONLI]: { read: true, create: true, update: false, delete: false, export: false }
    }
  },
  {
    key: "helpdesk",
    name: "Tiket Support SLA",
    description: "Pelaporan insiden gangguan IT, tanggapan teknisi, dan penutupan tiket",
    roles: {
      [UserRole.SUPER_ADMIN]: { read: true, create: true, update: true, delete: true, export: true },
      [UserRole.ENTRY_DATA]: { read: true, create: true, update: true, delete: false, export: true },
      [UserRole.KAKONLI]: { read: true, create: true, update: true, delete: false, export: true }
    }
  },
  {
    key: "borrowing",
    name: "Peminjaman Alat",
    description: "Pengajuan pinjam perangkat sementara & verifikasi pengembalian alat",
    roles: {
      [UserRole.SUPER_ADMIN]: { read: true, create: true, update: true, delete: true, export: true },
      [UserRole.ENTRY_DATA]: { read: true, create: true, update: true, delete: false, export: true },
      [UserRole.KAKONLI]: { read: true, create: true, update: false, delete: false, export: false }
    }
  },
  {
    key: "movement",
    name: "Relokasi / Mutasi Perangkat",
    description: "Mutasi lokasi fisik hardware antar gedung, lantai, dan ruangan",
    roles: {
      [UserRole.SUPER_ADMIN]: { read: true, create: true, update: true, delete: true, export: true },
      [UserRole.ENTRY_DATA]: { read: true, create: true, update: true, delete: false, export: true },
      [UserRole.KAKONLI]: { read: true, create: false, update: false, delete: false, export: false }
    }
  },
  {
    key: "master-data",
    name: "Master Data & Referensi",
    description: "Pengelolaan tabel referensi lokasi, unit kerja, kategori, dan vendor",
    roles: {
      [UserRole.SUPER_ADMIN]: { read: true, create: true, update: true, delete: true, export: true },
      [UserRole.ENTRY_DATA]: { read: true, create: false, update: false, delete: false, export: false },
      [UserRole.KAKONLI]: { read: true, create: false, update: false, delete: false, export: false }
    }
  },
  {
    key: "reports",
    name: "Laporan & Export Excel/PDF",
    description: "Pencetakan laporan berkala inventaris, service history, dan audit",
    roles: {
      [UserRole.SUPER_ADMIN]: { read: true, create: true, update: true, delete: true, export: true },
      [UserRole.ENTRY_DATA]: { read: true, create: false, update: false, delete: false, export: true },
      [UserRole.KAKONLI]: { read: true, create: false, update: false, delete: false, export: true }
    }
  },
  {
    key: "access-control",
    name: "Pengaturan Level Akses & Identitas",
    description: "Manajemen identitas akun pengguna, assign role, dan matriks hak akses",
    roles: {
      [UserRole.SUPER_ADMIN]: { read: true, create: true, update: true, delete: true, export: true },
      [UserRole.ENTRY_DATA]: { read: false, create: false, update: false, delete: false, export: false },
      [UserRole.KAKONLI]: { read: false, create: false, update: false, delete: false, export: false }
    }
  }
];

// Seed Data
export const INITIAL_ASSETS: Asset[] = [
  {
    id: "ast-1",
    inventoryNumber: "RSIA-BM/IT/INV/2025/0001",
    assetCode: "BM-IT-PC-001",
    assetName: "PC Kasir Rawat Jalan 1",
    category: "Desktop PC",
    brand: "HP",
    model: "ProDesk 400 G7",
    serialNumber: "SGH12345AB",
    hostname: "BM-PC-KASIR-01",
    ipAddress: "192.168.10.15",
    macAddress: "00:1A:2B:3C:4D:5E",
    processor: "Intel Core i5-10500",
    ram: "8 GB DDR4",
    storage: "256 GB SSD NVMe",
    graphics: "Intel UHD Graphics 630",
    operatingSystem: "Windows 11 Pro",
    windowsLicense: "OEM-W11P-1294819",
    officeLicense: "Office 2021 Home & Business",
    antivirus: "Windows Defender",
    purchaseDate: "2024-03-12",
    purchasePrice: 10500000,
    vendor: "PT. Computindo Solusindo",
    warrantyStart: "2024-03-12",
    warrantyEnd: "2027-03-12",
    building: "Main Building",
    floor: "Floor 1",
    room: "Cashier",
    department: "Finance & Cashier",
    pic: "Siti Rahma",
    currentUser: "Siti Rahma",
    status: "Active",
    condition: "Good",
    description: "Desktop PC used for inpatient/outpatient cashier. High duty cycle.",
    photoUrl: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=300",
    createdAt: "2024-03-12T08:00:00Z",
    updatedAt: "2025-06-15T10:30:00Z"
  },
  {
    id: "ast-2",
    inventoryNumber: "RSIA-BM/IT/INV/2025/0002",
    assetCode: "BM-IT-SRV-001",
    assetName: "Core Server SIMRS (HIS)",
    category: "Server",
    brand: "Dell",
    model: "PowerEdge R750",
    serialNumber: "CN-0XYZ12-34567",
    hostname: "BM-SRV-SIMRS",
    ipAddress: "192.168.1.10",
    macAddress: "D4:C9:EF:12:34:56",
    processor: "2x Intel Xeon Silver 4314",
    ram: "128 GB ECC Registered",
    storage: "4x 1.2TB SAS HDD RAID 5",
    graphics: "Matrox G200 Integrated",
    operatingSystem: "Windows Server 2022 Standard",
    windowsLicense: "WS22-STD-39182",
    officeLicense: "None",
    antivirus: "ESET Server Security",
    purchaseDate: "2023-01-20",
    purchasePrice: 85000000,
    vendor: "PT. Computindo Solusindo",
    warrantyStart: "2023-01-20",
    warrantyEnd: "2026-01-20",
    building: "Main Building",
    floor: "Floor 5",
    room: "Server Room",
    department: "IT (Information Technology)",
    pic: "Ahmad Rifai",
    currentUser: "System Database Admin",
    status: "Active",
    condition: "Good",
    description: "Main HIS SIMRS server holding patient records and database.",
    photoUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=300",
    createdAt: "2023-01-20T09:00:00Z",
    updatedAt: "2026-07-10T14:20:00Z"
  },
  {
    id: "ast-3",
    inventoryNumber: "RSIA-BM/IT/INV/2025/0003",
    assetCode: "BM-IT-PRN-001",
    assetName: "Printer Gelang Emergency",
    category: "Printer",
    brand: "Zebra",
    model: "HC100 Wristband Printer",
    serialNumber: "ZBR-HC100-391",
    hostname: "BM-PRN-WRIST-ER",
    ipAddress: "192.168.10.88",
    macAddress: "00:07:4D:39:1A:BC",
    processor: "N/A (Embedded)",
    ram: "16 MB SDRAM",
    storage: "8 MB Flash",
    graphics: "N/A",
    operatingSystem: "ZPL Firmware",
    windowsLicense: "None",
    officeLicense: "None",
    antivirus: "None",
    purchaseDate: "2024-05-18",
    purchasePrice: 6200000,
    vendor: "PT. Computindo Solusindo",
    warrantyStart: "2024-05-18",
    warrantyEnd: "2025-05-18",
    building: "Main Building",
    floor: "Floor 1",
    room: "Emergency",
    department: "Emergency (UGD)",
    pic: "Ns. Maya Astuti",
    currentUser: "Nurse Emergency Shift 1",
    status: "Maintenance",
    condition: "Needs Repair",
    description: "Thermos Wristband printer for patients admitted in ER.",
    photoUrl: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=300",
    createdAt: "2024-05-18T10:15:00Z",
    updatedAt: "2026-07-15T09:40:00Z"
  },
  {
    id: "ast-4",
    inventoryNumber: "RSIA-BM/IT/INV/2025/0004",
    assetCode: "BM-IT-PC-002",
    assetName: "PC Pendaftaran Loket 2",
    category: "Desktop PC",
    brand: "Lenovo",
    model: "ThinkCentre M70q Tiny",
    serialNumber: "MJ0839D1",
    hostname: "BM-PC-REG-02",
    ipAddress: "192.168.10.22",
    macAddress: "2C:60:0C:44:EE:FF",
    processor: "Intel Core i3-12100T",
    ram: "8 GB DDR4",
    storage: "512 GB SSD",
    graphics: "Intel UHD Graphics 730",
    operatingSystem: "Windows 11 Pro",
    windowsLicense: "OEM-W11P-LNV-4819",
    officeLicense: "Office 2021 Home & Business",
    antivirus: "Windows Defender",
    purchaseDate: "2024-08-05",
    purchasePrice: 9200000,
    vendor: "PT. Computindo Solusindo",
    warrantyStart: "2024-08-05",
    warrantyEnd: "2027-08-05",
    building: "Main Building",
    floor: "Floor 1",
    room: "Registration",
    department: "Medical Records (Rekam Medis)",
    pic: "Bambang Hermawan",
    currentUser: "Rina Kartika",
    status: "Active",
    condition: "Good",
    description: "Standard front desk PC for registering maternity and pediatric patients.",
    photoUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=300",
    createdAt: "2024-08-05T09:30:00Z",
    updatedAt: "2025-10-12T11:00:00Z"
  },
  {
    id: "ast-5",
    inventoryNumber: "RSIA-BM/IT/INV/2025/0005",
    assetCode: "BM-IT-AP-008",
    assetName: "Access Point NICU",
    category: "Access Point",
    brand: "Ubiquiti",
    model: "UniFi AP AC Pro",
    serialNumber: "UBNT-AP-NICU",
    hostname: "BM-AP-NICU-03",
    ipAddress: "192.168.1.140",
    macAddress: "74:83:C2:55:66:77",
    processor: "MIPS 74Kc 720 MHz",
    ram: "128 MB",
    storage: "16 MB Flash",
    graphics: "None",
    operatingSystem: "UniFi OS",
    windowsLicense: "None",
    officeLicense: "None",
    antivirus: "None",
    purchaseDate: "2023-06-15",
    purchasePrice: 2800000,
    vendor: "PT. Jaringan Nusantara",
    warrantyStart: "2023-06-15",
    warrantyEnd: "2025-06-15",
    building: "Main Building",
    floor: "Floor 3",
    room: "NICU",
    department: "Nursing (Keperawatan)",
    pic: "Ahmad Rifai",
    currentUser: "Shared Access NICU Floor",
    status: "Active",
    condition: "Good",
    description: "Wi-Fi access point installed on the ceiling of neonatal intensive care unit for incubator telemetry data and nursing tablets.",
    photoUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=300",
    createdAt: "2023-06-15T11:00:00Z",
    updatedAt: "2026-07-15T14:00:00Z"
  },
  {
    id: "ast-6",
    inventoryNumber: "RSIA-BM/IT/INV/2025/0006",
    assetCode: "BM-IT-PRN-002",
    assetName: "Printer Laporan Laboratorium",
    category: "Printer",
    brand: "Epson",
    model: "L3250 EcoTank Wi-Fi",
    serialNumber: "EPS-L3250-9281A",
    hostname: "BM-PRN-LAB-01",
    ipAddress: "192.168.20.40",
    macAddress: "38:11:15:AA:BB:CC",
    processor: "N/A",
    ram: "N/A",
    storage: "N/A",
    graphics: "N/A",
    operatingSystem: "Epson Firmware",
    windowsLicense: "None",
    officeLicense: "None",
    antivirus: "None",
    purchaseDate: "2024-02-10",
    purchasePrice: 3400000,
    vendor: "Epson Indonesia Authorized",
    warrantyStart: "2024-02-10",
    warrantyEnd: "2026-02-10",
    building: "Main Building",
    floor: "Floor 2",
    room: "Laboratory",
    department: "Laboratory (Laboratorium)",
    pic: "Anisa Fitri",
    currentUser: "Anisa Fitri",
    status: "Active",
    condition: "Good",
    description: "Epson EcoTank printer to print lab reports (blood tests, genetics). Installed with high-speed USB.",
    photoUrl: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=300",
    createdAt: "2024-02-10T09:00:00Z",
    updatedAt: "2026-05-18T16:22:00Z"
  },
  {
    id: "ast-7",
    inventoryNumber: "RSIA-BM/IT/INV/2025/0007",
    assetCode: "BM-IT-LAP-001",
    assetName: "Laptop IT Support 1",
    category: "Laptop",
    brand: "Asus",
    model: "ExpertBook B1400",
    serialNumber: "ASU-EXP-819A",
    hostname: "BM-LAP-IT-01",
    ipAddress: "192.168.1.150",
    macAddress: "F0:2F:74:99:88:77",
    processor: "Intel Core i5-1135G7",
    ram: "16 GB DDR4",
    storage: "512 GB NVMe SSD",
    graphics: "Intel Iris Xe Graphics",
    operatingSystem: "Windows 11 Pro",
    windowsLicense: "OEM-W11P-ASUS-9912",
    officeLicense: "Office 2021 Home & Business",
    antivirus: "Windows Defender",
    purchaseDate: "2023-09-01",
    purchasePrice: 12500000,
    vendor: "PT. Computindo Solusindo",
    warrantyStart: "2023-09-01",
    warrantyEnd: "2025-09-01",
    building: "Main Building",
    floor: "Floor 5",
    room: "IT Room",
    department: "IT (Information Technology)",
    pic: "Rizky Ramadhan",
    currentUser: "Rizky Ramadhan",
    status: "Borrowed",
    condition: "Good",
    description: "Laptop used by IT Support team for on-site helpdesk resolution and SIMRS testing.",
    photoUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=300",
    createdAt: "2023-09-01T08:00:00Z",
    updatedAt: "2026-07-16T11:30:00Z"
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "tkt-1",
    ticketNumber: "TKT-20260715-001",
    date: "2026-07-15",
    category: "Printer / Scanner",
    priority: "High",
    requester: "Ns. Maya Astuti",
    department: "Emergency (UGD)",
    room: "Emergency",
    floor: "Floor 1",
    description: "Printer Gelang Emergency (BM-IT-PRN-001) is flashing red light and cannot feed/print wristbands. It is critical because patients are waiting at UGD and cannot get hospital bracelets.",
    assignedTechnician: "Rizky Ramadhan",
    status: "In Progress",
    comments: [
      {
        id: "c-1",
        userId: "user-entry",
        userName: "Rizky Ramadhan",
        role: UserRole.ENTRY_DATA,
        text: "I am investigating the printer. It looks like the thermo printing head is dirty and the label calibration is off. Checking replacement ribbons.",
        timestamp: "2026-07-15T10:15:00Z"
      },
      {
        id: "c-2",
        userId: "user-superadmin",
        userName: "Ahmad Rifai",
        role: UserRole.SUPER_ADMIN,
        text: "Please escalate to vendor PT. Computindo Solusindo if printhead needs mechanical replacement. Keep the ER nurse informed.",
        timestamp: "2026-07-15T11:00:00Z"
      }
    ]
  },
  {
    id: "tkt-2",
    ticketNumber: "TKT-20260714-002",
    date: "2026-07-14",
    category: "Software / SIMRS",
    priority: "Critical",
    requester: "Siti Rahma",
    department: "Finance & Cashier",
    room: "Cashier",
    floor: "Floor 1",
    description: "SIMRS invoice printout is lagging on PC Kasir Rawat Jalan 1. Every time a print command is triggered, the screen freezes for 10-15 seconds before printing starts. Need urgent check because it slows registration queue.",
    assignedTechnician: "Ahmad Rifai",
    status: "Resolved",
    closedDate: "2026-07-14",
    comments: [
      {
        id: "c-3",
        userId: "user-superadmin",
        userName: "Ahmad Rifai",
        role: UserRole.SUPER_ADMIN,
        text: "Checked print queue spooler. Cleared stuck jobs, set Spool Print Jobs Directly, and optimized Windows printing service. Issue solved. Screen lag decreased from 15 seconds to 1 second.",
        timestamp: "2026-07-14T14:30:00Z"
      }
    ]
  },
  {
    id: "tkt-3",
    ticketNumber: "TKT-20260712-003",
    date: "2026-07-12",
    category: "Network / Wi-Fi",
    priority: "Medium",
    requester: "Ns. Dian Lestari",
    department: "Nursing (Keperawatan)",
    room: "NICU",
    floor: "Floor 3",
    description: "Wi-Fi in NICU is sometimes disconnected. Mobile nurses' tablets have trouble synchronizing patient vital metrics back to the nursing station database. Need to check signal coverage in NICU room corner.",
    assignedTechnician: "Rizky Ramadhan",
    status: "Closed",
    closedDate: "2026-07-13",
    comments: [
      {
        id: "c-4",
        userId: "user-entry",
        userName: "Rizky Ramadhan",
        role: UserRole.ENTRY_DATA,
        text: "Checked the UniFi controller dashboard. Access Point NICU (BM-IT-AP-008) had a channel clash with another AP nearby. Switched channel from Auto (Channel 6) to a clean Channel 11. Signal stable now.",
        timestamp: "2026-07-12T16:00:00Z"
      },
      {
        id: "c-5",
        userId: "user-kakonli",
        userName: "dr. Linda Wijaya",
        role: UserRole.KAKONLI,
        text: "Confirmed. NICU tablets are syncing normally now. Thank you for the quick action.",
        timestamp: "2026-07-13T09:00:00Z"
      }
    ]
  }
];

export const INITIAL_MAINTENANCE: MaintenanceLog[] = [
  {
    id: "m-1",
    assetId: "ast-2",
    assetName: "Core Server SIMRS (HIS)",
    type: "Preventive",
    date: "2026-07-10",
    description: "Routine hardware and system preventive maintenance: 1. Clean server dust inside chassis. 2. Verify fan status. 3. Check RAID Array health and physical disk errors. 4. Run Windows security patches. 5. Perform SQL Database indexing and vacuuming.",
    cost: 1500000,
    vendor: "PT. Computindo Solusindo",
    technicianName: "Prasetyo",
    status: "Completed",
    notes: "Everything checked green. RAID physical health is solid. SQL DB size is currently 142 GB."
  },
  {
    id: "m-2",
    assetId: "ast-3",
    assetName: "Printer Gelang Emergency",
    type: "Corrective",
    date: "2026-07-15",
    description: "Investigate and troubleshoot paper jam/wristband calibration failure. Replacing the paper sensor module and recalibrating the motor feed.",
    cost: 450000,
    vendor: "Epson Indonesia Authorized",
    technicianName: "Hendrik",
    status: "In Progress",
    notes: "Awaiting part delivery. Temporary wristband printer backup has been placed in ER."
  }
];

export const INITIAL_BORROWINGS: BorrowingLog[] = [
  {
    id: "b-1",
    assetId: "ast-7",
    assetName: "Laptop IT Support 1",
    assetCode: "BM-IT-LAP-001",
    borrower: "dr. Linda Wijaya",
    department: "Outpatient Clinic (Poliklinik)",
    borrowDate: "2026-07-16",
    expectedReturnDate: "2026-07-23",
    status: "Borrowed",
    approvedBy: "Ahmad Rifai",
    notes: "Borrowed for presenting clinical audits in the 5th floor Meeting Room and testing SIMRS clinic dashboards."
  }
];

export const INITIAL_MOVEMENTS: AssetMovementLog[] = [
  {
    id: "mov-1",
    assetId: "ast-4",
    assetName: "PC Pendaftaran Loket 2",
    oldLocation: {
      building: "Main Building",
      floor: "Floor 1",
      room: "Lobby",
      department: "Administration & HRD"
    },
    newLocation: {
      building: "Main Building",
      floor: "Floor 1",
      room: "Registration",
      department: "Medical Records (Rekam Medis)"
    },
    reason: "Lobby PC repurposed for active patient registration desks (Loket 2) due to high load in pediatric clinic registration.",
    approvedBy: "Ahmad Rifai",
    date: "2025-10-12"
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "lg-1",
    userId: "user-superadmin",
    userName: "Ahmad Rifai",
    userRole: UserRole.SUPER_ADMIN,
    action: "Login",
    module: "Auth",
    timestamp: "2026-07-18T08:00:00Z",
    details: "Logged in successfully to system dashboard"
  },
  {
    id: "lg-2",
    userId: "user-entry",
    userName: "Rizky Ramadhan",
    userRole: UserRole.ENTRY_DATA,
    action: "Create Maintenance Log",
    module: "Maintenance",
    timestamp: "2026-07-15T09:45:00Z",
    details: "Created Corrective Maintenance ticket for Printer Gelang Emergency (ast-3)"
  },
  {
    id: "lg-3",
    userId: "user-superadmin",
    userName: "Ahmad Rifai",
    userRole: UserRole.SUPER_ADMIN,
    action: "Update Ticket Status",
    module: "Helpdesk",
    timestamp: "2026-07-14T14:30:00Z",
    details: "Resolved SIMRS print lag ticket (TKT-20260714-002)"
  }
];

// Helper Functions for Local Storage Management
export const getStoredData = () => {
  if (typeof window === "undefined") return {
    assets: INITIAL_ASSETS,
    tickets: INITIAL_TICKETS,
    maintenance: INITIAL_MAINTENANCE,
    borrowings: INITIAL_BORROWINGS,
    movements: INITIAL_MOVEMENTS,
    auditLogs: INITIAL_AUDIT_LOGS,
    user: DEMO_USERS[0], // Default as Super Admin
  };

  const assets = localStorage.getItem("rsia_assets") ? JSON.parse(localStorage.getItem("rsia_assets")!) : INITIAL_ASSETS;
  const tickets = localStorage.getItem("rsia_tickets") ? JSON.parse(localStorage.getItem("rsia_tickets")!) : INITIAL_TICKETS;
  const maintenance = localStorage.getItem("rsia_maintenance") ? JSON.parse(localStorage.getItem("rsia_maintenance")!) : INITIAL_MAINTENANCE;
  const borrowings = localStorage.getItem("rsia_borrowings") ? JSON.parse(localStorage.getItem("rsia_borrowings")!) : INITIAL_BORROWINGS;
  const movements = localStorage.getItem("rsia_movements") ? JSON.parse(localStorage.getItem("rsia_movements")!) : INITIAL_MOVEMENTS;
  const auditLogs = localStorage.getItem("rsia_audits") ? JSON.parse(localStorage.getItem("rsia_audits")!) : INITIAL_AUDIT_LOGS;
  
  // Auth state
  const storedUser = localStorage.getItem("rsia_current_user");
  const user = storedUser ? JSON.parse(storedUser) : DEMO_USERS[0];

  return { assets, tickets, maintenance, borrowings, movements, auditLogs, user };
};

export const saveStoredData = (data: {
  assets?: Asset[];
  tickets?: SupportTicket[];
  maintenance?: MaintenanceLog[];
  borrowings?: BorrowingLog[];
  movements?: AssetMovementLog[];
  auditLogs?: AuditLog[];
  user?: User;
}) => {
  if (typeof window === "undefined") return;

  if (data.assets) localStorage.setItem("rsia_assets", JSON.stringify(data.assets));
  if (data.tickets) localStorage.setItem("rsia_tickets", JSON.stringify(data.tickets));
  if (data.maintenance) localStorage.setItem("rsia_maintenance", JSON.stringify(data.maintenance));
  if (data.borrowings) localStorage.setItem("rsia_borrowings", JSON.stringify(data.borrowings));
  if (data.movements) localStorage.setItem("rsia_movements", JSON.stringify(data.movements));
  if (data.auditLogs) localStorage.setItem("rsia_audits", JSON.stringify(data.auditLogs));
  if (data.user) localStorage.setItem("rsia_current_user", JSON.stringify(data.user));
};

// Logging function to easily inject action audits
export const logAction = (user: User, action: string, module: string, details: string) => {
  const currentLogs = localStorage.getItem("rsia_audits") ? JSON.parse(localStorage.getItem("rsia_audits")!) : INITIAL_AUDIT_LOGS;
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
};

// ================= INITIAL TRAINING & SYSTEM CHANGE DATASETS =================
export const INITIAL_TRAINING_MATERIALS: TrainingMaterial[] = [
  {
    id: "trn-001",
    title: "Panduan Transisi SIMRS V2.4: E-Resep & Validasi Dosis Otomatis Farmasi",
    category: "Farmasi & E-Resep",
    format: "Video Tutorial",
    systemVersion: "SIMRS Build 2026.04",
    targetRoles: ["Dokter", "Farmasi", "Perawat"],
    durationOrPages: "12:30 Min",
    releaseDate: "2026-03-15",
    updatedBy: "Ahmad Rifai (Super Admin)",
    isMandatory: true,
    description: "Tutorial langkah demi langkah penggunaan fitur E-Resep baru pada SIMRS V2.4, mencakup verifikasi alergi pasien, pemotongan stok obat real-time, dan alert otomatis interaksi obat keras.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    downloadUrl: "#",
    completedByUsers: ["user-superadmin", "user-entry"],
    steps: [
      {
        title: "1. Buka Modul EMR Dokter",
        desc: "Masuk ke menu RME Pasien, pilih tab 'Resep Elektronik', masukan diagnosa ICD-10 pasien."
      },
      {
        title: "2. Input Nama Obat & Dosis",
        desc: "Ketik nama obat standar formularium RSIA Bina Medika. Sistem akan otomatis menampilkan stok aktif farmasi Lt.1."
      },
      {
        title: "3. Tanda Tangan Digital & Kirim",
        desc: "Klik 'Tandatangani E-Resep' dengan PIN 6-digit. Resep akan langsung muncul di Layar Antrean Depo Farmasi."
      }
    ]
  },
  {
    id: "trn-002",
    title: "SOP Integrasi SATUSEHAT Kemenkes & Bridging BPJS VClaim 2.0",
    category: "SATUSEHAT & BPJS",
    format: "Panduan PDF",
    systemVersion: "Bridging v2.0",
    targetRoles: ["Rekam Medis", "Kasir", "Staff IT"],
    durationOrPages: "18 Halaman",
    releaseDate: "2026-03-20",
    updatedBy: "Rizky Ramadhan (IT Support)",
    isMandatory: true,
    description: "Panduan teknis dan operasional pertukaran data rekam medis elektronik (RME) ke FHIR SATUSEHAT Kemenkes RI serta penerbitan SEP BPJS Kesehatan tanpa hambatan.",
    downloadUrl: "#",
    completedByUsers: ["user-superadmin"],
    steps: [
      {
        title: "1. Verifikasi NIK Pasien & No. Kartu BPJS",
        desc: "Sistem akan otomatis melakukan ping API VClaim 2.0 untuk cek keaktifan rujukan faskes tingkat 1."
      },
      {
        title: "2. Mapping Kode Kemenkes FHIR",
        desc: "Pastikan item pemeriksaan fisik dan lab telah terhubung dengan dictionary LOINC dan SNOMED CT."
      }
    ]
  },
  {
    id: "trn-003",
    title: "SOP Keamanan Login Identitas 2FA & Kebijakan Password SIMRS",
    category: "Keamanan Akses & Identitas",
    format: "SOP & Flowchart",
    systemVersion: "Auth Policy 2026",
    targetRoles: ["Dokter", "Perawat", "Kasir", "Staff IT", "Kakonli"],
    durationOrPages: "08 Halaman",
    releaseDate: "2026-02-10",
    updatedBy: "Ahmad Rifai (Super Admin)",
    isMandatory: true,
    description: "Kebijakan wajib penggantian password berkala setiap 90 hari, enkripsi PIN tanda tangan digital EMR, dan protokol pencegahan akun bersama (shared account violation).",
    downloadUrl: "#",
    completedByUsers: ["user-superadmin", "user-entry", "user-kakonli"],
    steps: [
      {
        title: "1. Pembuatan Password Kuat",
        desc: "Password minimal 8 karakter mengandung kombinasi huruf besar, kecil, angka, dan karakter khusus."
      },
      {
        title: "2. Reset PIN EMR Mandiri",
        desc: "Buka menu Akses & Identitas > Profil Saya > Ubah PIN Tanda Tangan Digital."
      }
    ]
  },
  {
    id: "trn-004",
    title: "Tutorial Operasional Barcode Scanner Zebra & Cetak Label Gelang Pasien Rawat Inap",
    category: "Hardware & Scanner",
    format: "Video Tutorial",
    systemVersion: "Hardware Rev 3",
    targetRoles: ["Perawat", "Admission", "Farmasi"],
    durationOrPages: "06:15 Min",
    releaseDate: "2026-01-25",
    updatedBy: "Budi Santoso (Entry Data)",
    isMandatory: false,
    description: "Tata cara penggunaan barcode scanner Zebra DS2208 & printer thermal Honeywell pada pendaftaran pendaftaran rawat inap dan verifikasi 6 benar identifikasi pasien.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    downloadUrl: "#",
    completedByUsers: [],
    steps: [
      {
        title: "1. Kalibrasi Thermal Printer Gelang",
        desc: "Tekan tombol Feed 3 detik hingga LED hijau berkedip untuk auto-align posisi gelang ibu/bayi."
      },
      {
        title: "2. Scan Barcode Gelang Pasien",
        desc: "Arahkan sinar scanner pada QR Code gelang saat pemberian obat untuk verifikasi keamanan obat."
      }
    ]
  },
  {
    id: "trn-005",
    title: "Panduan Modul Kasir Billing & Deposito Rawat Inap SIMRS V2.4",
    category: "Kasir & Billing",
    format: "Panduan PDF",
    systemVersion: "SIMRS Build 2026.04",
    targetRoles: ["Kasir", "Finance"],
    durationOrPages: "14 Halaman",
    releaseDate: "2026-03-01",
    updatedBy: "Hendra Kristian",
    isMandatory: false,
    description: "Pelatihan pembukuan billing terpadu, pembayaran QRIS / EDC bank, pengembalian sisa deposit pasien rujukan, dan penerbitan kwitansi sah bermeterai elektronik.",
    downloadUrl: "#",
    completedByUsers: ["user-entry"],
    steps: [
      {
        title: "1. Verifikasi Biaya Tindakan & Alkes",
        desc: "Cek rekap klaim dari poli dan VK sebelum menutup invoice akhir pasien pulang."
      },
      {
        title: "2. Cetak Rincian Billing Terpadu",
        desc: "Pilih opsi 'Cetak Billing Detail' untuk diserahkan ke penjamin / asuransi komersial."
      }
    ]
  },
  {
    id: "trn-006",
    title: "Alur RME Dokter DPJP & Tanda Tangan Digital Sertifikat Medis",
    category: "SIMRS & EMR",
    format: "Release Notes",
    systemVersion: "RME E-Sign 1.2",
    targetRoles: ["Dokter", "Rekam Medis"],
    durationOrPages: "05 Halaman",
    releaseDate: "2026-03-18",
    updatedBy: "dr. Linda Wijaya (Kakonli)",
    isMandatory: true,
    description: "Prosedur pengisian lembar SOAP harian, resume medis pasien pulang, dan pembubuhan TTE (Tanda Tangan Elektronik) terintegrasi BSrE BSSN.",
    downloadUrl: "#",
    completedByUsers: ["user-kakonli"],
    steps: [
      {
        title: "1. Buka Lembar SOAP Pasien",
        desc: "Isi Anamnesis, Pemeriksaan Fisik, Assessment, dan Plan pada tablet atau PC Poliklinik."
      },
      {
        title: "2. Otorisasi TTE BSrE",
        desc: "Verifikasi OTP / PIN E-Sign untuk mengunci data rekam medis pasien sesuai aturan Permenkes 24/2022."
      }
    ]
  }
];

export const SYSTEM_CHANGE_RELEASES: SystemChangeRelease[] = [
  {
    id: "rel-2026-04",
    version: "SIMRS Build 2026.04",
    releaseDate: "2026-03-15",
    title: "Pembaruan Mayor E-Resep Farmasi, RME SOAP & SATUSEHAT Integration",
    impactLevel: "Critical Update",
    affectedModules: ["RME Dokter", "Depo Farmasi Lt.1 & Lt.3", "Rekam Medis", "Bridging SATUSEHAT"],
    summary: "Rilis versi 2026.04 memperbarui modul EMR untuk mendukung pemotongan obat real-time, alert dosis anak/bayi otomatis, dan bridging otomatis FHIR Kemenkes.",
    keyChanges: [
      "Penambahan fitur Alert Dosis Racikan Anak otomatis berdasarkan berat badan pasien.",
      "Integrasi tanda tangan digital BSrE untuk penguncian lembar SOAP resume medis.",
      "Sync stok obat real-time antara Depo Utama Farmasi dan Depo VK Rawat Inap.",
      "Peningkatan kecepatan loading RME pasien hingga 40%."
    ],
    tutorialIds: ["trn-001", "trn-002", "trn-006"]
  },
  {
    id: "rel-2026-03",
    version: "Auth Security Update v2.1",
    releaseDate: "2026-02-10",
    title: "Penerapan Otorisasi RBAC Bertingkat & Kebijakan Logins Password Enkripsi",
    impactLevel: "SOP Amendment",
    affectedModules: ["Akses Level & Identitas", "Helpdesk SLA", "Master Data IT"],
    summary: "Pembaruan kebijakan keamanan sistem IT RSIA Bina Medika untuk mencegah penyalahgunaan akun bersama dan pelacakan audit trail yang lebih presisi.",
    keyChanges: [
      "Setiap staff wajib memiliki Username & Password pribadi (dilarang menggunakan akun bersama).",
      "Penerapan matriks otorisasi CRUD bertingkat (Super Admin, Entry Data, Kakonli).",
      "Logging IP Address dan waktu transaksi perubahan data inventaris & helpdesk.",
      "Peringatan penggantian password otomatis setiap 90 hari."
    ],
    tutorialIds: ["trn-003"]
  },
  {
    id: "rel-2026-02",
    version: "Hardware & Label Driver v3.0",
    releaseDate: "2026-01-25",
    title: "Driver Baru Barcode Scanner Zebra DS2208 & Honeywell Thermal Gelang Pasien",
    impactLevel: "Major Feature",
    affectedModules: ["Admission Rawat Inap", "Poliklinik Lt.2", "IGD Lt.1"],
    summary: "Standardisasi hardware scanner dan printer thermal gelang ibu & anak di seluruh 5 lantai RSIA Bina Medika.",
    keyChanges: [
      "Dukungan scanning QR Code 2D resolusi tinggi pada gelang pasien ukuran mini.",
      "Auto-detect printer thermal Honeywell di perawat station lantai 1 s/d 5.",
      "Driver universal PnP tanpa perizinan administrator Windows."
    ],
    tutorialIds: ["trn-004"]
  }
];

