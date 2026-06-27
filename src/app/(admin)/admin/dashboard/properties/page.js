'use client';

import { useState, useEffect } from 'react';
import { 
    Plus, X, Pencil, Trash2, ChevronDown, 
    MapPin, Calendar, Building2, CheckSquare, 
    Square, Eye, Search, Layers, Upload, FileText, CheckCircle, AlertCircle
} from 'lucide-react';

export default function ManageProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const predefinedConfigs = ['1BHK', '1.5BHK', '2BHK', '2.5BHK', '3BHK', '3.5BHK', '4BHK', '5BHK'];
    const predefinedAmenities = ['Swimming Pool', 'Gym', 'Clubhouse', 'Children Play Area', 'Garden', 'Parking', 'Security', 'Power Backup'];
    const predefinedStatuses = ['Under Construction', 'Ready to Move', 'Pre-Launch', 'New Launch'];
    const predefinedLocations = ['Hinjewadi Phase 1, Pune', 'Baner, Pune', 'Kalyani Nagar, Pune', 'Koregaon Park, Pune', 'Viman Nagar, Pune'];

    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    // ── Bulk Import State ──
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkInput, setBulkInput] = useState('');
    const [bulkFile, setBulkFile] = useState(null);
    const [bulkStatus, setBulkStatus] = useState('idle'); // idle | loading | success | error
    const [bulkResult, setBulkResult] = useState(null);
    const [bulkError, setBulkError] = useState('');
    const [bulkImages, setBulkImages] = useState([]); // gallery images shared across all imported properties
    const [bulkBannerImage, setBulkBannerImage] = useState(''); // banner/hero image URL
    const [bulkImgUploading, setBulkImgUploading] = useState(false);
    const [bulkBannerUploading, setBulkBannerUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '', developer: '', location: '', possession: '', rera: '', status: '',
        landParcel: '', openSpace: '', totalFloors: '', floorBreakdown: '',
        configDetails: [], description: '', amenities: '', usp: '', launchYear: '',
        images: [],
        isSignature: false,
        isMandate: false,
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/properties');
            if (res.ok) {
                const data = await res.json();
                // Map _id to id for local state compatibility
                setProjects(data.map(p => ({...p, id: p._id})));
            }
        } catch (error) {
            console.error("Failed to load projects", error);
        } finally {
            setLoading(false);
        }
    };

    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [customAmenity, setCustomAmenity] = useState('');

    // Filter State
    const [filters, setFilters] = useState({
        search: '', configuration: '', maxPrice: '', location: '', possession: '', status: '',
    });

    const [filteredConfigs, setFilteredConfigs] = useState(predefinedConfigs);
    const [filteredLocations, setFilteredLocations] = useState(predefinedLocations);
    const [filteredStatuses, setFilteredStatuses] = useState(predefinedStatuses);
    const [showConfigAdd, setShowConfigAdd] = useState(false);
    const [showLocationAdd, setShowLocationAdd] = useState(false);
    const [newConfig, setNewConfig] = useState('');
    const [newLocation, setNewLocation] = useState('');

    // ✅ Compact Hybrid Number to Words Converter
    const numberToWords = (num) => {
        if (!num || isNaN(num)) return '';
        const n = parseInt(num, 10);
        if (n === 0) return 'Zero';

        // 1. Spell out numbers strictly under 1,000 completely
        if (n < 1000) {
            const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
            const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            
            const formatSmall = (num) => {
                if (num < 20) return a[num];
                if (num < 100) return b[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + a[num % 10] : '');
                return a[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' and ' + formatSmall(num % 100) : '');
            };
            return formatSmall(n) + (n === 1 ? ' Rupee' : ' Rupees');
        }

        // 2. Use Digit + Denomination format for large numbers to keep it short (e.g., "65 Lakh")
        const crore = Math.floor(n / 10000000);
        const lakh = Math.floor((n % 10000000) / 100000);
        const thousand = Math.floor((n % 100000) / 1000);
        const remainder = n % 1000;

        const parts = [];
        if (crore > 0) parts.push(`${crore} Crore`);
        if (lakh > 0) parts.push(`${lakh} Lakh`);
        if (thousand > 0) parts.push(`${thousand} Thousand`);
        if (remainder > 0) parts.push(`${remainder}`); // Keep remainder as digits to save space

        return parts.join(' ') + ' Rupees';
    };

    // Filter Logic
    const filteredProjects = projects.filter((project) => {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = filters.search === '' || 
            project.name.toLowerCase().includes(searchLower) || 
            project.developer.toLowerCase().includes(searchLower);

        const matchesConfig = filters.configuration === '' || project.configurations.includes(filters.configuration);
        const matchesPrice = filters.maxPrice === '' || parseInt(filters.maxPrice) >= (parseInt(project.price?.replace(/[^\d]/g, '')) || 0);
        const matchesLocation = filters.location === '' || project.location.toLowerCase().includes(filters.location.toLowerCase());
        const matchesPossession = filters.possession === '' || project.possession.includes(filters.possession);
        const matchesStatus = filters.status === '' || project.status === filters.status;

        return matchesSearch && matchesConfig && matchesPrice && matchesLocation && matchesPossession && matchesStatus;
    });

    const toggleSelect = (id) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredProjects.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredProjects.map((p) => p.id));
        }
    };

    const handleBulkDelete = async () => {
        for (const id of selectedIds) {
            await fetch(`/api/properties/${id}`, { method: 'DELETE' });
        }
        setProjects((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
        setSelectedIds([]);
    };

    // ---------------- FORM ----------------
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddModal = () => {
        setFormData({
            name: '', developer: '', location: '', possession: '', rera: '', status: '',
            landParcel: '', openSpace: '', totalFloors: '', floorBreakdown: '',
            configDetails: [], description: '', amenities: '', usp: '', launchYear: '',
            images: [],
            isSignature: false,
            isMandate: false,
        });
        setSelectedAmenities([]);
        setCustomAmenity('');
        setEditingProject(null);
        setShowModal(true);
    };

    const openEditModal = (project) => {
        setFormData({
            ...project,
            images: project.images || [],
            isSignature: project.isSignature || false,
            isMandate: project.isMandate || false,
        });
        setSelectedAmenities(project.amenities ? project.amenities.split(',').map(a => a.trim()) : []);
        setCustomAmenity('');
        setEditingProject(project);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formData.name) return;

        const amenitiesString = [...selectedAmenities, customAmenity].filter(a => a.trim()).join(', ');
        const updatedConfigs = formData.configDetails.map(c => c.type).filter(Boolean);

        const payload = {
            ...formData,
            amenities: amenitiesString,
            configurations: updatedConfigs.length > 0 ? updatedConfigs : (formData.configurations || ['2BHK']),
            landParcel: formData.landParcel || '—',
            openSpace: formData.openSpace || '—',
            totalFloors: formData.totalFloors || '—',
            floorBreakdown: formData.floorBreakdown || '—',
        };

        if (editingProject) {
            try {
                const res = await fetch(`/api/properties/${editingProject.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const updated = await res.json();
                    setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...updated, id: updated._id } : p));
                }
            } catch (error) {
                console.error("Failed to update project", error);
            }
        } else {
            try {
                const res = await fetch('/api/properties', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const created = await res.json();
                    setProjects(prev => [{...created, id: created._id}, ...prev]);
                }
            } catch (error) {
                console.error("Failed to create project", error);
            }
        }
        setShowModal(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this property?")) return;
        try {
            const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProjects((prev) => prev.filter((p) => p.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete project", error);
        }
    };

    const handleAddConfig = () => {
        if (newConfig.trim() && !filteredConfigs.includes(newConfig.trim())) {
            setFilteredConfigs([...filteredConfigs, newConfig.trim()]);
            setFilters({ ...filters, configuration: newConfig.trim() });
            setNewConfig('');
            setShowConfigAdd(false);
        }
    };

    // ── Bulk Import Handler ──
    const parseCsvToProperties = (csvText) => {
        const lines = csvText.trim().split('\n').filter(Boolean);
        if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row.');
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"+$/g, ''));
        return lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"+$/g, ''));
            const obj = {};
            headers.forEach((h, i) => { obj[h] = values[i] || ''; });
            // Map configDetails from flat CSV columns
            if (obj.configType || obj.configPrice || obj.configCarpet) {
                obj.configDetails = [{ type: obj.configType || '', price: obj.configPrice || '', carpet: obj.configCarpet || '' }];
                delete obj.configType; delete obj.configPrice; delete obj.configCarpet;
            }
            return obj;
        });
    };

    const handleBulkImport = async () => {
        setBulkStatus('loading');
        setBulkError('');
        try {
            let properties = [];
            if (bulkFile) {
                const text = await bulkFile.text();
                properties = bulkFile.name.endsWith('.json') ? JSON.parse(text) : parseCsvToProperties(text);
            } else if (bulkInput.trim()) {
                properties = JSON.parse(bulkInput);
            } else {
                throw new Error('Please paste JSON data or upload a CSV/JSON file.');
            }
            // Attach bulk images & banner to every property if not already set
            properties = properties.map(p => ({
                ...p,
                images: p.images?.length ? p.images : bulkImages,
                bannerImage: p.bannerImage || bulkBannerImage || undefined,
            }));
            const res = await fetch('/api/properties/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ properties }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Import failed');
            setBulkResult(data);
            setBulkStatus('success');
            fetchProjects();
        } catch (err) {
            setBulkError(err.message);
            setBulkStatus('error');
        }
    };

    const closeBulkModal = () => {
        setShowBulkModal(false);
        setBulkInput('');
        setBulkFile(null);
        setBulkStatus('idle');
        setBulkResult(null);
        setBulkError('');
        setBulkImages([]);
        setBulkBannerImage('');
    };

    const handleAddLocation = () => {
        if (newLocation.trim() && !filteredLocations.includes(newLocation.trim())) {
            setFilteredLocations([...filteredLocations, newLocation.trim()]);
            setFilters({ ...filters, location: newLocation.trim() });
            setNewLocation('');
            setShowLocationAdd(false);
        }
    };

    // ---------------- UI ----------------
    return (
        <div className="bg-slate-50 min-h-screen p-6 md:p-8 font-sans text-slate-900">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 pb-6 border-b border-slate-200">
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Projects</h1>
                <p className="text-slate-500 font-medium">Manage and organize your real estate directory</p>
            </div>

            <div className="flex flex-wrap gap-3">
            {selectedIds.length > 0 && (
                <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition border border-red-200 shadow-sm"
                >
                <Trash2 size={18} /> Delete ({selectedIds.length})
                </button>
            )}

            <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-100 transition border border-emerald-200 shadow-sm active:scale-95"
            >
                <Upload size={18} /> Bulk Import
            </button>

            <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md shadow-blue-600/20 active:scale-95"
            >
                <Plus size={18} strokeWidth={3} /> Add Project
            </button>
            </div>
        </div>

        {/* SEARCH & FILTER PANEL */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold flex items-center gap-2"><Search size={20} className="text-slate-400"/> Find Projects</h3>
                {Object.values(filters).some(v => v !== '') && (
                    <button
                        onClick={() => setFilters({ search: '', configuration: '', maxPrice: '', location: '', possession: '', status: '' })}
                        className="text-sm text-blue-600 font-bold hover:text-blue-800 transition"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">

                {/* Text Search */}
                <div className="relative col-span-1 md:col-span-2 lg:col-span-2">
                    <input
                        type="text"
                        placeholder="Search by name or developer..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 font-medium hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    />
                </div>

                {/* Dropdowns (Custom Styled) */}
                <div className="relative">
                    <select
                        value={filters.configuration}
                        onChange={(e) => e.target.value === 'add' ? setShowConfigAdd(true) : setFilters({ ...filters, configuration: e.target.value })}
                        className="appearance-none cursor-pointer w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    >
                        <option value="">All Configs</option>
                        <option value="add">+ Add Config</option>
                        {filteredConfigs.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>

                <div className="relative mb-2">
                    <input
                        type="number"
                        placeholder="Max Budget (₹)"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        className="w-full pl-4 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 font-medium hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    />
                    {/* ✅ Truncated single-line helper text */}
                    {filters.maxPrice && (
                        <p className="absolute -bottom-6 left-1 text-[11px] text-blue-600 font-bold tracking-wide uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[95%]">
                            {numberToWords(filters.maxPrice)}
                        </p>
                    )}
                </div>

                <div className="relative">
                    <select
                        value={filters.location}
                        onChange={(e) => e.target.value === 'add' ? setShowLocationAdd(true) : setFilters({ ...filters, location: e.target.value })}
                        className="appearance-none cursor-pointer w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-ellipsis"
                    >
                        <option value="">All Locations</option>
                        <option value="add">+ Add Location</option>
                        {filteredLocations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>

                <div className="relative">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="appearance-none cursor-pointer w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    >
                        <option value="">All Statuses</option>
                        {filteredStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>

            </div>
        </div>

        {/* ADD MODALS FOR DROPDOWNS */}
        {showConfigAdd && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60]">
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-black mb-4">Add Configuration</h3>
                    <input type="text" placeholder="e.g., 6BHK" value={newConfig} onChange={(e) => setNewConfig(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                    <div className="flex gap-3">
                        <button onClick={() => { setShowConfigAdd(false); setNewConfig(''); }} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition">Cancel</button>
                        <button onClick={handleAddConfig} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">Add</button>
                    </div>
                </div>
            </div>
        )}

        {showLocationAdd && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[60]">
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-black mb-4">Add Location</h3>
                    <input type="text" placeholder="e.g., Wakad, Pune" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                    <div className="flex gap-3">
                        <button onClick={() => { setShowLocationAdd(false); setNewLocation(''); }} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition">Cancel</button>
                        <button onClick={handleAddLocation} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">Add</button>
                    </div>
                </div>
            </div>
        )}

        {/* ── BULK IMPORT MODAL ── */}
        {showBulkModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                        <div>
                            <h2 className="text-xl font-black text-slate-900">Bulk Import Properties</h2>
                            <p className="text-sm text-slate-500 mt-0.5">Upload a CSV/JSON file or paste JSON data directly</p>
                        </div>
                        <button onClick={closeBulkModal} className="p-2 hover:bg-slate-100 rounded-xl transition"><X size={20} /></button>
                    </div>

                    <div className="p-6 space-y-5">
                        {bulkStatus === 'success' ? (
                            <div className="flex flex-col items-center gap-4 py-8 text-center">
                                <CheckCircle size={48} className="text-emerald-500" />
                                <div>
                                    <p className="text-xl font-black text-slate-900">Import Successful!</p>
                                    <p className="text-slate-500 mt-1">{bulkResult?.inserted} properties have been added to the database.</p>
                                </div>
                                <button onClick={closeBulkModal} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition">Done</button>
                            </div>
                        ) : (
                            <>
                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2"><Upload size={14} className="inline mr-1.5" />Upload CSV or JSON File</label>
                                    <input
                                        type="file"
                                        accept=".csv,.json"
                                        onChange={e => { setBulkFile(e.target.files[0]); setBulkInput(''); }}
                                        className="w-full p-3 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-600 hover:border-blue-400 transition cursor-pointer"
                                    />
                                    {bulkFile && <p className="mt-1.5 text-xs text-emerald-600 font-bold">✓ {bulkFile.name} selected</p>}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-px bg-slate-200" />
                                    <span className="text-xs font-bold text-slate-400">OR PASTE JSON</span>
                                    <div className="flex-1 h-px bg-slate-200" />
                                </div>

                                {/* JSON Paste Area */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2"><FileText size={14} className="inline mr-1.5" />Paste JSON Array</label>
                                    <textarea
                                        rows={8}
                                        placeholder={'[{"name":"My Property","location":"Baner, Pune","developer":"ABC Builders","status":"New Launch","configType":"2BHK","configPrice":"1.2 Cr","configCarpet":"950 sqft"}]'}
                                        value={bulkInput}
                                        onChange={e => { setBulkInput(e.target.value); setBulkFile(null); }}
                                        className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>

                                {/* CSV Format hint */}
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <p className="text-xs font-bold text-amber-800 mb-1">📋 CSV Column Format</p>
                                    <p className="text-[11px] text-amber-700 font-mono">name, developer, location, status, possession, rera, configType, configPrice, configCarpet, amenities, description</p>
                                    <p className="text-[10px] text-amber-600 mt-1">Tip: Leave image columns empty — use the uploaders below to apply images to all properties in this batch.</p>
                                </div>

                                {/* ── IMAGE UPLOADS ── */}
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                        <p className="text-sm font-bold text-slate-800">🖼️ Property Images</p>
                                        <p className="text-xs text-slate-500 mt-0.5">These images will be applied to all imported properties in this batch.</p>
                                    </div>
                                    <div className="p-4 space-y-4">

                                        {/* Banner / Hero Image */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Banner / Hero Image <span className="text-slate-400 font-normal">(used as main listing cover)</span></label>
                                            <div className="flex items-center gap-3">
                                                {bulkBannerImage && (
                                                    <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={bulkBannerImage} alt="banner" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setBulkBannerImage('')}
                                                            className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold"
                                                        >✕</button>
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;
                                                            setBulkBannerUploading(true);
                                                            const fd = new FormData();
                                                            fd.append('file', file);
                                                            try {
                                                                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                                                if (res.ok) { const r = await res.json(); setBulkBannerImage(r.url); }
                                                                else alert('Banner upload failed');
                                                            } catch { alert('Upload error'); }
                                                            finally { setBulkBannerUploading(false); }
                                                        }}
                                                        className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                                    />
                                                    {bulkBannerUploading && <p className="text-xs text-blue-500 mt-1 font-bold">Uploading...</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Gallery Images */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Gallery Images <span className="text-slate-400 font-normal">(multiple, shown in property detail)</span></label>
                                            {bulkImages.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {bulkImages.map((url, i) => (
                                                        <div key={i} className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => setBulkImages(prev => prev.filter((_, idx) => idx !== i))}
                                                                className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold"
                                                            >✕</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={async (e) => {
                                                    const files = Array.from(e.target.files || []);
                                                    if (!files.length) return;
                                                    setBulkImgUploading(true);
                                                    const urls = [];
                                                    for (const file of files) {
                                                        const fd = new FormData();
                                                        fd.append('file', file);
                                                        try {
                                                            const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                                            if (res.ok) { const r = await res.json(); urls.push(r.url); }
                                                        } catch { /* skip failed */ }
                                                    }
                                                    setBulkImages(prev => [...prev, ...urls]);
                                                    setBulkImgUploading(false);
                                                    e.target.value = '';
                                                }}
                                                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                                            />
                                            {bulkImgUploading && <p className="text-xs text-emerald-500 mt-1 font-bold">Uploading images...</p>}
                                            {bulkImages.length > 0 && <p className="text-xs text-slate-500 mt-1">{bulkImages.length} image{bulkImages.length > 1 ? 's' : ''} ready</p>}
                                        </div>
                                    </div>
                                </div>

                                {bulkError && (
                                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                                        <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                        <p className="text-sm text-red-600 font-medium">{bulkError}</p>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button onClick={closeBulkModal} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition">Cancel</button>
                                    <button
                                        onClick={handleBulkImport}
                                        disabled={bulkStatus === 'loading'}
                                        className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                                    >
                                        {bulkStatus === 'loading' ? (
                                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Importing...</>
                                        ) : (
                                            <><Upload size={16} /> Import Properties</>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* LIST VIEW */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* List Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-blue-600 transition p-1">
                        {selectedIds.length === filteredProjects.length && filteredProjects.length > 0 ? (
                            <CheckSquare size={22} className="text-blue-600" />
                        ) : (
                            <Square size={22} />
                        )}
                    </button>
                    <span className="font-bold text-slate-700">
                        {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Found
                    </span>
                </div>
            </div>

            {/* List Body */}
            {loading ? (
                <div className="p-10 text-center text-slate-500 font-bold">Loading projects...</div>
            ) : (
            <div className="flex flex-col divide-y divide-slate-100">
                {filteredProjects.map((p) => (
                    <div 
                        key={p.id} 
                        className={`group flex flex-col lg:flex-row lg:items-center gap-6 p-5 transition-all hover:bg-slate-50/80 ${selectedIds.includes(p.id) ? 'bg-blue-50/30' : ''}`}
                    >
                        {/* 1. Checkbox & Identity */}
                        <div className="flex items-start gap-4 flex-1">
                            <button onClick={() => toggleSelect(p.id)} className="mt-1 text-slate-300 hover:text-blue-600 transition">
                                {selectedIds.includes(p.id) ? <CheckSquare size={22} className="text-blue-600" /> : <Square size={22} />}
                            </button>
                            <div>
                                <h2 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setSelectedProject(p)}>
                                    {p.name}
                                </h2>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-1">
                                    <Building2 size={14} className="text-slate-400"/> {p.developer}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                    <MapPin size={14} className="text-slate-400"/> {p.location}
                                </div>
                            </div>
                        </div>

                        {/* 2. Key Specs */}
                        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm border-l-0 lg:border-l border-slate-200 lg:pl-6">
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Status</p>
                                <div className="flex flex-col items-start gap-1">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                                        p.status === 'Under Construction' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        p.status === 'Ready to Move' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        p.status === 'Pre-Launch' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                        'bg-slate-50 text-slate-700 border-slate-200'
                                    }`}>
                                        {p.status || 'N/A'}
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                        {p.isSignature && (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                                                Signature
                                            </span>
                                        )}
                                        {p.isMandate && (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-900 text-amber-400 border border-slate-800">
                                                Mandate
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar size={12}/> Possession</p>
                                <p className="font-semibold text-slate-800">{p.possession}</p>
                            </div>
                            <div className="col-span-2 lg:col-span-1 mt-2 lg:mt-0">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Layers size={12}/> Configurations</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {p.configurations.map(c => (
                                        <span key={c} className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded-md">{c}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. Actions */}
                        <div className="flex items-center gap-2 lg:justify-end border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                            <button onClick={() => setSelectedProject(p)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition tooltip" title="View Details">
                                <Eye size={18} />
                            </button>
                            <button onClick={() => openEditModal(p)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Edit">
                                <Pencil size={18} />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {filteredProjects.length === 0 && !loading && (
                    <div className="text-center py-24 bg-slate-50/50">
                        <Search size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-900 font-black text-xl mb-2">No projects found</p>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto">Try adjusting your filters or search terms to find what you&apos;re looking for.</p>
                    </div>
                )}
            </div>
            )}
        </div>

        {/* ADD / EDIT MODAL */}
        {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-4xl rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-8 sticky top-0 bg-white/90 backdrop-blur-md pb-4 border-b border-slate-100 z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                        <p className="text-slate-500 font-medium mt-1">Complete the details below to publish the project.</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-full transition">
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                <div className="space-y-10">
                    {/* BASIC INFO */}
                    <section>
                        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><Building2 size={20} className="text-blue-600"/> Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="name" placeholder="Project Name *" onChange={handleChange} value={formData.name} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                            <input name="developer" placeholder="Developer Name" onChange={handleChange} value={formData.developer} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                            <input name="location" placeholder="Location" onChange={handleChange} value={formData.location} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                            <input name="rera" placeholder="RERA Number" onChange={handleChange} value={formData.rera} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium font-mono" />
                            <input type="date" name="possession" placeholder="Possession Date" onChange={handleChange} value={formData.possession} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-500" />
                            <div className="relative">
                                <select name="status" onChange={handleChange} value={formData.status} className="appearance-none w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer">
                                    <option value="">Select Status</option>
                                    {filteredStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                            </div>
                        </div>
                    </section>

                    {/* PROJECT DETAILS */}
                    <section>
                        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><Layers size={20} className="text-blue-600"/> Project Specs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <input type="number" name="landParcel" placeholder="Land Parcel" onChange={handleChange} value={formData.landParcel} className="w-full p-3.5 pr-16 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">Acres</span>
                            </div>
                            <div className="relative">
                                <input type="number" name="openSpace" placeholder="Open Space" onChange={handleChange} value={formData.openSpace} className="w-full p-3.5 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">%</span>
                            </div>
                            <input name="totalFloors" placeholder="Total Floors" onChange={handleChange} value={formData.totalFloors} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                            <input name="floorBreakdown" placeholder="Floor Breakdown (e.g., 2 Podium + 20 Floor)" onChange={handleChange} value={formData.floorBreakdown} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                        </div>
                    </section>

                    {/* CONFIGURATIONS */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-slate-900">Configurations</h3>
                            <button onClick={() => setFormData({ ...formData, configDetails: [...(formData.configDetails || []), { type: '', carpet: '', price: '' }] })} className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">
                                + Add Row
                            </button>
                        </div>
                        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            {formData.configDetails?.length === 0 && <p className="text-sm text-slate-500 font-medium text-center py-2">No configurations added yet.</p>}
                            {formData.configDetails?.map((config, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
                                    <div className="relative">
                                        <select
                                            value={config.type}
                                            onChange={(e) => {
                                                const updated = [...formData.configDetails];
                                                updated[index].type = e.target.value;
                                                setFormData({ ...formData, configDetails: updated });
                                            }}
                                            className="appearance-none w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
                                        >
                                            <option value="">Select Type</option>
                                            {predefinedConfigs.map(type => <option key={type} value={type}>{type}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                    <input placeholder="Carpet Area (sqft)" value={config.carpet} onChange={(e) => { const updated = [...formData.configDetails]; updated[index].carpet = e.target.value; setFormData({ ...formData, configDetails: updated }); }} className="p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                    <div className="relative mb-5 md:mb-0">
                                        <input type="number" placeholder="Price (Numeric)" value={config.price} onChange={(e) => { const updated = [...formData.configDetails]; updated[index].price = e.target.value; setFormData({ ...formData, configDetails: updated }); }} className="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                                        {config.price && (
                                            <p className="absolute -bottom-5 left-1 text-[11px] text-blue-600 font-bold tracking-wide uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[95%]">
                                                {numberToWords(config.price)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* AMENITIES */}
                    <section>
                        <h3 className="font-bold text-lg text-slate-900 mb-4">Amenities & Features</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
                            {predefinedAmenities.map(amenity => (
                                <label key={amenity} className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition ${selectedAmenities.includes(amenity) ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                                        {selectedAmenities.includes(amenity) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={selectedAmenities.includes(amenity)} onChange={(e) => setSelectedAmenities(e.target.checked ? [...selectedAmenities, amenity] : selectedAmenities.filter(a => a !== amenity))} />
                                    <span className="text-sm font-medium text-slate-700">{amenity}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input placeholder="Type custom amenity..." value={customAmenity} onChange={(e) => setCustomAmenity(e.target.value)} className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                            <button onClick={() => { if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) { setSelectedAmenities([...selectedAmenities, customAmenity.trim()]); setCustomAmenity(''); } }} className="px-6 py-3.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition">Add</button>
                        </div>
                        {selectedAmenities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {selectedAmenities.map(amenity => (
                                    <span key={amenity} className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold">
                                        {amenity}
                                        <button onClick={() => setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))} className="text-blue-400 hover:text-blue-800 bg-white rounded-full p-0.5"><X size={12} strokeWidth={3} /></button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* EXTRA TEXT */}
                    <section>
                        <h3 className="font-bold text-lg text-slate-900 mb-4">Marketing Info</h3>
                        <textarea name="description" placeholder="Project Description" onChange={handleChange} value={formData.description} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium min-h-[120px]" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="usp" placeholder="Highlights / USP" onChange={handleChange} value={formData.usp} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                            <input name="launchYear" placeholder="Launch Year" onChange={handleChange} value={formData.launchYear} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                        </div>
                    </section>

                    {/* HOMEPAGE VISIBILITY FLAGS */}
                    <section>
                        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">🌐 Homepage Sectioning</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-slate-50 rounded-xl border border-slate-200">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded flex items-center justify-center border transition mt-0.5 ${formData.isSignature ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                                    {formData.isSignature && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                                </div>
                                <input type="checkbox" className="hidden" checked={formData.isSignature} onChange={(e) => setFormData({ ...formData, isSignature: e.target.checked })} />
                                <div>
                                    <span className="text-sm font-bold text-slate-900 block">Signature Collection</span>
                                    <span className="text-xs text-slate-500 font-medium">Display this property in the &quot;Signature Collection&quot; on the homepage</span>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded flex items-center justify-center border transition mt-0.5 ${formData.isMandate ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                                    {formData.isMandate && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                                </div>
                                <input type="checkbox" className="hidden" checked={formData.isMandate} onChange={(e) => setFormData({ ...formData, isMandate: e.target.checked })} />
                                <div>
                                    <span className="text-sm font-bold text-slate-900 block">Mandate Property</span>
                                    <span className="text-xs text-slate-500 font-medium">Display this property in the &quot;Investment Opportunities&quot; (Mandates) homepage section</span>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* PROJECT IMAGE */}
                    <section>
                        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">🖼️ Project Cover Image</h3>
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-40 h-28 bg-white border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center relative flex-shrink-0 shadow-inner">
                                {formData.images?.[0] ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-slate-400 font-medium">No image uploaded</span>
                                )}
                            </div>
                            <div className="flex-1 w-full space-y-2">
                                <p className="text-xs text-slate-500 font-semibold">Upload a high-quality cover image for the property listing. Supports PNG, JPG, or WEBP.</p>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const uploadFormData = new FormData();
                                            uploadFormData.append('file', file);
                                            try {
                                                const res = await fetch('/api/upload', {
                                                    method: 'POST',
                                                    body: uploadFormData
                                                });
                                                if (res.ok) {
                                                    const result = await res.json();
                                                    setFormData(prev => ({ ...prev, images: [result.url] }));
                                                } else {
                                                    alert("Failed to upload image");
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                alert("Upload error");
                                            }
                                        }}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                                    />
                                    {formData.images?.[0] && (
                                        <button 
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, images: [] }))}
                                            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* MODAL ACTIONS */}
                <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-200 sticky bottom-0 bg-white">
                    <button onClick={() => setShowModal(false)} className="px-8 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition">Cancel</button>
                    <button onClick={handleSubmit} className="px-10 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition active:scale-95">
                        {editingProject ? 'Save Changes' : 'Publish Project'}
                    </button>
                </div>
            </div>
        </div>
        )}

        {/* DETAILS MODAL (Read-Only) */}
        {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-3xl rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-black text-slate-900">{selectedProject.name}</h2>
                            <span className="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wide border border-blue-100">{selectedProject.status}</span>
                        </div>
                        <p className="text-slate-600 font-bold flex items-center gap-2"><Building2 size={16}/> {selectedProject.developer}</p>
                        <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-2"><MapPin size={16}/> {selectedProject.location}</p>
                    </div>
                    <button onClick={() => setSelectedProject(null)} className="bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-full transition">
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                {selectedProject.images?.[0] && (
                    <div className="w-full h-64 rounded-2xl overflow-hidden mb-6 bg-slate-100 shadow-sm border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selectedProject.images[0]} alt={selectedProject.name} className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div><p className="text-slate-400 text-xs font-bold uppercase mb-1">Possession</p><p className="font-bold text-slate-900">{selectedProject.possession}</p></div>
                    <div><p className="text-slate-400 text-xs font-bold uppercase mb-1">RERA</p><p className="font-mono font-bold text-slate-900">{selectedProject.rera}</p></div>
                    <div><p className="text-slate-400 text-xs font-bold uppercase mb-1">Land Area</p><p className="font-bold text-slate-900">{selectedProject.landParcel}</p></div>
                    <div><p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Floors</p><p className="font-bold text-slate-900">{selectedProject.totalFloors}</p></div>
                </div>

                <div className="mb-8">
                    <h3 className="font-bold text-lg text-slate-900 mb-4">Configurations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedProject.configDetails?.map((c, i) => (
                            <div key={i} className="flex justify-between items-center p-4 border border-slate-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition bg-white">
                                <div>
                                    <p className="font-black text-slate-900">{c.type}</p>
                                    <p className="text-sm text-slate-500 font-medium mt-0.5">{c.carpet}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Starting At</p>
                                    <p className="font-black text-blue-600 text-lg">{c.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedProject.description && (
                    <div className="mb-8 pb-8 border-b border-slate-100">
                        <h3 className="font-bold text-lg text-slate-900 mb-2">About the Project</h3>
                        <p className="text-slate-600 font-medium leading-relaxed">{selectedProject.description}</p>
                    </div>
                )}

                {selectedProject.amenities && (
                    <div className="mb-8">
                        <h3 className="font-bold text-lg text-slate-900 mb-4">World Class Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedProject.amenities.split(',').map((item, i) => (
                                <span key={i} className="text-sm bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl shadow-sm">{item.trim()}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
        )}
        </div>
    );
}