import React, { useState } from "react";
import { 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  Activity, 
  ChevronUp, 
  X, 
  Sparkles,
  Clock
} from "lucide-react";
import { useHospital } from "../../context/useHospital";
import { createAuditLog } from "../../context/helpers";

export const DemoSimulation: React.FC = () => {
  const { state, dispatch } = useHospital();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [simulatingStep, setSimulatingStep] = useState<number | null>(null);
  const [simStatus, setSimStatus] = useState<string | null>(null);

  const handleReset = () => {
    if (confirm("Reset Hospital Simulation to initial dummy state?")) {
      dispatch({ type: "RESET_SIMULATION" });
      setSimStatus("Hospital simulation reset to clean baseline.");
      setTimeout(() => setSimStatus(null), 4000);
    }
  };

  const handleRunJourney = () => {
    setSimulatingStep(1);
    setSimStatus("Step 1/4: Registering Demo Patient 'Suman Oraon' at Reception...");

    // Step 1: Register Patient
    setTimeout(() => {
      const demoPatientId = `JHR-2026-SIM-${Math.floor(100 + Math.random() * 899)}`;
      const demoPatient = {
        id: demoPatientId,
        uhid: demoPatientId,
        name: "Suman Oraon (Demo Workflow)",
        gender: "Female",
        dob: "1994-05-12",
        age: 32,
        mobile: "9876543210",
        aadhaar: "XXXX-XXXX-4589",
        address: "Panigarha Village",
        district: "Gumla",
        state: "Jharkhand",
        bloodGroup: "B+",
        guardian: "Ramesh Oraon",
        emergencyContact: "Ramesh Oraon (9876543210)",
        scheme: "PM-JAY Ayushman Bharat",
        registeredAt: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      };

      const demoAptId = `APT-${Math.floor(900 + Math.random() * 99)}`;
      const demoApt = {
        id: demoAptId,
        patientId: demoPatientId,
        uhid: demoPatientId,
        name: demoPatient.name,
        phone: demoPatient.mobile,
        date: new Date().toISOString().split("T")[0],
        timeSlot: "11:00 AM",
        department: "General Medicine",
        doctor: "Dr. Priya Sharma (CMO)",
        room: "Room #3",
        token: "T-42",
        status: "Waiting" as const,
        createdAt: new Date().toISOString(),
      };

      dispatch({
        type: "REGISTER_PATIENT",
        payload: {
          patient: demoPatient,
          appointment: demoApt,
          audit: createAuditLog("reception", "Reception Desk", "PATIENT_REGISTERED", "Patient", demoPatientId, `Demo patient Suman Oraon registered with OPD token T-42`),
        },
      });

      setSimulatingStep(2);
      setSimStatus("Step 2/4: Doctor Priya Sharma completes consultation & orders Lab Test + Prescription...");

      // Step 2: Doctor Consultation
      setTimeout(() => {
        const consultId = `CON-${Math.floor(100 + Math.random() * 899)}`;
        const sampleId = `SMP-SIM-${Math.floor(10 + Math.random() * 89)}`;
        const rxId = `RX-SIM-${Math.floor(100 + Math.random() * 899)}`;

        dispatch({
          type: "COMPLETE_CONSULTATION",
          payload: {
            consult: {
              id: consultId,
              token: "T-42",
              name: demoPatient.name,
              uhid: demoPatientId,
              diagnosis: "Acute Viral Upper Respiratory Infection",
              time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
              doctor: "Dr. Priya Sharma (CMO)",
              department: "General Medicine",
            },
            prescription: {
              id: rxId,
              patientId: demoPatientId,
              uhid: demoPatientId,
              name: demoPatient.name,
              age: demoPatient.age,
              gender: demoPatient.gender,
              doctor: "Dr. Priya Sharma (CMO)",
              department: "General Medicine",
              date: new Date().toLocaleDateString(),
              priority: "Normal",
              status: "Pending",
              diagnosis: "Acute Viral Upper Respiratory Infection",
              allergies: "None",
              weight: "58 kg",
              bloodGroup: "B+",
              drugs: [
                {
                  drugName: "Azithromycin 500mg",
                  strength: "500mg",
                  dosage: "1 Tab",
                  frequency: "OD",
                  duration: "3 days",
                  qtyNeeded: 3,
                },
                {
                  drugName: "Paracetamol 650mg",
                  strength: "650mg",
                  dosage: "1 Tab",
                  frequency: "TDS",
                  duration: "5 days",
                  qtyNeeded: 15,
                },
              ],
            },
            labOrder: {
              sampleId: sampleId,
              patientId: demoPatientId,
              uhid: demoPatientId,
              name: demoPatient.name,
              testName: "Complete Blood Count (CBC)",
              doctor: "Dr. Priya Sharma (CMO)",
              collectionTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
              priority: "Normal",
              status: "Pending Collection",
              sampleType: "Blood",
            },
            audit: createAuditLog("doctor", "Dr. Priya Sharma", "CONSULTATION_COMPLETED", "Appointment", demoAptId, `Diagnosis recorded. Lab test ${sampleId} and Prescription ${rxId} generated.`),
          },
        });

        setSimulatingStep(3);
        setSimStatus("Step 3/4: Laboratory collects sample & verifies CBC result...");

        // Step 3: Lab Complete
        setTimeout(() => {
          dispatch({
            type: "UPDATE_LAB_ORDER_STATUS",
            payload: {
              sampleId: sampleId,
              status: "Completed",
              resultValue: "Hb: 12.8 g/dL, WBC: 7,400 /uL (Normal)",
              audit: createAuditLog("lab", "Laboratory Desk", "TESTING_COMPLETED", "LabOrder", sampleId, `CBC test verified normal for ${demoPatient.name}`),
            },
          });

          setSimulatingStep(4);
          setSimStatus("Step 4/4: Pharmacy dispenses prescribed medicines...");

          // Step 4: Pharmacy Dispense
          setTimeout(() => {
            dispatch({
              type: "DISPENSE_PRESCRIPTION",
              payload: {
                prescriptionId: rxId,
                transaction: {
                  id: `TX-SIM-${Math.floor(100 + Math.random() * 899)}`,
                  time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                  type: "Dispense",
                  refId: rxId,
                  details: `Dispensed Azithromycin & Paracetamol to ${demoPatient.name}`,
                },
                audit: createAuditLog("pharmacy", "Pharmacy Desk", "MEDICINE_DISPENSED", "Prescription", rxId, `Dispensed medicines to ${demoPatient.name}`),
              },
            });

            setSimulatingStep(null);
            setSimStatus("✅ Complete End-to-End Hospital Workflow Simulation finished!");
            setTimeout(() => setSimStatus(null), 6000);
          }, 1500);
        }, 1500);
      }, 1500);
    }, 800);
  };

  return (
    <>
      {/* Floating Action Bar */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {simStatus && (
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-medium flex items-center gap-2 max-w-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0 animate-pulse" />
            <span>{simStatus}</span>
          </div>
        )}

        {isOpen ? (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-80 sm:w-96 transition-all duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Hospital Workflow Simulator</h4>
                  <p className="text-[11px] text-slate-500">Live integration state control</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3.5 space-y-3">
              <button
                onClick={handleRunJourney}
                disabled={simulatingStep !== null}
                className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold text-xs shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Complete Patient Journey</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowAuditModal(true)}
                  className="py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Audit Logs ({state.auditLogs.length})</span>
                </button>

                <button
                  onClick={handleReset}
                  className="py-2 px-3 rounded-xl border border-rose-200 hover:border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>Reset State</span>
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Active Patients:</span>
                  <span className="font-bold text-slate-800">{state.patients.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">OPD Appointments:</span>
                  <span className="font-bold text-slate-800">{state.appointments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Lab Queue / Prescriptions:</span>
                  <span className="font-bold text-slate-800">{state.labOrders.length} / {state.prescriptions.length}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-full shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 transition-all hover:scale-105"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </span>
              <span>Hospital Simulation</span>
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        )}
      </div>

      {/* Audit Log Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden animate-fade-in">
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Hospital Central Audit Log</h3>
                  <p className="text-xs text-slate-500">Real-time trace of all departmental actions across CHC Bharno</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 px-6 space-y-2.5">
              {state.auditLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No audit trail recorded yet. Perform actions across dashboards to generate logs.
                </div>
              ) : (
                state.auditLogs.map((log) => (
                  <div 
                    key={log.id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold mt-0.5">
                        {log.actorRole.toUpperCase()}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{log.action}</span>
                          <span className="text-[11px] text-slate-400 font-mono">[{log.entityType}: {log.entityId}]</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{log.description}</p>
                        <span className="text-[10px] text-slate-400 mt-1 inline-block">Actor: {log.actorName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Total entries: {state.auditLogs.length}</span>
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                Close Trail
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
