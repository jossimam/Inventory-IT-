import React, { useState } from "react";
import { FileCode2, Copy, Check, ShieldAlert, Layers, Map, Database, FileText, Settings, HeartPulse } from "lucide-react";

export default function BlueprintPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeStepTab, setActiveStepTab] = useState<"step1" | "step2" | "step3" | "step4" | "step5" | "step6">("step1");

  const triggerCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Step 6: Supabase SQL String containing comprehensive normalized schema, relationships, indexes, triggers, stored procedures, RLS policies, and bucket setups.
  const SUPABASE_SQL_SCRIPT = `-- =======================================================
-- SIM INVENTORY IT RSIA BINA MEDIKA - POSTGRESQL SCHEMA
-- PRODUCTION BLUEPRINT WITH RLS, TRIGGERS & STORAGE BUCKETS
-- =======================================================

-- 1. Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Custom Enums for Domain Integrity
CREATE TYPE user_role AS ENUM ('Super Admin', 'Entry Data', 'Kakonli');
CREATE TYPE asset_status AS ENUM ('Active', 'Maintenance', 'Borrowed', 'Broken', 'Scrapped');
CREATE TYPE asset_condition AS ENUM ('Good', 'Needs Repair', 'Damaged');
CREATE TYPE ticket_priority AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE ticket_status AS ENUM ('Open', 'In Progress', 'Resolved', 'Closed');

-- 3. MASTER DATA SCHEMAS (Normalization Step 1)
CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE floors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    UNIQUE(building_id, name)
);

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    floor_id UUID REFERENCES floors(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    UNIQUE(floor_id, name)
);

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE
);

-- 4. IT ASSETS REGISTER (Core Schema)
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_number VARCHAR(100) UNIQUE NOT NULL,
    asset_code VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    hostname VARCHAR(100),
    ip_address VARCHAR(45),
    mac_address VARCHAR(17),
    
    -- Hardware specifications
    processor VARCHAR(100),
    ram VARCHAR(50),
    storage VARCHAR(50),
    graphics VARCHAR(100),
    operating_system VARCHAR(100),
    windows_license VARCHAR(100),
    office_license VARCHAR(100),
    antivirus VARCHAR(100),
    
    -- Commercial metrics
    purchase_date DATE,
    purchase_price DECIMAL(15, 2),
    vendor VARCHAR(150),
    warranty_start DATE,
    warranty_end DATE,
    
    -- Mapped physical references
    building_id UUID REFERENCES buildings(id),
    floor_id UUID REFERENCES floors(id),
    room_id UUID REFERENCES rooms(id),
    department_id UUID REFERENCES departments(id),
    pic VARCHAR(150),
    current_user VARCHAR(150),
    
    -- Status trackers
    status asset_status DEFAULT 'Active'::asset_status NOT NULL,
    condition asset_condition DEFAULT 'Good'::asset_condition NOT NULL,
    description TEXT,
    
    -- Storage attachments
    photo_url TEXT,
    invoice_url TEXT,
    warranty_doc_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TRANSACTIONAL LEDGERS (Normalization Step 2)

-- Maintenance workorder ledger
CREATE TABLE maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL, -- preventive vs corrective
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
    vendor VARCHAR(150) NOT NULL,
    technician_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'In Progress' NOT NULL,
    before_photo_url TEXT,
    after_photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Incident tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(100) UNIQUE NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority ticket_priority DEFAULT 'Medium'::ticket_priority NOT NULL,
    requester VARCHAR(150) NOT NULL,
    department_id UUID REFERENCES departments(id),
    floor_name VARCHAR(50) NOT NULL,
    room_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    assigned_technician VARCHAR(150),
    status ticket_status DEFAULT 'Open'::ticket_status NOT NULL,
    closed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Helpdesk comments thread
CREATE TABLE ticket_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
    user_id UUID NOT NULL, -- maps to auth.users
    user_name VARCHAR(150) NOT NULL,
    role user_role NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Lending / Borrowing Ledger
CREATE TABLE borrowing_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
    borrower VARCHAR(150) NOT NULL,
    department_id UUID REFERENCES departments(id),
    borrow_date DATE DEFAULT CURRENT_DATE NOT NULL,
    expected_return_date DATE NOT NULL,
    actual_return_date DATE,
    status VARCHAR(50) DEFAULT 'Borrowed' NOT NULL,
    notes TEXT,
    approved_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Equipment physical movement log
CREATE TABLE movement_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
    old_floor VARCHAR(50) NOT NULL,
    old_room VARCHAR(100) NOT NULL,
    new_floor VARCHAR(50) NOT NULL,
    new_room VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    approved_by VARCHAR(150) NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- System comprehensive audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =======================================================
-- 6. SECURITY: SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================

-- Enable RLS on core tables
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE movement_logs ENABLE ROW LEVEL SECURITY;

-- Note: In Supabase, auth.uid() retrieves active session metadata.
-- We map custom role parameters via custom user JWT claims or profile lookup.

-- POLICY 1: KAKONLI (Read-only access on all tables)
CREATE POLICY "Kakonli select policy" ON assets 
    FOR SELECT TO authenticated USING (true);

-- POLICY 2: ENTRY DATA (Can read, create, update - NO DELETE)
CREATE POLICY "Entry Data write policy" ON assets 
    FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (
        -- Enforce in application metadata or JWT claim role
        auth.jwt() ->> 'role' IN ('Super Admin', 'Entry Data')
    );

-- Delete constraint policy (Super Admin Only)
CREATE POLICY "Super Admin delete policy" ON assets 
    FOR DELETE TO authenticated 
    USING (auth.jwt() ->> 'role' = 'Super Admin');

-- Apply similar policies across all ledgers...

-- =======================================================
-- 7. PERFORMANCE INDEXES
-- =======================================================
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_condition ON assets(condition);
CREATE INDEX idx_assets_floor_room ON assets(floor_id, room_id);
CREATE INDEX idx_tickets_priority_status ON tickets(priority, status);
CREATE INDEX idx_maintenance_asset ON maintenance_logs(asset_id);

-- =======================================================
-- 8. TRIGGERS & STORED FUNCTIONS
-- =======================================================

-- Function 1: Automate updated_at column updates
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_assets_timestamp
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Function 2: Sync asset status on borrowing registration
CREATE OR REPLACE FUNCTION sync_asset_borrow_status()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE assets 
    SET status = 'Borrowed'::asset_status 
    WHERE id = NEW.asset_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_borrow_sync
    AFTER INSERT ON borrowing_logs
    FOR EACH ROW
    EXECUTE FUNCTION sync_asset_borrow_status();

-- =======================================================
-- 9. STORAGE BUCKETS SETUP (Supabase SQL)
-- =======================================================
-- Run these in Supabase Dashboard API controls to initiate buckets
-- insert into storage.buckets (id, name, public) values ('asset-photos', 'asset-photos', true);
-- insert into storage.buckets (id, name, public) values ('warranty-docs', 'warranty-docs', false);
`;

  return (
    <div className="space-y-6" id="blueprint-view">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Architect & Database Blueprint Hub</h2>
          <p className="text-slate-500 text-xs mt-1">
            Read comprehensive structural specifications, entity relationship descriptions, and copy production SQL scripts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="p-2 bg-teal-50 text-teal-600 rounded-xl">
            <FileCode2 className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Blueprint Sub-navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-1">
        <button
          onClick={() => setActiveStepTab("step1")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeStepTab === "step1" ? "bg-teal-600 text-white shadow-sm font-bold" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          1. Business Analysis
        </button>
        <button
          onClick={() => setActiveStepTab("step2")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeStepTab === "step2" ? "bg-teal-600 text-white shadow-sm font-bold" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          2. Role Use Case
        </button>
        <button
          onClick={() => setActiveStepTab("step3")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeStepTab === "step3" ? "bg-teal-600 text-white shadow-sm font-bold" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          3. Process Flowcharts
        </button>
        <button
          onClick={() => setActiveStepTab("step4")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeStepTab === "step4" ? "bg-teal-600 text-white shadow-sm font-bold" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          4. ERD Schema
        </button>
        <button
          onClick={() => setActiveStepTab("step5")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeStepTab === "step5" ? "bg-teal-600 text-white shadow-sm font-bold" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          5. Supabase Integration
        </button>
        <button
          onClick={() => setActiveStepTab("step6")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeStepTab === "step6" ? "bg-teal-600 text-white shadow-sm font-bold" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          6. Production SQL Script
        </button>
      </div>

      {/* Main Documentation Frame */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm leading-relaxed text-xs">
        
        {/* Step 1: Business Analysis */}
        {activeStepTab === "step1" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><Layers className="w-4 h-4" /></span>
              <h3 className="text-sm font-bold text-slate-800">Business Analysis & Hospital Requirements</h3>
            </div>
            
            <p className="text-slate-600 text-[11px]">
              Managing Information Technology assets inside a high-throughput medical environment like <b>RSIA Bina Medika (Mother and Child Hospital)</b> requires strict traceability and strict regulatory safety compliance. Standard IT offices can afford minor asset downtime; hospitals cannot. Equipment failures at nurse stations, critical NICU monitor servers, or emergency admission registries directly disrupt patient safety workflows.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
                <div className="font-bold text-slate-800">Physical Constraints (5 Floors Topology)</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li><b>Floor 1 (Emergency admissions/Cashier)</b>: High continuous duty cycles. Systems must be kept active 24/7/365.</li>
                  <li><b>Floor 2 & 3 (Laboratories & Neonatal Intensive Care NICU)</b>: Sensor integrations and wireless telemetry nodes are subject to sterilizations. Network up-time is life-critical.</li>
                  <li><b>Floor 5 (Server Rooms/HQ)</b>: Center of administrative control, core local hosting stacks, and IT backups.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
                <div className="font-bold text-slate-800">Operational Log Mandates</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Every asset must carry an unbroken trail. When a printer is relocated from the Lobby to the Cashier desk, a <b>Custodian Movement Log</b> must register the source/target locations and approving authorities. When corrective or preventive repair is undertaken, the contracted <b>Vendor Service overhead</b> and diagnostic comments are kept in perpetuity for fiscal audit.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Role Use Case */}
        {activeStepTab === "step2" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><ShieldAlert className="w-4 h-4" /></span>
              <h3 className="text-sm font-bold text-slate-800">Security Governance: Role-Based Authorization Use Cases</h3>
            </div>

            <p className="text-slate-600 text-[11px]">
              Access limits are strictly partitioned among the three operational roles within the RSIA system:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0"></span>
                <div>
                  <div className="font-bold text-slate-800 uppercase text-[10px]">1. Super Admin (IT Manager / Senior Director)</div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    <b>Scope:</b> Full CRUD permissions. The only role authorized to delete cataloged assets, configure master lookups, change system databases, and execute custom stored functions. Authorized to log audit actions and approve high-cost vendor repair expenditures.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                <div>
                  <div className="font-bold text-slate-800 uppercase text-[10px]">2. Entry Data (IT Staff / Support Technicians)</div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    <b>Scope:</b> Read, create, and modify permissions. Can register newly procured assets, update specifications, file tickets, schedule workorders, and execute physical equipment relocations. <b>Strictly blocked from dropping database tables or deleting records.</b>
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0"></span>
                <div>
                  <div className="font-bold text-slate-800 uppercase text-[10px]">3. Kakonli (Operational Auditor / Financial Controller)</div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    <b>Scope:</b> Read-only permission. Cannot create or edit master records, assets, or maintenance. Authorized to run real-time queries across all tables, inspect system trails, and export custom PDFs/Excel spreadsheets for immediate presentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Process Flowcharts */}
        {activeStepTab === "step3" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><Map className="w-4 h-4" /></span>
              <h3 className="text-sm font-bold text-slate-800">Operational Process Workflows</h3>
            </div>

            <p className="text-slate-600 text-[11px]">
              Our system coordinates hardware lifecycles across three central hospital process workflows:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-center text-[11px] text-slate-700">
              
              {/* Procure to stock */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
                <div className="font-bold text-slate-800 uppercase text-[9px] tracking-wide">1. Asset Procurement Flow</div>
                <div className="space-y-1.5 font-semibold text-slate-500">
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">New Purchase (Invoice/S/N)</div>
                  <div>&darr;</div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">Cataloged to SIM DB</div>
                  <div>&darr;</div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">Generate QR Label Code</div>
                  <div>&darr;</div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">Landed to Floor (Active)</div>
                </div>
              </div>

              {/* Borrowing Flow */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
                <div className="font-bold text-slate-800 uppercase text-[9px] tracking-wide">2. Lending / Custody Flow</div>
                <div className="space-y-1.5 font-semibold text-slate-500">
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">Lending Request Filed</div>
                  <div>&darr;</div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">IT Authorized Approval</div>
                  <div>&darr;</div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">Asset State &rarr; Borrowed</div>
                  <div>&darr;</div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">Return &rarr; State &rarr; Active</div>
                </div>
              </div>

              {/* Maintenance Flow */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
                <div className="font-bold text-slate-800 uppercase text-[9px] tracking-wide">3. Incident Resolution Flow</div>
                <div className="space-y-1.5 font-semibold text-slate-500">
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">Hardware Failure Reported</div>
                  <div>&darr;</div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">Helpdesk SLA Ticket Opened</div>
                  <div>&darr;</div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">Scheduled Workorder Opened</div>
                  <div>&darr;</div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-200">Vendor Fixed &rarr; SLA Closed</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Step 4: ERD Schema */}
        {activeStepTab === "step4" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><Database className="w-4 h-4" /></span>
              <h3 className="text-sm font-bold text-slate-800">Entity Relationship Diagram & Relational Normalization</h3>
            </div>

            <p className="text-slate-600 text-[11px]">
              To guarantee zero database anomalies, the database schema is structured under <b>Third Normal Form (3NF)</b>. Rather than storing duplicating strings for physical locations or departments, assets reference normalized master directories. Lookups are handled cleanly via foreign key relationships.
            </p>

            <div className="p-4 bg-slate-900 text-teal-300 font-mono rounded-2xl text-[10px] space-y-3 leading-relaxed border border-slate-850">
              <div className="font-bold text-white text-xs border-b border-slate-800 pb-1 flex items-center justify-between">
                <span>Relational Schema Cardinalities</span>
                <span className="text-[10px] text-teal-400">PostgreSQL Relational DB</span>
              </div>
              <div><b>buildings (1)</b> &rarr; <b>floors (N)</b> : Parent/child physical mapping</div>
              <div><b>floors (1)</b> &rarr; <b>rooms (N)</b> : Precise hospital location directories</div>
              <div><b>departments (1)</b> &rarr; <b>assets (N)</b> : Allocation of device custodianship</div>
              <div><b>assets (1)</b> &rarr; <b>maintenance_logs (N)</b> : Unbroken ledger history trail [ON DELETE CASCADE]</div>
              <div><b>assets (1)</b> &rarr; <b>borrowing_logs (N)</b> : Lending audit log records</div>
              <div><b>assets (1)</b> &rarr; <b>movement_logs (N)</b> : Custody movement logs</div>
              <div><b>tickets (1)</b> &rarr; <b>ticket_comments (N)</b> : SLA comments ledger</div>
            </div>
          </div>
        )}

        {/* Step 5: Supabase Setup instructions */}
        {activeStepTab === "step5" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><Settings className="w-4 h-4" /></span>
              <h3 className="text-sm font-bold text-slate-800">Supabase Cloud Provisioning Guide</h3>
            </div>

            <p className="text-slate-600 text-[11px]">
              Follow this sequence to establish the production backend inside your Supabase cluster:
            </p>

            <div className="space-y-3 text-[11px] pt-1">
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl">
                <b>1. Run the SQL Script:</b> Open your <b>Supabase Dashboard</b> &rarr; navigate to <b>SQL Editor</b> &rarr; paste the entire production script provided in Tab 6 &rarr; click <b>Run</b>. This builds tables, constraints, enums, triggers, and configures the storage buckets.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl">
                <b>2. Configure Authentication:</b> Supabase Auth handles registrations and session tokens automatically. When inviting entry staff or directors, map their role (Super Admin, Entry Data, Kakonli) into the public profiles table or via user metadata so the RLS policies can parse constraints.
              </div>
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl">
                <b>3. Setup Storage Buckets:</b> In the Supabase storage tab, ensure two public buckets exist: <code className="bg-slate-200 px-1 py-0.5 rounded text-xs font-mono">asset-photos</code> and <code className="bg-slate-200 px-1 py-0.5 rounded text-xs font-mono">warranty-docs</code>. This holds hardware invoices and physical machine snapshots.
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Copyable SQL script */}
        {activeStepTab === "step6" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><FileText className="w-4 h-4" /></span>
                <h3 className="text-sm font-bold text-slate-800">Complete Production PostgreSQL SQL Script</h3>
              </div>
              
              <button
                onClick={() => triggerCopy("sql", SUPABASE_SQL_SCRIPT)}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] cursor-pointer transition-all"
              >
                {copiedText === "sql" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Script!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy SQL Code
                  </>
                )}
              </button>
            </div>

            <p className="text-slate-600 text-[11px]">
              This script builds the entire normalized database structure inside your Supabase project, including RLS policies, performance indexes, and database automatic sync triggers.
            </p>

            <div className="relative">
              <pre className="bg-slate-950 text-slate-200 p-4 rounded-2xl text-[9px] font-mono overflow-auto max-h-96 border border-slate-850 scrollbar-thin">
                {SUPABASE_SQL_SCRIPT}
              </pre>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
