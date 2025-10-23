import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Users,
  ShieldCheck,
  Bell,
  BarChart2,
  DollarSign,
  Settings,
  ChevronDown,
  LogOut,
  CheckCircle,
} from "lucide-react";
import Modal from "../components/Modal";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import TableCard from "../components/UserTable";
import Button from "../components/Button";
import api from "../api/axios";
import { useAuth } from "../context/authContext";
import toast, { Toaster } from "react-hot-toast"; // ✅ hot-toast import

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileDropdown, setProfileDropdown] = useState(false);

  const [users, setUsers] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [admin, setAdmin] = useState({ name: "Admin User" });
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ limit: 15, totalPages: 1, total: 0 });

  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", role: "" });
  const [modalError, setModalError] = useState("");

  // ✅ NEW STATE FOR PENDING MENTORS
  const [pendingMentors, setPendingMentors] = useState([]);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, tab: "dashboard" },
    { name: "Users & Mentors", icon: Users, tab: "users" },
    { name: "Approve Mentors", icon: CheckCircle, tab: "approveMentors" },
    { name: "Content", icon: ShieldCheck, tab: "content" },
    { name: "Notifications", icon: Bell, tab: "notifications" },
    { name: "Reports", icon: BarChart2, tab: "reports" },
    { name: "Payments", icon: DollarSign, tab: "payments" },
  ];

  // --- Dashboard Stats
  useEffect(() => {
    if (activeTab === "dashboard") {
      api
        .get("/admin/dashboard-stats")
        .then((res) => {
          setDashboardData(res.data);
          setError(null);
        })
        .catch(() => setError("Failed to load dashboard data"));
    }
  }, [activeTab]);

  // --- Users Fetch
  useEffect(() => {
  if (activeTab !== "users") return;

  const fetchUsers = async () => {
    try {
      const params = {
        page: currentPage,
        limit: pagination.limit,
        search: searchTerm,
      };
      if (filterRole !== "all") params.role = filterRole;

      const res = await api.get("/admin/users", { params });
      setUsers(res.data.users || []);
      setPagination(prev => ({
        ...prev,
        totalPages: res.data.totalPages || 1,
        total: res.data.total || 0,
      }));
      setError(null);
    } catch {
      setError("Failed to load user data");
    }
  };

  fetchUsers();
}, [activeTab, currentPage, searchTerm, filterRole, pagination.limit]);

  // --- Pending Mentors Fetch
  useEffect(() => {
    if (activeTab === "approveMentors") {
      const fetchPendingMentors = async () => {
        try {
          const res = await api.get("/admin/pending-mentors");
          setPendingMentors(res.data || []);
        } catch (err) {
          console.error("Failed to fetch pending mentors:", err);
          toast.error("Failed to fetch pending mentors");
        }
      };
      fetchPendingMentors();
    }
  }, [activeTab]);

  // --- Approve Mentor
  const handleApproveMentor = async (mentorId) => {
    try {
      await api.put(`/admin/approve-mentor/${mentorId}`);
      setPendingMentors((prev) => prev.filter((m) => m._id !== mentorId));
      toast.success("Mentor approved successfully!"); // ✅ toast notification
    } catch (err) {
      console.error("Failed to approve mentor:", err);
      toast.error("Failed to approve mentor");
    }
  };

  // --- Reject Mentor
  const handleRejectMentor = async (mentorId) => {
    try {
      await api.put(`/admin/reject-mentor/${mentorId}`);
      setPendingMentors((prev) => prev.filter((m) => m._id !== mentorId));
      toast.success("Mentor rejected successfully!"); // ✅ toast notification
    } catch (err) {
      console.error("Failed to reject mentor:", err);
      toast.error("Failed to reject mentor");
    }
  };

  // --- Fetch Admin Profile
  useEffect(() => {
    api
      .get("/auth/profile")
      .then((res) => setAdmin(res.data.user || { name: "Admin" }))
      .catch(() => setAdmin({ name: "Admin" }));
  }, []);

  // --- Edit User
  const handleEditSave = async () => {
    setModalError("");
    if (!editForm.name.trim()) {
      setModalError("Name cannot be empty");
      return;
    }
    try {
      const res = await api.put(`/admin/users/${editUser._id}`, {
        name: editForm.name,
        role: editForm.role,
      });
      if (res.status === 200) {
        setUsers((prev) =>
          prev.map((u) => (u._id === editUser._id ? { ...u, ...editForm } : u))
        );
        setEditUser(null);
        toast.success("User updated successfully!");
      }
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to update user");
    }
  };

  // --- Delete User
  const handleDelete = async () => {
    setModalError("");
    try {
      const res = await api.delete(`/admin/users/${deleteUser._id}`);
      if (res.status === 200) {
        setUsers((prev) => prev.filter((u) => u._id !== deleteUser._id));
        setDeleteUser(null);
        toast.success("User deleted successfully!");
      }
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} /> {/* ✅ hot-toast container */}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarExpanded ? "w-64" : "w-20"
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col transition-all duration-300 shadow-xl`}
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {sidebarExpanded && <h1 className="text-xl font-bold">DevConnect</h1>}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-1 hover:bg-slate-700 rounded-lg"
          >
            {sidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all font-medium text-sm ${
                activeTab === item.tab
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-slate-700"
              }`}
            >
              <item.icon size={20} />
              {sidebarExpanded && <span>{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors font-medium text-sm">
            <Settings size={20} />
            {sidebarExpanded && <span>Settings</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeTab === "dashboard"
              ? "Dashboard Overview"
              : activeTab === "users"
              ? "Manage Users & Mentors"
              : activeTab === "approveMentors"
              ? "Approve Mentors"
              : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>

          <div className="flex items-center gap-4 relative">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 bg-blue-600 text-white rounded-full px-3 py-1 font-semibold hover:bg-blue-700 transition-colors"
              >
                <span>{admin.name || "Admin"}</span>
                <ChevronDown size={16} />
              </button>

              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-600 font-medium"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8 w-full">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Dashboard */}
          {activeTab === "dashboard" && dashboardData && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {dashboardData.stats?.map((stat) => (
                  <StatCard key={stat.title} {...stat} />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
                {dashboardData.revenueTrend && (
                  <ChartCard
                    title="Revenue Trend"
                    subtitle="Monthly revenue"
                    data={dashboardData.revenueTrend}
                    chartType="line"
                    dataKey="revenue"
                    strokeColor="#3b82f6"
                  />
                )}
                {dashboardData.userGrowth && (
                  <ChartCard
                    title="User Growth"
                    subtitle="Total users"
                    data={dashboardData.userGrowth}
                    chartType="line"
                    dataKey="users"
                    strokeColor="#10b981"
                  />
                )}
                {dashboardData.sessionActivity && (
                  <ChartCard
                    title="Session Activity"
                    subtitle="Weekly sessions"
                    data={dashboardData.sessionActivity}
                    chartType="bar"
                    dataKey="sessions"
                    strokeColor="#f59e0b"
                  />
                )}
              </div>
            </>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="w-full">
              <TableCard
                users={users}
                onEdit={(user) => {
                  setEditUser(user);
                  setEditForm({ name: user.name, role: user.role });
                  setModalError("");
                }}
                onDelete={(user) => {
                  setDeleteUser(user);
                  setModalError("");
                }}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterRole={filterRole}
                setFilterRole={setFilterRole}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={pagination.totalPages}
              />
            </div>
          )}

          {/* ✅ Approve Mentors Tab */}
          {activeTab === "approveMentors" && (
            <div className="w-full">
              <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Experience</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pendingMentors.length > 0 ? (
                      pendingMentors.map((mentor) => (
                        <tr key={mentor._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{mentor.name}</td>
                          <td className="px-6 py-4 text-gray-600">{mentor.email}</td>
                          <td className="px-6 py-4">
                            {mentor.mentorProfile?.experience || "N/A"}
                          </td>
                          <td className="px-6 py-4 flex gap-3">
                            <Button
                              variant="primary"
                              onClick={() => handleApproveMentor(mentor._id)}
                              className="!w-auto"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleRejectMentor(mentor._id)}
                              className="!w-auto border-red-500 text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center text-gray-600 py-6 font-medium"
                        >
                          No pending mentors right now.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit User"
        onConfirm={handleEditSave}
        confirmText="Save Changes"
      >
        {modalError && (
          <p className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">{modalError}</p>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="developer">Developer</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        title="Delete User"
        onConfirm={handleDelete}
        confirmText="Delete"
        isDanger={true}
      >
        {modalError && (
          <p className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">{modalError}</p>
        )}
        <p className="text-gray-700">
          Are you sure you want to delete{" "}
          <span className="font-bold">{deleteUser?.name}</span>?
        </p>
      </Modal>
    </div>
  );
}
