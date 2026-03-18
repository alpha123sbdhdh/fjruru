
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import Manifesto from './components/Manifesto';
import ThePromise from './components/ThePromise';
import TheExchange from './components/TheExchange';
import AboutArena from './components/AboutArena';
import Testimonials from './components/Testimonials';
import { ViewState } from './types';
import { Swords, Crosshair, Skull, Info } from 'lucide-react';

function App() {
  const [view, setView] = useState<ViewState>('landing');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setView('dashboard');
    }
  }, []);

  const showLogin = () => setView('login');
  const showSignup = () => setView('signup');
  const enterArena = () => setView('dashboard');
  const exitArena = () => {
    localStorage.removeItem('user');
    setView('landing');
  };

  if (view === 'dashboard') {
    return <Dashboard onLogout={exitArena} />;
  }

  if (view === 'login' || view === 'signup' || view === 'forgot-password') {
    return (
      <Auth 
        initialMode={view === 'forgot-password' ? 'forgot-password' : (view === 'signup' ? 'signup' : 'login')} 
        onSuccess={enterArena} 
        onBack={exitArena} 
      />
    );
  }

  return (
    <div className="antialiased min-h-screen bg-[#000000] text-white font-sans selection:bg-[#D4AF37]/30">
      {/* Minimalist Navigation */}
      <nav className="absolute top-0 w-full z-50 px-6 py-8 md:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Left: Branding */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full group-hover:shadow-[0_0_10px_#D4AF37] transition-all"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 group-hover:text-white transition-colors">
              The Arena
            </span>
          </div>

          {/* Right: Login Pill Button */}
          <button 
            onClick={showLogin}
            className="group relative px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-bold tracking-[0.15em] hover:bg-white hover:text-black transition-all duration-300 uppercase"
          >
            Access Terminal
          </button>
        </div>
      </nav>
      
      <Hero onJoin={showSignup} />
      <AboutArena />
      
      <Testimonials />

      <ThePromise />
      <TheExchange onJoin={showSignup} />
      <Manifesto id="manifesto" onJoin={showSignup} />
    </div>
  );
}

export default App;
