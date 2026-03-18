
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AuthProps {
  initialMode: 'login' | 'signup' | 'forgot-password';
  onSuccess: () => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ initialMode, onSuccess, onBack }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState<{ code: string; message: string } | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/signup';
      const body = mode === 'login' 
        ? { email, password }
        : { username: fullName, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        // If response is not JSON, it's likely a server error page (HTML)
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server error: Received non-JSON response");
      }

      if (res.ok) {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        localStorage.setItem('user', JSON.stringify(data));
        onSuccess();
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a short password reset message for a user with email ${email}. 
        Include a 6-digit numeric security code. 
        Format as JSON with keys: "code" and "message".`,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{}');
      setResetSent({
        code: data.code || "842-991",
        message: data.message || "Use the following code to reset your password."
      });
    } catch (err) {
      console.error(err);
      setResetSent({
        code: "992-001",
        message: "Connection error. Manual override code generated."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#09090b] font-sans">
      
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></div>
        <span className="text-gray-400 tracking-[0.15em] font-bold text-sm">THE ARENA</span>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[400px] px-4">
        <div className="bg-[#18181b] border border-white/5 rounded-xl p-8 shadow-xl">
          
          {mode === 'login' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-white text-center mb-6">Welcome Back</h1>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <input 
                    required
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#27272a]/50 border border-white/5 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6]/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#27272a]/50 border border-white/5 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6]/50 transition-all"
                  />
                </div>

                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-4 h-4 border border-white/20 bg-[#27272a]/50 rounded transition-all peer-checked:bg-[#3b82f6] peer-checked:border-[#3b82f6]"></div>
                      <svg 
                        className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity left-0.5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                  </label>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-2.5 rounded-lg transition-colors mt-2 flex items-center justify-center"
                >
                  {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In'}
                </button>
              </form>

              <div className="text-center pt-2">
                <button 
                  onClick={() => setMode('signup')}
                  className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
                >
                  Don't have an account? Sign up
                </button>
              </div>
              
              <div className="text-center pt-2">
                <button 
                  onClick={() => setMode('forgot-password')}
                  className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-white text-center mb-6">Create Account</h1>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#27272a]/50 border border-white/5 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6]/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <input 
                    required
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#27272a]/50 border border-white/5 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6]/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#27272a]/50 border border-white/5 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6]/50 transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-2.5 rounded-lg transition-colors mt-2 flex items-center justify-center"
                >
                  {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign Up'}
                </button>
              </form>

              <div className="text-center pt-2">
                <button 
                  onClick={() => setMode('login')}
                  className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          )}

          {mode === 'forgot-password' && (
            <div className="space-y-6">
              {!resetSent ? (
                <>
                  <h1 className="text-2xl font-bold text-white text-center mb-6">Reset Password</h1>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-300">Email</label>
                      <input 
                        required
                        type="email" 
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#27272a]/50 border border-white/5 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6]/50 transition-all"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-2.5 rounded-lg transition-colors mt-2 flex items-center justify-center"
                    >
                      {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Send Reset Code'}
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <button 
                      onClick={() => setMode('login')}
                      className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
                    >
                      Back to login
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-6">
                  <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
                  <p className="text-sm text-gray-400">{resetSent.message}</p>
                  
                  <div className="bg-[#09090b] p-6 rounded-lg border border-white/5 inline-block">
                    <span className="text-3xl font-mono text-white tracking-widest">{resetSent.code}</span>
                  </div>

                  <button 
                    onClick={() => setMode('login')}
                    className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-2.5 rounded-lg transition-colors mt-4"
                  >
                    Return to Login
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <button 
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <ChevronLeft size={16} />
            Back to landing page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
