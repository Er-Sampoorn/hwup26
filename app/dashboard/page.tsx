'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus, Building2, ShieldCheck, Cpu, ArrowRight, Sparkles, CheckCircle2,
  Clock, FileText, AlertTriangle, Layers, AlertOctagon, RefreshCw, MapPin,
  Search, Filter, LayoutGrid, List, SlidersHorizontal, ArrowUpDown, ChevronRight,
  TrendingDown, TrendingUp, UserCheck, CloudUpload, Server, Check
} from 'lucide-react';

export default function DashboardPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'risk_desc' | 'risk_asc' | 'compliance_desc' | 'code'>('risk_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Staging Integration State
  const [stagingInfo, setStagingInfo] = useState<any>(null);
  const [stagingDeploying, setStagingDeploying] = useState(false);
  const [stagingResult, setStagingResult] = useState<any>(null);
  const [showStagingModal, setShowStagingModal] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState('North East');
  const [manager, setManager] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchStagingInfo = async () => {
    try {
      const res = await fetch('/api/rocketride/staging');
      const data = await res.json();
      if (data.success) {
        setStagingInfo(data);
      }
    } catch (err) {
      console.error('Failed to fetch staging info', err);
    }
  };

  const handleDeployToStaging = async () => {
    setStagingDeploying(true);
    try {
      const res = await fetch('/api/rocketride/staging', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStagingResult(data.deployment);
        setShowStagingModal(true);
        fetchStagingInfo();
      }
    } catch (err) {
      console.error('Staging deployment error', err);
    } finally {
      setStagingDeploying(false);
    }
  };

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
      console.error('Error loading locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchStagingInfo();
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
        setManager('');
        fetchLocations();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  // Sort locations
  const sortedLocations = [...locations].sort((a, b) => {
    if (sortBy === 'risk_desc') return b.riskScore - a.riskScore;
    if (sortBy === 'risk_asc') return a.riskScore - b.riskScore;
    if (sortBy === 'compliance_desc') return b.complianceScore - a.complianceScore;
    return a.code.localeCompare(b.code);
  });

  const criticalCount = locations.filter((l) => l.riskCategory === 'CRITICAL').length;
  const highRiskCount = locations.filter((l) => l.riskCategory === 'HIGH').length;
  const mediumCount = locations.filter((l) => l.riskCategory === 'MEDIUM').length;
  const healthyCount = locations.filter((l) => l.riskCategory === 'LOW').length;

  const heroLocation = locations.find((l) => l.code === 'LOC-042') || locations[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP EXECUTIVE HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              NATIONAL PITCH SHOWCASE
            </span>
            <span className="text-xs text-slate-400 font-mono">RocketRide .pipe Multi-Agent Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Building2 className="h-7 w-7 text-amber-400" />
            Franchise Operations Compliance Command Center
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Continuous Multimodal Audit Intelligence • 50 Locations Indexed • Zero False Accusation SLA
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDeployToStaging}
            disabled={stagingDeploying}
            className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            {stagingDeploying ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-emerald-200" />
                Deploying to Staging...
              </>
            ) : (
              <>
                <CloudUpload className="h-4 w-4 text-emerald-200" />
                Deploy to RocketRide Staging
              </>
            )}
          </button>

          <button
            onClick={fetchLocations}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition-colors shadow-sm"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Register New Store
          </button>
        </div>
      </div>

      {/* RocketRide Staging Integration Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                ROCKETRIDE STAGING PROCESS INTEGRATED
              </span>
              <span className="font-mono text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                PROMO: INDIAHACK
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Endpoint: <strong className="text-white font-mono font-normal">https://staging.rocketride.ai</strong> • {stagingInfo?.pipeCount || 15} Declarative <code className="text-emerald-300">.pipe</code> Pipelines Ready
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleDeployToStaging}
            className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 border border-emerald-500/40 font-semibold transition-all flex items-center gap-1.5"
          >
            <CloudUpload className="h-3.5 w-3.5" /> Sync .pipe Package
          </button>
          {stagingResult && (
            <button
              onClick={() => setShowStagingModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-all"
            >
              View Deployment Logs
            </button>
          )}
        </div>
      </div>

      {/* 2. KPI OVERVIEW STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Total Locations</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white num-tabular">{locations.length}</span>
            <span className="text-[10px] text-blue-400 font-mono">5 Regions</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Healthy Stores</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400 num-tabular">{healthyCount}</span>
            <span className="text-[10px] text-emerald-400/80 font-mono">Compliance &gt; 90%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-amber-500/30 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Watchlist (Medium)</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400 num-tabular">{mediumCount}</span>
            <span className="text-[10px] text-amber-400/80 font-mono">Monitoring</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-rose-500/40 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">High / Critical Risk</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-400 num-tabular">{highRiskCount + criticalCount}</span>
            <span className="text-[10px] text-rose-400/80 font-mono">Immediate Action</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-cyan-500/30 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Recurrence Rate</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-cyan-300 num-tabular">14.2%</span>
            <span className="text-[10px] text-cyan-400/80 font-mono">Repeat Violators</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-purple-500/30 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Est. AI Cost</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-100 num-tabular">$0.11</span>
            <span className="text-[10px] text-purple-400 font-mono">RocketRide</span>
          </div>
        </div>
      </div>

      {/* 3. HERO CRITICAL RECURRENT ALERT FOR LOCATION #042 */}
      {heroLocation && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900/90 to-slate-900/90 border border-rose-500/60 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-400 shrink-0">
              <AlertOctagon className="h-6 w-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                  {heroLocation.code}
                </span>
                <span className="text-xs font-bold uppercase text-rose-300 tracking-wide flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
                  CRITICAL CHRONIC RISK (Risk Score: {heroLocation.riskScore}/100)
                </span>
              </div>
              <h3 className="text-lg font-black text-white">{heroLocation.name}</h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Failed Standard <strong className="text-amber-300">CLEAN-001 (Storefront Cleanliness)</strong> in <strong>4 consecutive audits</strong>. Correlated with negative Google Review feedback. Formal Brand Default & Cure Notice recommended under Clause 14.2.
              </p>
            </div>
          </div>

          <Link
            href={`/locations/${heroLocation.id}`}
            className="px-5 py-3 text-xs font-extrabold text-white rounded-xl bg-rose-600 hover:bg-rose-500 shadow-xl shadow-rose-600/30 transition-all shrink-0 flex items-center gap-2 group hover:scale-[1.02]"
          >
            <span>Review Cure Notice</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {/* 4. REGIONAL RISK GRID & HEATMAP */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-400" /> Regional Compliance Health Grid
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
            const isSelected = selectedRegion === reg;

            return (
              <button
                key={reg}
                onClick={() => setSelectedRegion(isSelected ? 'ALL' : reg)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-950/70 border-amber-500 ring-1 ring-amber-500 shadow-lg shadow-amber-500/15'
                    : 'glass-card hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                  <span>{reg}</span>
                  {isSelected && <span className="text-[10px] text-amber-400 font-mono">ACTIVE</span>}
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-black text-white num-tabular">{locsInRegion.length} Stores</span>
                  <span className={`text-xs font-mono font-bold ${numScore >= 60 ? 'text-rose-400' : numScore >= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    Avg Risk: {avgRisk}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. LOCATIONS DIRECTORY WITH ADVANCED CONTROLS */}
      <div className="space-y-4">
        {/* Controls Bar */}
        <div className="p-4 rounded-2xl glass-panel flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search code, city, store, manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white w-64 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Risk Filter */}
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Risk (80-100)</option>
              <option value="HIGH">High Risk (60-79)</option>
              <option value="MEDIUM">Medium Risk (30-59)</option>
              <option value="LOW">Low Risk (0-29)</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="risk_desc">Highest Risk Score</option>
              <option value="risk_asc">Lowest Risk Score</option>
              <option value="compliance_desc">Highest Compliance %</option>
              <option value="code">Store Code (A-Z)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950 rounded-xl p-0.5 border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Dense Table View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <span className="text-xs text-slate-400 font-mono">
              Showing <strong>{sortedLocations.length}</strong> location(s)
            </span>
          </div>
        </div>

        {/* VIEW 1: GRID CARDS VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedLocations.map((loc) => (
              <div
                key={loc.id}
                className="p-6 rounded-3xl glass-card flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-lg border border-amber-800">
                      {loc.code}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                      loc.riskCategory === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                        : loc.riskCategory === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}>
                      Risk: {loc.riskCategory} ({loc.riskScore}/100)
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors truncate">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{loc.address}, {loc.city}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Compliance</span>
                      <span className="font-mono font-black text-emerald-400 text-sm">{loc.complianceScore}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block">Manager</span>
                      <span className="font-medium text-slate-200 truncate block">{loc.manager}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Region: <strong className="text-slate-200">{loc.region}</strong></span>
                  <Link
                    href={`/locations/${loc.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Open Profile</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: DENSE EXECUTIVE TABLE VIEW */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto glass-panel rounded-2xl border border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Location Name</th>
                  <th className="py-3.5 px-4">Region</th>
                  <th className="py-3.5 px-4">Manager</th>
                  <th className="py-3.5 px-4 text-center">Compliance</th>
                  <th className="py-3.5 px-4 text-center">Risk Score</th>
                  <th className="py-3.5 px-4 text-center">Category</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {sortedLocations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{loc.code}</td>
                    <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">{loc.name}</td>
                    <td className="py-3.5 px-4 text-slate-300">{loc.region}</td>
                    <td className="py-3.5 px-4 text-slate-300 truncate">{loc.manager}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">{loc.complianceScore}%</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-white">{loc.riskScore}/100</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        loc.riskCategory === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : loc.riskCategory === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {loc.riskCategory}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/locations/${loc.id}`}
                        className="px-3 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-bold transition-all"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE LOCATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg glass-panel-glow rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-amber-400" /> Register Franchise Location
            </h3>

            <form onSubmit={handleCreateLocation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Location Code *</label>
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
                <label className="block text-xs font-bold text-slate-300 mb-1">Location Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BurgerCraft #51 (Austin Downtown)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Address *</label>
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
                <label className="block text-xs font-bold text-slate-300 mb-1">Store Manager</label>
                <input
                  type="text"
                  placeholder="Manager Name"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Operational Region</label>
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
                  className="px-5 py-2 text-xs font-extrabold text-white rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 shadow-md"
                >
                  {creating ? 'Registering...' : 'Register Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staging Deployment Logs Modal */}
      {showStagingModal && stagingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CloudUpload className="h-5 w-5 text-emerald-400" /> RocketRide Staging Deployment Manifest
              </h3>
              <span className="font-mono text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {stagingResult.deploymentId}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">TARGET URL</span>
                <span className="font-mono text-emerald-300 font-bold">{stagingResult.stagingUrl}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">PROMO CODE</span>
                <span className="font-mono text-cyan-300 font-bold">{stagingResult.promoCode} ({stagingResult.promoStatus})</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">PIPELINES ACTIVE</span>
                <span className="font-mono text-amber-300 font-bold">{stagingResult.pipesCount} .pipe files</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-1">Live Execution Logs:</span>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 max-h-60 overflow-y-auto space-y-1">
                {stagingResult.logs?.map((log: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowStagingModal(false)}
                className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-slate-800 hover:bg-slate-700"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
