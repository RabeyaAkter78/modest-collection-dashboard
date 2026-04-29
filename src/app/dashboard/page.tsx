"use client";

import { StatCard } from "@/components/ui/Card";
import { Users, ShoppingCart, Package, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { mockEarnings, mockOrders, mockProducts, mockUsers } from "@/lib/mock-data";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "@/components/ui/Card";

export default function DashboardPage() {
  const totalRevenue = mockEarnings.reduce((sum, e) => sum + e.revenue, 0);
  const totalOrders = mockOrders.length;
  const totalProducts = mockProducts.length;
  const totalUsers = mockUsers.length;

  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign size={24} />}
          change="+12.5% from last month"
          changeType="positive"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingCart size={24} />}
          change="+8.2% from last month"
          changeType="positive"
        />
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package size={24} />}
          change="3 new this week"
          changeType="neutral"
        />
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<Users size={24} />}
          change="+5.1% from last month"
          changeType="positive"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Revenue Overview</h3>
              <p className="text-sm text-slate-500">Monthly revenue for 2025</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <TrendingUp size={14} />
              +18%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockEarnings}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                formatter={(value: unknown) => [formatCurrency(Number(value) || 0), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Orders Chart */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Orders Overview</h3>
              <p className="text-sm text-slate-500">Monthly orders for 2025</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              <TrendingUp size={14} />
              +14%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockEarnings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900">Recent Orders</h3>
          <p className="text-sm text-slate-500">Latest 5 orders</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 text-left font-medium text-slate-500">Order ID</th>
                <th className="pb-3 text-left font-medium text-slate-500">Customer</th>
                <th className="pb-3 text-left font-medium text-slate-500">Total</th>
                <th className="pb-3 text-left font-medium text-slate-500">Status</th>
                <th className="pb-3 text-left font-medium text-slate-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-slate-50">
                  <td className="py-3 font-medium text-slate-900">{order.id}</td>
                  <td className="py-3 text-slate-600">{order.userName}</td>
                  <td className="py-3 font-medium text-slate-900">{formatCurrency(order.total)}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        order.status === "delivered"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.status === "shipped"
                          ? "bg-indigo-100 text-indigo-700"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
