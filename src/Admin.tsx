
import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import { Download, Users, Eye, Database, Lock } from 'lucide-react';

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Simple hardcoded simple auth for demo purposes
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('Invalid Password');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    // Fetch Waitlist
    const { data: waitlistData } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Fetch Visits
    const { data: visitsData } = await supabase
        .from('site_visits')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

    setWaitlist(waitlistData || []);
    setVisits(visitsData || []);
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-peach rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-stone-900" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Admin Access</h2>
          <p className="text-stone-500 mb-6 text-sm">Enter the password to view dashboard</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-100 border border-stone-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-peach"
              placeholder="Password"
            />
            <button className="w-full bg-stone-900 text-white font-bold py-3 rounded-lg hover:bg-stone-800 transition-colors">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-black uppercase text-stone-900 tracking-tight">Sorar Admin</h1>
                <p className="text-stone-500">Live Database Overview</p>
            </div>
            <button onClick={fetchData} disabled={loading} className="text-sm font-bold bg-white px-4 py-2 rounded-lg hover:bg-stone-200 border border-stone-200 disabled:opacity-50">
                {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Waitlist Count */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-stone-400 text-xs font-bold uppercase tracking-wider">Total Waitlist</h3>
                    <p className="text-3xl font-black text-stone-900">{waitlist.length}</p>
                </div>
            </div>

            {/* Visits Count */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-stone-400 text-xs font-bold uppercase tracking-wider">Site Visits</h3>
                    <p className="text-3xl font-black text-stone-900">{visits.length}</p>
                </div>
            </div>

             {/* Database Status */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-stone-400 text-xs font-bold uppercase tracking-wider">System Status</h3>
                    <p className="text-lg font-bold text-stone-900 text-green-500">Active • Live</p>
                </div>
            </div>
        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Waitlist Table */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Waitlist Entries</h2>
                    <button className="text-xs font-bold uppercase bg-stone-100 px-3 py-1 rounded hover:bg-peach hover:text-stone-900 transition-colors flex items-center gap-2">
                        <Download className="w-3 h-3" /> Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-stone-100 text-stone-400 text-xs uppercase tracking-wider">
                                <th className="pb-3 pl-2">Email</th>
                                <th className="pb-3">Date Joined</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {waitlist.map((entry) => (
                                <tr key={entry.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors group">
                                    <td className="py-3 pl-2 font-medium text-stone-700">{entry.email}</td>
                                    <td className="py-3 text-stone-500">{new Date(entry.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {waitlist.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="py-8 text-center text-stone-400">No entries yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Visits Log */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Recent Traffic</h2>
                </div>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {visits.map((visit) => (
                        <div key={visit.id} className="flex items-start gap-4 pb-4 border-b border-stone-100 last:border-0 relative">
                             <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0"></div>
                             <div className="flex-1">
                                 <p className="text-xs font-bold text-stone-900 mb-1">{new Date(visit.timestamp).toLocaleString()}</p>
                                 <p className="text-xs text-stone-500 font-mono break-all">{visit.path} <span className="text-stone-300">|</span> {visit.referrer || 'Direct'}</p>
                                 <p className="text-[10px] text-stone-300 mt-1 truncate max-w-xs">{visit.user_agent}</p>
                             </div>
                        </div>
                    ))}
                    {visits.length === 0 && (
                        <p className="text-center text-stone-400 py-8">No visits recorded.</p>
                    )}
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}
