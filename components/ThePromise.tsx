import React from 'react';
import { User, Crown, ArrowRight, XCircle, CheckCircle2 } from 'lucide-react';

const ThePromise: React.FC = () => {
  return (
    <section className="relative py-32 px-6 bg-[#020205] overflow-hidden border-t border-white/5">
       {/* Background FX */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_70%)] pointer-events-none" />
       
       {/* Floating Particles (CSS based simple dots) */}
       <div className="absolute top-20 left-20 w-2 h-2 bg-white/10 rounded-full animate-pulse"></div>
       <div className="absolute bottom-40 right-40 w-3 h-3 bg-[#D4AF37]/20 rounded-full animate-pulse delay-700"></div>

       <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6">The Promise</h2>
             <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
                Most men will scroll past this and stay slaves. <br/>
                <span className="text-white font-medium">The men who join THE ARENA become the new elite.</span>
             </p>
          </div>

          <div className="flex flex-col md:flex-row gap-12 md:gap-0 items-center justify-center perspective-1000">

            {/* Card 1: The Slave (Average) */}
            <div className="group relative w-full md:w-[380px] h-[520px] bg-[#080808] rounded-[32px] border border-white/5 p-8 flex flex-col items-center transition-all duration-500 hover:bg-[#0f0f0f] hover:border-white/10 hover:shadow-2xl">
                {/* Header Image / Icon */}
                <div className="w-24 h-24 rounded-full bg-[#111] border border-white/5 flex items-center justify-center mb-10 group-hover:scale-95 transition-transform duration-500 grayscale opacity-50">
                    <User size={40} className="text-gray-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-600 mb-2 tracking-widest uppercase group-hover:text-gray-500 transition-colors">The Average</h3>
                <p className="text-xs font-mono text-gray-700 mb-10 uppercase tracking-widest">Path of Least Resistance</p>

                <ul className="space-y-6 w-full px-4">
                   {[
                     "Ignored by high-value women", 
                     "Slave to a 9-5 boss", 
                     "Weak, forgettable physique", 
                     "Constant financial anxiety"
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-4 text-gray-600 font-medium text-sm group-hover:text-gray-500 transition-colors">
                        <XCircle size={16} className="text-red-900/50 shrink-0" />
                        {item}
                     </li>
                   ))}
                </ul>
            </div>

            {/* Connector Visual */}
            <div className="hidden md:flex flex-col items-center justify-center w-40 relative z-20">
               {/* Glowing Line */}
               <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#333] to-transparent absolute"></div>
               {/* Central Button */}
               <div className="w-16 h-16 rounded-full bg-[#050505] border border-white/10 flex items-center justify-center z-10 shadow-2xl">
                 <ArrowRight size={24} className="text-gray-600" />
               </div>
            </div>

            {/* Card 2: The King (Elite) */}
             <div className="relative w-full md:w-[420px] h-[580px] rounded-[32px] p-1 flex flex-col items-center transform md:scale-105 z-10 transition-transform duration-500 hover:-translate-y-2">
                {/* Gradient Border Background */}
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-[#D4AF37] via-[#8B6F18] to-transparent opacity-30 blur-sm"></div>
                
                <div className="relative w-full h-full bg-[#050505] rounded-[30px] p-8 flex flex-col items-center overflow-hidden border border-[#D4AF37]/20 backdrop-blur-xl shadow-[0_0_60px_-20px_rgba(212,175,55,0.15)]">
                    {/* Inner Ambient Light */}
                    <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-64 h-64 bg-[#D4AF37] opacity-10 blur-[100px] pointer-events-none"></div>

                    <div className="w-28 h-28 rounded-full bg-gradient-to-b from-[#1a1a1a] to-black border border-[#D4AF37]/30 flex items-center justify-center mb-10 shadow-[0_10px_30px_-10px_rgba(212,175,55,0.3)] relative group">
                        <div className="absolute inset-0 bg-[#D4AF37] opacity-5 rounded-full animate-pulse"></div>
                        <Crown size={48} className="text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-2 tracking-widest uppercase">The Elite</h3>
                    <p className="text-xs font-mono text-[#D4AF37] mb-10 uppercase tracking-widest">Path of The Arena</p>

                    <ul className="space-y-6 w-full px-4 relative z-10">
                        {[
                            "Commands respect instantly",
                            "Complete financial freedom",
                            "Unbreakable, dangerous body",
                            "Absolute authority over life"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-4 text-white font-bold text-sm tracking-wide">
                                <CheckCircle2 size={18} className="text-[#D4AF37] shrink-0 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    
                    {/* Bottom Seal */}
                    <div className="mt-auto pt-8 border-t border-white/10 w-full flex justify-center">
                       <div className="px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase">
                          Guaranteed Result
                       </div>
                    </div>
                </div>
            </div>

          </div>
          
          <div className="text-center mt-32 relative">
             <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-32 h-32 bg-white opacity-[0.02] blur-[50px] rounded-full"></div>
             <p className="relative z-10 text-3xl md:text-5xl font-bold text-white font-display tracking-tighter leading-tight">
               "This is where boys die <br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] to-[#8B6F18]">and legends are born.</span>"
             </p>
          </div>
       </div>
    </section>
  );
}
export default ThePromise;