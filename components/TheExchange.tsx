import React, { useState } from 'react';
import { Target, DollarSign, Clock, ShieldCheck, ArrowUpRight, Plus, X, Loader2, CheckCircle2, FileSignature, ChevronDown, ChevronUp, Trash2, ListTodo, ClipboardCheck } from 'lucide-react';
import { BOUNTIES } from '../constants';
import { Bounty } from '../types';
import VerifiedBadge from './VerifiedBadge';


const TheExchange: React.FC<{ onJoin?: () => void }> = ({ onJoin }) => {
  const [bounties, setBounties] = useState<Bounty[]>(BOUNTIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedBountyId, setExpandedBountyId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    reward: '',
    type: 'Project',
    timeLeft: '',
    tags: ''
  });

  const [currentTaskInput, setCurrentTaskInput] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTask = () => {
    if (currentTaskInput.trim()) {
      setTasks(prev => [...prev, currentTaskInput.trim()]);
      setCurrentTaskInput('');
    }
  };

  const removeTask = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const newBounty: Bounty = {
        id: Date.now().toString(),
        title: formData.title,
        reward: formData.reward,
        description: 'A newly posted bounty.',
        posterName: formData.client || "Anonymous",
        posterAvatar: `https://ui-avatars.com/api/?name=${formData.client || 'A'}`,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
        timeLeft: formData.timeLeft || "24h",
        type: formData.type.toLowerCase() as 'project' | 'contract' | 'commission',
        posterIsVerified: false,
        tasks: tasks.length > 0 ? tasks : undefined
      };

      setBounties(prev => [newBounty, ...prev]);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setFormData({ title: '', client: '', reward: '', type: 'Project', timeLeft: '', tags: '' });
      setTasks([]);
    }, 1500);
  };

  const getBountyType = (type: Bounty['type']) => {
    switch(type) {
      case 'commission': return 'Commission';
      case 'project': return 'Project';
      case 'contract': return 'Contract';
      default: return 'Bounty';
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedBountyId(expandedBountyId === id ? null : id);
  };

  return (
    <section className="relative py-32 px-6 bg-[#050505] border-t border-white/5 overflow-hidden">
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>
      
      {/* Glow FX */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 md:gap-0">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                 <DollarSign className="w-3 h-3 text-[#D4AF37]" />
                 <span className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase">Internal Economy</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                The Exchange.
              </h2>
              <p className="text-gray-400 text-lg max-w-xl leading-relaxed font-light">
                 Why work for a boss when you can work for kings? <br/>
                 <span className="text-white font-medium">Hire killers. Get paid. No middlemen.</span>
              </p>
           </div>
           
           <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all hover:bg-[#E5C048] hover:scale-105 flex items-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
             >
                <FileSignature size={16} /> Post Bounty
             </button>
             <button 
               onClick={onJoin}
               className="hidden md:flex px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all hover:scale-105 items-center gap-2 backdrop-blur-md"
             >
               View All Contracts <ArrowUpRight size={16} />
             </button>
           </div>
        </div>

        {/* Bounties Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
            {bounties.slice(0,6).map((bounty) => {
                const isExpanded = expandedBountyId === bounty.id;
                return (
                    <div key={bounty.id} className={`group relative p-8 rounded-[32px] bg-[#0a0a0a] border ${isExpanded ? 'border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/20' : 'border-white/5'} hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-2xl overflow-hidden animate-fade-in-up flex flex-col`}>
                       
                       {/* Hover Gradient */}
                       <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                       <div className="relative z-10 flex flex-col h-full">
                           <div className="flex justify-between items-start mb-6">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                 <Target size={20} className="text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
                              </div>
                              <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                                  bounty.type === 'commission' ? 'bg-purple-900/20 border-purple-500/20 text-purple-400' :
                                  bounty.type === 'project' ? 'bg-blue-900/20 border-blue-500/20 text-blue-400' :
                                  'bg-emerald-900/20 border-emerald-500/20 text-emerald-500'
                              }`}>
                                 {getBountyType(bounty.type)}
                              </div>
                           </div>
                           
                           <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors truncate">{bounty.title}</h3>
                           <div className="flex items-center gap-2 mb-4">
                              <p className="text-sm text-gray-500 font-mono uppercase tracking-wide truncate">{bounty.posterName}</p>
                              {bounty.posterIsVerified && <VerifiedBadge size="sm" />}
                           </div>

                           <div className="flex flex-wrap gap-2 mb-6">
                              {bounty.tags.slice(0, 3).map((tag, idx) => (
                                  <span key={idx} className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">{tag}</span>
                              ))}
                           </div>

                           {/* Task Brief Section */}
                           {bounty.tasks && bounty.tasks.length > 0 && (
                               <div className="mb-6">
                                   <button 
                                      onClick={() => toggleExpand(bounty.id)}
                                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:brightness-125 transition-all"
                                   >
                                       {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                       Task Brief ({bounty.tasks.length})
                                   </button>
                                   
                                   {isExpanded && (
                                       <div className="mt-4 space-y-3 animate-fade-in-up">
                                           {bounty.tasks.map((task, idx) => (
                                               <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-black/40 border border-white/5 group/task">
                                                   <div className="mt-0.5 w-4 h-4 rounded border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                                                       <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-sm opacity-0 group-hover/task:opacity-100 transition-opacity"></div>
                                                   </div>
                                                   <span className="text-xs text-gray-400 leading-relaxed">{task}</span>
                                               </div>
                                           ))}
                                       </div>
                                   )}
                               </div>
                           )}
                           
                           <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                              <span className="text-white font-bold font-mono tracking-wide">{bounty.reward}</span>
                              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                 <Clock size={12} />
                                 <span>{bounty.timeLeft}</span>
                              </div>
                           </div>
                       </div>
                    </div>
                );
            })}
        </div>

        {/* Stats Strip */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/5 py-10">
            <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">$4.2M</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Paid Out This Month</div>
            </div>
            <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{842 + bounties.length - 3}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Active Contracts</div>
            </div>
             <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">12min</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Avg. Fill Time</div>
            </div>
             <div className="text-center flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                   <ShieldCheck className="text-[#D4AF37]" />
                   <span className="text-3xl font-bold text-white">100%</span>
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Verified Payment</div>
            </div>
        </div>

      </div>

      {/* POST BOUNTY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
             onClick={() => setIsModalOpen(false)}
           />

           {/* Modal Content */}
           <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[32px] shadow-[0_0_50px_-10px_rgba(0,0,0,0.8)] overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
              
              {/* Modal Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50 shadow-[0_0_20px_#D4AF37]"></div>
              
              <div className="p-8">
                 <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                            <Plus className="text-[#D4AF37]" size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-wide">Create Contract</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Deploy funds to the network</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Project Title</label>
                        <input 
                            required
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            type="text" 
                            placeholder="e.g. Senior React Developer Needed"
                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-[#D4AF37]/50 focus:shadow-[0_0_20px_-5px_rgba(212,175,55,0.3)] transition-all duration-300"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Client Name / Brand</label>
                            <input 
                                name="client"
                                value={formData.client}
                                onChange={handleInputChange}
                                type="text" 
                                placeholder="e.g. Apex Agency"
                                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                            />
                        </div>
                        <div>
                             <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Reward Amount</label>
                            <input 
                                required
                                name="reward"
                                value={formData.reward}
                                onChange={handleInputChange}
                                type="text" 
                                placeholder="e.g. $5,000 USD"
                                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                             <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Contract Type</label>
                             <div className="relative">
                                <select 
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 appearance-none"
                                >
                                    <option value="Project">Project (Flat Fee)</option>
                                    <option value="Contract">Contract (Recurring)</option>
                                    <option value="Commission">Commission Based</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-gray-500"></div>
                                </div>
                             </div>
                        </div>
                        <div>
                             <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Deadline / Urgency</label>
                            <input 
                                name="timeLeft"
                                value={formData.timeLeft}
                                onChange={handleInputChange}
                                type="text" 
                                placeholder="e.g. 24h Remaining"
                                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Deliverables / Tasks</label>
                        <div className="flex gap-2">
                            <input 
                                value={currentTaskInput}
                                onChange={(e) => setCurrentTaskInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTask())}
                                type="text" 
                                placeholder="Add a sub-item..."
                                className="flex-1 bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                            />
                            <button 
                                type="button"
                                onClick={addTask}
                                className="w-12 h-12 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center hover:bg-[#E5C048] transition-all shrink-0"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        
                        {tasks.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {tasks.map((task, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group/list">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                                            <span className="text-sm text-gray-300">{task}</span>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => removeTask(idx)}
                                            className="text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover/list:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Tags (Comma Separated)</label>
                        <input 
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            type="text" 
                            placeholder="e.g. React, Design, High Ticket"
                            className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-3.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-bold text-xs uppercase tracking-widest transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest hover:bg-[#E5C048] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="animate-spin" size={16} /> Deploying...</>
                            ) : (
                                "Deploy Contract"
                            )}
                        </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}
    </section>
  );
};

export default TheExchange;