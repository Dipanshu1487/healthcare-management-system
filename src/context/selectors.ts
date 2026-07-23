import type { HospitalState } from "./types";

export function selectAdminStats(state: HospitalState) {
  const totalPatients = state.patients.length;
  const todayAppointments = state.appointments.length;
  const activeEmergencies = state.emergencies.filter((e) => e.status === "Active").length;
  const pendingLabs = state.labOrders.filter((l) => l.status !== "Completed").length;
  const pendingPrescriptions = state.prescriptions.filter((p) => p.status === "Pending").length;
  const lowStockMedicines = state.inventory.filter((i) => i.status === "Low Stock").length;

  return {
    totalPatients,
    todayAppointments,
    activeEmergencies,
    pendingLabs,
    pendingPrescriptions,
    lowStockMedicines,
  };
}

export function selectReceptionQueue(state: HospitalState) {
  return state.appointments.filter((a) => a.status === "Waiting");
}

export function selectDoctorQueue(state: HospitalState, department?: string) {
  return state.appointments.filter(
    (a) => a.status === "Waiting" && (!department || department === "All" || a.department === department)
  );
}

export function selectPendingLabOrders(state: HospitalState) {
  return state.labOrders.filter((ord) => ord.status !== "Completed");
}

export function selectCompletedLabOrders(state: HospitalState) {
  return state.labOrders.filter((ord) => ord.status === "Completed");
}

export function selectPendingPrescriptions(state: HospitalState) {
  return state.prescriptions.filter((rx) => rx.status === "Pending");
}

export function selectDispensedPrescriptions(state: HospitalState) {
  return state.prescriptions.filter((rx) => rx.status === "Dispensed");
}

export function selectPatientData(state: HospitalState, patientId: string) {
  const patient = state.patients.find((p) => p.id === patientId) || state.patients[0];
  const patientApts = state.appointments.filter((a) => a.patientId === patient.id || a.uhid === patient.uhid);
  const patientRecords = state.medicalRecords.filter((r) => r.patientId === patient.id);
  const patientPrescriptions = state.prescriptions.filter((rx) => rx.patientId === patient.id || rx.uhid === patient.uhid);
  const patientLabs = state.labOrders.filter((lab) => lab.patientId === patient.id || lab.uhid === patient.uhid);
  const patientBills = state.bills.filter((b) => b.patientId === patient.id);
  const patientVaccines = state.vaccinations.filter((v) => v.patientId === patient.id);
  const patientTimeline = state.timelineEvents.filter((t) => t.patientId === patient.id);

  return {
    patient,
    appointments: patientApts,
    medicalRecords: patientRecords,
    prescriptions: patientPrescriptions,
    labOrders: patientLabs,
    bills: patientBills,
    vaccinations: patientVaccines,
    timeline: patientTimeline,
  };
}
