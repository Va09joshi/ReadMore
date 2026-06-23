"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, LockKeyhole } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAppStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await api.post('/v1/auth/login', credentials);
      return res.data;
    },
    onSuccess: (data) => {
      // The API returns a successful payload containing the access token
      const token = data.data.accessToken;
      const user = data.data;

      // Ensure it's an admin
      if (user.role !== 'SUPER_ADMIN') {
        setError("Unauthorized: Only Super Admins can access the panel.");
        return;
      }

      localStorage.setItem("adminToken", token);
      setUser(user);
      router.push("/");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-blue-50 flex items-center justify-center rounded-xl text-blue-600">
            <LockKeyhole className="h-8 w-8" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-center text-slate-900 mb-2">Admin Portal</h1>
        <p className="text-center text-slate-500 font-medium mb-8">Enter your credentials to access the marketplace dashboard.</p>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 font-medium p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block font-semibold text-slate-700 text-sm mb-1.5">Email Address</label>
            <Input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-slate-200 h-12 px-4 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 text-sm mb-1.5">Password</label>
            <Input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border-slate-200 h-12 px-4 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all"
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={loginMutation.isPending}
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all shadow-sm"
          >
            {loginMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authenticate"}
          </Button>
        </form>
      </div>
    </div>
  );
}
