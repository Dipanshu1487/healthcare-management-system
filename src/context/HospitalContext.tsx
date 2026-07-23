import React, { createContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { HospitalState, HospitalRole } from "./types";
import type { HospitalAction } from "./actions";
import { initialHospitalState } from "./initialData";
import { hospitalReducer } from "./reducer";
import { api } from "../services/api";

export interface HospitalContextType {
  state: HospitalState;
  dispatch: React.Dispatch<HospitalAction>;
  hasPermission: (role: HospitalRole, requiredPermissions: string[]) => boolean;
  syncDashboardKpis: () => Promise<void>;
}

export const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const ROLE_PERMISSIONS: Record<HospitalRole, string[]> = {
  admin: ["read:all", "write:all", "audit:view"],
  doctor: ["read:patients", "write:consultation", "write:prescription", "write:lab_order"],
  reception: ["read:patients", "write:patients", "write:appointment", "write:emergency"],
  lab: ["read:lab_orders", "write:lab_results"],
  pharmacy: ["read:prescriptions", "write:dispense", "read:inventory", "write:inventory"],
  patient: ["read:own_profile", "write:appointment_request"],
  "it-admin": ["read:all", "write:all", "audit:view", "manage:users", "manage:config", "manage:devices"],
};

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(hospitalReducer, initialHospitalState);

  const hasPermission = (role: HospitalRole, requiredPermissions: string[]): boolean => {
    const granted = ROLE_PERMISSIONS[role] || [];
    if (granted.includes("read:all") && granted.includes("write:all")) return true;
    return requiredPermissions.every((perm) => granted.includes(perm));
  };

  const syncDashboardKpis = async () => {
    try {
      const kpis = await api.request<{
        total_patients: number;
        active_doctors: number;
        pending_prescriptions: number;
        pending_lab_reports: number;
        today_appointments: number;
      }>("/dashboard/kpis");
      
      // Update statistics KPI values in state using context reducer
      dispatch({
        type: "ADD_AUDIT_LOG",
        payload: {
          id: "sys-sync",
          actorRole: "admin",
          actorName: "System",
          action: "SYNC_KPIS",
          entityType: "System",
          entityId: "dashboard",
          description: `Loaded ${kpis.total_patients} patients statistics from backend`,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error("Dashboard KPI sync failed", err);
    }
  };

  useEffect(() => {
    // Run initial sync on boot if session exists
    const token = localStorage.getItem("access_token");
    if (token) {
      syncDashboardKpis();
    }
  }, []);

  return (
    <HospitalContext.Provider value={{ state, dispatch, hasPermission, syncDashboardKpis }}>
      {children}
    </HospitalContext.Provider>
  );
};
