"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Loader2, Search, MoreHorizontal, Eye, Ban } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const fetchSubscriptions = async () => {
  const { data } = await api.get('/v1/admin/subscriptions');
  return data.data;
};

export default function SubscriptionsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  
  // Modal states
  const [selectedSub, setSelectedSub] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { data: subscriptions, isLoading, isError } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: fetchSubscriptions,
  });

  const cancelMutation = useMutation({
    mutationFn: async (id) => {
      // Assuming a cancel endpoint exists, or we would create one
      // For now, let's pretend it updates status to CANCELLED
      const res = await api.put(`/v1/admin/subscriptions/${id}/cancel`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      setIsCancelModalOpen(false);
    }
  });

  const handleOpenView = (sub) => {
    setSelectedSub(sub);
    setIsViewModalOpen(true);
  };

  const handleOpenCancel = (sub) => {
    setSelectedSub(sub);
    setIsCancelModalOpen(true);
  };

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
        Failed to load subscriptions. Check backend.
      </div>
    );
  }

  const filteredSubscriptions = subscriptions?.filter(sub => 
    sub._id?.toLowerCase().includes(search.toLowerCase()) || 
    sub.userId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4 inline-block pr-12">Active Subscriptions</h2>
          <p className="text-slate-500 font-medium mt-2">Monitor recurring revenue and customer plans.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by user or status..."
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
                <TableHead className="text-slate-600 font-semibold h-11">User</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Plan Type</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Status</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Ends On</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center font-bold text-slate-500">
                    No subscriptions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscriptions?.map((sub) => (
                  <TableRow key={sub._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-semibold text-slate-900">{sub.userId?.name || 'Unknown'}</TableCell>
                    <TableCell className="text-slate-500">{sub.planId?.name || 'Custom Plan'}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        sub.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 
                        sub.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700 hover:bg-rose-100' : 
                        'bg-amber-100 text-amber-700 hover:bg-amber-100'
                      }`}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">{new Date(sub.endDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 focus:outline-none transition-all">
                          <MoreHorizontal className="h-4 w-4 text-slate-500" />
                          <span className="sr-only">Open menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl border border-slate-200 shadow-md">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="font-semibold text-slate-900">Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenView(sub)} className="cursor-pointer hover:bg-slate-50 rounded-md">
                              <Eye className="mr-2 h-4 w-4 text-slate-500" /> View Details
                            </DropdownMenuItem>
                            {sub.status === 'ACTIVE' && (
                              <DropdownMenuItem onClick={() => handleOpenCancel(sub._id)} className="text-rose-600 cursor-pointer hover:bg-rose-50 rounded-md">
                                <Ban className="mr-2 h-4 w-4 text-rose-500" /> Cancel Plan
                              </DropdownMenuItem>
                            )}
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

      {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-xl border border-slate-200 bg-white shadow-lg">
          <DialogHeader>
            <DialogTitle className="font-bold tracking-tight text-xl text-slate-900 border-b border-slate-100 pb-2">Subscription Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium text-slate-500 text-sm text-right">User</span>
              <span className="col-span-3 font-semibold text-slate-900">{selectedSub?.userId?.name || 'Unknown'}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium text-slate-500 text-sm text-right">Plan Type</span>
              <span className="col-span-3 text-slate-700">{selectedSub?.planId?.name || 'Custom Plan'}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium text-slate-500 text-sm text-right">Status</span>
              <span className="col-span-3">
                <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  selectedSub?.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                  selectedSub?.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' : 
                  'bg-amber-100 text-amber-700'
                }`}>
                  {selectedSub?.status}
                </Badge>
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium text-slate-500 text-sm text-right">Starts On</span>
              <span className="col-span-3 text-slate-500 text-sm">{selectedSub && new Date(selectedSub.startDate).toLocaleDateString()}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium text-slate-500 text-sm text-right">Ends On</span>
              <span className="col-span-3 text-slate-500 text-sm">{selectedSub && new Date(selectedSub.endDate).toLocaleDateString()}</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)} variant="outline" className="rounded-lg">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <AlertDialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <AlertDialogContent className="rounded-xl border border-slate-200 bg-white shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold tracking-tight text-xl text-rose-600">Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Are you sure you want to cancel this user's subscription? They will lose access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Go Back</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => cancelMutation.mutate(selectedSub._id)}
              className="rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
            >
              {cancelMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
