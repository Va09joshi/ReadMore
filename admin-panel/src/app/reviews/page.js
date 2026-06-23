"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Loader2, Search, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const fetchReviews = async () => {
  const { data } = await api.get('/v1/admin/reviews');
  return data.data;
};

export default function ReviewsPage() {
  const [search, setSearch] = useState("");
  const { data: reviews, isLoading, isError } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: fetchReviews,
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
        Failed to load reviews.
      </div>
    );
  }

  const filteredReviews = reviews?.filter(review => 
    review.comment?.toLowerCase().includes(search.toLowerCase()) || 
    review.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4 inline-block pr-12">Product Reviews</h2>
          <p className="text-slate-500 font-medium mt-2">Monitor user feedback and product ratings.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by product or user..."
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
                <TableHead className="text-slate-600 font-semibold h-11">Product</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">User</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Rating</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Comment</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11">Status</TableHead>
                <TableHead className="text-slate-600 font-semibold h-11 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center font-bold text-slate-500">
                    No reviews found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews?.map((review) => (
                  <TableRow key={review._id} className="border-b-2 border-slate-200 hover:bg-[#faf9f6]">
                    <TableCell className="font-bold text-black">{review.product?.title || 'Unknown Product'}</TableCell>
                    <TableCell className="font-monospace text-slate-700">{review.user?.name || 'Unknown User'}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-serif italic text-sm max-w-xs truncate">{review.comment}</TableCell>
                    <TableCell className="font-monospace text-slate-500 text-xs">{new Date(review.createdAt).toLocaleDateString()}</TableCell>
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
