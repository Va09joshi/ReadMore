"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, ShoppingCart, DollarSign, Activity, BookOpen, Package, CreditCard, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

const fetchDashboardStats = async () => {
  const { data } = await api.get('/v1/admin/dashboard-stats');
  return data.data;
};

export default function DashboardHome() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-black" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-rose-500 font-bold uppercase tracking-widest text-xl">
        Failed to load dashboard data. Check backend.
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    { title: "Total Users", value: data.totalUsers.toString(), icon: Users, change: "+12.5%", trend: "up" },
    { title: "Total Providers", value: data.totalProviders.toString(), icon: Building2, change: "+4.3%", trend: "up" },
    { title: "Total Products", value: data.totalProducts.toString(), icon: Package, change: "+2.1%", trend: "up" },
    { title: "Total Orders", value: data.totalOrders.toString(), icon: ShoppingCart, change: "+18.2%", trend: "up" },
    { title: "Monthly Revenue", value: `$${data.monthlyRevenue.toLocaleString()}`, icon: DollarSign, change: "+24.5%", trend: "up" },
    { title: "Active Subscriptions", value: data.totalSubscriptions.toString(), icon: CreditCard, change: "+5.4%", trend: "up" },
    { title: "Pending Approvals", value: data.pendingApprovals.toString(), icon: Activity, change: "-12", trend: "down" },
    { title: "Total Publications", value: "0", icon: BookOpen, change: "+1.2%", trend: "up" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4 inline-block pr-12">Dashboard Overview</h2>
        <p className="text-slate-500 font-medium mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold tracking-tight text-slate-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-lg ${['bg-emerald-50 text-emerald-600', 'bg-rose-50 text-rose-600', 'bg-blue-50 text-blue-600', 'bg-amber-50 text-amber-600', 'bg-purple-50 text-purple-600', 'bg-pink-50 text-pink-600'][i % 6]}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <p className={`text-xs font-medium mt-1 ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 mb-4 pb-4">
            <CardTitle className="font-bold tracking-tight text-slate-900">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: '500' }}
                    labelStyle={{ fontWeight: '600', color: '#64748b' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 rounded-xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 mb-4 pb-4">
            <CardTitle className="font-bold tracking-tight text-slate-900">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: '500' }}
                    labelStyle={{ fontWeight: '600', color: '#64748b' }}
                  />
                  <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
