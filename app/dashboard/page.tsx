'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus, Building2, ShieldCheck, Cpu, ArrowRight, Sparkles, CheckCircle2,
  Clock, FileText, AlertTriangle, Layers, AlertOctagon, RefreshCw, MapPin,
  Search, Filter, LayoutGrid, List, SlidersHorizontal, ArrowUpDown, ChevronRight,
  TrendingDown, TrendingUp, UserCheck, X
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
      if (data.success) {
        setShowCreateModal(false);
        setCode('');
        setName('');
        setAddress('');
        setManager('');
        fetchLocations();
      }
    } catch (err) {
      console.error('Error creating store:', err);
    } finally {
      setCreating(false);
    }
  };

  const sortedLocations = [...locations].sort((a, b) => {
    if (sortBy === 'risk_desc') return b.riskScore - a.riskScore;
    if (sortBy === 'risk_asc') return a.riskScore - b.riskScore;
    if (sortBy === 'compliance_desc') return b.complianceScore - a.complianceScore;
    return a.code.localeCompare(b.code);
  });

  const totalStores = locations.length;
  const criticalStores = locations.filter((l) => l.riskCategory === 'CRITICAL').length;
  const highRiskStores = locations.filter((l) => l.riskCategory === 'HIGH').length;
  const avgCompliance =
    totalStores > 0
      ? (locations.reduce((acc, l) => acc + l.complianceScore, 0) / totalStores).toFixed(1)
      : '0';

  return (
    <div className="min-h-screen bg-white text-cyber-darkText pb-20">
      
      {/* 1. TOP HEADER & KPI STRIP */}
      <div className="border-b border-cyber-borderLight bg-[#FAFAFA] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyber-grayText">
                Operations Command • Autonomous Telemetry
              </span>
              <h1 className="text-3xl font-black text-black mt-1">
                Franchise Network Command
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="cyber-btn-black text-xs py-2.5 px-4 rounded-xl"
              >
                <Plus className="h-4 w-4" />
                <span>Add Store Location</span>
              </button>
            </div>
          </div>

          {/* 4 Cyber KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="cyber-card p-4 bg-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyber-grayText block">
                Total Stores Monitored
              </span>
              <p className="text-2xl font-black text-black mt-1 num-tabular">{totalStores}</p>
              <span className="text-[10px] text-cyber-grayText">5 Geographic Regions</span>
            </div>

            <div className="cyber-card p-4 bg-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyber-grayText block">
                Network Avg Compliance
              </span>
              <p className="text-2xl font-black text-black mt-1 num-tabular">{avgCompliance}%</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Grounded in AI Vision SLA</span>
            </div>

            <div className="cyber-card p-4 bg-white border-amber-300">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                Action Required
              </span>
              <p className="text-2xl font-black text-amber-600 mt-1 num-tabular">{highRiskStores} Stores</p>
              <span className="text-[10px] text-amber-700/80">Audit Remediation Active</span>
            </div>

            <div className="cyber-card p-4 bg-white border-rose-300">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                Critical (Clause 14.2)
              </span>
              <p className="text-2xl font-black text-rose-600 mt-1 num-tabular">{criticalStores} Store (LOC-042)</p>
              <span className="text-[10px] text-rose-700/80">Cure Notice Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER & CATALOG CONTROLS (Cyber Products Page Filter Bar) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAFAFA] border border-cyber-borderLight">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyber-grayText" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search store name, code, manager..."
              className="w-full bg-white text-xs pl-9 pr-4 py-2 rounded-xl border border-cyber-borderLight focus:border-black focus:outline-none"
            />
          </div>

          {/* Filters & Toggles */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white text-xs px-3 py-2 rounded-xl border border-cyber-borderLight focus:border-black focus:outline-none font-semibold text-black"
            >
              <option value="ALL">All Regions (5)</option>
              <option value="North East">North East</option>
              <option value="South East">South East</option>
              <option value="Midwest">Midwest</option>
              <option value="Central">Central</option>
              <option value="West Coast">West Coast</option>
            </select>

            {/* Risk Filter */}
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-white text-xs px-3 py-2 rounded-xl border border-cyber-borderLight focus:border-black focus:outline-none font-semibold text-black"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical (≥ 80)</option>
              <option value="HIGH">High (60–79)</option>
              <option value="MEDIUM">Medium (30–59)</option>
              <option value="LOW">Low (0–29)</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white text-xs px-3 py-2 rounded-xl border border-cyber-borderLight focus:border-black focus:outline-none font-semibold text-black"
            >
              <option value="risk_desc">Risk: Highest First</option>
              <option value="risk_asc">Risk: Lowest First</option>
              <option value="compliance_desc">Compliance: Highest First</option>
              <option value="code">Store Code</option>
            </select>

            {/* View Mode Buttons */}
            <div className="flex items-center rounded-xl bg-white border border-cyber-borderLight p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs ${viewMode === 'grid' ? 'bg-black text-white' : 'text-slate-400 hover:text-black'}`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs ${viewMode === 'table' ? 'bg-black text-white' : 'text-slate-400 hover:text-black'}`}
                title="Table View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. STORE CATALOG VIEW (Grid / Table) */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="h-8 w-8 animate-spin text-black mx-auto" />
            <p className="text-xs text-cyber-grayText">Loading franchise stores...</p>
          </div>
        ) : sortedLocations.length === 0 ? (
          <div className="py-20 text-center space-y-4 cyber-card p-12">
            <Building2 className="h-12 w-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-black">No franchise stores match your filter</h3>
            <button
              onClick={() => { setSelectedRegion('ALL'); setSelectedRisk('ALL'); setSearchTerm(''); }}
              className="cyber-btn-black text-xs py-2 px-4 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* CYBER PRODUCT CARDS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedLocations.map((loc) => {
              const isHero = loc.code === 'LOC-042';
              return (
                <div
                  key={loc.id}
                  className={`cyber-card p-5 flex flex-col justify-between space-y-4 relative ${
                    isHero ? 'border-rose-500 bg-rose-50/20' : ''
                  }`}
                >
                  {/* Badge & Region */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`cyber-badge ${
                        loc.riskCategory === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-700'
                          : loc.riskCategory === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {loc.riskCategory} RISK
                    </span>
                    <span className="text-[10px] font-mono font-bold text-cyber-grayText">
                      {loc.region}
                    </span>
                  </div>

                  {/* Visual Preview Box */}
                  <div className="h-32 rounded-2xl bg-white border border-cyber-borderLight flex flex-col items-center justify-center p-3 text-center">
                    <Building2 className={`h-8 w-8 ${isHero ? 'text-rose-500' : 'text-slate-400'} mb-1`} />
                    <span className="text-2xl font-black text-black num-tabular">
                      {loc.complianceScore}%
                    </span>
                    <span className="text-[10px] text-cyber-grayText uppercase font-semibold">
                      Compliance
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-cyber-grayText">{loc.code}</span>
                    <h3 className="text-sm font-bold text-black truncate">{loc.name}</h3>
                    <p className="text-[11px] text-cyber-grayText truncate">{loc.address}</p>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-cyber-borderLight mt-2">
                      <span className="text-cyber-grayText">Risk Index:</span>
                      <strong className={`font-mono ${isHero ? 'text-rose-600' : 'text-black'}`}>
                        {loc.riskScore}/100
                      </strong>
                    </div>
                  </div>

                  {/* Cyber Black Button */}
                  <Link
                    href={`/locations/${loc.id}`}
                    className="cyber-btn-black text-xs py-2.5 w-full rounded-xl"
                  >
                    <span>Inspect Store Profile</span>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="overflow-x-auto rounded-2xl border border-cyber-borderLight">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAFA] border-b border-cyber-borderLight text-cyber-grayText uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Location Name</th>
                  <th className="py-3.5 px-4">Region</th>
                  <th className="py-3.5 px-4">Compliance</th>
                  <th className="py-3.5 px-4">Risk Score</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-borderLight">
                {sortedLocations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-[#F9F9F9] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-black">{loc.code}</td>
                    <td className="py-3.5 px-4 font-semibold text-black">{loc.name}</td>
                    <td className="py-3.5 px-4 text-cyber-grayText">{loc.region}</td>
                    <td className="py-3.5 px-4 font-bold text-black">{loc.complianceScore}%</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-black">{loc.riskScore}/100</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`cyber-badge ${
                          loc.riskCategory === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-700'
                            : loc.riskCategory === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {loc.riskCategory}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/locations/${loc.id}`}
                        className="cyber-btn-black text-[11px] py-1.5 px-3 rounded-lg"
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

      {/* CREATE STORE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="cyber-card p-6 w-full max-w-md bg-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-cyber-borderLight pb-3">
              <h3 className="text-base font-bold text-black">Register New Franchise Store</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLocation} className="space-y-3 text-xs">
              <div>
                <label className="block text-cyber-grayText font-semibold mb-1">Store Code</label>
                <input
                  type="text"
                  required
                  placeholder="LOC-051"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#F5F5F7] p-2.5 rounded-xl border border-cyber-borderLight focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-cyber-grayText font-semibold mb-1">Store Name</label>
                <input
                  type="text"
                  required
                  placeholder="BurgerCraft #51 (Phoenix)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F5F5F7] p-2.5 rounded-xl border border-cyber-borderLight focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-cyber-grayText font-semibold mb-1">Address</label>
                <input
                  type="text"
                  required
                  placeholder="500 Desert Ridge Way"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#F5F5F7] p-2.5 rounded-xl border border-cyber-borderLight focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-cyber-grayText font-semibold mb-1">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-[#F5F5F7] p-2.5 rounded-xl border border-cyber-borderLight focus:border-black focus:outline-none"
                >
                  <option value="North East">North East</option>
                  <option value="South East">South East</option>
                  <option value="Midwest">Midwest</option>
                  <option value="Central">Central</option>
                  <option value="West Coast">West Coast</option>
                </select>
              </div>

              <div>
                <label className="block text-cyber-grayText font-semibold mb-1">Store Manager</label>
                <input
                  type="text"
                  placeholder="Alex Mercer"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  className="w-full bg-[#F5F5F7] p-2.5 rounded-xl border border-cyber-borderLight focus:border-black focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="cyber-btn-white py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="cyber-btn-black py-2 px-4 rounded-xl disabled:opacity-50"
                >
                  {creating ? 'Saving...' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
