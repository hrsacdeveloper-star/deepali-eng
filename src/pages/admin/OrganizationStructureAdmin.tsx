import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  order_index: number;
}

const OrganizationStructureAdmin = () => {
  const [leadership, setLeadership] = useState<TeamMember[]>([]);
  const [operations, setOperations] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<TeamMember>>({});
  const [currentTeam, setCurrentTeam] = useState<'leadership' | 'operations'>('leadership');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const [lRes, oRes] = await Promise.all([
        supabase.from('leadership_team').select('*').order('order_index'),
        supabase.from('operations_team').select('*').order('order_index')
      ]);

      if (lRes.error) throw lRes.error;
      if (oRes.error) throw oRes.error;

      setLeadership(lRes.data || []);
      setOperations(oRes.data || []);
    } catch (error: any) {
      toast.error('Error fetching teams: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member?: TeamMember, team: 'leadership' | 'operations' = 'leadership') => {
    setCurrentTeam(team);
    if (member) {
      setCurrentMember(member);
    } else {
      setCurrentMember({
        name: '',
        role: '',
        order_index: team === 'leadership' ? leadership.length + 1 : operations.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentMember.name || !currentMember.role) {
      toast.error('Name and Role are required');
      return;
    }

    try {
      setSaving(true);
      const table = currentTeam === 'leadership' ? 'leadership_team' : 'operations_team';

      if (currentMember.id) {
        const { error } = await supabase.from(table).update({
          name: currentMember.name,
          role: currentMember.role,
        }).eq('id', currentMember.id);
        if (error) throw error;
        toast.success('Member updated successfully');
      } else {
        const { error } = await supabase.from(table).insert([{
          name: currentMember.name,
          role: currentMember.role,
          order_index: currentMember.order_index
        }]);
        if (error) throw error;
        toast.success('Member added successfully');
      }

      setIsModalOpen(false);
      fetchTeams();
    } catch (error: any) {
      toast.error('Error saving member: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, team: 'leadership' | 'operations') => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
      const table = team === 'leadership' ? 'leadership_team' : 'operations_team';
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      toast.success('Member deleted successfully');
      fetchTeams();
    } catch (error: any) {
      toast.error('Error deleting member: ' + error.message);
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down', team: 'leadership' | 'operations') => {
    const list = team === 'leadership' ? [...leadership] : [...operations];
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === list.length - 1)
    ) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const itemToMove = list[index];
    const itemToReplace = list[newIndex];

    try {
      const table = team === 'leadership' ? 'leadership_team' : 'operations_team';
      
      await supabase.from(table).update({ order_index: itemToReplace.order_index }).eq('id', itemToMove.id);
      await supabase.from(table).update({ order_index: itemToMove.order_index }).eq('id', itemToReplace.id);
      
      fetchTeams();
    } catch (error) {
      toast.error('Error reordering');
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const renderTeamSection = (title: string, data: TeamMember[], teamType: 'leadership' | 'operations') => (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button onClick={() => handleOpenModal(undefined, teamType)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Member
        </Button>
      </div>

      <div className="bg-white rounded-md border border-border shadow-sm">
        {data.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No members found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 font-semibold w-16">Order</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((member, index) => (
                <tr key={member.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        disabled={index === 0}
                        onClick={() => moveItem(index, 'up', teamType)}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        disabled={index === data.length - 1}
                        onClick={() => moveItem(index, 'down', teamType)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{member.name}</td>
                  <td className="p-4 text-muted-foreground">{member.role}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenModal(member, teamType)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id, teamType)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Organization Structure</h1>
        <p className="text-muted-foreground mt-2">Manage the Leadership and Expert Operations teams.</p>
      </div>

      {renderTeamSection('Leadership Team', leadership, 'leadership')}
      {renderTeamSection('Expert Operations Team', operations, 'operations')}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{currentMember.id ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input 
                value={currentMember.name || ''} 
                onChange={e => setCurrentMember({...currentMember, name: e.target.value})}
                placeholder="e.g. Mr. Jagdish Patil"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role / Department</label>
              <Input 
                value={currentMember.role || ''} 
                onChange={e => setCurrentMember({...currentMember, role: e.target.value})}
                placeholder="e.g. Founder & Director Commercial"
              />
            </div>
            
            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationStructureAdmin;