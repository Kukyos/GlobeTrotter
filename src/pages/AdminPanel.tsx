import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Map, Globe, DollarSign, MapPin, Activity, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import type { User } from "../types/user";

/**
 * AdminPanel.tsx
 *
 * Admin dashboard that uses shared UI components and recharts.
 *
 * Access control: if user.role !== 'admin' => redirect to /dashboard
 */

/* ---------------- Admin types ---------------- */
interface AnalyticsData {
  userGrowth: { date: string; count: number }[];
  tripsByStatus: { status: string; count: number }[];
  popularCities: { city: string; visits: number }[];
  activityCategories: { category: string; count: number }[];
  revenueByMonth: { month: string; amount: number }[];
}

interface AdminStats {
  totalUsers: number;
  activeTrips: number;
  citiesExplored: number;
  revenue: number;
}

/* ---------------- Mock data (simulated) ---------------- */
const mockUsers: User[] = [
  { id: "u1", firstName: "Alice", lastName: "Smith", email: "alice@example.com", role: "user" , photoUrl: undefined},
  { id: "u2", firstName: "Bob", lastName: "Jones", email: "bob@example.com", role: "admin" , photoUrl: undefined},
  { id: "u3", firstName: "Clara", lastName: "Diaz", email: "clara@example.com", role: "guide" , photoUrl: undefined},
];

const mockAnalytics: AnalyticsData = {
  userGrowth: [
    { date: "2025-11-01", count: 20 },
    { date: "2025-12-01", count: 40 },
    { date: "2026-01-01", count: 80 },
    { date: "2026-02-01", count: 120 },
  ],
  tripsByStatus: [
    { status: "ongoing", count: 12 },
    { status: "upcoming", count: 34 },
    { status: "completed", count: 56 },
  ],
  popularCities: [
    { city: "Lisbon", visits: 120 },
    { city: "Paris", visits: 95 },
    { city: "Kyoto", visits: 78 },
  ],
  activityCategories: [
    { category: "Food", count: 120 },
    { category: "Tours", count: 80 },
    { category: "Outdoor", count: 50 },
  ],
  revenueByMonth: [
    { month: "Nov", amount: 12000 },
    { month: "Dec", amount: 18000 },
    { month: "Jan", amount: 22000 },
  ],
};

const mockStats: AdminStats = {
  totalUsers: 1240,
  activeTrips: 72,
  citiesExplored: 320,
  revenue: 123456,
};

/* ---------------- Small helper components ---------------- */
const StatCard: React.FC<{ title: string; value: React.ReactNode; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-white/50">{title}</div>
        <div className="text-2xl font-bold mt-2">{value}</div>
      </div>
      <div className="text-white/40">{icon}</div>
    </div>
  </Card>
);

const UserRow: React.FC<{ user: User; onRoleChange: (id: string, role: User["role"]) => void }> = ({ user, onRoleChange }) => {
  return (
    <tr className="border-b border-white/10">
      <td className="py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm">{user.firstName[0]}</div>
          <div>
            <div className="font-medium">{user.firstName} {user.lastName}</div>
            <div className="text-xs text-white/50">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="py-3 text-sm text-white/50">{user.email}</td>
      <td className="py-3 text-sm text-white/50">—</td>
      <td className="py-3">
        <select
          value={user.role}
          onChange={(e) => onRoleChange(user.id, e.target.value as User["role"])}
          className="input-field"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="guide">Guide</option>
        </select>
      </td>
      <td className="py-3">
        <div className="flex gap-2">
          <button className="btn-secondary px-3 py-1">Impersonate</button>
          <button className="btn-secondary px-3 py-1 text-red-400">Delete</button>
        </div>
      </td>
    </tr>
  );
};

/* ---------------- Main AdminPanel component ---------------- */
interface AdminPanelProps {
  user: User | null;
}

const COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#f97316", "#ef4444"];

const AdminPanel: React.FC<AdminPanelProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"users" | "cities" | "activities" | "analytics">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    // Access control
    if (!user || user.role !== "admin") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    // load mock users
    setUsers(mockUsers);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [users, search, roleFilter]);

  const handleRoleChange = (id: string, role: User["role"]) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-white/50">Platform overview and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Export Data</Button>
          <Button variant="primary">Generate Report</Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Users" value={mockStats.totalUsers} icon={<Users className="w-6 h-6" />} />
        <StatCard title="Active Trips" value={mockStats.activeTrips} icon={<Map className="w-6 h-6" />} />
        <StatCard title="Cities Explored" value={mockStats.citiesExplored} icon={<Globe className="w-6 h-6" />} />
        <StatCard title="Total Revenue" value={`$${mockStats.revenue}`} icon={<DollarSign className="w-6 h-6" />} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: "users", label: "Manage Users", icon: <Users /> },
          { id: "cities", label: "Popular Cities", icon: <MapPin /> },
          { id: "activities", label: "Popular Activities", icon: <Activity /> },
          { id: "analytics", label: "User Trends", icon: <TrendingUp /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? "bg-globe-500 text-white" : "btn-secondary"}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "users" && (
        <Card className="p-4">
          <div className="flex gap-4 mb-4">
            <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
            <select className="input-field w-40" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
              <option value="guide">Guides</option>
            </select>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left text-white/50 border-b border-white/10">
                <th className="pb-3">User</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Trips</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <UserRow key={u.id} user={u} onRoleChange={handleRoleChange} />
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm text-white/50 mb-2">User Growth</div>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockAnalytics.userGrowth.map((d) => ({ date: d.date, users: d.count }))}>
                  <CartesianGrid stroke="#222" />
                  <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.7)" }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.7)" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm text-white/50 mb-2">Popular Cities</div>
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mockAnalytics.popularCities} dataKey="visits" nameKey="city" innerRadius={30} outerRadius={80}>
                    {mockAnalytics.popularCities.map((entry, index) => (
                      <Cell key={entry.city} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-sm text-white/50 mb-2">Activity Categories</div>
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockAnalytics.activityCategories}>
                  <CartesianGrid stroke="#222" />
                  <XAxis dataKey="category" tick={{ fill: "rgba(255,255,255,0.7)" }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.7)" }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Placeholder content for other tabs */}
      {activeTab === "cities" && (
        <Card className="p-4">
          <div className="text-white/50">Popular cities data and management tools would go here.</div>
        </Card>
      )}

      {activeTab === "activities" && (
        <Card className="p-4">
          <div className="text-white/50">Popular activities analytics and management tools would go here.</div>
        </Card>
      )}
    </div>
  );
};

export default AdminPanel;