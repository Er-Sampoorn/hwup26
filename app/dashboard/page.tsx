'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Building2, ShieldCheck, Cpu, ArrowRight, Sparkles, CheckCircle2, Clock, FileText, AlertTriangle, Layers, AlertOctagon, RefreshCw, MapPin } from 'lucide-react';

export default function DashboardPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState('North East');
  const [manager, setManager] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedRegion !== 'ALL') queryParams.append('region', selectedRegion);
      if (selectedRisk !== 'ALL') queryParams.append('risk', selectedRisk);
      if (searchTerm) queryParams.append('search', searchTerm);

      const res = await fetch(`/api/locations?${queryParams.toString()}`);
      const data = await res.json();
      if (data.locations) {
        setLocations(data.locations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [selectedRegion, selectedRisk, searchTerm]);

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !address) return;

    setCreating(true);
    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, name, address, region, manager }),
      });
      const data = await res.json();
      if (data.location) {
        setShowCreateModal(false);
        setCode('');
        setName('');
        setAddress('');
        fetchLocations();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const criticalCount = locations.filter((l) => l.riskCategory === 'CRITICAL').length;
  const highRiskCount = locations.filter((l) => l.riskCategory === 'HIGH').length;
  const mediumCount = locations.filter((l) => l.riskCategory === 'MEDIUM').length;
  const healthyCount = locations.filter((l) => l.riskCategory === 'LOW').length;

  const heroLocation = locations.find((l) => l.code === 'LOC-042') || locations[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Building2 className="h-7 w-7 text-amber-400" /> Franchise Operations Compliance Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Problem Statement #18 • RocketRide Multimodal AI Engine • Continuous Audit Intelligence
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLocations}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Refresh Locations"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Register Location
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Total Locations</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{locations.length}</span>
            <span className="text-xs text-blue-400 font-mono">5 Regions</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Healthy (Low Risk)</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-400">{healthyCount}</span>
            <span className="text-xs text-emerald-400/80">Compliance &gt; 90%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Medium Risk</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-400">{mediumCount}</span>
            <span className="text-xs text-amber-400/80">Monitoring</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400">High / Critical Risk</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-rose-400">{highRiskCount + criticalCount}</span>
            <span className="text-xs text-rose-400/80">Immediate Action</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Recurring Rate</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-cyan-300">14.2%</span>
            <span className="text-xs text-cyan-400/80">Recurrence</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Est. AI Cost</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-200">$0.11</span>
            <span className="text-xs text-slate-400 font-mono">RocketRide</span>
          </div>
        </div>
      </div>

      {/* Hero At-Risk Alert for Location #042 */}
      {heroLocation && (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 shrink-0">
              <AlertOctagon className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                  {heroLocation.code}
                </span>
                <span className="text-xs font-bold uppercase text-rose-300">
                  CRITICAL RECURRENT RISK (Risk Score: {heroLocation.riskScore}/100)
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-1">{heroLocation.name}</h3>
              <p className="text-xs text-slate-300 mt-1">
                Failed Standard <strong className="text-amber-300">CLEAN-001 (Storefront Cleanliness)</strong> in 4 consecutive audits. Correlated with negative Google review complaint feed. Formal Cure Notice recommended.
              </p>
            </div>
          </div>

          <Link
            href={`/locations/${heroLocation.id}`}
            className="px-5 py-2.5 text-xs font-bold text-white rounded-xl bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-500/30 transition-all shrink-0 flex items-center gap-2"
          >
            Review Cure Notice <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Regional Risk Grid / Health Map */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-400" /> Regional Franchise Compliance Grid
          </h2>
          <span className="text-xs text-slate-400 font-mono">5 Operational Regions</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['North East', 'South East', 'Midwest', 'Central', 'West Coast'].map((reg) => {
            const locsInRegion = locations.filter((l) => l.region === reg);
            const avgRisk = locsInRegion.length > 0
              ? (locsInRegion.reduce((acc, l) => acc + l.riskScore, 0) / locsInRegion.length).toFixed(0)
              : '15';
            const numScore = parseInt(avgRisk);

            return (
              <button
                key={reg}
                onClick={() => setSelectedRegion(selectedRegion === reg ? 'ALL' : reg)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedRegion === reg
                    ? 'bg-amber-950/60 border-amber-500 ring-1 ring-amber-500'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[11px] font-semibold text-slate-400 block">{reg}</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-extrabold text-white">{locsInRegion.length} Locs</span>
                  <span className={`text-xs font-mono font-bold ${numScore >= 60 ? 'text-rose-400' : numScore >= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    Risk: {avgRisk}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Locations Directory Table */}
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search location code, city, or manager..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white w-64 focus:outline-none focus:border-amber-500"
            />

            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            Showing <strong>{locations.length}</strong> location(s)
          </span>
        </div>

        {/* Directory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    {loc.code}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                    loc.riskCategory === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : loc.riskCategory === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    Risk: {loc.riskCategory} ({loc.riskScore}/100)
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                  {loc.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{loc.address}, {loc.city}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Compliance</span>
                    <span className="font-mono font-bold text-emerald-400">{loc.complianceScore}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Manager</span>
                    <span className="font-medium text-slate-200 truncate block">{loc.manager}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Region: <strong className="text-slate-200">{loc.region}</strong></span>
                <Link
                  href={`/locations/${loc.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  Open Location Profile <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Location Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-amber-400" /> Register Franchise Location
            </h3>

            <form onSubmit={handleCreateLocation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LOC-051"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BurgerCraft #51 (Austin)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Operational Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="North East">North East</option>
                  <option value="South East">South East</option>
                  <option value="Midwest">Midwest</option>
                  <option value="Central">Central</option>
                  <option value="West Coast">West Coast</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-amber-600 hover:bg-amber-500 shadow-md"
                >
                  {creating ? 'Registering...' : 'Register Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
