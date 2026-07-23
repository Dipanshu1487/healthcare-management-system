import type {
  PatientRecord,
  Appointment,
  EmergencyPatient,
  PrescriptionOrder,
  LabOrder,
  CriticalAlert,
  RecentReportItem,
  TransactionRecord,
  MedicalRecordItem,
  TimelineEvent,
  NotificationItem,
  AuditLogItem,
  ConsultResult,
  StaffMember,
  HospitalDepartment,
  HospitalDevice,
  HospitalConfig,
} from "./types";

export type HospitalAction =
  | { type: "REGISTER_PATIENT"; payload: { patient: PatientRecord; appointment?: Appointment; audit: AuditLogItem } }
  | { type: "BOOK_APPOINTMENT"; payload: { appointment: Appointment; audit: AuditLogItem } }
  | { type: "UPDATE_APPOINTMENT_STATUS"; payload: { appointmentId: string; status: Appointment["status"]; audit?: AuditLogItem } }
  | { type: "ADD_EMERGENCY_PATIENT"; payload: { emergency: EmergencyPatient; audit: AuditLogItem } }
  | { type: "RESOLVE_EMERGENCY_PATIENT"; payload: { id: string; status: EmergencyPatient["status"]; audit?: AuditLogItem } }
  | { type: "COMPLETE_CONSULTATION"; payload: { consult: ConsultResult; prescription?: PrescriptionOrder; labOrder?: LabOrder; medicalRecord?: MedicalRecordItem; timeline?: TimelineEvent; audit: AuditLogItem } }
  | { type: "UPDATE_LAB_ORDER_STATUS"; payload: { sampleId: string; status: LabOrder["status"]; resultValue?: string; normalRange?: string; remarks?: string; technicianName?: string; alert?: CriticalAlert; report?: RecentReportItem; audit?: AuditLogItem } }
  | { type: "DISPENSE_PRESCRIPTION"; payload: { prescriptionId: string; transaction: TransactionRecord; audit?: AuditLogItem } }
  | { type: "RESTOCK_INVENTORY"; payload: { medicineId: string; addQty: number; transaction: TransactionRecord; audit?: AuditLogItem } }
  | { type: "ADD_NOTIFICATION"; payload: NotificationItem }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "ADD_AUDIT_LOG"; payload: AuditLogItem }
  | { type: "UPDATE_PATIENT_PROFILE"; payload: Partial<PatientRecord> & { id: string } }
  | { type: "SET_CURRENT_SIMULATED_PATIENT"; payload: string }
  | { type: "SET_SIMULATION_RUNNING"; payload: boolean }
  | { type: "RESET_SIMULATION" }
  | { type: "CREATE_STAFF_MEMBER"; payload: { staffMember: StaffMember; audit: AuditLogItem } }
  | { type: "UPDATE_STAFF_MEMBER"; payload: { staffMember: StaffMember; audit: AuditLogItem } }
  | { type: "DELETE_STAFF_MEMBER"; payload: { id: string; audit: AuditLogItem } }
  | { type: "TOGGLE_STAFF_STATUS"; payload: { id: string; audit: AuditLogItem } }
  | { type: "RESET_STAFF_PASSWORD"; payload: { id: string; passwordTemp: string; audit: AuditLogItem } }
  | { type: "CREATE_DEPARTMENT"; payload: { department: HospitalDepartment; audit: AuditLogItem } }
  | { type: "UPDATE_DEPARTMENT"; payload: { department: HospitalDepartment; audit: AuditLogItem } }
  | { type: "REGISTER_DEVICE"; payload: { device: HospitalDevice; audit: AuditLogItem } }
  | { type: "UPDATE_DEVICE"; payload: { device: HospitalDevice; audit: AuditLogItem } }
  | { type: "UPDATE_HOSPITAL_CONFIG"; payload: { config: HospitalConfig; audit: AuditLogItem } };
