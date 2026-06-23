"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Loader2, Search, CheckCircle2, MoreHorizontal, MessageSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const fetchTickets = async () => {
  const { data } = await api.get('/v1/admin/support');
  return data.data;
};

export default function SupportPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const { data: tickets, isLoading, isError } = useQuery({
    queryKey: ['admin-support'],
    queryFn: fetchTickets,
  });

  const closeMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.put(`/v1/admin/support/${id}/close`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-support'] });
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
        Failed to load support tickets.
      </div>
    );
  }

  const filteredTickets = tickets?.filter(ticket => 
    ticket.subject?.toLowerCase().includes(search.toLowerCase()) || 
    ticket.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4 inline-block pr-12">Support Tickets</h2>
          <p className="text-slate-500 font-medium mt-2">Manage customer inquiries and technical issues.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by ticket ID, subject, or user..."
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
                <TableHead className="text-slate-600 font-semibold h-11">Ticket ID</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">User</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Subject</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Status</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Priority</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center font-bold text-slate-500">
                    No support tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets?.map((ticket) => (
                  <TableRow key={ticket._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-semibold text-slate-900">#{ticket._id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell className="text-slate-500">{ticket.user?.name || 'Unknown'}</TableCell>
                    <TableCell className="font-medium text-slate-900">{ticket.subject}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : 
                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        ticket.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 
                        ticket.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {ticket.priority || 'NORMAL'}
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
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-slate-50 rounded-md"
                              onSelect={() => {
                                if (ticket.user?.email) {
                                  window.location.href = `mailto:${ticket.user.email}?subject=Re: ${encodeURIComponent(ticket.subject)}&body=Hi ${encodeURIComponent(ticket.user.name || 'there')},%0D%0A%0D%0AThis is in response to your ticket: "${encodeURIComponent(ticket.subject)}"%0D%0A%0D%0A`;
                                } else {
                                  alert('No email found for this user.');
                                }
                              }}
                            >
                              <MessageSquare className="mr-2 h-4 w-4 text-slate-500" /> Reply to Ticket
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-slate-50 rounded-md"
                              onSelect={() => closeMutation.mutate(ticket._id)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Mark Resolved
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
