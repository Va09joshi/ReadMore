"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const fetchSettings = async () => {
  const { data } = await api.get('/v1/admin/settings');
  return data.data;
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    platformFeePercentage: 5,
    maintenanceMode: false,
    contactEmail: '',
    companyName: '',
  });

  const { data: settings, isLoading, isError } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: fetchSettings,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        platformFeePercentage: settings.platformFeePercentage || 5,
        maintenanceMode: settings.maintenanceMode || false,
        contactEmail: settings.contactEmail || '',
        companyName: settings.companyName || '',
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.put('/v1/admin/settings', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      alert("Settings saved successfully!");
    }
  });

  const handleSave = () => {
    updateMutation.mutate(form);
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
        Failed to load settings.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4 inline-block pr-12">Global Settings</h2>
          <p className="text-slate-500 font-medium mt-2">Configure marketplace parameters and maintenance modes.</p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-sm px-8"
        >
          {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-8 shadow-sm max-w-3xl">
        <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-6 border-b border-slate-100 pb-3">General Information</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block font-medium text-sm text-slate-700 mb-2">Company Name</label>
            <Input
              value={form.companyName}
              onChange={(e) => setForm({...form, companyName: e.target.value})}
              className="rounded-lg border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-sm text-slate-700 mb-2">Contact Email</label>
            <Input
              value={form.contactEmail}
              onChange={(e) => setForm({...form, contactEmail: e.target.value})}
              className="rounded-lg border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium text-sm text-slate-700 mb-2">Platform Fee Percentage (%)</label>
            <Input
              type="number"
              value={form.platformFeePercentage}
              onChange={(e) => setForm({...form, platformFeePercentage: parseFloat(e.target.value)})}
              className="rounded-lg border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
            />
            <p className="text-sm text-slate-500 mt-1.5">This fee is automatically deducted from provider payouts.</p>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={form.maintenanceMode}
              onChange={(e) => setForm({...form, maintenanceMode: e.target.checked})}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
            />
            <label htmlFor="maintenanceMode" className="font-medium text-slate-700 cursor-pointer select-none">
              Enable Maintenance Mode
            </label>
          </div>
          {form.maintenanceMode && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 text-rose-700 text-sm rounded-r-lg">
              <span className="font-bold">Warning:</span> Maintenance mode will block all users and providers from accessing the main website. Only Super Admins can log in.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
