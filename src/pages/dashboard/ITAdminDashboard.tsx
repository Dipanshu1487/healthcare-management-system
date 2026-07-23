import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { 
  Users, 
  ShieldAlert, 
  Settings, 
  Activity, 
  Server, 
  Database, 
  HardDrive, 
  Lock, 
  Unlock, 
  Plus, 
  Search, 
  Mail, 
  AlertTriangle,
  CheckCircle,
  Shield,
  Cpu,
  RefreshCw,
  TrendingUp,
  Sliders,
  Laptop,
  Trash2,
  Eye,
  Key,
  X
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useHospital } from "../../context/useHospital";
import { createAuditLog } from "../../context/helpers";
import type { StaffMember, HospitalDepartment, HospitalDevice, HospitalConfig } from "../../context/types";

export const ITAdminDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const { state, dispatch } = useHospital();

  // Local helper for changing tabs
  const setTab = (tabName: string) => {
    setSearchParams({ tab: tabName });
  };

  // Local state for User Management search & forms
  const [userSearch, setUserSearch] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Add User Form State
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState<any>("doctor");
  const [newUserDept, setNewUserDept] = useState("General Medicine");
  const [newUserDesig, setNewUserDesig] = useState("");

  // Local state for Department Management
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptHead, setNewDeptHead] = useState("");

  // Local state for Device Registry
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceAssigned, setNewDeviceAssigned] = useState("");
  const [newDeviceLoc, setNewDeviceLoc] = useState("");

  // Local state for Config management
  const [editedConfig, setEditedConfig] = useState<HospitalConfig>({ ...state.hospitalConfig });

  // Status message
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const triggerMsg = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  // Automated Credential Helper
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserDesig) return;

    const initials = newUserName.toLowerCase().replace(/\s+/g, ".");
    const email = `${initials}@chcbharno.gov.in`;
    const username = initials.split(".")[0] + Math.floor(10 + Math.random() * 89);
    const tempPassword = `CHC${username.toUpperCase()}@2026`;
    const newId = `CHC-${newUserRole.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`;

    const newStaff: StaffMember = {
      id: newId,
      name: newUserName,
      username,
      email,
      passwordTemp: tempPassword,
      department: newUserDept,
      designation: newUserDesig,
      joiningDate: new Date().toISOString().split("T")[0],
      role: newUserRole,
      status: "Active",
    };

    dispatch({
      type: "CREATE_STAFF_MEMBER",
      payload: {
        staffMember: newStaff,
        audit: createAuditLog("it-admin", "IT System", "CREATE_STAFF_ACCOUNT", "System", newId, `Created account for ${newUserName} with temporary password`),
      },
    });

    triggerMsg(`Successfully created staff account for ${newUserName}. Email: ${email}`);
    setShowAddUserModal(false);
    // Reset inputs
    setNewUserName("");
    setNewUserDesig("");
  };

  const handleToggleStaff = (id: string, name: string) => {
    dispatch({
      type: "TOGGLE_STAFF_STATUS",
      payload: {
        id,
        audit: createAuditLog("it-admin", "IT System", "TOGGLE_STAFF_STATUS", "System", id, `Toggled active status for ${name}`),
      },
    });
    triggerMsg(`Account status updated for ${name}.`);
  };

  const handleResetPassword = (id: string, name: string) => {
    const randomPass = `CHCReset@${Math.floor(1000 + Math.random() * 8999)}`;
    dispatch({
      type: "RESET_STAFF_PASSWORD",
      payload: {
        id,
        passwordTemp: randomPass,
        audit: createAuditLog("it-admin", "IT System", "PASSWORD_RESET", "System", id, `Forced security password reset for ${name}`),
      },
    });
    triggerMsg(`Temporary password reset for ${name} to: ${randomPass}`);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete the staff record for ${name}?`)) {
      dispatch({
        type: "DELETE_STAFF_MEMBER",
        payload: {
          id,
          audit: createAuditLog("it-admin", "IT System", "DELETE_STAFF_ACCOUNT", "System", id, `Permanently deleted employee account of ${name}`),
        },
      });
      triggerMsg(`Deleted staff account of ${name}.`);
      if (selectedStaff?.id === id) {
        setSelectedStaff(null);
      }
    }
  };

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName) return;

    const newId = `DEP-${newDeptName.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`;
    const newDept: HospitalDepartment = {
      id: newId,
      name: newDeptName,
      headName: newDeptHead || "Not Assigned",
      staffCount: 1,
    };

    dispatch({
      type: "CREATE_DEPARTMENT",
      payload: {
        department: newDept,
        audit: createAuditLog("it-admin", "IT System", "CREATE_DEPARTMENT", "System", newId, `Registered new hospital department: ${newDeptName}`),
      },
    });

    triggerMsg(`Registered department: ${newDeptName}`);
    setShowAddDeptModal(false);
    setNewDeptName("");
    setNewDeptHead("");
  };

  const handleRegisterDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName) return;

    const newId = `DEV-${newDeviceName.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`;
    const newDevice: HospitalDevice = {
      id: newId,
      name: newDeviceName,
      assignedTo: newDeviceAssigned || "Unassigned",
      status: "Online",
      location: newDeviceLoc || "Main Ward",
    };

    dispatch({
      type: "REGISTER_DEVICE",
      payload: {
        device: newDevice,
        audit: createAuditLog("it-admin", "IT System", "REGISTER_DEVICE", "System", newId, `Registered device ${newDeviceName} to ${newDeviceAssigned}`),
      },
    });

    triggerMsg(`Registered system device: ${newDeviceName}`);
    setShowAddDeviceModal(false);
    setNewDeviceName("");
    setNewDeviceAssigned("");
    setNewDeviceLoc("");
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "UPDATE_HOSPITAL_CONFIG",
      payload: {
        config: editedConfig,
        audit: createAuditLog("it-admin", "IT System", "UPDATE_CONFIG", "System", "CONFIG-1", "Updated global hospital configurations"),
      },
    });
    triggerMsg("Hospital configuration settings saved successfully.");
  };

  // Filtered lists
  const filteredStaff = state.staff.filter(s => 
    s.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    s.designation.toLowerCase().includes(userSearch.toLowerCase()) ||
    s.department.toLowerCase().includes(userSearch.toLowerCase()) ||
    s.id.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Helmet>
        <title>IT & System Administration | CHC Bharno</title>
      </Helmet>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="badge badge-primary">IT Command Operations</span>
          <h1 className="text-2xl font-bold font-display text-slate-900 mt-1">System Administration Hub</h1>
          <p className="text-xs text-slate-500">Manage user authorization, security settings, server monitoring, and system configurations.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTab("dashboard")} 
            className="btn border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs py-2 font-medium flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Systems</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Layout Tabs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar for IT Settings */}
        <div className="lg:col-span-3 space-y-2.5">
          <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-sm space-y-1">
            <h3 className="text-[11px] font-bold text-slate-400 tracking-wider px-2.5 uppercase pb-2">Admin Panels</h3>
            <button
              onClick={() => setTab("dashboard")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all",
                activeTab === "dashboard" 
                  ? "bg-indigo-55 text-white shadow-md shadow-indigo-500/10" 
                  : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Activity className="w-4 h-4" />
              <span>IT Operations Dashboard</span>
            </button>
            <button
              onClick={() => setTab("users")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all",
                activeTab === "users" 
                  ? "bg-indigo-55 text-white shadow-md shadow-indigo-500/10" 
                  : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Users className="w-4 h-4" />
              <span>User Accounts & Credentials</span>
            </button>
            <button
              onClick={() => setTab("permissions")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all",
                activeTab === "permissions" 
                  ? "bg-indigo-55 text-white shadow-md shadow-indigo-500/10" 
                  : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Shield className="w-4 h-4" />
              <span>RBAC Permission Matrix</span>
            </button>
            <button
              onClick={() => setTab("departments")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all",
                activeTab === "departments" 
                  ? "bg-indigo-55 text-white shadow-md shadow-indigo-500/10" 
                  : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Sliders className="w-4 h-4" />
              <span>Department Directory</span>
            </button>
            <button
              onClick={() => setTab("devices")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all",
                activeTab === "devices" 
                  ? "bg-indigo-55 text-white shadow-md shadow-indigo-500/10" 
                  : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Laptop className="w-4 h-4" />
              <span>Hardware Registry</span>
            </button>
            <button
              onClick={() => setTab("security")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all",
                activeTab === "security" 
                  ? "bg-indigo-55 text-white shadow-md shadow-indigo-500/10" 
                  : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Security & Alerts</span>
            </button>
            <button
              onClick={() => setTab("config")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all",
                activeTab === "config" 
                  ? "bg-indigo-55 text-white shadow-md shadow-indigo-500/10" 
                  : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Settings className="w-4 h-4" />
              <span>Global Configurations</span>
            </button>
          </div>
        </div>

        {/* Dynamic Workspace Container */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: IT Operations Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Operations Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-sm flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Staff Sessions</h5>
                    <p className="text-xl font-extrabold text-slate-800">{state.itMetrics.activeSessions}</p>
                    <span className="text-[9px] text-teal-600 font-semibold flex items-center gap-0.5 mt-0.5">
                      <TrendingUp className="w-2.5 h-2.5" />
                      <span>{state.itMetrics.onlineUsers} users online</span>
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-sm flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Server Health</h5>
                    <p className="text-xl font-extrabold text-slate-800">{state.itMetrics.serverStatus}</p>
                    <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                      <CheckCircle className="w-2.5 h-2.5" />
                      <span>Uptime: 99.98%</span>
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-sm flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Database Status</h5>
                    <p className="text-xl font-extrabold text-slate-800">{state.itMetrics.databaseStatus}</p>
                    <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                      <CheckCircle className="w-2.5 h-2.5" />
                      <span>Synced to Local Node</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Hardware / Performance section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-slate-500" />
                    <span>System Resources Monitoring</span>
                  </h4>
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>CPU Load</span>
                        <span>{state.itMetrics.cpuUsagePct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${state.itMetrics.cpuUsagePct}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Memory Utilization</span>
                        <span>{state.itMetrics.memoryUsagePct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${state.itMetrics.memoryUsagePct}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                        <span>Storage (Local Host)</span>
                        <span>{state.itMetrics.storageUsedGB} GB / {state.itMetrics.storageTotalGB} GB</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-teal-600 h-full rounded-full" style={{ width: `${(state.itMetrics.storageUsedGB / state.itMetrics.storageTotalGB) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operations logs */}
                <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-slate-500" />
                    <span>Backup & Security Sync</span>
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <span className="font-semibold text-slate-700">Nightly DB Dump Backup</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Completed successfully · 03:00 AM</p>
                      </div>
                      <span className="badge bg-emerald-50 text-emerald-700 border-emerald-200">Verified</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <span className="font-semibold text-slate-700">Audit Logs Synced</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Continuous replication active</p>
                      </div>
                      <span className="badge bg-emerald-50 text-emerald-700 border-emerald-200">Replicating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: User Accounts & Credentials */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search employees by name, role, ID..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="btn-primary text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Staff Account</span>
                  </button>
                </div>

                {/* Users List Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-150 bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Employee ID</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Official Email</th>
                        <th className="py-3 px-4">Department / Designation</th>
                        <th className="py-3 px-4">Account Status</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {filteredStaff.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">{member.id}</td>
                          <td className="py-3 px-4">
                            <div>
                              <span className="font-bold text-slate-800">{member.name}</span>
                              <span className="block text-[10px] text-slate-400">Username: {member.username}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="flex items-center gap-1 text-slate-600 font-medium">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>{member.email}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <span className="font-semibold text-slate-700">{member.department}</span>
                              <span className="block text-[10px] text-slate-400">{member.designation}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={cn(
                              "badge text-[10px] px-2 py-0.5",
                              member.status === "Active" 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-250" 
                                : "bg-slate-100 text-slate-650 border-slate-200"
                            )}>
                              {member.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedStaff(member)}
                                title="View Employee ID Card"
                                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleToggleStaff(member.id, member.name)}
                                title={member.status === "Active" ? "Deactivate Account" : "Activate Account"}
                                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 transition-colors"
                              >
                                {member.status === "Active" ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Unlock className="w-3.5 h-3.5 text-emerald-500" />}
                              </button>
                              <button
                                onClick={() => handleResetPassword(member.id, member.name)}
                                title="Reset Temporary Password"
                                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 transition-colors"
                              >
                                <Key className="w-3.5 h-3.5 text-indigo-500" />
                              </button>
                              <button
                                onClick={() => handleDeleteStaff(member.id, member.name)}
                                title="Delete Staff Account"
                                className="p-1.5 rounded-lg border border-rose-150 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Staff ID Card Preview Panel */}
              {selectedStaff && (
                <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-bold text-slate-800">Hospital ID Card & Signature Workspace</h4>
                    <button 
                      onClick={() => setSelectedStaff(null)}
                      className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
                    {/* ID Card Display */}
                    <div className="w-80 h-48 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 text-white p-4.5 flex flex-col justify-between shadow-lg relative overflow-hidden border border-slate-800">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">CHC BHARNO STAFF</span>
                          <h5 className="text-sm font-bold mt-0.5">{selectedStaff.name}</h5>
                          <span className="text-[10px] text-slate-300 block">{selectedStaff.designation}</span>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                          <Users className="w-5 h-5 text-indigo-400" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] text-slate-400">
                          <span>Employee ID:</span>
                          <span className="font-mono text-white font-semibold">{selectedStaff.id}</span>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-400">
                          <span>Department:</span>
                          <span className="text-white font-semibold">{selectedStaff.department}</span>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-400">
                          <span>Official Email:</span>
                          <span className="text-indigo-200 font-semibold">{selectedStaff.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code and digital signatures placeholder */}
                    <div className="space-y-4 text-xs flex-1 max-w-sm">
                      <div className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/50 space-y-2">
                        <span className="font-bold text-slate-700">Digital Signature & Authorization</span>
                        <div className="h-14 border border-dashed border-slate-200 rounded-lg bg-white flex items-center justify-center text-slate-400 font-mono text-[10px]">
                          [Digital Signature Active/Secure]
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/50 flex items-center gap-3">
                        <div className="w-14 h-14 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[8px] text-slate-400 font-bold shrink-0">
                          [QR CODE]
                        </div>
                        <div>
                          <span className="font-bold text-slate-700 block">Security Verification QR</span>
                          <p className="text-[10px] text-slate-500 mt-0.5">Scan to verify employee status, clearances, and HIS role access permissions.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RBAC Permission Matrix */}
          {activeTab === "permissions" && (
            <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Role-Based Access Control (RBAC) Permissions Matrix</h4>
                <p className="text-xs text-slate-500">Configure feature access per department role to ensure HIPPA / security compliance.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-150 bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">OPD Registration</th>
                      <th className="py-3 px-4">Clinical Consults</th>
                      <th className="py-3 px-4">Lab Orders</th>
                      <th className="py-3 px-4">Dispense Meds</th>
                      <th className="py-3 px-4">System Settings</th>
                      <th className="py-3 px-4">Billing Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-slate-700">
                    <tr>
                      <td className="py-3 px-4 font-bold">IT Administrator</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Allowed</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Allowed</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Allowed</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Allowed</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Allowed</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Allowed</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">Hospital Administrator</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Allowed</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Allowed</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Allowed</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">Doctor</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Allowed</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Allowed</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">Receptionist</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Allowed</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">Laboratory Technician</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Allowed</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">Pharmacist</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-emerald-600 font-bold">Allowed</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                      <td className="py-3 px-4 text-slate-400">Denied</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Department Directory */}
          {activeTab === "departments" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Hospital Departments</h4>
                    <p className="text-xs text-slate-500">Configure medical & service wings of CHC Bharno.</p>
                  </div>
                  <button
                    onClick={() => setShowAddDeptModal(true)}
                    className="btn-primary text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Department</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.departments.map((dept) => (
                    <div 
                      key={dept.id} 
                      className="p-4 rounded-xl border border-slate-150 bg-slate-50/50 flex flex-col justify-between gap-3 shadow-sm hover:border-slate-300 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-slate-450 font-semibold uppercase">{dept.id}</span>
                          <h5 className="text-sm font-bold text-slate-800 mt-0.5">{dept.name}</h5>
                        </div>
                        <span className="badge bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] font-bold">
                          {dept.staffCount} Staff Allocated
                        </span>
                      </div>

                      <div className="flex justify-between text-xs pt-2 border-t border-slate-200/50">
                        <span className="text-slate-500 font-medium">Head of Department:</span>
                        <span className="font-bold text-slate-700">{dept.headName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Hardware Registry */}
          {activeTab === "devices" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Hardware & Connected Devices</h4>
                    <p className="text-xs text-slate-500">Monitor tablets, PC workstations, and scanners in the local network.</p>
                  </div>
                  <button
                    onClick={() => setShowAddDeviceModal(true)}
                    className="btn-primary text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register Device</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {state.devices.map((device) => (
                    <div 
                      key={device.id} 
                      className="p-4 rounded-xl border border-slate-150 bg-slate-50/50 flex items-start justify-between gap-4 shadow-sm hover:border-slate-350 transition-all"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-slate-400 font-semibold">{device.id}</span>
                        <h5 className="text-xs font-bold text-slate-850 flex items-center gap-1.5">
                          <Laptop className="w-4 h-4 text-slate-500" />
                          <span>{device.name}</span>
                        </h5>
                        <p className="text-[10px] text-slate-500">Assigned: {device.assignedTo} · {device.location}</p>
                      </div>

                      <span className={cn(
                        "badge text-[9px] px-1.5 py-0.5",
                        device.status === "Online" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-slate-100 text-slate-650 border-slate-200"
                      )}>
                        {device.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Security Center */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Account Security Center</h4>
                  <p className="text-xs text-slate-500">Real-time alerts, login failures, policy compliance and security locks.</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm block">System Alert Logged</span>
                    <p className="text-xs mt-1">2 failed login attempts detected from Doctor Room Workstation (IP: 192.168.1.42). No action required, but monitoring continues.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Recent Security Alerts</span>
                  <div className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-800">Password Expired Policy warning</span>
                        <p className="text-[10px] text-slate-450 mt-0.5">Pharmacist Kundan Gope password expired. Forced change pending.</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">1 hr ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Hospital Configurations */}
          {activeTab === "config" && (
            <div className="bg-white rounded-2xl border border-slate-150 p-5 shadow-sm space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Hospital Software Profile Configuration</h4>
                <p className="text-xs text-slate-500">Configure global parameters, working slots, and government coverage plans.</p>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-semibold text-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label>Hospital Name</label>
                    <input
                      type="text"
                      value={editedConfig.hospitalName}
                      onChange={(e) => setEditedConfig({ ...editedConfig, hospitalName: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label>Working Shift Hours</label>
                    <input
                      type="text"
                      value={editedConfig.workingHours}
                      onChange={(e) => setEditedConfig({ ...editedConfig, workingHours: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label>Appointment Slot Duration (Minutes)</label>
                    <input
                      type="number"
                      value={editedConfig.appointmentSlotDurationMin}
                      onChange={(e) => setEditedConfig({ ...editedConfig, appointmentSlotDurationMin: parseInt(e.target.value) })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button type="submit" className="btn-primary text-xs py-2.5 px-4 rounded-xl shadow-sm">
                    Save System Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">Add Staff Account</h3>
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-6 space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1.5">
                <label>Employee Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Anil Kumar Tiwari"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>System Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="reception">Receptionist</option>
                    <option value="lab">Lab Technician</option>
                    <option value="pharmacy">Pharmacist</option>
                    <option value="admin">Hospital Admin</option>
                    <option value="it-admin">IT Admin</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label>Department</label>
                  <select
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Gynecology & Obstetrics">Gynecology</option>
                    <option value="Pathology">Pathology</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label>Job Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Medical Officer (SMO)"
                  value={newUserDesig}
                  onChange={(e) => setNewUserDesig(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm shadow-indigo-650/15"
                >
                  Create & Generate Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">Create Hospital Department</h3>
              <button 
                onClick={() => setShowAddDeptModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="p-6 space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1.5">
                <label>Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ophthalmology"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label>Head of Department (HoD)</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Anil Tiwari"
                  value={newDeptHead}
                  onChange={(e) => setNewDeptHead(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Register Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Device Modal */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">Register Network Device</h3>
              <button 
                onClick={() => setShowAddDeviceModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterDevice} className="p-6 space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1.5">
                <label>Device Name / Workstation Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pharmacy Counter 2 Workstation"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label>Assigned Operator / Staff</label>
                <input
                  type="text"
                  placeholder="e.g. Kundan Gope"
                  value={newDeviceAssigned}
                  onChange={(e) => setNewDeviceAssigned(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label>Facility Location</label>
                <input
                  type="text"
                  placeholder="e.g. Pharmacy Cabin"
                  value={newDeviceLoc}
                  onChange={(e) => setNewDeviceLoc(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-normal focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDeviceModal(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Register Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
