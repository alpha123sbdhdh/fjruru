
import React, { useState, useEffect } from 'react';
import { Shield, User, UserPlus, ShieldAlert, ChevronLeft, Search, MoreVertical, Check, X } from 'lucide-react';
import { Member } from '../types';

interface AdminPortalProps {
  currentUser: any;
  onBack: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ currentUser, onBack }) => {
  const [users, setUsers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const roles: Member['role'][] = ['General', 'Admin', 'Co-Admin', 'Officer', 'Soldier', 'Recruit'];

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      // Map server users to Member type
      const mappedUsers = data.users.map((u: any) => ({
        id: u.id,
        name: u.username,
        avatar: u.avatar,
        role: u.role,
        status: u.status || 'offline'
      }));
      setUsers(mappedUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: Member['role']) => {
    setUpdatingUserId(userId);
    try {
      const res = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: currentUser.id,
          userId,
          newRole
        })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update role');
      }
    } catch (err) {
      console.error('Update role error:', err);
      alert('Connection error');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">User Management & Roles</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Authorized: {currentUser.role}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              placeholder="Search users by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all"
            />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Total Users</p>
              <p className="text-2xl font-mono font-bold">{users.length}</p>
            </div>
            <User className="w-8 h-8 text-gray-700" />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">User</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Current Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-gray-500 font-mono">Loading user database...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500 font-mono text-sm">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="w-10 h-10 rounded-full border border-white/10"
                            />
                            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#09090b] ${
                              user.status === 'online' ? 'bg-emerald-500' : 
                              user.status === 'idle' ? 'bg-amber-500' : 
                              user.status === 'dnd' ? 'bg-red-500' : 'bg-gray-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{user.name}</p>
                            <p className="text-[10px] text-gray-500 font-mono">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'General' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          user.role === 'Admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          user.role === 'Co-Admin' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                          user.role === 'Officer' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-gray-500/10 text-gray-400 border border-white/10'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select 
                            value={user.role}
                            disabled={updatingUserId === user.id || user.id === currentUser.id}
                            onChange={(e) => handleUpdateRole(user.id, e.target.value as Member['role'])}
                            className="bg-black border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#D4AF37] disabled:opacity-50"
                          >
                            {roles.map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                          {updatingUserId === user.id && (
                            <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
