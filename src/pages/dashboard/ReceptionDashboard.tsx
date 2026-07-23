import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Users, 
  BedDouble, 
  Clock, 
  AlertCircle,
  Search,
  UserPlus,
  Ticket,
  Printer,
  Calendar,
  X,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  List,
  LayoutGrid
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useHospital } from "../../context/useHospital";
import { HospitalCalendar } from "../../components/dashboard/HospitalCalendar";
import type { CalendarEvent } from "../../components/dashboard/HospitalCalendar";
import { createAuditLog, generateId, getCurrentTimeFormatted } from "../../context/helpers";


const generateUHID = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `UHID-${dateStr}-${rand}`;
};

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface QueuePatient {
  token: string;
  name: string;
  age: number;
  gender: string;
  department: string;
  doctor: string;
  status: "Waiting" | "In Consultation" | "Completed";
  time: string;
  uhid?: string;
  triage?: "Critical" | "Severe" | "Minor";
}

interface Appointment {
  id: string;
  name: string;
  phone: string;
  timeSlot: string;
  date: string;
  department: string;
  doctor: string;
  status: "Scheduled" | "Checked In" | "Cancelled";
  gender?: string;
  age?: number;
}

interface EmergencyPatient {
  id: string;
  name: string;
  condition: string;
  triage: "Critical" | "Severe" | "Minor";
  time: string;
}

interface PatientRecord {
  uhid: string;
  name: string;
  gender: string;
  dob: string;
  age: number;
  mobile: string;
  aadhaar: string;
  address: string;
  district: string;
  state: string;
  bloodGroup: string;
  guardian: string;
  emergencyContact: string;
  scheme: string;
}

// ─── Initial Dummy Data ───────────────────────────────────────────────────────
const initialPatientsList: PatientRecord[] = [
  {
    uhid: "UHID-20260710-1001",
    name: "Suresh Oraon",
    gender: "Male",
    dob: "1984-04-12",
    age: 42,
    mobile: "9431011223",
    aadhaar: "123456789012",
    address: "Village Panigarha, Bharno",
    district: "Gumla",
    state: "Jharkhand",
    bloodGroup: "B+",
    guardian: "Budhu Oraon (Father)",
    emergencyContact: "Budhu Oraon (9431011223)",
    scheme: "PM-JAY (Ayushman Bharat)"
  },
  {
    uhid: "UHID-20260710-1002",
    name: "Anjali Devi",
    gender: "Female",
    dob: "1998-08-22",
    age: 28,
    mobile: "7488900123",
    aadhaar: "987654321098",
    address: "Near Block Office, Bharno Town",
    district: "Gumla",
    state: "Jharkhand",
    bloodGroup: "O+",
    guardian: "Ramesh Gope (Spouse)",
    emergencyContact: "Ramesh Gope (7488900123)",
    scheme: "PM-JAY (Ayushman Bharat)"
  },
  {
    uhid: "UHID-20260710-1003",
    name: "Bipin Kujur",
    gender: "Male",
    dob: "1976-12-05",
    age: 50,
    mobile: "9122344556",
    aadhaar: "456789012345",
    address: "Village Sisai, Gumla Road",
    district: "Gumla",
    state: "Jharkhand",
    bloodGroup: "AB+",
    guardian: "Mariam Kujur (Mother)",
    emergencyContact: "Mariam Kujur (9122344556)",
    scheme: "MSBY (Jharkhand State Scheme)"
  },
  {
    uhid: "UHID-20260710-1004",
    name: "Munni Kumari",
    gender: "Female",
    dob: "2021-03-15",
    age: 5,
    mobile: "9431055667",
    aadhaar: "789012345678",
    address: "Bharno Town, Gope Tola",
    district: "Gumla",
    state: "Jharkhand",
    bloodGroup: "A+",
    guardian: "Kundan Gope (Father)",
    emergencyContact: "Kundan Gope (9431055667)",
    scheme: "JSSK (Maternal Support)"
  },
  {
    uhid: "UHID-20260710-1005",
    name: "Ramesh Mahto",
    gender: "Male",
    dob: "1991-05-18",
    age: 35,
    mobile: "9934123456",
    aadhaar: "112233445566",
    address: "Village Panigarha, Tola 2",
    district: "Gumla",
    state: "Jharkhand",
    bloodGroup: "O-",
    guardian: "Sohan Mahto (Father)",
    emergencyContact: "Sohan Mahto (9934123456)",
    scheme: "None (General Cash)"
  }
];

const initialQueue: QueuePatient[] = [
  { token: "OPD-210", name: "Suresh Oraon", age: 42, gender: "Male", department: "General Medicine", doctor: "Dr. Priya Sharma", status: "Waiting", time: "09:15 AM", triage: "Minor" },
  { token: "OPD-211", name: "Anjali Devi", age: 28, gender: "Female", department: "Maternal & Child Health", doctor: "Dr. Kavita Devi", status: "In Consultation", time: "09:30 AM", triage: "Severe" },
  { token: "OPD-212", name: "Bipin Kujur", age: 50, gender: "Male", department: "Eye Care", doctor: "Dr. Meena Kumari", status: "Waiting", time: "09:45 AM", triage: "Minor" },
  { token: "OPD-213", name: "Munni Kumari", age: 5, gender: "Female", department: "Nutrition & Dietetics", doctor: "Dt. Preeti Singh", status: "Completed", time: "08:30 AM", triage: "Minor" },
  { token: "OPD-214", name: "Ramesh Mahto", age: 35, gender: "Male", department: "General Medicine", doctor: "Dr. Ramesh Gupta", status: "Waiting", time: "10:05 AM", triage: "Critical" },
];

const initialAppointments: Appointment[] = [
  { id: "APT-801", name: "Kiran Gope", phone: "+91 94310 88212", timeSlot: "10:30 AM", date: new Date().toISOString().slice(0, 10), department: "Dental Care", doctor: "Dr. Vijay Oraon", status: "Scheduled", gender: "Male", age: 32 },
  { id: "APT-802", name: "Sanjay Minz", phone: "+91 91223 44556", timeSlot: "11:00 AM", date: new Date().toISOString().slice(0, 10), department: "General Medicine", doctor: "Dr. Priya Sharma", status: "Scheduled", gender: "Male", age: 41 },
  { id: "APT-803", name: "Sunita Ekka", phone: "+91 74889 00123", timeSlot: "11:30 AM", date: new Date().toISOString().slice(0, 10), department: "Maternal & Child Health", doctor: "Dr. Rakesh Kumar", status: "Scheduled", gender: "Female", age: 29 },
];

const initialEmergencies: EmergencyPatient[] = [
  { id: "EMG-901", name: "Lalmohan Singh", condition: "Head Injury / Trauma", triage: "Critical", time: "10:15 AM" },
  { id: "EMG-902", name: "Phulo Devi", condition: "Severe Asthma Attack", triage: "Severe", time: "10:25 AM" },
];

const departments = [
  "General Medicine",
  "Maternal & Child Health",
  "Emergency & Trauma",
  "Dental Care",
  "Eye Care",
  "Nutrition & Dietetics",
  "Laboratory Services",
];

const doctorsByDept: Record<string, string[]> = {
  "General Medicine": ["Dr. Priya Sharma", "Dr. Ramesh Gupta", "Dr. Suresh Mahto"],
  "Maternal & Child Health": ["Dr. Rakesh Kumar", "Dr. Kavita Devi"],
  "Emergency & Trauma": ["Dr. Anita Singh", "Duty MO Available"],
  "Dental Care": ["Dr. Vijay Oraon", "Dr. Nisha Toppo"],
  "Eye Care": ["Dr. Meena Kumari"],
  "Nutrition & Dietetics": ["Dt. Preeti Singh"],
  "Laboratory Services": ["Dr. Arvind Munda"],
};

// ─── Reception Dashboard Component ───────────────────────────────────────────
const ReceptionDashboard: React.FC = () => {
  const { state, dispatch } = useHospital();
  const [activeTab, setActiveTab] = useState<"queue" | "register" | "appointments" | "search">("queue");

  const contextQueue: QueuePatient[] = state.appointments
    .filter((a) => a.status === "Waiting" || a.status === "Scheduled")
    .map((a) => ({
      token: a.token || "T-01",
      name: a.name,
      age: Number(a.age) || 35,
      gender: a.gender || "Male",
      department: a.department || "General Medicine",
      doctor: a.doctor || "Dr. Priya Sharma",
      status: (a.status as any) || "Waiting",
      time: a.timeSlot || "09:30 AM",
      uhid: a.uhid || "JHR-2026-00892",
      triage: (a.triage as any) || "Normal",
    }));
  const queue = contextQueue.length > 0 ? contextQueue : initialQueue;

  const appointments: Appointment[] = [
    ...state.appointments.map((a) => ({
      id: a.id,
      name: a.name,
      phone: a.phone || "+91 98000 00000",
      timeSlot: a.timeSlot,
      date: a.date,
      department: a.department,
      doctor: a.doctor,
      status: (a.status as any),
      gender: a.gender,
      age: Number(a.age) || 35,
    })),
    ...initialAppointments,
  ];

  const calendarEvents: CalendarEvent[] = (appointments || []).map((a: any) => {
    try {
      const dateStr = a.date || new Date().toISOString().slice(0, 10);
      const timeStr = a.timeSlot || "09:00 AM";
      const [year, month, day] = dateStr.split("-").map(Number);
      const [timeVal, modifier] = timeStr.split(" ");
      let [hours, minutes] = timeVal.split(":").map(Number);
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      
      const start = new Date(year, month - 1, day, hours, minutes);
      const end = new Date(start.getTime() + 15 * 60 * 1000);
      
      return {
        id: a.id || String(Math.random()),
        title: `${a.doctor} - ${a.name}`,
        subtitle: `${a.department} (${a.timeSlot})`,
        start,
        end,
        type: "appointment" as const,
        status: a.status
      };
    } catch (e) {
      return {
        id: a.id || String(Math.random()),
        title: a.name || "Appointment",
        start: new Date(),
        end: new Date(Date.now() + 15 * 60 * 1000),
        type: "appointment" as const
      };
    }
  });

  const emergencies: EmergencyPatient[] = [
    ...state.emergencies.map((e) => ({
      id: e.id,
      uhid: e.uhid,
      name: e.name,
      condition: e.condition,
      triage: (e.triage as any),
      time: e.time,
      status: e.status,
    })),
    ...initialEmergencies,
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const patientsList: PatientRecord[] = [
    ...state.patients.map((p) => ({
      uhid: p.uhid,
      name: p.name,
      gender: p.gender,
      dob: p.dob,
      age: p.age,
      mobile: p.mobile,
      aadhaar: p.aadhaar,
      address: p.address,
      district: p.district,
      state: p.state,
      bloodGroup: p.bloodGroup,
      guardian: `${p.guardian} (${p.guardianRelation})`,
      emergencyContact: p.emergencyContact,
      scheme: p.scheme,
    })),
    ...initialPatientsList,
  ];

  // Search state variables
  const [registrySearchQuery, setRegistrySearchQuery] = useState("");
  const [searchViewMode, setSearchViewMode] = useState<"table" | "card">("table");
  const [filterGender, setFilterGender] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("");
  const [filterScheme, setFilterScheme] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(["Suresh", "Anjali", "Bipin"]);

  // Patient Registration Form States
  const [regFullName, setRegFullName] = useState("");
  const [regGender, setRegGender] = useState("");
  const [regDOB, setRegDOB] = useState("");
  const [regAge, setRegAge] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regAltMobile, setRegAltMobile] = useState("");
  const [regAadhaar, setRegAadhaar] = useState("");
  const [regUHID, setRegUHID] = useState(() => generateUHID());
  const [regAddress, setRegAddress] = useState("");
  const [regDistrict, setRegDistrict] = useState("Gumla");
  const [regState, setRegState] = useState("Jharkhand");
  const [regBloodGroup, setRegBloodGroup] = useState("");
  const [regEmergencyName, setRegEmergencyName] = useState("");
  const [regEmergencyPhone, setRegEmergencyPhone] = useState("");
  const [regGuardianName, setRegGuardianName] = useState("");
  const [regGuardianRelation, setRegGuardianRelation] = useState("");
  const [regOccupation, setRegOccupation] = useState("");
  const [regGovScheme, setRegGovScheme] = useState("None (General Cash)");
  const [regType, setRegType] = useState("Walk-in Intake");
  const [regTriage, setRegTriage] = useState("Minor");

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDoc, setSelectedDoc] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Appointment Scheduler states
  const [aptName, setAptName] = useState("");
  const [aptPhone, setAptPhone] = useState("");
  const [aptGender, setAptGender] = useState("");
  const [aptAge, setAptAge] = useState("");
  const [aptDate, setAptDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [aptDept, setAptDept] = useState("");
  const [aptDoc, setAptDoc] = useState("");
  const [aptSlot, setAptSlot] = useState("");
  const [aptErrors, setAptErrors] = useState<Record<string, string>>({});
  
  // Active appointments list filters
  const [aptFilterStatus, setAptFilterStatus] = useState("");

  // Generated Token Modal State
  const [generatedToken, setGeneratedToken] = useState<QueuePatient | null>(null);

  // Success Registry Modal State
  const [successPatient, setSuccessPatient] = useState<any | null>(null);

  // Slides Drawer for Patient record summary
  const [selectedSummaryPatient, setSelectedSummaryPatient] = useState<PatientRecord | null>(null);

  // Bed Directory states
  const [bedAllocationOpen, setBedAllocationOpen] = useState(false);
  const [wardBeds, setWardBeds] = useState(() => 
    Array.from({ length: 30 }, (_, i) => ({ 
      id: i + 1, 
      occupied: i % 4 === 0,
      patientName: i % 4 === 0 ? "Occupied Bed" : "" 
    }))
  );

  // Lobby custom broadcast announcements
  const [customBroadcastText, setCustomBroadcastText] = useState("");

  // Stats
  const registeredCount = queue.length + 8;
  const waitingCount = queue.filter(p => p.status === "Waiting").length;
  const avgWaitTime = waitingCount * 12; // 12 mins per patient

  // Triage Color Map
  const getTriageCls = (triage: string) => {
    switch (triage) {
      case "Critical": return "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
      case "Severe": return "bg-orange-50 text-orange-700 border-orange-200";
      default: return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  // Actions
  // Actions
  const handleStatusChange = (token: string, newStatus: QueuePatient["status"]) => {
    const targetApt = state.appointments.find((a) => a.token === token);
    if (targetApt) {
      dispatch({
        type: "UPDATE_APPOINTMENT_STATUS",
        payload: {
          appointmentId: targetApt.id,
          status: newStatus as any,
          audit: createAuditLog("reception", "Reception Desk", "QUEUE_STATUS_CHANGE", "Appointment", targetApt.id, `Status updated to ${newStatus}`),
        },
      });
    }
  };

  const handleCheckInAppointment = (apt: Appointment) => {
    const nextTokenNum = 200 + queue.length + 15;
    const newToken: QueuePatient = {
      token: `OPD-${nextTokenNum}`,
      name: apt.name,
      age: apt.age || 30,
      gender: apt.gender || "Male",
      department: apt.department,
      doctor: apt.doctor,
      status: "Waiting",
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      triage: "Minor"
    };

    dispatch({
      type: "UPDATE_APPOINTMENT_STATUS",
      payload: {
        appointmentId: apt.id,
        status: "Waiting",
        audit: createAuditLog("reception", "Reception Desk", "APPOINTMENT_CHECKIN", "Appointment", apt.id, `Patient ${apt.name} checked in with token ${newToken.token}`),
      },
    });

    setGeneratedToken(newToken);
  };

  const handleCancelAppointment = (id: string) => {
    dispatch({
      type: "UPDATE_APPOINTMENT_STATUS",
      payload: {
        appointmentId: id,
        status: "Cancelled",
        audit: createAuditLog("reception", "Reception Desk", "APPOINTMENT_CANCELLED", "Appointment", id, "Appointment cancelled"),
      },
    });
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!aptName.trim()) newErrors.name = "Name is required";
    if (!aptPhone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(aptPhone.trim())) newErrors.phone = "Phone must be 10 digits";
    
    if (!aptGender) newErrors.gender = "Gender is required";
    if (!aptAge.trim()) newErrors.age = "Age is required";
    if (!aptDate) newErrors.date = "Date is required";
    if (!aptDept) newErrors.dept = "Department is required";
    if (!aptDoc) newErrors.doc = "Doctor is required";
    if (!aptSlot) newErrors.slot = "Please select a time slot";

    if (Object.keys(newErrors).length > 0) {
      setAptErrors(newErrors);
      return;
    }

    setAptErrors({});
    const newAptId = `APT-${800 + appointments.length + 10}`;

    dispatch({
      type: "BOOK_APPOINTMENT",
      payload: {
        appointment: {
          id: newAptId,
          patientId: generateId("PAT"),
          uhid: generateUHID(),
          name: aptName,
          phone: aptPhone,
          gender: aptGender as any,
          age: parseInt(aptAge),
          date: aptDate,
          timeSlot: aptSlot,
          department: aptDept,
          doctor: aptDoc,
          room: "OPD Room",
          token: `OPD-${800 + appointments.length + 10}`,
          status: "Scheduled",
          priority: "Normal",
          symptoms: "Booked Appointment",
          triage: "Routine",
          createdAt: getCurrentTimeFormatted(),
        },
        audit: createAuditLog("reception", "Reception Desk", "APPOINTMENT_BOOKED", "Appointment", newAptId, `Booked appointment for ${aptName}`),
      },
    });

    // Reset fields
    setAptName("");
    setAptPhone("");
    setAptGender("");
    setAptAge("");
    setAptSlot("");
    alert(`Appointment successfully scheduled for ${aptName} on ${aptDate} at ${aptSlot}.`);
  };

  const getSlotStatus = (doc: string, date: string, slot: string) => {
    const matched = appointments.find(a => a.doctor === doc && a.date === date && a.timeSlot === slot);
    if (matched) {
      if (matched.status === "Checked In") return "checked-in";
      if (matched.status === "Cancelled") return "available";
      return "booked";
    }
    // Static hashes to make scheduling board feel authentic
    const hash = (doc.length + date.length + slot.length) % 6;
    if (hash === 1) return "booked";
    if (hash === 3) return "checked-in";
    return "available";
  };

  const timeSlotsList = [
    "09:00 AM", "09:15 AM", "09:30 AM", "09:45 AM",
    "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
    "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
    "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM"
  ];

  const handleDOBChange = (dobVal: string) => {
    setRegDOB(dobVal);
    if (!dobVal) {
      setRegAge("");
      return;
    }
    const birthDate = new Date(dobVal);
    const today = new Date();
    let ageVal = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      ageVal--;
    }
    setRegAge(ageVal >= 0 ? ageVal.toString() : "0");
  };

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validations
    if (!regFullName.trim()) newErrors.regFullName = "Full Name is required";
    else if (!/^[A-Za-z\s]+$/.test(regFullName.trim())) newErrors.regFullName = "Name must contain letters only";
    
    if (!regGender) newErrors.regGender = "Gender is required";
    if (!regDOB) newErrors.regDOB = "Date of Birth is required";
    if (!regMobile.trim()) newErrors.regMobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(regMobile.trim())) newErrors.regMobile = "Mobile must be exactly 10 digits";

    if (regAltMobile.trim() && !/^\d{10}$/.test(regAltMobile.trim())) {
      newErrors.regAltMobile = "Alternate mobile must be 10 digits";
    }

    if (!regAadhaar.trim()) newErrors.regAadhaar = "Aadhaar number is required";
    else if (!/^\d{12}$/.test(regAadhaar.trim())) newErrors.regAadhaar = "Aadhaar must be exactly 12 digits";

    if (!regAddress.trim()) newErrors.regAddress = "Address is required";
    if (!regDistrict.trim()) newErrors.regDistrict = "District is required";
    if (!regState.trim()) newErrors.regState = "State is required";
    if (!regBloodGroup) newErrors.regBloodGroup = "Blood Group is required";

    if (!regEmergencyName.trim()) newErrors.regEmergencyName = "Emergency Contact Name is required";
    if (!regEmergencyPhone.trim()) newErrors.regEmergencyPhone = "Emergency Phone is required";
    else if (!/^\d{10}$/.test(regEmergencyPhone.trim())) newErrors.regEmergencyPhone = "Emergency Phone must be 10 digits";

    if (!regGuardianName.trim()) newErrors.regGuardianName = "Guardian Name is required";
    if (!regGuardianRelation) newErrors.regGuardianRelation = "Relation is required";

    if (!selectedDept) newErrors.selectedDept = "Specialty Department is required";
    if (!selectedDoc) newErrors.selectedDoc = "Assigned Doctor is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const tokenNumber = 200 + queue.length + 16;
    const nextToken = `OPD-${tokenNumber}`;
    const newTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const newRecord = {
      id: generateId("PAT"),
      uhid: regUHID,
      name: regFullName,
      gender: regGender as any,
      dob: regDOB,
      age: parseInt(regAge),
      mobile: regMobile,
      aadhaar: regAadhaar,
      address: regAddress,
      district: regDistrict,
      state: regState,
      bloodGroup: regBloodGroup,
      guardian: `${regGuardianName} (${regGuardianRelation})`,
      emergencyContact: `${regEmergencyName} (${regEmergencyPhone})`,
      scheme: regGovScheme,
      registeredAt: newTime,
    };

    const newAppointment = {
      id: generateId("APT"),
      patientId: newRecord.id,
      uhid: regUHID,
      name: regFullName,
      phone: regMobile,
      gender: regGender as any,
      age: parseInt(regAge),
      date: new Date().toISOString().split("T")[0],
      timeSlot: newTime,
      department: selectedDept,
      doctor: selectedDoc,
      room: "OPD Room",
      token: nextToken,
      status: "Waiting" as const,
      priority: regTriage === "Severe" || regTriage === "Critical" ? ("Urgent" as const) : ("Normal" as const),
      symptoms: `${regType} — Triage: ${regTriage}`,
      triage: regTriage,
      createdAt: newTime,
    };

    dispatch({
      type: "REGISTER_PATIENT",
      payload: {
        patient: newRecord,
        appointment: newAppointment,
        audit: createAuditLog(
          "reception",
          "Reception Desk",
          "PATIENT_REGISTERED",
          "Patient",
          newRecord.id,
          `Registered patient ${regFullName} (UHID: ${regUHID}) with token ${nextToken}`
        ),
      },
    });

    // Set success modal state
    setSuccessPatient({
      uhid: regUHID,
      name: regFullName,
      gender: regGender,
      dob: regDOB,
      age: parseInt(regAge),
      mobile: regMobile,
      altMobile: regAltMobile,
      aadhaar: regAadhaar,
      address: regAddress,
      district: regDistrict,
      state: regState,
      bloodGroup: regBloodGroup,
      guardian: `${regGuardianName} (${regGuardianRelation})`,
      emergencyContact: `${regEmergencyName} (${regEmergencyPhone})`,
      scheme: regGovScheme,
      regType: regType,
      triage: regTriage,
      department: selectedDept,
      doctor: selectedDoc,
      token: nextToken,
      time: newTime
    });

    // Reset Form & Generate new UHID for next time
    handleResetForm();
  };

  const handleRegistrySearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrySearchQuery.trim()) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== registrySearchQuery.trim().toLowerCase());
      return [registrySearchQuery.trim(), ...filtered].slice(0, 4);
    });
  };

  const handleRecentSearchClick = (query: string) => {
    setRegistrySearchQuery(query);
  };

  const handleResetForm = () => {
    setRegFullName("");
    setRegGender("");
    setRegDOB("");
    setRegAge("");
    setRegMobile("");
    setRegAltMobile("");
    setRegAadhaar("");
    setRegUHID(generateUHID());
    setRegAddress("");
    setRegDistrict("Gumla");
    setRegState("Jharkhand");
    setRegBloodGroup("");
    setRegEmergencyName("");
    setRegEmergencyPhone("");
    setRegGuardianName("");
    setRegGuardianRelation("");
    setRegOccupation("");
    setRegGovScheme("None (General Cash)");
    setRegType("Walk-in Intake");
    setRegTriage("Minor");
    setSelectedDept("");
    setSelectedDoc("");
    setErrors({});
  };

  // Emergency Intake Quick Registration
  const handleEmergencyIntake = () => {
    const nextTokenNum = 900 + emergencies.length + 1;
    const newEmgId = `EMG-${nextTokenNum}`;
    dispatch({
      type: "ADD_EMERGENCY_PATIENT",
      payload: {
        emergency: {
          id: newEmgId,
          uhid: generateUHID(),
          name: `Emergency Patient #${nextTokenNum}`,
          condition: "Severe Trauma / Unresponsive",
          triage: "Critical (Red)",
          time: getCurrentTimeFormatted(),
          status: "Active",
        },
        audit: createAuditLog("reception", "Reception Desk", "EMERGENCY_ADMISSION", "Emergency", newEmgId, `Intake Emergency Patient #${nextTokenNum}`),
      },
    });
  };

  const handleResolveEmergency = (id: string) => {
    dispatch({
      type: "RESOLVE_EMERGENCY_PATIENT",
      payload: {
        id,
        status: "Stabilized",
        audit: createAuditLog("reception", "Reception Desk", "EMERGENCY_RESOLVED", "Emergency", id, "Resolved emergency status"),
      },
    });
  };

  const handleCallPatient = (p: QueuePatient) => {
    // Voice speech synthesis announcement
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance();
      speech.text = `Attention please. Patient ${p.name}, token number ${p.token}, please proceed to doctor ${p.doctor} in department ${p.department}.`;
      
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.includes("en-IN") || v.lang.includes("en-US")) || voices[0];
      if (englishVoice) {
        speech.voice = englishVoice;
      }
      
      speech.rate = 0.85;
      window.speechSynthesis.speak(speech);
    } else {
      alert(`Browser Speech Synthesis is not supported. Simulated Call: Patient ${p.name} (${p.token}) to Chamber ${p.doctor}.`);
    }

    // Move state to Consultation
    handleStatusChange(p.token, "In Consultation");
  };

  const triagePriority = {
    "Critical": 1,
    "Severe": 2,
    "Minor": 3
  };

  const getTriageWeight = (triage?: string) => {
    if (!triage) return 3;
    return triagePriority[triage as keyof typeof triagePriority] || 3;
  };

  // Search filter and Priority sort (Critical -> Severe -> Minor -> FIFO order)
  const filteredQueue = queue
    .filter(
      p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
           p.department.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Completed goes to the bottom
      if (a.status === "Completed" && b.status !== "Completed") return 1;
      if (a.status !== "Completed" && b.status === "Completed") return -1;

      const weightA = getTriageWeight(a.triage);
      const weightB = getTriageWeight(b.triage);
      if (weightA !== weightB) {
        return weightA - weightB;
      }
      
      // Secondary: FIFO (smaller token numbers first)
      return a.token.localeCompare(b.token);
    });

  return (
    <>
      <Helmet>
        <title>Reception Dashboard — CHC Bharno HMS</title>
      </Helmet>

      <div className="space-y-6">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-800">Reception desk & OPD Intake</h1>
            <p className="text-slate-500 text-xs mt-0.5">Manage daily patient triage, token printing, and queue logistics.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-3.5 py-2 rounded-xl animate-pulse">
              <AlertCircle size={14} className="text-rose-500" />
              <span>{emergencies.length} Critical Triage Alerts</span>
            </span>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Users size={20} />
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                Active Desk
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-800">{registeredCount}</h3>
              <p className="text-xs text-slate-500 mt-1">Patients Registered Today</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock size={20} />
              </div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                Queue Size
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-800">{waitingCount}</h3>
              <p className="text-xs text-slate-500 mt-1">Waiting in OPD Queue</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                <Ticket size={20} />
              </div>
              <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-100">
                Lobby Load
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-800">
                {queue.filter(p => p.status === "In Consultation").length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Active Consultations</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Clock size={20} />
              </div>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                Lobby Service
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold font-display text-slate-800">{avgWaitTime} mins</h3>
              <p className="text-xs text-slate-500 mt-1">Estimated Wait Time</p>
            </div>
          </div>
        </div>

        {/* ── Triage Live Tally Desk Strip ── */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse block"></span>
            <span className="text-xs font-bold text-slate-700">OPD Live Triage Dispatch Board</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-100 rounded-xl">
              <span className="text-[10px] font-extrabold text-rose-600">CRITICAL:</span>
              <span className="text-xs font-black text-rose-750">{queue.filter(p => p.status === "Waiting" && p.triage === "Critical").length}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-100 rounded-xl">
              <span className="text-[10px] font-extrabold text-orange-600">SEVERE:</span>
              <span className="text-xs font-black text-orange-750">{queue.filter(p => p.status === "Waiting" && p.triage === "Severe").length}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-100 rounded-xl">
              <span className="text-[10px] font-extrabold text-yellow-600">MINOR:</span>
              <span className="text-xs font-black text-yellow-750">{queue.filter(p => p.status === "Waiting" && p.triage === "Minor").length}</span>
            </div>
          </div>
        </div>

        {/* ── Main Dashboard Layout Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Panel: Primary Desk Controls */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between min-h-[500px]">
            <div>
              {/* Toolbar Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-5 gap-3">
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                  <button
                    onClick={() => setActiveTab("queue")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      activeTab === "queue" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    OPD Queue Desk
                  </button>
                  <button
                    onClick={() => setActiveTab("register")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      activeTab === "register" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    Patient Registration
                  </button>
                  <button
                    onClick={() => setActiveTab("search")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      activeTab === "search" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    Patient Search
                  </button>
                  <button
                    onClick={() => setActiveTab("appointments")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      activeTab === "appointments" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    Appointments ({appointments.length})
                  </button>
                </div>

                {activeTab === "queue" && (
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search queue by token/patient/specialty..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                )}
              </div>

              {/* ── Tab: Live Queue Table ── */}
              {activeTab === "queue" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400">
                        <th className="pb-3 font-semibold">Token</th>
                        <th className="pb-3 font-semibold">Patient Name</th>
                        <th className="pb-3 font-semibold text-center">Triage Priority</th>
                        <th className="pb-3 font-semibold">Department</th>
                        <th className="pb-3 font-semibold">Assigned Doctor</th>
                        <th className="pb-3 font-semibold">Time</th>
                        <th className="pb-3 font-semibold text-center">Status</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredQueue.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400">
                            No patients found in queue matching search.
                          </td>
                        </tr>
                      ) : (
                        filteredQueue.map(p => (
                          <tr key={p.token} className="hover:bg-slate-50/40 transition-colors">
                            <td className="py-3 font-bold text-slate-800">{p.token}</td>
                            <td className="py-3">
                              <button
                                type="button"
                                onClick={() => {
                                  const match = patientsList.find(pat => pat.name === p.name);
                                  if (match) {
                                    setSelectedSummaryPatient(match);
                                  } else {
                                    setSelectedSummaryPatient({
                                      uhid: p.uhid || "UHID-20260710-0999",
                                      name: p.name,
                                      gender: p.gender,
                                      dob: `${parseInt(new Date().getFullYear().toString()) - p.age}-01-01`,
                                      age: p.age,
                                      mobile: "9431011223",
                                      aadhaar: "000000000000",
                                      address: "Panigarha Village, Bharno Block",
                                      district: "Gumla",
                                      state: "Jharkhand",
                                      bloodGroup: "O+",
                                      guardian: "Guardian Caretaker",
                                      emergencyContact: "Guardian Caretaker (9431011223)",
                                      scheme: "None (General Cash)"
                                    });
                                  }
                                }}
                                className="hover:underline text-left block font-bold text-slate-700 hover:text-blue-600 transition-colors"
                                title="Click to view full patient health details summary"
                              >
                                {p.name}
                              </button>
                              <div className="text-[10px] text-slate-400 mt-0.5">{p.age} yrs · {p.gender}</div>
                            </td>
                            <td className="py-3 text-center">
                              <span className={cn(
                                "inline-block px-2 py-0.5 rounded text-[9px] font-extrabold border tracking-wider uppercase",
                                p.triage === "Critical" ? "bg-rose-50 text-rose-700 border-rose-100 animate-pulse" :
                                p.triage === "Severe" ? "bg-orange-50 text-orange-700 border-orange-100" :
                                "bg-yellow-50 text-yellow-750 border-yellow-100"
                              )}>
                                {p.triage || "Minor"}
                              </span>
                            </td>
                            <td className="py-3 text-slate-500 font-semibold">{p.department}</td>
                            <td className="py-3 text-slate-500">{p.doctor}</td>
                            <td className="py-3 text-slate-400">{p.time}</td>
                            <td className="py-3 text-center">
                              <span className={cn(
                                "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                                p.status === "Waiting" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                p.status === "In Consultation" ? "bg-blue-50 text-blue-700 border-blue-100" :
                                "bg-emerald-50 text-emerald-700 border-emerald-100"
                              )}>
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {p.status === "Waiting" && (
                                  <button
                                    onClick={() => handleCallPatient(p)}
                                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold transition-all flex items-center gap-1 shadow-xs"
                                    title="Call patient visually and read out their name"
                                  >
                                    <Volume2 size={12} />
                                    Call Out
                                  </button>
                                )}
                                {p.status === "In Consultation" && (
                                  <button
                                    onClick={() => handleStatusChange(p.token, "Completed")}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold transition-all"
                                  >
                                    Complete
                                  </button>
                                )}
                                <button
                                  onClick={() => setGeneratedToken(p)}
                                  className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all"
                                  title="Print Token Slip"
                                >
                                  <Printer size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── Tab: Patient Intake Registration Form ── */}
              {activeTab === "register" && (
                <form onSubmit={handleRegisterPatient} className="space-y-6 animate-fade-in-up">
                  
                  {/* Card Section 1: Demographics */}
                  <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <UserPlus size={14} className="text-blue-600" />
                        1. Patient Personal Details
                      </h3>
                      <span className="text-[10px] text-slate-400 bg-slate-100 border border-slate-200 rounded px-2 py-0.5 font-bold">
                        UHID: {regUHID}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Deepak Kumar"
                          value={regFullName}
                          onChange={e => setRegFullName(e.target.value)}
                          className={cn(
                            "w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                            errors.regFullName ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        />
                        {errors.regFullName && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.regFullName}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Gender *</label>
                        <select
                          value={regGender}
                          onChange={e => setRegGender(e.target.value)}
                          className={cn(
                            "w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white",
                            errors.regGender ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        >
                          <option value="">Select</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                        {errors.regGender && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.regGender}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Date of Birth *</label>
                        <input
                          type="date"
                          value={regDOB}
                          onChange={e => handleDOBChange(e.target.value)}
                          className={cn(
                            "w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-semibold",
                            errors.regDOB ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        />
                        {errors.regDOB && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.regDOB}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Age (Auto-calculated)</label>
                        <input
                          type="text"
                          readOnly
                          placeholder="Age in Years"
                          value={regAge}
                          className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-xl text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Blood Group *</label>
                        <select
                          value={regBloodGroup}
                          onChange={e => setRegBloodGroup(e.target.value)}
                          className={cn(
                            "w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white",
                            errors.regBloodGroup ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        >
                          <option value="">Select</option>
                          <option>A+</option>
                          <option>A-</option>
                          <option>B+</option>
                          <option>B-</option>
                          <option>AB+</option>
                          <option>AB-</option>
                          <option>O+</option>
                          <option>O-</option>
                        </select>
                        {errors.regBloodGroup && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.regBloodGroup}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Card Section 2: Contact & Identity */}
                  <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <Clock size={14} className="text-teal-600" />
                      2. Contact & Identity Records
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Mobile Number *</label>
                        <input
                          type="text"
                          maxLength={10}
                          placeholder="10-digit Mobile"
                          value={regMobile}
                          onChange={e => setRegMobile(e.target.value.replace(/\D/g, ""))}
                          className={cn(
                            "w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                            errors.regMobile ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        />
                        {errors.regMobile && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.regMobile}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Alternate Mobile</label>
                        <input
                          type="text"
                          maxLength={10}
                          placeholder="Alternate Mobile"
                          value={regAltMobile}
                          onChange={e => setRegAltMobile(e.target.value.replace(/\D/g, ""))}
                          className={cn(
                            "w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                            errors.regAltMobile ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        />
                        {errors.regAltMobile && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.regAltMobile}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Aadhaar Number *</label>
                        <input
                          type="text"
                          maxLength={12}
                          placeholder="12-digit Aadhaar"
                          value={regAadhaar}
                          onChange={e => setRegAadhaar(e.target.value.replace(/\D/g, ""))}
                          className={cn(
                            "w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                            errors.regAadhaar ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        />
                        {errors.regAadhaar && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.regAadhaar}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Residential Address *</label>
                        <input
                          type="text"
                          placeholder="House No, Village, Block, Landmark..."
                          value={regAddress}
                          onChange={e => setRegAddress(e.target.value)}
                          className={cn(
                            "w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                            errors.regAddress ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        />
                        {errors.regAddress && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.regAddress}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Occupation</label>
                        <input
                          type="text"
                          placeholder="e.g. Farmer, Student"
                          value={regOccupation}
                          onChange={e => setRegOccupation(e.target.value)}
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">District *</label>
                        <input
                          type="text"
                          placeholder="District"
                          value={regDistrict}
                          onChange={e => setRegDistrict(e.target.value)}
                          className={cn(
                            "w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                            errors.regDistrict ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        />
                        {errors.regDistrict && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.regDistrict}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">State *</label>
                        <input
                          type="text"
                          placeholder="State"
                          value={regState}
                          onChange={e => setRegState(e.target.value)}
                          className={cn(
                            "w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                            errors.regState ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        />
                        {errors.regState && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.regState}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Card Section 3: Guardian & Emergency Care */}
                  <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <AlertCircle size={14} className="text-rose-600" />
                      3. Guardian & Emergency Contacts
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Guardian Full Name *</label>
                        <input
                          type="text"
                          placeholder="Guardian Name"
                          value={regGuardianName}
                          onChange={e => setRegGuardianName(e.target.value)}
                          className={cn(
                            "w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                            errors.regGuardianName ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        />
                        {errors.regGuardianName && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.regGuardianName}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Guardian Relation *</label>
                        <select
                          value={regGuardianRelation}
                          onChange={e => setRegGuardianRelation(e.target.value)}
                          className={cn(
                            "w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white",
                            errors.regGuardianRelation ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        >
                          <option value="">Select Relation</option>
                          <option>Father</option>
                          <option>Mother</option>
                          <option>Spouse</option>
                          <option>Sibling</option>
                          <option>Son</option>
                          <option>Daughter</option>
                          <option>Other / Legal Guardian</option>
                        </select>
                        {errors.regGuardianRelation && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.regGuardianRelation}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Emergency Contact Person *</label>
                        <input
                          type="text"
                          placeholder="Emergency Contact Name"
                          value={regEmergencyName}
                          onChange={e => setRegEmergencyName(e.target.value)}
                          className={cn(
                            "w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                            errors.regEmergencyName ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        />
                        {errors.regEmergencyName && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.regEmergencyName}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Emergency Contact Mobile *</label>
                        <input
                          type="text"
                          maxLength={10}
                          placeholder="Emergency Contact Phone"
                          value={regEmergencyPhone}
                          onChange={e => setRegEmergencyPhone(e.target.value.replace(/\D/g, ""))}
                          className={cn(
                            "w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                            errors.regEmergencyPhone ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        />
                        {errors.regEmergencyPhone && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.regEmergencyPhone}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Card Section 4: Schemes & Duty Assignment */}
                  <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-1.5">
                      <Ticket size={14} className="text-purple-600" />
                      4. Government Schemes & OPD Assignment
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Government Health Scheme</label>
                        <select
                          value={regGovScheme}
                          onChange={e => setRegGovScheme(e.target.value)}
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                        >
                          <option>None (General Cash)</option>
                          <option>PM-JAY (Ayushman Bharat)</option>
                          <option>MSBY (Jharkhand State Scheme)</option>
                          <option>JSSK (Maternal Support)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Registration Type</label>
                        <select
                          value={regType}
                          onChange={e => setRegType(e.target.value)}
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                        >
                          <option>Walk-in Intake</option>
                          <option>Pre-booked Appointment</option>
                          <option>Outreach Camp Referral</option>
                          <option>Inter-hospital Transfer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-550 mb-1.5">Triage Severity *</label>
                        <select
                          value={regTriage}
                          onChange={e => setRegTriage(e.target.value)}
                          className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                        >
                          <option>Minor</option>
                          <option>Severe</option>
                          <option>Critical</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Specialty Department *</label>
                        <select
                          value={selectedDept}
                          onChange={e => {
                            setSelectedDept(e.target.value);
                            setSelectedDoc("");
                          }}
                          className={cn(
                            "w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white",
                            errors.selectedDept ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        >
                          <option value="">Select Specialty</option>
                          {departments.map(d => <option key={d}>{d}</option>)}
                        </select>
                        {errors.selectedDept && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.selectedDept}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Assigned Duty Doctor *</label>
                        <select
                          value={selectedDoc}
                          disabled={!selectedDept}
                          onChange={e => setSelectedDoc(e.target.value)}
                          className={cn(
                            "w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400",
                            errors.selectedDoc ? "border-rose-350 ring-2 ring-rose-100" : "border-slate-200"
                          )}
                        >
                          <option value="">Select Doctor</option>
                          {selectedDept && doctorsByDept[selectedDept]?.map(doc => <option key={doc}>{doc}</option>)}
                        </select>
                        {errors.selectedDoc && <p className="text-[10px] text-rose-600 mt-1 font-medium">{errors.selectedDoc}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="btn-outline px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 border-slate-200"
                    >
                      Reset Form
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("queue")}
                      className="btn-outline px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 border-slate-200 hover:text-slate-750"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                    >
                      <UserPlus size={14} />
                      Submit Patient Registry
                    </button>
                  </div>
                </form>
              )}

              {/* ── Tab: Patient Registry Search Directory ── */}
              {activeTab === "search" && (
                <div className="space-y-5 animate-fade-in-up">
                  
                  {/* Search bar and View controls row */}
                  <form onSubmit={handleRegistrySearchSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-end">
                      
                      <div className="flex-1 w-full">
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Search Patient Registry</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                          <input
                            type="text"
                            placeholder="Search by UHID, Name, Mobile, or Aadhaar..."
                            value={registrySearchQuery}
                            onChange={e => setRegistrySearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50/20 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          type="submit"
                          className="btn-primary py-2 px-5 rounded-xl text-xs font-bold shadow-sm h-9 flex-1 sm:flex-none"
                        >
                          Search
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRegistrySearchQuery("");
                            setFilterGender("");
                            setFilterBloodGroup("");
                            setFilterScheme("");
                          }}
                          className="btn-outline px-4 py-2 rounded-xl text-xs font-bold text-slate-500 border-slate-200 h-9"
                        >
                          Clear
                        </button>
                      </div>

                    </div>

                    {/* Filters Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-450 mb-1">Filter Gender</label>
                        <select
                          value={filterGender}
                          onChange={e => setFilterGender(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                        >
                          <option value="">All Genders</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-450 mb-1">Filter Blood Group</label>
                        <select
                          value={filterBloodGroup}
                          onChange={e => setFilterBloodGroup(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                        >
                          <option value="">All Blood Groups</option>
                          <option>A+</option>
                          <option>A-</option>
                          <option>B+</option>
                          <option>B-</option>
                          <option>AB+</option>
                          <option>AB-</option>
                          <option>O+</option>
                          <option>O-</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-450 mb-1">Filter Scheme</label>
                        <select
                          value={filterScheme}
                          onChange={e => setFilterScheme(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                        >
                          <option value="">All Schemes</option>
                          <option value="Ayushman">PM-JAY (Ayushman)</option>
                          <option value="MSBY">MSBY</option>
                          <option value="JSSK">JSSK</option>
                          <option value="None">None (Cash)</option>
                        </select>
                      </div>

                      <div className="flex flex-col justify-end">
                        <label className="block text-[10px] font-semibold text-slate-450 mb-1">View Format</label>
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-0.5 rounded-lg w-full h-8">
                          <button
                            type="button"
                            onClick={() => setSearchViewMode("table")}
                            className={cn(
                              "flex-1 h-full rounded flex items-center justify-center gap-1 text-[11px] font-bold transition-all",
                              searchViewMode === "table" ? "bg-white text-blue-600 shadow-sm" : "text-slate-550"
                            )}
                          >
                            <List size={12} />
                            Table
                          </button>
                          <button
                            type="button"
                            onClick={() => setSearchViewMode("card")}
                            className={cn(
                              "flex-1 h-full rounded flex items-center justify-center gap-1 text-[11px] font-bold transition-all",
                              searchViewMode === "card" ? "bg-white text-blue-600 shadow-sm" : "text-slate-550"
                            )}
                          >
                            <LayoutGrid size={12} />
                            Cards
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Recent Searches logged */}
                  {recentSearches.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-450 font-medium">
                      <span>Recent queries:</span>
                      {recentSearches.map((query, i) => (
                        <button
                          key={i}
                          onClick={() => handleRecentSearchClick(query)}
                          className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-600 font-semibold transition-colors"
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Search Results Display */}
                  <div className="border-t border-slate-100 pt-3">
                    {(() => {
                      const q = registrySearchQuery.toLowerCase().trim();
                      const filteredPatients = patientsList.filter(p => {
                        const matchesQuery = !q || 
                          p.name.toLowerCase().includes(q) ||
                          p.uhid.toLowerCase().includes(q) ||
                          p.mobile.includes(q) ||
                          p.aadhaar.includes(q);

                        const matchesGender = !filterGender || p.gender === filterGender;
                        const matchesBloodGroup = !filterBloodGroup || p.bloodGroup === filterBloodGroup;
                        const matchesScheme = !filterScheme || p.scheme.includes(filterScheme);

                        return matchesQuery && matchesGender && matchesBloodGroup && matchesScheme;
                      });

                      if (filteredPatients.length === 0) {
                        return (
                          <div className="text-center py-12 text-slate-400 text-xs">
                            No registered patients matching query search or filters.
                          </div>
                        );
                      }

                      return searchViewMode === "table" ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                                <th className="pb-3 font-semibold">UHID</th>
                                <th className="pb-3 font-semibold">Patient Name</th>
                                <th className="pb-3 font-semibold">Age/Gender</th>
                                <th className="pb-3 font-semibold">Mobile</th>
                                <th className="pb-3 font-semibold text-center">Aadhaar</th>
                                <th className="pb-3 font-semibold">Health Scheme</th>
                                <th className="pb-3 font-semibold text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {filteredPatients.map(p => (
                                <tr key={p.uhid} className="hover:bg-slate-50/30 transition-colors">
                                  <td className="py-3 font-bold text-slate-800">{p.uhid}</td>
                                  <td className="py-3">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedSummaryPatient(p)}
                                      className="hover:underline text-left font-bold text-slate-700 hover:text-blue-600 transition-colors"
                                      title="View patient profile details"
                                    >
                                      {p.name}
                                    </button>
                                  </td>
                                  <td className="py-3 text-slate-500 font-medium">{p.age} Yrs / {p.gender}</td>
                                  <td className="py-3 text-slate-500">{p.mobile}</td>
                                  <td className="py-3 text-center text-slate-400">XXXX-XXXX-{p.aadhaar.slice(-4)}</td>
                                  <td className="py-3 text-slate-650 font-semibold">{p.scheme}</td>
                                  <td className="py-3 text-right">
                                    <button
                                      onClick={() => {
                                        setSelectedDept("General Medicine");
                                        setRegFullName(p.name);
                                        setRegGender(p.gender);
                                        setRegDOB(p.dob);
                                        setRegAge(p.age.toString());
                                        setRegMobile(p.mobile);
                                        setRegAadhaar(p.aadhaar);
                                        setRegUHID(p.uhid);
                                        setRegAddress(p.address);
                                        setRegDistrict(p.district);
                                        setRegState(p.state);
                                        setRegBloodGroup(p.bloodGroup);
                                        
                                        const guardName = p.guardian.split(" (")[0] || "";
                                        const guardRel = p.guardian.split(" (")[1]?.replace(")", "") || "";
                                        setRegGuardianName(guardName);
                                        setRegGuardianRelation(guardRel);

                                        const emgName = p.emergencyContact.split(" (")[0] || "";
                                        const emgPhone = p.emergencyContact.split(" (")[1]?.replace(")", "") || "";
                                        setRegEmergencyName(emgName);
                                        setRegEmergencyPhone(emgPhone);

                                        setRegGovScheme(p.scheme);

                                        setActiveTab("register");
                                      }}
                                      className="px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-[10px] font-bold text-teal-600 transition-all shadow-sm inline-block"
                                    >
                                      Book Consult
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {filteredPatients.map(p => (
                            <div 
                              key={p.uhid} 
                              className="bg-white border border-slate-250 hover:border-slate-350 rounded-xl p-4 shadow-sm space-y-3 transition-all relative overflow-hidden group"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <span className="text-[10px] text-slate-400 font-bold block">{p.uhid}</span>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedSummaryPatient(p)}
                                    className="font-bold text-slate-800 hover:text-blue-600 transition-colors text-xs mt-0.5 hover:underline text-left block"
                                    title="View patient profile details"
                                  >
                                    {p.name}
                                  </button>
                                  <span className="text-[10px] text-slate-500 block mt-0.5">
                                    {p.age} Yrs · {p.gender} · Blood Group: {p.bloodGroup}
                                  </span>
                                </div>
                                <span className="text-[8px] font-bold px-1.5 rounded-md border tracking-wider bg-emerald-50 text-emerald-700 border-emerald-100 uppercase">
                                  {p.scheme.includes("Ayushman") ? "PM-JAY" : p.scheme.includes("MSBY") ? "MSBY" : "Cash"}
                                </span>
                              </div>

                              <div className="border-t border-slate-50 pt-2.5 grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                                <div>
                                  <span className="text-slate-400 font-semibold block">Mobile:</span>
                                  <span>{p.mobile}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 font-semibold block">Aadhaar:</span>
                                  <span>XXXX-XXXX-{p.aadhaar.slice(-4)}</span>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-slate-400 font-semibold block">Guardian:</span>
                                  <span>{p.guardian}</span>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-slate-400 font-semibold block">Address:</span>
                                  <span className="truncate block" title={`${p.address}, ${p.district}`}>{p.address}, {p.district}</span>
                                </div>
                              </div>

                              <div className="border-t border-slate-50 pt-2 flex justify-end">
                                <button
                                  onClick={() => {
                                    setSelectedDept("General Medicine");
                                    setRegFullName(p.name);
                                    setRegGender(p.gender);
                                    setRegDOB(p.dob);
                                    setRegAge(p.age.toString());
                                    setRegMobile(p.mobile);
                                    setRegAadhaar(p.aadhaar);
                                    setRegUHID(p.uhid);
                                    setRegAddress(p.address);
                                    setRegDistrict(p.district);
                                    setRegState(p.state);
                                    setRegBloodGroup(p.bloodGroup);

                                    const guardName = p.guardian.split(" (")[0] || "";
                                    const guardRel = p.guardian.split(" (")[1]?.replace(")", "") || "";
                                    setRegGuardianName(guardName);
                                    setRegGuardianRelation(guardRel);

                                    const emgName = p.emergencyContact.split(" (")[0] || "";
                                    const emgPhone = p.emergencyContact.split(" (")[1]?.replace(")", "") || "";
                                    setRegEmergencyName(emgName);
                                    setRegEmergencyPhone(emgPhone);

                                    setRegGovScheme(p.scheme);

                                    setActiveTab("register");
                                  }}
                                  className="px-3 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold shadow-sm transition-all"
                                >
                                  Dispatch Consult
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                </div>
              )}

              {/* ── Tab: Appointment Management Console ── */}
              {activeTab === "appointments" && (
                <div className="space-y-6 animate-fade-in-up">
                  <HospitalCalendar events={calendarEvents} role="receptionist" />
                  <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                  
                  {/* Left Column: Booking & Slots (Span 2) */}
                  <div className="xl:col-span-2 space-y-4">
                    <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                        <Calendar size={14} className="text-blue-600" />
                        Schedule New Appointment
                      </h3>

                      <form onSubmit={handleBookAppointment} className="space-y-3.5">
                        
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-550 mb-1">Patient Full Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Kiran Oraon"
                            value={aptName}
                            onChange={e => setAptName(e.target.value)}
                            className={cn(
                              "w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white",
                              aptErrors.name ? "border-rose-350 ring-1 ring-rose-100" : "border-slate-200"
                            )}
                          />
                          {aptErrors.name && <span className="text-[9px] text-rose-500 mt-0.5 block">{aptErrors.name}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-555 mb-1">Mobile Number *</label>
                            <input
                              type="text"
                              maxLength={10}
                              placeholder="10-digit number"
                              value={aptPhone}
                              onChange={e => setAptPhone(e.target.value.replace(/\D/g, ""))}
                              className={cn(
                                "w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white",
                                aptErrors.phone ? "border-rose-350 ring-1 ring-rose-100" : "border-slate-200"
                              )}
                            />
                            {aptErrors.phone && <span className="text-[9px] text-rose-500 mt-0.5 block">{aptErrors.phone}</span>}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-555 mb-1">Gender *</label>
                              <select
                                value={aptGender}
                                onChange={e => setAptGender(e.target.value)}
                                className={cn(
                                  "w-full px-2 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white",
                                  aptErrors.gender ? "border-rose-350 ring-1 ring-rose-100" : "border-slate-200"
                                )}
                              >
                                <option value="">Select</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-555 mb-1">Age *</label>
                              <input
                                type="text"
                                maxLength={3}
                                placeholder="Age"
                                value={aptAge}
                                onChange={e => setAptAge(e.target.value.replace(/\D/g, ""))}
                                className={cn(
                                  "w-full px-2 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white",
                                  aptErrors.age ? "border-rose-350 ring-1 ring-rose-100" : "border-slate-200"
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-555 mb-1">Specialty Department *</label>
                            <select
                              value={aptDept}
                              onChange={e => {
                                setAptDept(e.target.value);
                                setAptDoc("");
                                setAptSlot("");
                              }}
                              className={cn(
                                "w-full px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white",
                                aptErrors.dept ? "border-rose-350 ring-1 ring-rose-100" : "border-slate-200"
                              )}
                            >
                              <option value="">Select Department</option>
                              {departments.map(d => <option key={d}>{d}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-555 mb-1">Doctor Assigned *</label>
                            <select
                              value={aptDoc}
                              disabled={!aptDept}
                              onChange={e => {
                                setAptDoc(e.target.value);
                                setAptSlot("");
                              }}
                              className={cn(
                                "w-full px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white disabled:bg-slate-100",
                                aptErrors.doc ? "border-rose-350 ring-1 ring-rose-100" : "border-slate-200"
                              )}
                            >
                              <option value="">Select Doctor</option>
                              {aptDept && doctorsByDept[aptDept]?.map(doc => <option key={doc}>{doc}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-555 mb-1">Preferred Date *</label>
                          <input
                            type="date"
                            min={new Date().toISOString().slice(0, 10)}
                            value={aptDate}
                            onChange={e => {
                              setAptDate(e.target.value);
                              setAptSlot("");
                            }}
                            className={cn(
                              "w-full px-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-700 font-semibold",
                              aptErrors.date ? "border-rose-350 ring-1 ring-rose-100" : "border-slate-200"
                            )}
                          />
                        </div>

                        {/* Chamber Slot Selector Board */}
                        {aptDoc && (
                          <div className="space-y-2 border-t border-slate-100 pt-3">
                            <div className="flex justify-between items-center text-[10px] text-slate-500">
                              <span className="font-semibold">Chamber Slots for {aptDoc}:</span>
                              <span className="italic">Select a green slot</span>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2">
                              {timeSlotsList.map(slot => {
                                const status = getSlotStatus(aptDoc, aptDate, slot);
                                let btnCls = "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100";
                                let isDisabled = false;

                                if (status === "booked") {
                                  btnCls = "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed";
                                  isDisabled = true;
                                } else if (status === "checked-in") {
                                  btnCls = "bg-amber-50 border-amber-200 text-amber-600 cursor-not-allowed";
                                  isDisabled = true;
                                }

                                if (aptSlot === slot) {
                                  btnCls = "bg-blue-600 border-blue-600 text-white shadow-sm ring-1 ring-blue-300 font-bold";
                                }

                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => setAptSlot(slot)}
                                    className={cn(
                                      "py-1.5 px-1.5 border rounded text-[9px] font-semibold text-center transition-all",
                                      btnCls
                                    )}
                                  >
                                    {slot.slice(0, 5)} {slot.slice(-2)}
                                  </button>
                                );
                              })}
                            </div>
                            
                            {/* Legend */}
                            <div className="flex items-center gap-3 text-[9px] text-slate-400 font-medium pt-1">
                              <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block"></span>
                                <span>Available</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 block"></span>
                                <span>Booked</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 block"></span>
                                <span>Checked In</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="pt-2.5">
                          <button
                            type="submit"
                            className="btn-primary w-full py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
                          >
                            <Calendar size={13} />
                            Confirm Schedule Booking
                          </button>
                        </div>

                      </form>

                    </div>
                  </div>

                  {/* Right Column: Active Appointments Scheduler Board (Span 3) */}
                  <div className="xl:col-span-3 space-y-4">
                    <div className="border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 bg-white h-full flex flex-col">
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-3 gap-3">
                        <div>
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Ticket size={14} className="text-teal-650" />
                            Booked Slots Directory
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">Live scheduling logs for today / chosen dates</p>
                        </div>

                        {/* Status Filter Pill buttons */}
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-0.5 rounded-lg text-[10px]">
                          <button
                            onClick={() => setAptFilterStatus("")}
                            className={cn(
                              "px-2.5 py-1 rounded font-bold transition-all",
                              aptFilterStatus === "" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500"
                            )}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setAptFilterStatus("Scheduled")}
                            className={cn(
                              "px-2.5 py-1 rounded font-bold transition-all",
                              aptFilterStatus === "Scheduled" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500"
                            )}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => setAptFilterStatus("Checked In")}
                            className={cn(
                              "px-2.5 py-1 rounded font-bold transition-all",
                              aptFilterStatus === "Checked In" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500"
                            )}
                          >
                            Checked In
                          </button>
                          <button
                            onClick={() => setAptFilterStatus("Cancelled")}
                            className={cn(
                              "px-2.5 py-1 rounded font-bold transition-all",
                              aptFilterStatus === "Cancelled" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500"
                            )}
                          >
                            Cancelled
                          </button>
                        </div>
                      </div>

                      {/* Appointments Table Grid */}
                      <div className="flex-1 overflow-x-auto">
                        {(() => {
                          const list = appointments.filter(a => {
                            const matchStatus = !aptFilterStatus || a.status === aptFilterStatus;
                            return matchStatus;
                          });

                          if (list.length === 0) {
                            return (
                              <div className="text-center py-16 text-slate-400 text-xs">
                                No scheduled appointments found for current filter.
                              </div>
                            );
                          }

                          return (
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                                  <th className="pb-3">Patient Details</th>
                                  <th className="pb-3">Doctor Assigned</th>
                                  <th className="pb-3">Schedule Slot</th>
                                  <th className="pb-3">Status</th>
                                  <th className="pb-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {list.map(apt => (
                                  <tr key={apt.id} className="hover:bg-slate-50/20 transition-colors">
                                    <td className="py-3">
                                      <div className="font-bold text-slate-700">{apt.name}</div>
                                      <div className="text-[10px] text-slate-450 mt-0.5">
                                        {apt.phone} {apt.age && `· ${apt.age} Yrs · ${apt.gender}`}
                                      </div>
                                    </td>
                                    <td className="py-3">
                                      <div className="text-slate-655 font-semibold">{apt.doctor}</div>
                                      <div className="text-[9px] text-slate-400">{apt.department}</div>
                                    </td>
                                    <td className="py-3">
                                      <div className="font-bold text-blue-600">{apt.timeSlot}</div>
                                      <div className="text-[9px] text-slate-450 font-medium">{apt.date}</div>
                                    </td>
                                    <td className="py-3">
                                      <span className={cn(
                                        "text-[9px] font-bold px-2 py-0.5 rounded border tracking-wide uppercase",
                                        apt.status === "Scheduled" && "bg-blue-50 text-blue-700 border-blue-100",
                                        apt.status === "Checked In" && "bg-emerald-50 text-emerald-700 border-emerald-100",
                                        apt.status === "Cancelled" && "bg-rose-50 text-rose-700 border-rose-100"
                                      )}>
                                        {apt.status === "Scheduled" ? "Scheduled" : apt.status === "Checked In" ? "Checked In" : "Cancelled"}
                                      </span>
                                    </td>
                                    <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                                      {apt.status === "Scheduled" && (
                                        <>
                                          <button
                                            onClick={() => handleCheckInAppointment(apt)}
                                            className="px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-[10px] font-bold text-teal-600 border border-teal-100 transition-colors shadow-sm"
                                          >
                                            Check In
                                          </button>
                                          <button
                                            onClick={() => handleCancelAppointment(apt.id)}
                                            className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-[10px] font-bold text-rose-600 border border-rose-100 transition-colors"
                                          >
                                            Cancel
                                          </button>
                                        </>
                                      )}
                                      {apt.status !== "Scheduled" && (
                                        <span className="text-[10px] text-slate-400 italic font-medium pr-2">
                                          No action required
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          );
                        })()}
                      </div>

                    </div>
                  </div>

                </div>
              </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center text-xs text-slate-400 font-medium">
              <span>Primary Lobby Terminal Desk #1</span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 font-bold">
                <Volume2 size={13} className="text-slate-400" />
                Queue Paging Speaker: Connected
              </span>
            </div>
          </div>

          {/* Right Panel: Emergency Alerts & Quick Desk Actions */}
          <div className="space-y-6">
            
            {/* Emergency Intake alerts Panel */}
            <div className="border-2 border-red-100 bg-red-50/10 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between border-b border-red-50 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <h2 className="text-sm font-bold text-red-900">Emergency Triage</h2>
                  </div>
                  <span className="text-[10px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                    {emergencies.length} Critical
                  </span>
                </div>

                <div className="space-y-3.5">
                  {emergencies.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl bg-white">
                      No active emergency triages logged.
                    </div>
                  ) : (
                    emergencies.map(emg => (
                      <div key={emg.id} className="p-3 bg-white border border-red-100 rounded-xl shadow-sm flex items-start justify-between gap-3 animate-fade-in-up">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-800 text-xs">{emg.name}</span>
                            <span className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded-md border",
                              getTriageCls(emg.triage)
                            )}>
                              {emg.triage}
                            </span>
                          </div>
                          <p className="text-[10px] text-red-600 font-semibold mt-1">{emg.condition}</p>
                          <span className="text-[9px] text-slate-400 block mt-0.5">Reported: {emg.time}</span>
                        </div>
                        <button
                          onClick={() => handleResolveEmergency(emg.id)}
                          className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-[10px] font-bold text-rose-600 transition-colors"
                        >
                          Admitted
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-red-50/50 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Casualty triage line</span>
                <button
                  onClick={handleEmergencyIntake}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] shadow-sm flex items-center gap-1 transition-all"
                >
                  <AlertCircle size={11} />
                  Add Emergency Patient
                </button>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 text-slate-400">Reception Operations</h2>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setActiveTab("register")}
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/20 transition-all text-center group"
                >
                  <UserPlus className="text-blue-500 group-hover:scale-105 transition-transform mb-1.5" size={20} />
                  <span className="text-xs font-bold text-slate-700">Add Walk-in</span>
                </button>
                <button 
                  onClick={() => {
                    if (queue.length > 0) setGeneratedToken(queue[0]);
                  }}
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/20 transition-all text-center group"
                >
                  <Printer className="text-teal-500 group-hover:scale-105 transition-transform mb-1.5" size={20} />
                  <span className="text-xs font-bold text-slate-700">Print Last Token</span>
                </button>
                <button 
                  onClick={() => setBedAllocationOpen(true)}
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-100 hover:border-purple-300 hover:bg-purple-50/20 transition-all text-center group"
                >
                  <BedDouble className="text-purple-500 group-hover:scale-105 transition-transform mb-1.5" size={20} />
                  <span className="text-xs font-bold text-slate-700">Bed Allocation</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all text-center group">
                  <Calendar className="text-slate-500 group-hover:scale-105 transition-transform mb-1.5" size={20} />
                  <span className="text-xs font-bold text-slate-700">Audit Logs</span>
                </button>
              </div>
            </div>

            {/* Lobby Broadcast Announcement */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-50 pb-1.5">Lobby Broadcast Paging</h2>
              <div className="space-y-2">
                <textarea
                  placeholder="Type broadcast message (e.g. Duty Medical Officer report to Emergency Casualty Ward immediately)..."
                  value={customBroadcastText}
                  onChange={e => setCustomBroadcastText(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/20 focus:bg-white resize-none h-14"
                />
                <button
                  onClick={() => {
                    if (!customBroadcastText.trim()) return;
                    if ("speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                      const speech = new SpeechSynthesisUtterance();
                      speech.text = customBroadcastText;
                      const voices = window.speechSynthesis.getVoices();
                      const englishVoice = voices.find(v => v.lang.includes("en-IN") || v.lang.includes("en-US")) || voices[0];
                      if (englishVoice) {
                        speech.voice = englishVoice;
                      }
                      speech.rate = 0.85;
                      window.speechSynthesis.speak(speech);
                    } else {
                      alert(`Speech Synthesis not supported. Simulated: ${customBroadcastText}`);
                    }
                    setCustomBroadcastText("");
                  }}
                  className="btn-teal w-full py-1.5 rounded-lg text-[10px] font-bold shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Volume2 size={13} />
                  Announce Paging P.A.
                </button>
              </div>
            </div>

            {/* Shift Logs Alert box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex gap-2">
                <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Front Desk Roster Notice</h3>
                  <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                    Ayushman Bharat (PM-JAY) claims audits occur at the registration desk between 2:00 PM and 3:00 PM today.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Slideover Patient Summary Drawer ── */}
        {selectedSummaryPatient && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right overflow-y-auto">
              
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">Patient Registry Card</h3>
                  <h2 className="text-lg font-black font-display mt-0.5">{selectedSummaryPatient.name}</h2>
                </div>
                <button 
                  onClick={() => setSelectedSummaryPatient(null)}
                  className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-750 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6 flex-1">
                
                {/* Vitals metrics strip */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Lobby Vitals Intake Check</h4>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5">
                      <span className="text-[9px] text-slate-400 font-semibold block">Blood Press.</span>
                      <strong className="text-xs text-slate-850 block mt-1">118/76</strong>
                      <span className="text-[8px] text-slate-450 block font-medium">mmHg</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5">
                      <span className="text-[9px] text-slate-400 font-semibold block">Pulse Rate</span>
                      <strong className="text-xs text-slate-850 block mt-1">72</strong>
                      <span className="text-[8px] text-slate-450 block font-medium">bpm</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5">
                      <span className="text-[9px] text-slate-400 font-semibold block">Temperature</span>
                      <strong className="text-xs text-slate-850 block mt-1">98.4</strong>
                      <span className="text-[8px] text-slate-450 block font-medium">°F</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5">
                      <span className="text-[9px] text-slate-400 font-semibold block">SpO2 Level</span>
                      <strong className="text-xs text-emerald-600 block mt-1">99%</strong>
                      <span className="text-[8px] text-slate-455 block font-medium">Normal</span>
                    </div>
                  </div>
                </div>

                {/* Patient Profile list */}
                <div className="space-y-3.5 border-t border-slate-100 pt-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">National Health ID (UHID):</span>
                    <strong className="text-slate-800 font-display">{selectedSummaryPatient.uhid}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Aadhaar Card:</span>
                    <strong className="text-slate-700">XXXX-XXXX-{selectedSummaryPatient.aadhaar.slice(-4)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Blood Group:</span>
                    <strong className="text-slate-700 font-bold">{selectedSummaryPatient.bloodGroup}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Date of Birth:</span>
                    <strong className="text-slate-750">{selectedSummaryPatient.dob} ({selectedSummaryPatient.age} Yrs)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Registered Scheme:</span>
                    <strong className="text-emerald-650 font-bold">{selectedSummaryPatient.scheme}</strong>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between">
                    <span className="text-slate-400 font-medium">Mobile Contact:</span>
                    <strong className="text-slate-700">{selectedSummaryPatient.mobile}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Guardian Caregiver:</span>
                    <strong className="text-slate-700">{selectedSummaryPatient.guardian}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Emergency Contact:</span>
                    <strong className="text-slate-700">{selectedSummaryPatient.emergencyContact}</strong>
                  </div>
                  <div className="flex justify-between flex-wrap gap-1">
                    <span className="text-slate-400 font-medium">Residential Address:</span>
                    <strong className="text-slate-700 text-right block flex-1">{selectedSummaryPatient.address}, {selectedSummaryPatient.district}, {selectedSummaryPatient.state}</strong>
                  </div>
                </div>

                {/* Active queue token check if applicable */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Medical History & Encounters</h4>
                  <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-850 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">OPD Consultation Chamber</span>
                      <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-extrabold uppercase">Today</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Allocated to General Medicine department with Dr. Priya Sharma. Priority level set to triage minor status.
                    </p>
                  </div>
                </div>

              </div>

              {/* Actions footer */}
              <div className="p-5 bg-slate-50 border-t border-slate-150 flex gap-2">
                <button
                  onClick={() => {
                    alert(`Reprinting registry/OPD slip card for ${selectedSummaryPatient.name}`);
                    const matchedQueue = queue.find(q => q.name === selectedSummaryPatient.name);
                    if (matchedQueue) {
                      setGeneratedToken(matchedQueue);
                    } else {
                      setGeneratedToken({
                        token: "OPD-REPRINT",
                        name: selectedSummaryPatient.name,
                        age: selectedSummaryPatient.age,
                        gender: selectedSummaryPatient.gender,
                        department: "General Medicine",
                        doctor: "Dr. Priya Sharma",
                        status: "Waiting",
                        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                      });
                    }
                  }}
                  className="btn-primary py-2 flex-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Printer size={13} />
                  Reprint Token Slip
                </button>
                <button
                  onClick={() => setSelectedSummaryPatient(null)}
                  className="btn-outline py-2 flex-1 rounded-xl text-xs font-bold text-slate-650 border-slate-200"
                >
                  Dismiss Summary
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ── Bed Occupancy Ward Modal ── */}
        {bedAllocationOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-in">
              
              <div className="bg-slate-950 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BedDouble className="text-blue-500" size={18} />
                  <h3 className="font-bold font-display text-sm">Emergency & Casualty Ward Bed Map</h3>
                </div>
                <button 
                  onClick={() => setBedAllocationOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                
                {/* Stats strip */}
                <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-3 font-medium text-slate-500">
                  <span>Total Beds Capacity: <strong>30 Beds</strong></span>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500 block"></span>
                      Available: {wardBeds.filter(b => !b.occupied).length}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-rose-500 block"></span>
                      Occupied: {wardBeds.filter(b => b.occupied).length}
                    </span>
                  </div>
                </div>

                {/* Bed Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 py-2">
                  {wardBeds.map(bed => (
                    <button
                      key={bed.id}
                      onClick={() => {
                        setWardBeds(prev => prev.map(b => b.id === bed.id ? { ...b, occupied: !b.occupied, patientName: !b.occupied ? "Emergency Intake" : "" } : b));
                      }}
                      className={cn(
                        "p-2 border rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-center",
                        bed.occupied ? "bg-rose-50 border-rose-200 hover:bg-rose-100/50" : "bg-emerald-50 border-emerald-200 hover:bg-emerald-100/50"
                      )}
                      title={bed.occupied ? `Bed ${bed.id} Occupied` : `Bed ${bed.id} Vacant (Click to allocate)`}
                    >
                      <BedDouble size={16} className={bed.occupied ? "text-rose-600" : "text-emerald-600"} />
                      <span className="text-[9px] font-black text-slate-800">#{bed.id}</span>
                    </button>
                  ))}
                </div>

                <p className="text-[10px] text-slate-400 italic">
                  * Click any bed to toggle allocation. Inpatient triage details will automatically link to Ayushman claims portal when admitted.
                </p>

                <div className="flex justify-end border-t border-slate-100 pt-3">
                  <button
                    onClick={() => setBedAllocationOpen(false)}
                    className="btn-primary py-2 px-5 rounded-xl text-xs font-bold shadow-sm"
                  >
                    Close Directory Map
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ── Patient Registration Success Overview Slip Modal ── */}
        {successPatient && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in">
              
              <div className="bg-gradient-to-r from-blue-700 to-teal-600 p-5 text-white relative">
                <button 
                  onClick={() => setSuccessPatient(null)}
                  className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold font-display text-sm">PATIENT REGISTERED SUCCESSFULLY</h3>
                    <p className="text-[10px] text-white/80">National Health Mission · CHC Bharno Portal</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                
                {/* Identifier Strip */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center gap-4 flex-wrap">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Generated Patient Health UHID</span>
                    <span className="text-sm font-bold text-slate-800 font-display tracking-wide">{successPatient.uhid}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">OPD Queue Token</span>
                    <span className="text-base font-extrabold text-blue-600">{successPatient.token}</span>
                  </div>
                </div>

                {/* Patient Summary Details Grid */}
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-xs border-y border-dashed border-slate-200 py-4">
                  <div>
                    <span className="text-slate-400 font-medium">Name:</span>
                    <p className="font-bold text-slate-800 mt-0.5">{successPatient.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Demographics:</span>
                    <p className="font-bold text-slate-850 mt-0.5">{successPatient.gender} · {successPatient.age} Yrs · {successPatient.bloodGroup}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Mobile:</span>
                    <p className="font-semibold text-slate-700 mt-0.5">{successPatient.mobile} {successPatient.altMobile && ` / ${successPatient.altMobile}`}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Aadhaar Card:</span>
                    <p className="font-semibold text-slate-700 mt-0.5">XXXX-XXXX-{successPatient.aadhaar.slice(-4)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Guardian:</span>
                    <p className="font-semibold text-slate-700 mt-0.5">{successPatient.guardian}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Emergency Contact:</span>
                    <p className="font-semibold text-slate-700 mt-0.5">{successPatient.emergencyContact}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Residential Info:</span>
                    <p className="font-semibold text-slate-700 mt-0.5">{successPatient.address}, {successPatient.district}, {successPatient.state}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Govt Health Scheme:</span>
                    <p className="font-bold text-emerald-600 mt-0.5">{successPatient.scheme}</p>
                  </div>
                </div>

                {/* Assigned consultation summary */}
                <div className="text-xs space-y-1">
                  <p className="text-slate-500">
                    Department Referral: <strong className="text-slate-750">{successPatient.department}</strong>
                  </p>
                  <p className="text-slate-500">
                    Assigned Chamber Physician: <strong className="text-slate-750">{successPatient.doctor}</strong>
                  </p>
                  <p className="text-[10px] text-slate-400 italic mt-1">
                    Registered Type: {successPatient.regType} · Registration Timestamp: {successPatient.time}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      alert(`Printing registration slip & OPD ticket ${successPatient.token} for ${successPatient.name}...`);
                      setSuccessPatient(null);
                    }}
                    className="btn-primary flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Printer size={13} />
                    Print Registry Slip
                  </button>
                  <button
                    onClick={() => setSuccessPatient(null)}
                    className="btn-outline flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 border-slate-200"
                  >
                    Close / Done
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ── Token Slip Card Modal (Simulated Print State) ── */}
        {generatedToken && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-in">
              <div className="bg-slate-950 p-4 text-white text-center relative">
                <button 
                  onClick={() => setGeneratedToken(null)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-2 text-white">
                  <Ticket size={16} />
                </div>
                <h3 className="font-bold font-display text-sm">OPD TOKEN SLIP</h3>
                <p className="text-[10px] text-slate-400">Community Health Centre Bharno</p>
              </div>

              <div className="p-6 text-center space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 tracking-widest font-bold uppercase block">Token Number</span>
                  <span className="text-4xl font-black font-display text-blue-600 mt-1 block">{generatedToken.token}</span>
                </div>

                <div className="border-y border-dashed border-slate-200 py-4 text-left text-xs space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Patient:</span>
                    <span className="font-bold text-slate-800">{generatedToken.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Department:</span>
                    <span className="font-bold text-slate-800">{generatedToken.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Assigned Doctor:</span>
                    <span className="font-bold text-slate-800">{generatedToken.doctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Issued Time:</span>
                    <span className="font-bold text-slate-800">{generatedToken.time}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      alert("Simulating token receipt printing sequence...");
                      setGeneratedToken(null);
                    }}
                    className="btn-primary flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Printer size={13} />
                    Print Slip
                  </button>
                  <button
                    onClick={() => setGeneratedToken(null)}
                    className="btn-outline flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 border-slate-200"
                  >
                    Dismiss
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 italic">
                  * consultations are completely free under NHM Jharkhand. Please present your Aadhaar or Ration Card at the doctor's chamber.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default ReceptionDashboard;
