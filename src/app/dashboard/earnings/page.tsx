"use client";

import { useState, useMemo } from "react";
import { mockEarnings, mockDailyEarnings } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import Card, { StatCard } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { DollarSign, TrendingUp, ShoppingCart, Calendar } from "lucide-react";
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

type FilterPeriod = "daily" | "monthly" | "yearly";

export default function EarningsPage() {
  const [period, setPeriod] = useState<FilterPeriod>("monthly");

  const data = useMemo(() => {
    if (period === "daily") return mockDailyEarnings;
    return mockEarnings;
  }, [period]);

  const totalRevenue = useMemo(() => data.reduce((sum, e) => sum + e.revenue, 0), [data]);
  const totalOrders = useMemo(() => data.reduce((sum, e) => sum + e.orders, 0), [data]);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const periods: { key: FilterPeriod; label: string }[] = [
    { key: "daily", label: "Daily" },
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Earnings</h1>
          <p className="mt-1 text-sm text-slate-500">Revenue analytics and financial overview</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {periods.map((p) => (
            <Button
              key={p.key}
              variant={period === p.key ? "primary" : "ghost"}
              size="sm"
              onClick={() => setPeriod(p.key)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign size={24} />}
          change="+18.2% from last period"
          changeType="positive"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingCart size={24} />}
          change="+14.5% from last period"
          changeType="positive"
        />
        <StatCard
          title="Avg. Order Value"
          value={formatCurrency(Math.round(avgOrderValue))}
          icon={<TrendingUp size={24} />}
          change="+3.2% from last period"
          changeType="positive"
        />
        <StatCard
          title="Period"
          value={period === "daily" ? "14 days" : period === "monthly" ? "12 months" : "1 year"}
          icon={<Calendar size={24} />}
          changeType="neutral"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-slate-900">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="earnRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px" }}
                formatter={(value: unknown) => [formatCurrency(Number(value) || 0), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#earnRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-semibold text-slate-900">Orders Trend</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px" }}
              />
              <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Revenue Breakdown Table */}
      <Card>
        <h3 className="mb-4 text-base font-semibold text-slate-900">Revenue Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 text-left font-medium text-slate-500">Period</th>
                <th className="pb-3 text-left font-medium text-slate-500">Revenue</th>
                <th className="pb-3 text-left font-medium text-slate-500">Orders</th>
                <th className="pb-3 text-left font-medium text-slate-500">Avg. Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item) => (
                <tr key={item.date} className="transition-colors hover:bg-slate-50">
                  <td className="py-3 font-medium text-slate-900">{item.date}</td>
                  <td className="py-3 font-medium text-primary">{formatCurrency(item.revenue)}</td>
                  <td className="py-3 text-slate-600">{item.orders}</td>
                  <td className="py-3 text-slate-600">{formatCurrency(Math.round(item.revenue / item.orders))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-300">
                <td className="pt-3 font-bold text-slate-900">Total</td>
                <td className="pt-3 font-bold text-primary">{formatCurrency(totalRevenue)}</td>
                <td className="pt-3 font-bold text-slate-900">{totalOrders}</td>
                <td className="pt-3 font-bold text-slate-900">{formatCurrency(Math.round(avgOrderValue))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}
