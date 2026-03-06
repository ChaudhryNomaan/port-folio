"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions'; 

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    const result = await loginAction(password);

    if (result.success) {
      router.push('/admin/dashboard');
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <span className="text-amber-500 text-[10px] uppercase tracking-[1em] font-bold block mb-4">Security</span>
          <h1 className="text-3xl font-light text-white tracking-tighter uppercase font-serif italic">Liza Studio</h1>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="ACCESS KEY"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-none px-4 py-4 text-white outline-none focus:border-amber-500/50 transition-colors text-center tracking-[0.3em]"
            required
          />
          {error && <p className="text-red-500 text-[10px] uppercase text-center tracking-widest">Invalid Credentials</p>}
          <button 
            disabled={loading}
            className="w-full bg-amber-500 text-black font-bold py-4 text-[11px] uppercase tracking-[0.5em] hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Authorize'}
          </button>
        </form>
      </div>
    </div>
  );
}