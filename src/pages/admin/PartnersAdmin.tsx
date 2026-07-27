import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Partner {
  id: string;
  name: string;
  image_url: string;
  order_index: number;
}

const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_DIM = 1920;
        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas conversion failed'));
        }, 'image/webp', 0.8);
      };
      img.onerror = reject;
    };
  });
};

const PartnersAdmin: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    order_index: 0
  });

  const fetchData = async () => {
    try {
      const { data } = await supabase.from('global_partners').select('*').order('order_index');
      if (data) setPartners(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    try {
      let uploadFile: Blob | File = file;
      let isCompressed = false;
      
      if (file.size > 1024 * 1024) {
        toast.info("Image > 1MB, compressing...");
        uploadFile = await compressImage(file);
        isCompressed = true;
      }
      
      const fileExt = isCompressed ? 'webp' : file.name.split('.').pop();
      const fileName = `partner_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, uploadFile);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);
        
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase.from('global_partners').update(formData).eq('id', editingId);
        if (error) throw error;
        toast.success("Partner updated");
      } else {
        const { error } = await supabase.from('global_partners').insert([formData]);
        if (error) throw error;
        toast.success("Partner created");
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this partner?')) return;
    try {
      const { error } = await supabase.from('global_partners').delete().eq('id', id);
      if (error) throw error;
      toast.success('Deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openDialog = (partner?: Partner) => {
    if (partner) {
      setEditingId(partner.id);
      setFormData({
        name: partner.name || '',
        image_url: partner.image_url || '',
        order_index: partner.order_index || 0
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        image_url: '',
        order_index: partners.length
      });
    }
    setIsDialogOpen(true);
  };

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin: Global Partners</h1>
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add Partner
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Partner' : 'New Partner'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Partner Name</label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Order Index</label>
              <Input type="number" value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Logo Image</label>
              <div className="flex gap-4 items-center">
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="w-16 h-16 object-contain border p-1 rounded-md bg-white" />
                )}
                <Button variant="outline" className="relative cursor-pointer" asChild>
                  <label>
                    {uploading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Upload className="mr-2 h-4 w-4" />}
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">For best results, use PNG or JPG files with transparent or white backgrounds.</p>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={uploading}>Save Partner</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="text-center py-12"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>
      ) : (
        <div className="border rounded-md">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                <th className="p-3">Logo</th>
                <th className="p-3">Name</th>
                <th className="p-3">Order</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {partners.map(p => (
                <tr key={p.id} className="hover:bg-muted/50">
                  <td className="p-3">
                    {p.image_url ? (
                       <img src={p.image_url} alt={p.name} className="w-12 h-12 object-contain bg-white border p-1 mix-blend-multiply" />
                    ) : (
                       <span className="text-xs text-muted-foreground">No Logo</span>
                    )}
                  </td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.order_index}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(p)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
              {partners.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted-foreground">No partners found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PartnersAdmin;
