import React, { useState } from 'react';
import Button from './Button';
import { Clock, Globe, ShieldAlert } from 'lucide-react';

const Hero: React.FC<{ onJoin: () => void }> = ({ onJoin }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start pt-32 overflow-hidden">
      
      {/* Central Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-5xl mx-auto w-full">
        
        {/* 3D Animated Medallion Logo */}
        <div 
          className="flex flex-col items-center mb-10 animate-fade-in-up perspective-1000"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
            <div 
              className={`
                w-24 h-24 rounded-[2.5rem] bg-gradient-to-b from-[#1a1a1a] to-black 
                border border-white/10 flex items-center justify-center shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] 
                mb-6 relative overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${hovered ? 'scale-110 rotate-3 shadow-[0_30px_80px_-15px_rgba(212,175,55,0.2)] border-[#D4AF37]/30' : 'scale-100'}
              `}
            >
                 {/* Metallic sheen */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 pointer-events-none"></div>
                 
                 {/* Logo SVG */}
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-[#D4AF37] drop-shadow-lg">
                    <defs>
                      <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE580" />
                        <stop offset="50%" stopColor="#D4AF37" />
                        <stop offset="100%" stopColor="#8B6F18" />
                      </linearGradient>
                    </defs>
                    <path d="M2 20h20" strokeLinecap="round" stroke="url(#gold-grad)" />
                    <path d="M5 20v-5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5" strokeLinejoin="round" stroke="url(#gold-grad)" />
                    <path d="M10 13V9a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4" stroke="url(#gold-grad)" />
                    <path d="M2 13c0-3 3.5-5 10-5s10 2 10 5" stroke="url(#gold-grad)" />
                    <path d="M6 13v2" stroke="url(#gold-grad)" />
                    <path d="M18 13v2" stroke="url(#gold-grad)" />
                 </svg>
            </div>
            <span className="text-[10px] tracking-[0.5em] font-bold text-[#444] uppercase group-hover:text-[#D4AF37] transition-colors">The Arena</span>
        </div>

        {/* Notification Pill */}
        <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0, animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md shadow-2xl relative overflow-hidden group hover:border-[#D4AF37]/20 transition-all cursor-pointer">
                <Globe className="w-3 h-3 text-gray-400" />
                <span className="font-medium text-gray-300 text-[10px] uppercase tracking-[0.2em]">Global Network Active</span>
                <span className="text-gray-700 font-light">|</span>
                <span className="text-[#D4AF37] font-mono text-[10px] tracking-widest">150,000+ AGENTS</span>
            </div>
        </div>

        {/* Main Headlines - Staggered Animation */}
        <div className="flex flex-col items-center space-y-1 mb-12">
            <h1 
              className="text-5xl md:text-8xl font-bold text-white tracking-tighter drop-shadow-2xl animate-fade-in-up" 
              style={{ animationDelay: '200ms', opacity: 0, animationFillMode: 'forwards' }}
            >
                This Is Not School.
            </h1>
            <h1 
              className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-400 to-gray-600 tracking-tighter animate-fade-in-up" 
              style={{ animationDelay: '400ms', opacity: 0, animationFillMode: 'forwards' }}
            >
                This Is War.
            </h1>
        </div>

        {/* Subtitle / Clock */}
        <div className="max-w-xl mx-auto mb-16 animate-fade-in-up" style={{ animationDelay: '600ms', opacity: 0, animationFillMode: 'forwards' }}>
            <p className="text-gray-400 text-lg font-light leading-relaxed">
                <span className="text-white font-normal">The system lied to you.</span> Society trained you to be prey. 
                We reverse the programming and turn you into a predator.
            </p>
        </div>

        {/* Action Button */}
        <div className="animate-fade-in-up flex flex-col items-center gap-6" style={{ animationDelay: '800ms', opacity: 0, animationFillMode: 'forwards' }}>
             <Button 
              onClick={onJoin} 
              className="
                px-16 py-5 
                bg-gradient-to-b from-[#D4AF37] to-[#b89628]
                text-black 
                shadow-[0_0_40px_rgba(212,175,55,0.15)] 
                text-sm font-bold tracking-[0.2em] uppercase rounded-full
                transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                hover:scale-105 hover:-translate-y-1.5
                hover:shadow-[0_20px_80px_rgba(212,175,55,0.4)]
                hover:brightness-110
                ring-1 ring-white/20
              "
            >
                Join The War
             </Button>
             <div className="flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest">
                <ShieldAlert className="w-3 h-3" />
                <span>Price Rising Soon</span>
             </div>
        </div>

      </div>

      {/* Bottom Card Element (The "Portal") */}
      <div className="absolute bottom-0 left-0 right-0 h-[180px] z-10 flex justify-center overflow-hidden pointer-events-none">
          <div className="w-full max-w-[1400px] h-full bg-gradient-to-b from-[#080808] to-black rounded-t-[80px] border-t border-white/5 relative flex flex-col items-center justify-start pt-1 shadow-[0_-20px_100px_-20px_rgba(0,0,0,1)]">
               {/* Glowing Line */}
               <div className="absolute top-0 left-[30%] right-[30%] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-30 box-shadow-[0_0_30px_#D4AF37]"></div>
               
               <div className="absolute top-10 text-center opacity-30">
                  <span className="text-[9px] font-mono text-gray-500 tracking-[0.4em] uppercase">System: Operational</span>
               </div>
          </div>
      </div>

    </div>
  );
};

export default Hero;