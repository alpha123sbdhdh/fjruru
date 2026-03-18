import React, { useState } from 'react';
import { Menu, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle, Clock, Search, Filter, Plus } from 'lucide-react';
import { STRATEGIES } from '../constants';
import { Strategy } from '../types';

interface StrategyAuditsProps {
  onToggleMobileMenu: () => void;
}

export default function StrategyAudits({ onToggleMobileMenu }: StrategyAuditsProps) {
  const [strategies, setStrategies] = useState<Strategy[]>(STRATEGIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const handleVote = (id: string, type: 'up' | 'down') => {
    setStrategies(prev => prev.map(strat => {
      if (strat.id === id) {
        const newUpvotes = type === 'up' ? strat.upvotes + 1 : strat.upvotes;
        const newDownvotes = type === 'down' ? strat.downvotes + 1 : strat.downvotes;
        
        // Auto-update status based on votes
        let newStatus = strat.status;
        const totalVotes = newUpvotes + newDownvotes;
        if (totalVotes > 50) {
          const downvoteRatio = newDownvotes / totalVotes;
          if (downvoteRatio > 0.6) {
            newStatus = 'Saturated';
          } else if (downvoteRatio > 0.4) {
            newStatus = 'Under Review';
          } else {
            newStatus = 'Active';
          }
        }

        return {
          ...strat,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          status: newStatus
        };
      }
      return strat;
    }));
  };

  const filteredStrategies = strategies.filter(strat => {
    const matchesSearch = strat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          strat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || strat.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Under Review': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Saturated': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle size={14} className="mr-1" />;
      case 'Under Review': return <Clock size={14} className="mr-1" />;
      case 'Saturated': return <AlertTriangle size={14} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-white">
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 shrink-0 bg-[#09090b]/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            <Menu size={20} />
          </button>
          <div>
            <h2 className="font-bold text-[15px] flex items-center gap-2">
              <AlertTriangle size={16} className="text-[#D4AF37]" />
              Strategy Audits
            </h2>
            <p className="text-[11px] text-gray-400">Radical transparency. Flag saturated methods.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37] text-black text-xs font-bold rounded hover:bg-[#F3C623] transition-colors">
          <Plus size={14} />
          <span className="hidden sm:inline">Submit Strategy</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search strategies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121214] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
              <Filter size={16} className="text-gray-500 shrink-0" />
              {['All', 'Active', 'Under Review', 'Saturated'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    filterStatus === status 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Strategies List */}
          <div className="grid gap-4">
            {filteredStrategies.map(strat => (
              <div key={strat.id} className="bg-[#121214] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
                <div className="flex flex-col md:flex-row gap-5">
                  
                  {/* Voting Column */}
                  <div className="flex md:flex-col items-center gap-2 bg-black/20 p-2 rounded-lg shrink-0 w-full md:w-16 justify-center">
                    <button 
                      onClick={() => handleVote(strat.id, 'up')}
                      className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors"
                      title="Still works"
                    >
                      <ThumbsUp size={18} />
                    </button>
                    <span className="text-sm font-bold text-gray-300 min-w-[2rem] text-center">
                      {strat.upvotes - strat.downvotes}
                    </span>
                    <button 
                      onClick={() => handleVote(strat.id, 'down')}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                      title="Flag as saturated"
                    >
                      <ThumbsDown size={18} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{strat.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <img src={strat.authorAvatar} alt={strat.authorName} className="w-5 h-5 rounded-full" />
                          <span>Posted by <span className="text-gray-300">{strat.authorName}</span></span>
                          <span>•</span>
                          <span>{strat.lastUpdated.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className={`flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(strat.status)}`}>
                        {getStatusIcon(strat.status)}
                        {strat.status}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      {strat.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {strat.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white/5 text-gray-400 rounded text-[10px] uppercase font-bold tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredStrategies.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <AlertTriangle size={32} className="mx-auto mb-3 opacity-50" />
                <p>No strategies found matching your criteria.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
