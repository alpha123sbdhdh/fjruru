import React from 'react';
import { Quote } from 'lucide-react';

const Manifesto: React.FC<{ id?: string, onJoin: () => void }> = ({ id, onJoin }) => {
  return (
    <section id={id} className="relative bg-[#020205] text-white py-32 px-6 border-t border-white/5 selection:bg-[#D4AF37] selection:text-black">
      
      {/* Deep Ambient Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Content */}
        <div className="space-y-24">
          
          {/* Section 1: The Problem */}
          <div className="relative">
             <Quote className="absolute -top-8 -left-8 text-[#D4AF37] opacity-20 w-16 h-16 rotate-180" />
             <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
               They want you weak. <br/>
               They want you poor. <br/>
               They want you alone.
             </h2>
             <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
               The modern world is designed to drain your energy and empty your pockets. Schools teach you to be an employee. The news teaches you to be afraid. Social media teaches you to be envious.
             </p>
          </div>

          {/* Section 2: The Divider */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-30"></div>

          {/* Section 3: The Solution */}
          <div className="grid md:grid-cols-2 gap-12">
             <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-[#D4AF37]/20 transition-colors">
                <h3 className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest mb-4">The Old Way</h3>
                <ul className="space-y-4 text-gray-500 font-medium">
                   <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-900 rounded-full"></span> Go to university</li>
                   <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-900 rounded-full"></span> Get into debt</li>
                   <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-900 rounded-full"></span> Work 9-5 until you die</li>
                   <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-900 rounded-full"></span> Beg for a raise</li>
                </ul>
             </div>
             <div className="p-8 rounded-3xl bg-[#111] border border-white/10 shadow-[0_0_30px_-10px_rgba(212,175,55,0.1)]">
                <h3 className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest mb-4">The Arena Way</h3>
                <ul className="space-y-4 text-white font-medium">
                   <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_5px_#D4AF37]"></span> Master high-income skills</li>
                   <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_5px_#D4AF37]"></span> Leverage AI & Automation</li>
                   <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_5px_#D4AF37]"></span> Network with winners</li>
                   <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_5px_#D4AF37]"></span> Location Independence</li>
                </ul>
             </div>
          </div>

          {/* Section 4: The Pledge */}
          <div className="text-center pt-12">
             <h1 className="text-6xl md:text-9xl font-bold tracking-tighter text-[#111] drop-shadow-[0_1px_0_rgba(255,255,255,0.1)] mb-6">
               ESCAPE
             </h1>
             <p className="text-white text-lg font-medium max-w-xl mx-auto mb-12">
               The door is open. We have given you the map. We have given you the weapons. Now you must choose to fight.
             </p>
             <button 
               onClick={onJoin}
               className="px-12 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#E5C048] hover:scale-105 transition-all shadow-[0_0_40px_rgba(212,175,55,0.3)]"
             >
               I Am Ready
             </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Manifesto;