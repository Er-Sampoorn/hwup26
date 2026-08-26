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
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel-glow rounded-3xl p-8 space-y-6 shadow-2xl border border-slate-800">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Sign In to FranchiseGuard AI</h2>
          <p className="text-xs text-slate-400">Enterprise Franchise Compliance Intelligence Platform</p>
        </div>

        {/* 1-Click Role Switcher for Pitch */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
            Instant Presentation Demo Personas
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedRole('OPS')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedRole === 'OPS'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-[10px] font-bold uppercase block">Ops Manager</span>
              <span className="text-[9px] text-slate-400 block truncate">Sarah Jenkins</span>
            </button>

            <button
              onClick={() => setSelectedRole('REGIONAL')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedRole === 'REGIONAL'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-[10px] font-bold uppercase block">Director</span>
              <span className="text-[9px] text-slate-400 block truncate">Marcus Vance</span>
            </button>

            <button
              onClick={() => setSelectedRole('OWNER')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedRole === 'OWNER'
                  ? 'bg-purple-500/20 border-purple-500 text-purple-300 ring-1 ring-purple-500'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-[10px] font-bold uppercase block">Store Owner</span>
              <span className="text-[9px] text-slate-400 block truncate">Apex Retail</span>
            </button>
          </div>
        </div>

        {/* 1-Click Launch Button */}
        <button
          onClick={() => handleDemoLogin(selectedRole)}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 group"
        >
          <Sparkles className="h-4 w-4 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span>{loading ? 'Authenticating Persona...' : `Instant Demo Login (${selectedRole === 'OPS' ? 'Sarah Jenkins - Ops Manager' : selectedRole === 'REGIONAL' ? 'Marcus Vance - Director' : 'Apex Retail - Owner'})`}</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-slate-950 px-3 text-[10px] font-bold text-slate-500 uppercase">Or Standard SSO</span>
        </div>

        {/* Standard Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleDemoLogin(); }} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Corporate Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                defaultValue="ops.manager@burgercraft.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                defaultValue="demo123password"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
          >
            Sign In with Enterprise SSO
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Powered by <strong className="text-cyan-400 font-mono">RocketRide Multimodal AI Engine</strong>
        </p>
      </div>
    </div>
  );
}
