'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Sparkles, KeyRound, Mail, UserCheck, Building2, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'OPS' | 'REGIONAL' | 'OWNER'>('OPS');

  const handleDemoLogin = async (role = selectedRole) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo-login', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Demo login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md cyber-card p-8 space-y-6 shadow-2xl bg-white border border-cyber-borderLight">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white mb-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-black">Sign In to FranchiseGuard</h2>
          <p className="text-xs text-cyber-grayText">Enterprise Franchise Compliance Intelligence Platform</p>
        </div>

        {/* Instant Role Switcher */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-cyber-grayText text-center">
            Demo Presentation Personas
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedRole('OPS')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedRole === 'OPS'
                  ? 'bg-black text-white border-black'
                  : 'bg-[#FAFAFA] border-cyber-borderLight text-cyber-grayText hover:text-black'
              }`}
            >
              <span className="text-[10px] font-bold uppercase block">Ops Manager</span>
              <span className="text-[9px] opacity-80 block truncate">Sarah Jenkins</span>
            </button>

            <button
              onClick={() => setSelectedRole('REGIONAL')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedRole === 'REGIONAL'
                  ? 'bg-black text-white border-black'
                  : 'bg-[#FAFAFA] border-cyber-borderLight text-cyber-grayText hover:text-black'
              }`}
            >
              <span className="text-[10px] font-bold uppercase block">Regional VP</span>
              <span className="text-[9px] opacity-80 block truncate">Austin Lead</span>
            </button>

            <button
              onClick={() => setSelectedRole('OWNER')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedRole === 'OWNER'
                  ? 'bg-black text-white border-black'
                  : 'bg-[#FAFAFA] border-cyber-borderLight text-cyber-grayText hover:text-black'
              }`}
            >
              <span className="text-[10px] font-bold uppercase block">Franchisee</span>
              <span className="text-[9px] opacity-80 block truncate">Owner Group #42</span>
            </button>
          </div>
        </div>

        {/* Demo Fast Login Button */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => handleDemoLogin(selectedRole)}
            disabled={loading}
            className="cyber-btn-black w-full py-3 rounded-xl text-xs uppercase tracking-wider font-bold"
          >
            {loading ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin text-amber-400" />
                <span>Authenticating Persona...</span>
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4" />
                <span>Enter as {selectedRole === 'OPS' ? 'Corporate Ops Manager' : selectedRole === 'REGIONAL' ? 'Regional VP' : 'Franchise Owner'}</span>
              </>
            )}
          </button>

          <Link
            href="/dashboard"
            className="cyber-btn-white w-full py-3 rounded-xl text-xs font-bold text-center block"
          >
            Skip to Public Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
