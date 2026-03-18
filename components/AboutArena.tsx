import React from 'react';
import { Zap, Shield, Users, Trophy, Target, Brain } from 'lucide-react';

const AboutArena: React.FC = () => {
  return (
    <section className="relative py-32 px-6 bg-[#000000] border-t border-white/5 overflow-hidden">
        {/* Background Grid & Ambient */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none"></div>
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
            
            {/* Content Side */}
            <div className="space-y-10">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                        <Target size={12} className="text-[#D4AF37]" />
                        <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">Our Philosophy</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[0.9] mb-6">
                        CIVILIZATION <br/>
                        IS A <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F59E0B]">PRISON.</span>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed font-light mx-auto max-w-2xl">
                        You have been conditioned to be weak. To accept "average". To work a job you hate to buy things you don't need.
                        <br/><br/>
                        <strong className="text-white font-medium">We are the jailbreak.</strong> The Arena is not just a community; it is a separate economy, a separate society, and a separate reality. We operate outside the matrix.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-10">
                    {[
                        {
                            icon: Brain,
                            title: "Mental Sovereignty",
                            desc: "We deprogram the lies society taught you. No fear. No hesitation. Pure, cold, calculated logic.",
                            color: "text-blue-500"
                        },
                        {
                            icon: Shield,
                            title: "Financial Fortress",
                            desc: "Wealth is the only true shield against tyranny. We build automated income systems that cannot be stopped.",
                            color: "text-[#D4AF37]"
                        },
                        {
                            icon: Users,
                            title: "Tribal Warfare",
                            desc: "A lone wolf dies. A pack survives. We are a global network of 150,000+ men watching each other's six.",
                            color: "text-red-500"
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="group flex flex-col items-center text-center gap-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-[#D4AF37]/20 transition-all duration-300">
                            <div className={`w-14 h-14 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                                <item.icon className={`w-7 h-7 ${item.color}`} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-3 group-hover:text-[#D4AF37] transition-colors">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
};

export default AboutArena;