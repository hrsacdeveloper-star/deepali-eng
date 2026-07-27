import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  slug: string;
  brief_description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  is_active: boolean;
  category_id: string;
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

const ProductsAdmin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id:string, name:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    brief_description: '',
    price: 0,
    stock_quantity: 0,
    image_url: '',
    category_id: '',
    is_active: true
  });

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('product_categories').select('id, name')
      ]);
      if (pRes.data) setProducts(pRes.data);
      if (cRes.data) setCategories(cRes.data);
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
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('product_images')
        .upload(filePath, uploadFile);
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);
        
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success(isCompressed ? `Uploaded compressed image (${(uploadFile.size/1024).toFixed(0)}KB)` : "Uploaded image successfully");
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
        const { error } = await supabase.from('products').update(formData).eq('id', editingId);
        if (error) throw error;
        toast.success("Product updated");
      } else {
        const { error } = await supabase.from('products').insert([formData]);
        if (error) throw error;
        toast.success("Product created");
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openDialog = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        brief_description: product.brief_description || '',
        price: product.price || 0,
        stock_quantity: product.stock_quantity || 0,
        image_url: product.image_url || '',
        category_id: product.category_id || (categories[0]?.id || ''),
        is_active: product.is_active
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        slug: '',
        brief_description: '',
        price: 0,
        stock_quantity: 0,
        image_url: '',
        category_id: categories[0]?.id || '',
        is_active: true
      });
    }
    setIsDialogOpen(true);
  };

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin: Products</h1>
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Product' : 'New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.category_id} 
                  onChange={e => setFormData({...formData, category_id: e.target.value})}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Active
                  <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={formData.brief_description} onChange={e => setFormData({...formData, brief_description: e.target.value})} rows={3} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image</label>
              <div className="flex gap-4 items-center">
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                )}
                <Button variant="outline" className="relative cursor-pointer" asChild>
                  <label>
                    {uploading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Upload className="mr-2 h-4 w-4" />}
                    {uploading ? 'Uploading...' : 'Upload Image'}
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
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={uploading}>Save Product</Button>
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
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-muted/50">
                  <td className="p-3">
                    <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded" />
                  </td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.is_active ? 'Active' : 'Draft'}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDialog(p)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;
