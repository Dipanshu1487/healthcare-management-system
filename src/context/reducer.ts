import type { HospitalState } from "./types";
import type { HospitalAction } from "./actions";
import { initialHospitalState } from "./initialData";

export function hospitalReducer(state: HospitalState, action: HospitalAction): HospitalState {
  switch (action.type) {
    case "REGISTER_PATIENT": {
      const { patient, appointment, audit } = action.payload;
      const nextPatients = [patient, ...state.patients];
      const nextAppointments = appointment ? [appointment, ...state.appointments] : state.appointments;
      return {
        ...state,
        patients: nextPatients,
        appointments: nextAppointments,
        auditLogs: [audit, ...state.auditLogs],
      };
    }

    case "BOOK_APPOINTMENT": {
      const { appointment, audit } = action.payload;
      return {
        ...state,
        appointments: [appointment, ...state.appointments],
        auditLogs: [audit, ...state.auditLogs],
      };
    }

    case "UPDATE_APPOINTMENT_STATUS": {
      const { appointmentId, status, audit } = action.payload;
      const nextAppointments = state.appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status } : apt
      );
      return {
        ...state,
        appointments: nextAppointments,
        auditLogs: audit ? [audit, ...state.auditLogs] : state.auditLogs,
      };
    }

    case "ADD_EMERGENCY_PATIENT": {
      const { emergency, audit } = action.payload;
      return {
        ...state,
        emergencies: [emergency, ...state.emergencies],
        auditLogs: [audit, ...state.auditLogs],
      };
    }

    case "RESOLVE_EMERGENCY_PATIENT": {
      const { id, status, audit } = action.payload;
      const nextEmergencies = state.emergencies.map((em) =>
        em.id === id ? { ...em, status } : em
      );
      return {
        ...state,
        emergencies: nextEmergencies,
        auditLogs: audit ? [audit, ...state.auditLogs] : state.auditLogs,
      };
    }

    case "COMPLETE_CONSULTATION": {
      const { consult, prescription, labOrder, medicalRecord, timeline, audit } = action.payload;
      const nextCompleted = [consult, ...state.completedConsults];
      const nextPrescriptions = prescription ? [prescription, ...state.prescriptions] : state.prescriptions;
      const nextLabOrders = labOrder ? [labOrder, ...state.labOrders] : state.labOrders;
      const nextMedicalRecords = medicalRecord ? [medicalRecord, ...state.medicalRecords] : state.medicalRecords;
      const nextTimeline = timeline ? [timeline, ...state.timelineEvents] : state.timelineEvents;

      const nextAppointments = state.appointments.map((apt) =>
        apt.token === consult.token || apt.name === consult.name
          ? { ...apt, status: "Completed" as const }
          : apt
      );

      return {
        ...state,
        completedConsults: nextCompleted,
        prescriptions: nextPrescriptions,
        labOrders: nextLabOrders,
        medicalRecords: nextMedicalRecords,
        timelineEvents: nextTimeline,
        appointments: nextAppointments,
        auditLogs: [audit, ...state.auditLogs],
      };
    }

    case "UPDATE_LAB_ORDER_STATUS": {
      const { sampleId, status, resultValue, normalRange, remarks, technicianName, alert, report, audit } = action.payload;
      const nextLabOrders = state.labOrders.map((ord) => {
        if (ord.sampleId === sampleId) {
          return {
            ...ord,
            status,
            resultValue: resultValue !== undefined ? resultValue : ord.resultValue,
            normalRange: normalRange !== undefined ? normalRange : ord.normalRange,
            remarks: remarks !== undefined ? remarks : ord.remarks,
            technicianName: technicianName !== undefined ? technicianName : ord.technicianName,
            completedTime: status === "Completed" ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ord.completedTime,
          };
        }
        return ord;
      });

      const nextAlerts = alert ? [alert, ...state.criticalAlerts] : state.criticalAlerts;
      const nextReports = report ? [report, ...state.recentReports] : state.recentReports;

      return {
        ...state,
        labOrders: nextLabOrders,
        criticalAlerts: nextAlerts,
        recentReports: nextReports,
        auditLogs: audit ? [audit, ...state.auditLogs] : state.auditLogs,
      };
    }

    case "DISPENSE_PRESCRIPTION": {
      const { prescriptionId, transaction, audit } = action.payload;
      const nextPrescriptions = state.prescriptions.map((rx) =>
        rx.id === prescriptionId ? { ...rx, status: "Dispensed" as const } : rx
      );

      const targetRx = state.prescriptions.find((rx) => rx.id === prescriptionId);
      let nextInventory = [...state.inventory];
      if (targetRx) {
        targetRx.drugs.forEach((drug) => {
          nextInventory = nextInventory.map((inv) => {
            if (inv.name.toLowerCase().includes(drug.drugName.toLowerCase().split(" ")[0]) && inv.quantity > 0) {
              const deduct = drug.qtyNeeded || 10;
              const nextQty = Math.max(0, inv.quantity - deduct);
              return {
                ...inv,
                quantity: nextQty,
                status: nextQty < 500 ? ("Low Stock" as const) : ("Optimal" as const),
              };
            }
            return inv;
          });
        });
      }

      return {
        ...state,
        prescriptions: nextPrescriptions,
        inventory: nextInventory,
        transactions: [transaction, ...state.transactions],
        auditLogs: audit ? [audit, ...state.auditLogs] : state.auditLogs,
      };
    }

    case "RESTOCK_INVENTORY": {
      const { medicineId, addQty, transaction, audit } = action.payload;
      const nextInventory = state.inventory.map((inv) => {
        if (inv.id === medicineId || inv.name === medicineId) {
          const newQty = inv.quantity + addQty;
          return {
            ...inv,
            quantity: newQty,
            status: newQty < 500 ? ("Low Stock" as const) : ("Optimal" as const),
          };
        }
        return inv;
      });

      return {
        ...state,
        inventory: nextInventory,
        transactions: [transaction, ...state.transactions],
        auditLogs: audit ? [audit, ...state.auditLogs] : state.auditLogs,
      };
    }

    case "ADD_NOTIFICATION": {
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    }

    case "MARK_NOTIFICATION_READ": {
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    }

    case "ADD_AUDIT_LOG": {
      return {
        ...state,
        auditLogs: [action.payload, ...state.auditLogs],
      };
    }

    case "UPDATE_PATIENT_PROFILE": {
      const { id, ...updates } = action.payload;
      return {
        ...state,
        patients: state.patients.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      };
    }

    case "SET_CURRENT_SIMULATED_PATIENT": {
      return {
        ...state,
        currentSimulatedPatientId: action.payload,
      };
    }

    case "SET_SIMULATION_RUNNING": {
      return {
        ...state,
        isSimulationRunning: action.payload,
      };
    }

    case "RESET_SIMULATION": {
      return {
        ...initialHospitalState,
      };
    }

    case "CREATE_STAFF_MEMBER": {
      const { staffMember, audit } = action.payload;
      return {
        ...state,
        staff: [...state.staff, staffMember],
        auditLogs: [audit, ...state.auditLogs],
      };
    }

    case "UPDATE_STAFF_MEMBER": {
      const { staffMember, audit } = action.payload;
      return {
        ...state,
        staff: state.staff.map((s) => (s.id === staffMember.id ? staffMember : s)),
        auditLogs: [audit, ...state.auditLogs],
      };
    }

    case "DELETE_STAFF_MEMBER": {
      const { id, audit } = action.payload;
      return {
        ...state,
        staff: state.staff.filter((s) => s.id !== id),
        auditLogs: [audit, ...state.auditLogs],
      };
    }

    case "TOGGLE_STAFF_STATUS": {
      const { id, audit } = action.payload;
      return {
        ...state,
        staff: state.staff.map((s) =>
          s.id === id
            ? { ...s, status: s.status === "Active" ? ("Inactive" as const) : ("Active" as const) }
            : s
        ),
        auditLogs: [audit, ...state.auditLogs],
      };
    }

    case "RESET_STAFF_PASSWORD": {
      const { id, passwordTemp, audit } = action.payload;
      return {
        ...state,
        staff: state.staff.map((s) =>
          s.id === id ? { ...s, passwordTemp } : s
        ),
        auditLogs: [audit, ...state.auditLogs],
      };
    }

    case "CREATE_DEPARTMENT": {
      const { department, audit } = action.payload;
      return {
        ...state,
        departments: [...state.departments, department],
        auditLogs: [audit, ...state.auditLogs],
      };
    }

    case "UPDATE_DEPARTMENT": {
      const { department, audit } = action.payload;
      return {
        ...state,
        departments: state.departments.map((d) => (d.id === department.id ? department : d)),
        auditLogs: [audit, ...state.auditLogs],
      };
    }

    case "REGISTER_DEVICE": {
      const { device, audit } = action.payload;
      return {
        ...state,
        devices: [...state.devices, device],
        auditLogs: [audit, ...state.auditLogs],
      };
    }

    case "UPDATE_DEVICE": {
      const { device, audit } = action.payload;
      return {
        ...state,
        devices: state.devices.map((d) => (d.id === device.id ? device : d)),
        auditLogs: [audit, ...state.auditLogs],
      };
    }

    case "UPDATE_HOSPITAL_CONFIG": {
      const { config, audit } = action.payload;
      return {
        ...state,
        hospitalConfig: config,
        auditLogs: [audit, ...state.auditLogs],
      };
    }

    default:
      return state;
  }
}
