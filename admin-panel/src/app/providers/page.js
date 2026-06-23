"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Loader2, Search, MoreHorizontal, CheckCircle2, XCircle } from "lucide-react";
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

const fetchProviders = async () => {
  const { data } = await api.get('/v1/admin/providers');
  return data.data;
};

export default function ProvidersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  
  const { data: providers, isLoading, isError } = useQuery({
    queryKey: ['admin-providers'],
    queryFn: fetchProviders,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, isApproved }) => {
      const res = await api.put(`/v1/admin/providers/${id}/status`, { isApproved });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/v1/admin/providers/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
    }
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
        Failed to load providers. Check backend.
      </div>
    );
  }

  const filteredProviders = providers?.filter(provider => 
    provider.companyName?.toLowerCase().includes(search.toLowerCase()) || 
    provider.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4 inline-block pr-12">Provider Management</h2>
          <p className="text-slate-500 font-medium mt-2">Review and manage publisher accounts.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by company or email..."
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
                <TableHead className="text-slate-600 font-semibold h-11">Company</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Contact</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Phone</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Status</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center font-bold text-slate-500">
                    No providers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProviders?.map((provider) => (
                  <TableRow key={provider._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-semibold text-slate-900">{provider.companyName}</TableCell>
                    <TableCell className="text-slate-500">{provider.email}</TableCell>
                    <TableCell className="text-slate-500">{provider.phone}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${provider.approved ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}`}>
                        {provider.approved ? (
                          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3"/> Approved</span>
                        ) : (
                          <span className="flex items-center gap-1.5">Pending</span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 focus:outline-none transition-all">
                          <MoreHorizontal className="h-4 w-4 text-slate-500" />
                          <span className="sr-only">Open menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl border border-slate-200 shadow-md">
                          <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 rounded-md">View Details</DropdownMenuItem>
                            {!provider.approved && (
                              <DropdownMenuItem 
                                onClick={() => statusMutation.mutate({ id: provider._id, isApproved: true })}
                                className="text-emerald-600 cursor-pointer hover:bg-emerald-50 rounded-md"
                              >
                                Approve
                              </DropdownMenuItem>
                            )}
                            {provider.approved && (
                              <DropdownMenuItem 
                                onClick={() => statusMutation.mutate({ id: provider._id, isApproved: false })}
                                className="text-rose-600 cursor-pointer hover:bg-rose-50 rounded-md"
                              >
                                Reject
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-rose-600 cursor-pointer hover:bg-rose-50 rounded-md"
                              onClick={() => {
                                if(confirm('Are you sure you want to delete this provider?')) {
                                  deleteMutation.mutate(provider._id);
                                }
                              }}
                            >
                              Delete Provider
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
