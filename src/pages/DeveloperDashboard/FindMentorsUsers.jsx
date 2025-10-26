import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { searchUsers } from "../../api/users"; // centralized API
import MentorDeveloperCard from "../../components/MentorDeveloperCard";
import UserProfileModal from "../../components/UserProfileModal";

const FindMentorsUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // start false for instant UX without spinner
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("mentor");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await searchUsers({ role: roleFilter, search: searchQuery });
      setUsers(data.users);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (userId) => {
    setSelectedUserId(userId);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find {roleFilter === "mentor" ? "Mentors" : "Developers"}
        </h1>
        <p className="text-gray-600">
          Connect with experienced professionals and grow your network
        </p>
      </div>

      {/* Modern Search Bar */}
      <div className="bg-gradient-to-r from-[#032f60]/5 via-blue-50/30 to-[#032f60]/5 rounded-2xl p-5 mb-6 border border-[#032f60]/10">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && fetchUsers()}
              placeholder="Search by name or username..."
              className="w-full pl-12 pr-4 py-3 bg-white border-0 rounded-xl focus:ring-2 focus:ring-[#032f60] text-gray-900 placeholder-gray-400 shadow-sm"
            />
          </div>

          <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm">
            <button
              onClick={() => setRoleFilter("mentor")}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                roleFilter === "mentor"
                  ? "bg-[#032f60] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Mentors
            </button>
            <button
              onClick={() => setRoleFilter("developer")}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                roleFilter === "developer"
                  ? "bg-[#032f60] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Developers
            </button>
          </div>

          <button
            onClick={fetchUsers}
            className="px-8 py-3 bg-[#032f60] text-white rounded-xl font-semibold hover:bg-[#021d38] transition-all active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-[#032f60] mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <MentorDeveloperCard
              key={user._id}
              user={user}
              onUpdate={fetchUsers}
              onViewProfile={() => handleViewProfile(user._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-xl font-semibold text-gray-900 mb-2">
            No {roleFilter}s found
          </p>
          <p className="text-gray-500">Try adjusting your search</p>
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        userId={selectedUserId}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default FindMentorsUsers;
