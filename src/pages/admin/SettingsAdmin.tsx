import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface SiteSettings {
  id: string;
  company_name: string;
  address: string;
  phone: string;
  email: string;
  about_text: string;
}

const SettingsAdmin: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
      if (error) throw error;
      setSettings(data);
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          company_name: settings.company_name,
          address: settings.address,
          phone: settings.phone,
          email: settings.email,
          about_text: settings.about_text,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings.id);
        
      if (error) throw error;
      toast.success('Settings updated successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>;
  }

  if (!settings) {
    return <div className="text-center py-12">No settings found.</div>;
  }

  return (
    <div className="container py-12 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin: Site Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 border rounded-lg shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Company Name</label>
            <Input 
              value={settings.company_name || ''} 
              onChange={e => setSettings({...settings, company_name: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Phone Number (Top Bar & Contact)</label>
            <Input 
              value={settings.phone || ''} 
              onChange={e => setSettings({...settings, phone: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Email Address (Top Bar & Contact)</label>
            <Input 
              type="email"
              value={settings.email || ''} 
              onChange={e => setSettings({...settings, email: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Physical Address (Contact & Footer)</label>
            <Textarea 
              value={settings.address || ''} 
              onChange={e => setSettings({...settings, address: e.target.value})} 
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Short About Text (Footer)</label>
            <Textarea 
              value={settings.about_text || ''} 
              onChange={e => setSettings({...settings, about_text: e.target.value})} 
              rows={3}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsAdmin;
