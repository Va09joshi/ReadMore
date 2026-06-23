"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Loader2, Search, Activity } from "lucide-react";
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
import { useState } from "react";

const fetchLogs = async () => {
  const { data } = await api.get('/v1/admin/activity-logs');
  return data.data;
};

export default function ActivityLogsPage() {
  const [search, setSearch] = useState("");
  
  const { data: logs, isLoading, isError } = useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: fetchLogs,
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
        Failed to load activity logs.
      </div>
    );
  }

  const filteredLogs = logs?.filter(log => 
    log.action?.toLowerCase().includes(search.toLowerCase()) || 
    log.performedBy?.name?.toLowerCase().includes(search.toLowerCase()) ||
    log.entityType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4 inline-block pr-12 flex items-center">
            <Activity className="mr-3 h-8 w-8 text-blue-600" /> System Activity
          </h2>
          <p className="text-slate-500 font-medium mt-2">Immutable audit trail of all platform actions.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by action, user, or entity..."
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
                <TableHead className="text-slate-600 font-semibold h-11">Date / Time</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Admin</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Action</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Entity</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center font-bold text-slate-500">
                    No activity logs found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs?.map((log) => (
                  <TableRow key={log._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-slate-500 text-sm">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">{log.performedBy?.name || 'System'}</TableCell>
                    <TableCell>
                      <Badge className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">{log.entityType}</TableCell>
                    <TableCell className="text-slate-400 text-sm">{log.ipAddress || '127.0.0.1'}</TableCell>
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
