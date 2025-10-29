import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  ShieldCheck,
  Bell,
  BarChart2,
  DollarSign,
  Settings,
  ChevronDown,
  LogOut,
  CheckCircle,
} from "lucide-react";
import Modal from "./components/Modal";
import StatCard from "./components/StatCard";
import ChartCard from "./components/ChartCard";
import TableCard from "./components/UserTable";
import Button from "../../components/Button";
import api from "../../api/axios";
import useAuthStore from "../../ZustandStore/useAuthStore";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const loading = useAuthStore((s) => s.loading);
  const fetchUserProfile = useAuthStore((s) => s.fetchUserProfile);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [users, setUsers] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingMentors, setPendingMentors] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ limit: 15, totalPages: 1, total: 0 });

  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", role: "" });
  const [modalError, setModalError] = useState("");

  // Icon map for dashboard stats received as string keys
  const iconMap = {
    Users: Users,
    UserCheck: UserCheck,
  };

  // Fetch profile ONCE on mount
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      window.location.href = "/admin-login";
    }
  }, [isAuthenticated, loading, user]);

  // Fetch dashboard stats
  useEffect(() => {
    if (activeTab === "dashboard") {
      api
        .get("/admin/dashboard-stats", { withCredentials: true })
        .then((res) => setDashboardData(res.data))
        .catch(() => toast.error("Failed to load dashboard data"));
    }
  }, [activeTab]);

  // Fetch users
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

        const res = await api.get("/admin/users", { params, withCredentials: true });
        setUsers(res.data.users || []);
        setPagination((prev) => ({
          ...prev,
          totalPages: res.data.totalPages || 1,
          total: res.data.total || 0,
        }));
      } catch {
        toast.error("Failed to load users");
      }
    };
    fetchUsers();
  }, [activeTab, currentPage, searchTerm, filterRole, pagination.limit]);

  // Fetch pending mentors
  useEffect(() => {
    if (activeTab !== "approveMentors") return;
    api
      .get("/admin/pending-mentors", { withCredentials: true })
      .then((res) => setPendingMentors(res.data || []))
      .catch(() => toast.error("Failed to fetch pending mentors"));
  }, [activeTab]);

  // Approve mentor
  const handleApproveMentor = async (id) => {
    try {
      await api.put(`/admin/approve-mentor/${id}`, {}, { withCredentials: true });
      setPendingMentors((prev) => prev.filter((m) => m._id !== id));
      toast.success("Mentor approved ✅");
    } catch {
      toast.error("Failed to approve mentor");
    }
  };

  // Reject mentor
  const handleRejectMentor = async (id) => {
    try {
      await api.put(`/admin/reject-mentor/${id}`, {}, { withCredentials: true });
      setPendingMentors((prev) => prev.filter((m) => m._id !== id));
      toast.success("Mentor rejected ❌");
    } catch {
      toast.error("Failed to reject mentor");
    }
  };

  // Save user edits
  const handleEditSave = async () => {
    if (!editForm.name.trim()) {
      setModalError("Name cannot be empty");
      return;
    }
    try {
      await api.put(`/admin/users/${editUser._id}`, editForm, { withCredentials: true });
      setUsers((prev) => prev.map((u) => (u._id === editUser._id ? { ...u, ...editForm } : u)));
      setEditUser(null);
      toast.success("User updated ✅");
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to update user");
    }
  };

  // Delete user
  const handleDelete = async () => {
    try {
      await api.delete(`/admin/users/${deleteUser._id}`, { withCredentials: true });
      setUsers((prev) => prev.filter((u) => u._id !== deleteUser._id));
      setDeleteUser(null);
      toast.success("User deleted 🗑️");
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, tab: "dashboard" },
    { name: "Users & Mentors", icon: Users, tab: "users" },
    { name: "Approve Mentors", icon: CheckCircle, tab: "approveMentors" },
    { name: "Content", icon: ShieldCheck, tab: "content" },
    { name: "Notifications", icon: Bell, tab: "notifications" },
    { name: "Reports", icon: BarChart2, tab: "reports" },
    { name: "Payments", icon: DollarSign, tab: "payments" },
  ];

  if (loading || !user)
    return (
      <div className="h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );

  // Map icon strings to components for StatCard
  const mappedStats = dashboardData?.stats?.map((stat) => ({
    ...stat,
    Icon: iconMap[stat.icon] || null,
  }));

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      <Toaster position="top-right" />
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
          {/* Profile / Logout */}
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
                <span>{user?.name || "Admin"}</span>
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
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "dashboard" && mappedStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mappedStats.map(({ title, value, Icon }) => (
                <StatCard key={title} title={title} value={value} Icon={Icon} />
              ))}
            </div>
          )}

          {activeTab === "users" && (
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
          )}

          {activeTab === "approveMentors" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Pending Mentor Approvals</h3>
              <div className="grid gap-4">
                {pendingMentors.length > 0 ? (
                  pendingMentors.map((mentor) => (
                    <div
                      key={mentor._id}
                      className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{mentor.name}</p>
                        <p className="text-gray-500">{mentor.email}</p>
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={() => handleApproveMentor(mentor._id)} variant="success">
                          Approve
                        </Button>
                        <Button onClick={() => handleRejectMentor(mentor._id)} variant="danger">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No mentors pending approval.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
      {/* Modals */}
      {editUser && (
        <Modal title="Edit User" onClose={() => setEditUser(null)}>
          <div className="space-y-4">
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="User Name"
            />
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="developer">Developer</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
            {modalError && <p className="text-red-500 text-sm">{modalError}</p>}
            <div className="flex justify-end gap-2">
              <Button onClick={handleEditSave} variant="primary">
                Save
              </Button>
              <Button onClick={() => setEditUser(null)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {deleteUser && (
        <Modal title="Confirm Delete" onClose={() => setDeleteUser(null)}>
          <p className="mb-4">Are you sure you want to delete this user?</p>
          <div className="flex justify-end gap-2">
            <Button onClick={handleDelete} variant="danger">
              Delete
            </Button>
            <Button onClick={() => setDeleteUser(null)} variant="secondary">
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
