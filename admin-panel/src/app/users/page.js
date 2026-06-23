"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Loader2, Search, MoreHorizontal, Eye, Edit3, ShieldAlert, Trash2, CheckCircle2, XCircle } from "lucide-react";
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
  DialogDescription,
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

const fetchUsers = async () => {
  const { data } = await api.get('/v1/admin/users');
  return data.data;
};

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({ name: "", phone: "", role: "USER" });
  const [newRole, setNewRole] = useState("USER");

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/v1/admin/users/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsEditModalOpen(false);
    }
  });

  const suspendMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await api.put(`/v1/admin/users/${id}/suspend`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsSuspendModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/v1/admin/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsDeleteModalOpen(false);
    }
  });

  const handleOpenView = (user) => { setSelectedUser(user); setIsViewModalOpen(true); };
  const handleOpenEdit = (user) => { 
    setSelectedUser(user); 
    setNewRole(user.role || "USER");
    setIsEditModalOpen(true); 
  };
  const handleOpenSuspend = (user) => { setSelectedUser(user); setIsSuspendModalOpen(true); };
  const handleOpenDelete = (id) => { setSelectedUser({_id: id}); setIsDeleteModalOpen(true); };
  const handleToggleStatus = (id, status) => { suspendMutation.mutate({ id, status }); };

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
        Failed to load users. Check backend.
      </div>
    );
  }

  const filteredUsers = users?.filter(user => 
    user.name?.toLowerCase().includes(search.toLowerCase()) || 
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4 inline-block pr-12">User Management</h2>
          <p className="text-slate-500 font-medium mt-2">Manage customer accounts, roles, and status.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search users by name or email..."
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
                <TableHead className="text-slate-600 font-semibold h-11">Name</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Email</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Role</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Status</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center font-medium text-slate-500">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers?.map((user) => (
                  <TableRow key={user._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-semibold text-slate-900">{user.name}</TableCell>
                    <TableCell className="text-slate-500">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700 hover:bg-purple-100' : user.role === 'PROVIDER' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-100'}`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}`}>
                        {user.status === 'ACTIVE' ? (
                          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3"/> Active</span>
                        ) : (
                          <span className="flex items-center gap-1.5"><XCircle className="h-3 w-3"/> Suspended</span>
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
                            <DropdownMenuLabel className="font-semibold text-slate-900">Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenEdit(user)} className="cursor-pointer hover:bg-slate-50 rounded-md">Edit Role</DropdownMenuItem>
                            {user.status === 'ACTIVE' ? (
                              <DropdownMenuItem onClick={() => handleToggleStatus(user._id, 'SUSPENDED')} className="text-amber-600 cursor-pointer hover:bg-amber-50 rounded-md">Suspend User</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleToggleStatus(user._id, 'ACTIVE')} className="text-emerald-600 cursor-pointer hover:bg-emerald-50 rounded-md">Activate User</DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleOpenDelete(user._id)} className="text-rose-600 cursor-pointer hover:bg-rose-50 rounded-md">Delete User</DropdownMenuItem>
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

      {/* Edit Role Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl border border-slate-200 bg-white shadow-lg">
          <DialogHeader>
            <DialogTitle className="font-bold tracking-tight text-xl text-slate-900 border-b border-slate-100 pb-2">Change User Role</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium text-slate-500 text-sm text-right">Name</span>
              <span className="col-span-3 font-semibold text-slate-900">{selectedUser?.name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium text-slate-500 text-sm text-right">Current Role</span>
              <span className="col-span-3">
                <Badge className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">{selectedUser?.role}</Badge>
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <span className="font-medium text-slate-500 text-sm text-right">New Role</span>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="USER">User (Reader)</option>
                <option value="PROVIDER">Provider (Publisher)</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsEditModalOpen(false)} variant="outline" className="rounded-lg">Cancel</Button>
            <Button 
              onClick={() => updateMutation.mutate({ id: selectedUser._id, data: { role: newRole } })}
              disabled={updateMutation.isPending}
              className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent className="rounded-xl border border-slate-200 bg-white shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold tracking-tight text-xl text-rose-600">Delete User Account?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              This action cannot be undone. This will permanently delete the user account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteMutation.mutate(selectedUser?._id)}
              className="rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
