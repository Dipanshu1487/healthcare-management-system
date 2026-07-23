import { useContext } from "react";
import { HospitalContext } from "./HospitalContext";
import type { HospitalContextType } from "./HospitalContext";

export function useHospital(): HospitalContextType {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
}
