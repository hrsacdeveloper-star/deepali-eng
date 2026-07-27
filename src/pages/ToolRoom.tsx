import React, { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { FadeIn } from '@/components/ui/fade-in';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Wrench, PenTool, CheckCircle, Factory, ShieldCheck, Cog, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SEO } from '@/components/seo/SEO';

const TEAM = [
  { name: 'Mr. Jagdish Patil', role: 'Founder & Director Commercial' },
  { name: 'Mr. Avinash Patil', role: 'Quality' },
  { name: 'Mr. Dutta Argha', role: 'Project Manager' },
  { name: 'Mr. Pranay Reddy', role: 'Accountant' },
];

const OPERATORS = [
  'Rahul Yedle (VMC)', 'Bapu Pawar (CNC)', 'Rajiv (CNC)', 
  'Rajat (CNC)', 'Ajay (CNC)', 'Vijay Guatam (CNC)', 
  'Rupesh Mishra (Lathe)', 'Ramratan (Lathe)', 'Satyam (Lathe)',
  'Vijay Ingale (Milling)', 'Dharmratn Tayde (M1TR)'
];

const ToolRoom = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedMachine, setSelectedMachine] = useState<any | null>(null);
  const [machines, setMachines] = useState<any[]>([]);

  useEffect(() => {
    const fetchMachines = async () => {
      const { data } = await supabase.from('tool_room_machines').select('*').eq('is_active', true).order('order_index');
      if (data && data.length > 0) {
        setMachines(data);
      } else {
        // Fallback to static data if table is empty
        setMachines([
          { id: 1, name: 'CNC Lathe M/C-01', specs: 'Dia 200 length 300mm', type: 'CNC Lathe', image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_4583506d-d19e-45f7-97b8-be77a6672ca4.jpg' },
          { id: 2, name: 'CNC Lathe M/C-02', specs: 'Dia 250 length 300mm', type: 'CNC Lathe', image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_4583506d-d19e-45f7-97b8-be77a6672ca4.jpg' },
          { id: 3, name: 'CNC Lathe M/C-03', specs: 'Dia 400 length 500mm', type: 'CNC Lathe', image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_4583506d-d19e-45f7-97b8-be77a6672ca4.jpg' },
          { id: 4, name: 'CNC Lathe M/C-04', specs: 'Dia 500 length 500mm', type: 'CNC Lathe', image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_4583506d-d19e-45f7-97b8-be77a6672ca4.jpg' },
          { id: 5, name: 'VMC M/C-01', specs: 'Make-BFW size-1100*600*600mm With 4 Axis & ATC', type: 'VMC', image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_d772922a-46ee-4e8d-ae65-5b0dcd8e4d80.jpg' },
          { id: 6, name: 'VMC M/C-02', specs: 'Make-BFW size-1100*600*600mm With ATC', type: 'VMC', image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_d772922a-46ee-4e8d-ae65-5b0dcd8e4d80.jpg' },
          { id: 7, name: 'Lathe M/c -01', specs: 'Size - 7.5 Feet', type: 'Conventional Lathe', image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_3edf3618-f2a1-4ea0-a405-3d87674d7aa0.jpg' },
          { id: 8, name: 'Lathe M/c -02', specs: 'Size - 9 Feet', type: 'Conventional Lathe', image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_3edf3618-f2a1-4ea0-a405-3d87674d7aa0.jpg' },
          { id: 9, name: 'Lathe M/c -03', specs: 'Size - 9 Feet', type: 'Conventional Lathe', image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_3edf3618-f2a1-4ea0-a405-3d87674d7aa0.jpg' },
          { id: 10, name: 'Milling M/c with DRO-01', specs: 'Size - 1100*600*600mm', type: 'Milling', image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_542b5e36-c54a-4c92-822a-a389d40cbeb5.jpg' },
          { id: 11, name: 'Milling M/c with DRO-02', specs: 'Size - 900*450*450mm', type: 'Milling', image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_542b5e36-c54a-4c92-822a-a389d40cbeb5.jpg' },
          { id: 12, name: 'Milling M/c', specs: 'Size - 1200*600*600mm', type: 'Milling', image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_542b5e36-c54a-4c92-822a-a389d40cbeb5.jpg' },
          { id: 13, name: '2D Digital Height Gauge', specs: '0 to 450mm', type: 'Measurement', image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_74e540ad-c585-4f02-bc39-b5d224a9f73f.jpg' },
          { id: 14, name: 'CMM-Fixed bed (Future)', specs: 'Size 1500*1000*800mm (Make-Accurate)', type: 'Measurement', image_url: 'https://miaoda-site-img.s3cdn.medo.dev/images/KLing_23fe3c9f-84c6-4d94-a07a-42ccc98322f8.jpg' },
        ]);
      }
    };
    fetchMachines();
  }, []);

  const types = ['All', ...Array.from(new Set(machines.map(m => m.type)))];

  const filteredMachines = machines.filter(m => {
    const matchesType = filter === 'All' || m.type === filter;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || (m.specs && m.specs.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <>
      <SEO 
        title="Tool Room | Precision Engineering Manufacturing Facility | Deepali Engineering"
        description="Explore the Tool Room at Deepali Engineering, supporting precision manufacturing through reliable tooling, engineering expertise, and efficient production processes."
        url="/tool-room"
        keywords="Tool Room, Precision Engineering Tool Room, Industrial Tool Room, Tool Room Facility, Engineering Manufacturing Tool Room"
      />
    <div className="bg-white pb-20">
      {/* Page Header */}
      <section className="bg-secondary text-white py-16">
        <div className="container">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-black mb-4">Tool Room & Facilities</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Comprehensive inventory of our advanced manufacturing and measurement infrastructure, ensuring precision for every component.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Facilities Overview */}
      <section className="py-16">
        <div className="container">
          <FadeIn>
            <div className="mb-10">
              <h2 className="text-3xl font-black text-secondary mb-4 flex items-center gap-2">
                <Factory className="h-8 w-8 text-primary" />
                Infrastructure & Facilities
              </h2>
              <div className="h-1 w-20 bg-primary mb-8"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'CNC / VMC Shop Floors', desc: 'Old and new dedicated floors for high-precision automated machining.', icon: Cog },
                { name: 'Conventional Shop Floor', desc: 'Equipped with heavy-duty lathes and milling machines.', icon: Wrench },
                { name: 'Quality Room', desc: 'Temperature-controlled environment for precise measurement.', icon: ShieldCheck },
                { name: 'Office & Assembly Area', desc: 'Dedicated space for engineering planning and final product assembly.', icon: Settings },
                { name: 'Despatch Area', desc: 'Organized logistics zone for secure export packaging.', icon: CheckCircle },
                { name: 'Power Infrastructure', desc: '37kw Solar Power Plant and 62.5 KVA Generator Backup.', icon: Factory },
              ].map((fac, i) => (
                <Card key={i} className="border-border/50 shadow-none hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <fac.icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-lg font-bold text-secondary mb-2">{fac.name}</h3>
                    <p className="text-sm text-muted-foreground">{fac.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Machine Inventory */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <FadeIn>
            <div className="mb-10">
              <h2 className="text-3xl font-black text-secondary mb-4 flex items-center gap-2">
                <PenTool className="h-8 w-8 text-primary" />
                Machine Inventory
              </h2>
              <div className="h-1 w-20 bg-primary mb-8"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search machines..." 
                  className="pl-9 rounded-none border-border focus-visible:ring-primary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-4 py-2 text-sm border transition-colors ${filter === t ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-border hover:border-primary/50'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMachines.length > 0 ? filteredMachines.map(m => (
                <Card key={m.id} className="rounded-none border-border shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/50 flex flex-col overflow-hidden" onClick={() => setSelectedMachine(m)}>
                  <div className="h-48 w-full bg-muted border-b border-border">
                    <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="mb-3">
                      <Badge variant="outline" className="rounded-none text-primary border-primary/20 bg-primary/5">{m.type}</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-2">{m.name}</h3>
                    <p className="text-muted-foreground text-sm font-medium mt-auto">{m.spec}</p>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No machines found matching your criteria.
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Organization Structure */}
      <section className="py-16">
        <div className="container">
          <FadeIn>
            <div className="mb-10">
              <h2 className="text-3xl font-black text-secondary mb-4 flex items-center gap-2">
                <Settings className="h-8 w-8 text-primary" />
                Organization Structure
              </h2>
              <div className="h-1 w-20 bg-primary mb-8"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="col-span-1 lg:col-span-2 border border-border p-6 bg-white">
                <h3 className="text-xl font-bold text-secondary mb-6 border-b pb-4">Leadership Team</h3>
                <ul className="space-y-4">
                  {TEAM.map((member, i) => (
                    <li key={i} className="flex justify-between items-baseline border-b border-border/50 pb-3 last:border-0 last:pb-0">
                      <span className="font-semibold text-secondary whitespace-nowrap mr-4">{member.name}</span>
                      <span className="text-sm text-primary text-right font-medium">{member.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-1 lg:col-span-3 border border-border p-6 bg-white">
                <h3 className="text-xl font-bold text-secondary mb-6 border-b pb-4">Expert Operations Team</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                  {OPERATORS.map((op, i) => {
                    const [name, role] = op.split(' (');
                    return (
                      <div key={i} className="flex flex-col">
                        <span className="font-medium text-secondary">{name}</span>
                        <span className="text-xs text-muted-foreground">({role}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>


      {/* Machine Details Dialog */}
      <Dialog open={!!selectedMachine} onOpenChange={(open) => !open && setSelectedMachine(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-white rounded-none">
          {selectedMachine && (
            <div className="flex flex-col">
              <div className="w-full h-64 sm:h-80 bg-muted relative">
                <img src={(selectedMachine as any).img || selectedMachine.image_url} alt={selectedMachine.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <Badge className="rounded-none bg-primary text-white hover:bg-primary/90">
                    {selectedMachine.type}
                  </Badge>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-secondary mb-2 text-left">
                    {selectedMachine.name}
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="space-y-4 mt-4 text-left text-sm text-muted-foreground">
                      <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
                        <div className="col-span-1 text-secondary font-semibold">Specification</div>
                        <div className="col-span-2 text-muted-foreground">{(selectedMachine as any).spec || selectedMachine.specifications}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
                        <div className="col-span-1 text-secondary font-semibold">Machine Type</div>
                        <div className="col-span-2 text-muted-foreground">{selectedMachine.type}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
                        <div className="col-span-1 text-secondary font-semibold">Status</div>
                        <div className="col-span-2 text-primary font-medium">Operational</div>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
};

export default ToolRoom;
