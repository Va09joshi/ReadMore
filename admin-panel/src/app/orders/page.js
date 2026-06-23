"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Loader2, Search, MoreHorizontal, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const fetchOrders = async () => {
  const { data } = await api.get('/v1/admin/orders');
  return data.data;
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: fetchOrders,
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
        Failed to load orders. Check backend.
      </div>
    );
  }

  const filteredOrders = orders?.filter(order => 
    order._id?.toLowerCase().includes(search.toLowerCase()) || 
    order.userId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4 inline-block pr-12">Orders & Revenue</h2>
          <p className="text-slate-500 font-medium mt-2">Track marketplace transactions and statuses.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by order ID or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-lg border-slate-200 bg-slate-50 h-10 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 overflow-x-auto">
          <Table className="min-w-full whitespace-nowrap">
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-slate-600 font-semibold h-11">Order ID</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">User</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Amount</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Status</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Date</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center font-bold text-slate-500">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders?.map((order) => (
                  <TableRow key={order._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-semibold text-slate-900">{order._id.substring(0, 8)}...</TableCell>
                    <TableCell className="text-slate-500">{order.userId?.name || 'Unknown'}</TableCell>
                    <TableCell className="font-medium text-slate-900">${order.totalAmount?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.paymentStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 
                        order.paymentStatus === 'FAILED' ? 'bg-rose-100 text-rose-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 focus:outline-none transition-all">
                          <MoreHorizontal className="h-4 w-4 text-slate-500" />
                          <span className="sr-only">Open menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl border border-slate-200 shadow-md">
                          <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 rounded-md">
                              <Eye className="mr-2 h-4 w-4 text-slate-500" /> View Receipt
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-rose-600 cursor-pointer hover:bg-rose-50 rounded-md">
                              Process Refund
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
