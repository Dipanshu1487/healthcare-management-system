export type HospitalRole = "admin" | "doctor" | "reception" | "lab" | "pharmacy" | "patient" | "it-admin";

export interface PatientRecord {
  id: string;
  uhid: string;
  name: string;
  gender: string;
  dob: string;
  age: number;
  mobile: string;
  altMobile?: string;
  aadhaar: string;
  address: string;
  district: string;
  state: string;
  bloodGroup: string;
  guardian: string;
  guardianRelation?: string;
  emergencyContact: string;
  emergencyPhone?: string;
  scheme: string;
  occupation?: string;
  registeredAt: string;
  allergies?: string[];
  chronicConditions?: string[];
  weight?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  uhid: string;
  name: string;
  phone: string;
  gender?: string;
  age?: number | string;
  date: string;
  timeSlot: string;
  department: string;
  doctor: string;
  room?: string;
  token?: string;
  status: "Waiting" | "In-Consultation" | "Completed" | "Cancelled" | "Scheduled";
  priority?: "Normal" | "Urgent" | "Emergency";
  symptoms?: string;
  triage?: string;
  createdAt: string;
}

export interface EmergencyPatient {
  id: string;
  name: string;
  condition: string;
  triage: "Critical (Red)" | "Severe (Yellow)" | "Moderate (Green)" | "Critical" | "Severe" | "Moderate";
  time: string;
  status: "Active" | "Stabilized" | "Admitted" | "Discharged";
  uhid?: string;
}

export interface PrescribedDrug {
  id?: string;
  drugName: string;
  strength?: string;
  dosage: string;
  frequency: string;
  duration: string;
  qtyNeeded?: number;
}

export interface PrescriptionOrder {
  id: string;
  patientId: string;
  uhid: string;
  name: string;
  age: number | string;
  gender: string;
  doctor: string;
  department: string;
  drugs: PrescribedDrug[];
  date: string;
  priority: "Normal" | "Urgent" | "Emergency";
  status: "Pending" | "Dispensed" | "Partially Dispensed" | "Cancelled";
  diagnosis: string;
  allergies: string;
  weight: string;
  bloodGroup: string;
  notes?: string;
}

export interface LabTestItem {
  testName: string;
  resultValue?: string;
  normalRange?: string;
  status: "Pending" | "Testing" | "Completed";
  unit?: string;
}

export interface LabOrder {
  id?: string;
  sampleId: string;
  patientId: string;
  uhid: string;
  name: string;
  testName: string;
  doctor: string;
  collectionTime: string;
  priority: "Normal" | "Urgent" | "Emergency";
  status: "Pending Collection" | "Collected" | "Testing" | "Completed";
  sampleType: string;
  collectorName?: string;
  technicianName?: string;
  resultValue?: string;
  normalRange?: string;
  remarks?: string;
  completedTime?: string;
  tests?: LabTestItem[];
}

export interface CriticalAlert {
  id: string;
  patientName: string;
  testName: string;
  finding: string;
  urgency: "Immediate Action" | "Urgent Review" | "Critical";
  time: string;
  uhid?: string;
}

export interface ActiveTestItem {
  id: string;
  patientName: string;
  testName: string;
  status: "In Analyzer" | "Centrifuging" | "Slide Prep" | "Incubating" | string;
  eta: string;
}

export interface RecentReportItem {
  id: string;
  patientName: string;
  testName: string;
  completedTime: string;
  status: "Verified" | "Delivered" | "Pending Review";
  findings: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  batchNo: string;
  expiryDate: string;
  quantity: number;
  unit: string;
  mrp: number;
  purchasePrice: number;
  manufacturer: string;
  status: "Optimal" | "Low Stock" | "Expiring Soon";
}

export interface TransactionRecord {
  id: string;
  time: string;
  type: "Dispense" | "Restock" | "Adjustment" | "Return";
  refId: string;
  details: string;
  amount?: number;
}

export interface SupplierItem {
  id: string;
  name: string;
  pendingOrders: number;
  deliveryDate: string;
  status: "Scheduled" | "In Transit" | "Delivered";
}

export interface NotificationItem {
  id: string;
  targetRole?: HospitalRole | "All";
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "alert" | "success" | "warning";
}

export interface ConsultResult {
  id: string;
  token: string;
  name: string;
  uhid: string;
  diagnosis: string;
  time: string;
  doctor: string;
  department: string;
}

export interface MedicalRecordItem {
  id: string;
  patientId: string;
  date: string;
  type: string;
  doctor: string;
  department: string;
  diagnosis: string;
  summary: string;
  status: string;
}

export interface BillItem {
  id: string;
  patientId: string;
  invoiceNo: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue";
  paymentMethod?: string;
  items?: { name: string; cost: number }[];
}

export interface VaccinationItem {
  id: string;
  patientId: string;
  name: string;
  date: string;
  status: "Completed" | "Scheduled" | "Overdue";
  dosage: string;
  administeredBy: string;
}

export interface TimelineEvent {
  id: string;
  patientId: string;
  date: string;
  time?: string;
  title: string;
  subtitle: string;
  type: "visit" | "lab" | "med" | "surgery" | "scheme" | "registration" | "emergency";
  department?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorRole: HospitalRole;
  actorName: string;
  action: string;
  entityType: "Patient" | "Appointment" | "Prescription" | "LabOrder" | "Inventory" | "Emergency" | "System";
  entityId: string;
  description: string;
}

export interface HospitalState {
  patients: PatientRecord[];
  appointments: Appointment[];
  emergencies: EmergencyPatient[];
  completedConsults: ConsultResult[];
  prescriptions: PrescriptionOrder[];
  labOrders: LabOrder[];
  criticalAlerts: CriticalAlert[];
  activeTests: ActiveTestItem[];
  recentReports: RecentReportItem[];
  inventory: InventoryItem[];
  transactions: TransactionRecord[];
  suppliers: SupplierItem[];
  medicalRecords: MedicalRecordItem[];
  bills: BillItem[];
  vaccinations: VaccinationItem[];
  timelineEvents: TimelineEvent[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  currentSimulatedPatientId: string;
  isSimulationRunning: boolean;
  
  // IT Admin Added
  staff: StaffMember[];
  departments: HospitalDepartment[];
  devices: HospitalDevice[];
  itMetrics: ITMetrics;
  hospitalConfig: HospitalConfig;
}

export interface StaffMember {
  id: string; // Employee ID (e.g. CHC-DOC-00125)
  name: string;
  username: string;
  email: string;
  passwordTemp: string;
  department: string;
  designation: string;
  joiningDate: string;
  role: HospitalRole | "nurse" | "cashier" | "radiology" | "store_manager" | "it_support" | "super-admin";
  status: "Active" | "Inactive";
}

export interface HospitalDepartment {
  id: string;
  name: string;
  headName: string;
  staffCount: number;
}

export interface HospitalDevice {
  id: string;
  name: string;
  assignedTo: string;
  status: "Online" | "Offline" | "Maintenance";
  location: string;
}

export interface ITMetrics {
  onlineUsers: number;
  activeSessions: number;
  serverStatus: "Healthy" | "Degraded" | "Down";
  databaseStatus: "Connected" | "Disconnected";
  storageUsedGB: number;
  storageTotalGB: number;
  backupStatus: "Success" | "Failed" | "In Progress";
  failedLoginsToday: number;
  cpuUsagePct: number;
  memoryUsagePct: number;
}

export interface HospitalConfig {
  hospitalName: string;
  logoUrl?: string;
  workingHours: string;
  appointmentSlotDurationMin: number;
  governmentSchemes: string[];
  medicineCategories: string[];
  labCategories: string[];
}

