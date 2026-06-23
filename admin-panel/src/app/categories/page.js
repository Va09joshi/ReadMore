"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Loader2, Search, Plus, MoreHorizontal, Edit3, Trash2 } from "lucide-react";
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

const fetchCategories = async () => {
  const { data } = await api.get('/v1/admin/categories');
  return data.data;
};

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Forms
  const [formData, setFormData] = useState({ name: "", description: "" });

  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchCategories,
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/v1/admin/categories', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsAddModalOpen(false);
      setFormData({ name: "", description: "" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/v1/admin/categories/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsEditModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/v1/admin/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsDeleteModalOpen(false);
    }
  });

  const handleOpenAdd = () => {
    setFormData({ name: "", description: "" });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, description: category.description || "" });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
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
        Failed to load categories.
      </div>
    );
  }

  const filteredCategories = categories?.filter(cat => 
    cat.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4 inline-block pr-12">Category Management</h2>
          <p className="text-slate-500 font-medium mt-2">Organize marketplace content.</p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Category
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search categories..."
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
                <TableHead className="text-slate-600 font-semibold h-11">Description</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Created At</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories?.map((category) => (
                  <TableRow key={category._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-semibold text-slate-900">{category.name}</TableCell>
                    <TableCell className="text-slate-500">{category.description || 'No description'}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 focus:outline-none transition-all">
                          <MoreHorizontal className="h-4 w-4 text-slate-500" />
                          <span className="sr-only">Open menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl border border-slate-200 shadow-md">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="font-semibold text-slate-900">Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenEdit(category)} className="cursor-pointer hover:bg-slate-50 rounded-md">
                              <Edit3 className="mr-2 h-4 w-4 text-slate-500" /> Edit Category
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenDelete(category)} className="text-rose-600 cursor-pointer hover:bg-rose-50 rounded-md">
                              <Trash2 className="mr-2 h-4 w-4 text-rose-500" /> Delete Category
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

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl border border-slate-200 bg-white shadow-lg">
          <DialogHeader>
            <DialogTitle className="font-bold tracking-tight text-xl text-slate-900 border-b border-slate-100 pb-2">New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="block font-medium text-sm text-slate-700 mb-1">Category Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="rounded-lg border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-sm text-slate-700 mb-1">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="rounded-lg border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAddModalOpen(false)} variant="outline" className="rounded-lg">
              Cancel
            </Button>
            <Button onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending} className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl border border-slate-200 bg-white shadow-lg">
          <DialogHeader>
            <DialogTitle className="font-bold tracking-tight text-xl text-slate-900 border-b border-slate-100 pb-2">Edit Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="block font-medium text-sm text-slate-700 mb-1">Category Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="rounded-lg border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-sm text-slate-700 mb-1">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="rounded-lg border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsEditModalOpen(false)} variant="outline" className="rounded-lg">
              Cancel
            </Button>
            <Button onClick={() => updateMutation.mutate({ id: selectedCategory._id, data: formData })} disabled={updateMutation.isPending} className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent className="rounded-xl border border-slate-200 bg-white shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold tracking-tight text-xl text-rose-600">Delete Category?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              Are you sure you want to delete <span className="font-semibold text-slate-900">{selectedCategory?.name}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteMutation.mutate(selectedCategory._id)}
              className="rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
