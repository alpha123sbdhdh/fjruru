
import React from 'react';
import { Zap, Globe, Feather, Dna, Award } from 'lucide-react';

const MENTORS = [
  {
    id: 1,
    name: "THE BARON",
    role: "E-Commerce General",
    netWorth: "$100M+",
    specialty: "Global Logistics",
    quote: "I don't sell products. I sell desire.",
    icon: <Globe className="w-5 h-5 text-white" />,
    image: "https://picsum.photos/seed/baron/600/800",
    gradient: "from-yellow-600/20 to-yellow-900/20"
  },
  {
    id: 2,
    name: "THE ORACLE",
    role: "Crypto & DeFi",
    netWorth: "$85M+",
    specialty: "Market Cycles",
    quote: "Volatility is only dangerous if you are blind.",
    icon: <Zap className="w-5 h-5 text-white" />,
    image: "https://picsum.photos/seed/oracle/600/800",
    gradient: "from-blue-600/20 to-purple-900/20"
  },
  {
    id: 3,
    name: "THE SCRIBE",
    role: "Master Copywriter",
    netWorth: "$40M+",
    specialty: "Mass Psychology",
    quote: "Words are weapons. I teach you how to aim.",
    icon: <Feather className="w-5 h-5 text-white" />,
    image: "https://picsum.photos/seed/scribe/600/800",
    gradient: "from-emerald-600/20 to-teal-900/20"
  },
  {
    id: 4,
    name: "THE TITAN",
    role: "Bio-Hacking",
    netWorth: "Priceless",
    specialty: "Physical Dominance",
    quote: "A weak body houses a weak mind.",
    icon: <Dna className="w-5 h-5 text-white" />,
    image: "https://picsum.photos/seed/titan/600/800",
    gradient: "from-red-600/20 to-red-900/20"
  }
];

const Mentors: React.FC<{ id?: string }> = ({ id }) => {
  return (
    <section id={id} className="relative bg-[#000000] py-32 px-6 overflow-hidden border-t border-white/5">
      
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Header - Minimalist Apple Style */}
        <div className="mb-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
            <Award className="w-3 h-3 text-[#D4AF37]" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase">World Class Faculty</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            The Generals.
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
            Trained by multi-millionaire commanders who have conquered the real world. No theory. Only results.
          </p>
        </div>

        {/* Bento Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
          {MENTORS.map((mentor, i) => (
            <div 
              key={mentor.id}
              className="group relative h-[520px] rounded-[32px] bg-[#0a0a0a] overflow-hidden transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.7)] border border-white/5 hover:border-white/10"
            >
               {/* Dynamic Background Gradient */}
               <div className={`absolute inset-0 bg-gradient-to-b ${mentor.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
               
               {/* Image with Parallax Feel */}
               <div className="absolute inset-0">
                 <img 
                    src={mentor.image} 
                    alt={mentor.name} 
                    className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110 ease-[cubic-bezier(0.25,1,0.5,1)]"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
               </div>

               {/* Floating Content Layer */}
               <div className="absolute inset-0 p-8 flex flex-col justify-end relative z-10">
                  
                  {/* Top Icon Floating */}
                  <div className="absolute top-6 left-6 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center transform transition-transform duration-500 group-hover:translate-y-2 group-hover:rotate-3 shadow-lg">
                     {mentor.icon}
                  </div>

                  <div className="transform transition-all duration-500 translate-y-8 group-hover:translate-y-0">
                     <div className="mb-2 flex items-baseline gap-2">
                       <h3 className="text-3xl font-bold text-white tracking-tight">{mentor.name}</h3>
                       <span className="text-[10px] font-mono text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity delay-100">0{i + 1}</span>
                     </div>
                     
                     <p className="text-sm text-gray-300 font-medium uppercase tracking-wider mb-6">{mentor.role}</p>
                     
                     {/* Reveal Content */}
                     <div className="space-y-4 overflow-hidden max-h-0 group-hover:max-h-[200px] transition-[max-height] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] opacity-0 group-hover:opacity-100">
                        <div className="h-[1px] w-full bg-white/20 mb-4"></div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                           <div>
                              <p className="text-gray-500 mb-1 uppercase tracking-wider text-[10px]">Net Worth</p>
                              <p className="text-white font-bold font-mono">{mentor.netWorth}</p>
                           </div>
                           <div>
                              <p className="text-gray-500 mb-1 uppercase tracking-wider text-[10px]">Focus</p>
                              <p className="text-white font-bold">{mentor.specialty}</p>
                           </div>
                        </div>
                        
                        <p className="text-[#D4AF37] text-sm italic pt-2 leading-relaxed opacity-90">
                           "{mentor.quote}"
                        </p>
                     </div>
                  </div>
               </div>

               {/* Glass Shine on Hover */}
               <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -translate-x-full group-hover:translate-x-full transition-transform" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mentors;
