import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Loader2, Send, Briefcase, Clock, DollarSign, Target, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CareerArchitectProps {
  onToggleMobileMenu: () => void;
}

const CareerArchitect: React.FC<CareerArchitectProps> = ({ onToggleMobileMenu }) => {
  const [skills, setSkills] = useState('');
  const [capital, setCapital] = useState('');
  const [time, setTime] = useState('');
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!skills || !capital || !time) {
      setError('Please fill in all fields to generate your roadmap.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is missing. Please set GEMINI_API_KEY in your environment.');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
You are an elite AI Career Architect for an exclusive community of ambitious individuals.
Your goal is to audit the user's current skills, capital, and available time to build a highly customized, actionable 90-day roadmap.
Instead of suggesting saturated niches like dropshipping, you must disperse talent across varied, high-demand, and potentially unconventional industries tailored specifically to this individual's profile.

User Profile:
- Current Skills: ${skills}
- Available Capital: ${capital}
- Available Time: ${time}

Generate a detailed 90-day roadmap. Format the response in Markdown.
Include:
1.  **The Verdict**: A brief, hard-hitting analysis of their profile and the specific, unique industry/niche they should attack.
2.  **Phase 1: Foundation (Days 1-30)**: Specific actions, learning goals, and setup.
3.  **Phase 2: Execution (Days 31-60)**: Launching, outreach, or building the core product/service.
4.  **Phase 3: Scaling & Revenue (Days 61-90)**: Monetization, optimization, and growth tactics.
5.  **Daily Non-Negotiables**: 3-4 daily habits they must stick to.

Be direct, authoritative, and practical. No fluff.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });

      setRoadmap(response.text || 'Failed to generate roadmap. Please try again.');
    } catch (err: any) {
      console.error('Error generating roadmap:', err);
      setError(err.message || 'An error occurred while generating your roadmap.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-white overflow-y-auto">
      <div className="md:hidden h-[60px] flex items-center px-4 border-b border-white/10 bg-[#18181b] shrink-0 sticky top-0 z-30">
        <button onClick={onToggleMobileMenu} className="mr-4 text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        </button>
        <span className="font-bold text-sm truncate">AI Career Architect</span>
      </div>

      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-4">
            <Sparkles className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">AI Career Architect</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Stop following the herd into saturated markets. Provide your intel below, and our AI will engineer a custom 90-day roadmap to dominate a high-demand, low-competition niche tailored to your exact profile.
          </p>
        </div>

        {!roadmap && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <Briefcase size={16} className="text-[#D4AF37]" />
                  Current Skills & Experience
                </label>
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., Basic Python, good at writing, 3 years in B2B sales..."
                  className="w-full bg-[#1F2937] border border-white/5 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 min-h-[100px] resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                    <DollarSign size={16} className="text-emerald-400" />
                    Available Capital
                  </label>
                  <input
                    type="text"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    placeholder="e.g., $500, $5000, or $0"
                    className="w-full bg-[#1F2937] border border-white/5 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                    <Clock size={16} className="text-blue-400" />
                    Available Time
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g., 2 hours/day, Weekends only, Full-time"
                    className="w-full bg-[#1F2937] border border-white/5 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-2">
                  <Target size={16} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-[#D4AF37] hover:bg-[#E5C048] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Architecting Your Path...
                  </>
                ) : (
                  <>
                    <Target size={20} />
                    Generate 90-Day Roadmap
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {roadmap && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" />
                Your Custom Directive
              </h2>
              <button
                onClick={() => setRoadmap(null)}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                Start Over <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl prose prose-invert max-w-none prose-headings:text-[#D4AF37] prose-a:text-blue-400 hover:prose-a:text-blue-300">
              <ReactMarkdown>{roadmap}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerArchitect;
