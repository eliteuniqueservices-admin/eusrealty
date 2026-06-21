'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
    Search, FileText, Calendar, DollarSign, Activity, 
    CheckCircle, XCircle, Clock, Eye, AlertTriangle, Download, Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import ExportModal from '@/components/admin/ExportModal';

function LoanApplicationsContent() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [exportOpen, setExportOpen] = useState(false);

    const searchParams = useSearchParams();
    const appIdParam = searchParams.get('appId');

    useEffect(() => {
        fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus, searchTerm]);

    useEffect(() => {
        if (appIdParam && applications.length > 0) {
            const match = applications.find(app => app._id === appIdParam || app.id === appIdParam);
            if (match) {
                setSelectedApp(match);
            }
        }
    }, [appIdParam, applications]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams();
            if (filterStatus !== 'All') query.append('status', filterStatus);
            if (searchTerm) query.append('search', searchTerm);
            
            const res = await fetch(`/api/loan-applications?${query.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setApplications(data);
            }
        } catch (error) {
            console.error("Failed to load loan applications", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/loan-applications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationStatus: newStatus }),
            });
            if (res.ok) {
                const updated = await res.json();
                setApplications(applications.map(app => 
                    app._id === id ? updated : app
                ));
                if (selectedApp && selectedApp._id === id) {
                    setSelectedApp(updated);
                }
            } else {
                alert('Failed to update status.');
            }
        } catch (error) {
            console.error("Error updating status", error);
            alert('An error occurred while updating status.');
        }
    };

    const handleDeleteApp = async (id) => {
        if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) return;
        try {
            const res = await fetch(`/api/loan-applications/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setApplications(applications.filter(app => app._id !== id));
                if (selectedApp && selectedApp._id === id) {
                    setSelectedApp(null);
                }
            } else {
                alert('Failed to delete application.');
            }
        } catch (error) {
            console.error("Error deleting application:", error);
            alert('An error occurred while deleting the application.');
        }
    };

    // Metrics
    const totalApps = applications.length;
    const approvedApps = applications.filter(a => a.applicationStatus === 'Approved').length;
    const pendingApps = applications.filter(a => a.applicationStatus === 'Pending' || a.applicationStatus === 'Under Review').length;
    const totalVolume = applications.reduce((acc, curr) => acc + (curr.calculatedMetrics?.eligibleLoanAmount || 0), 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'Under Review': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getRiskColor = (risk) => {
        switch(risk) {
            case 'Excellent': return 'text-emerald-600 bg-emerald-50';
            case 'Good': return 'text-blue-600 bg-blue-50';
            case 'Average': return 'text-amber-600 bg-amber-50';
            case 'High Risk': return 'text-red-600 bg-red-50';
            default: return 'text-slate-600 bg-slate-50';
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen p-6 md:p-8 font-sans text-slate-900">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">Loan Applications</h1>
                <p className="text-slate-500 font-medium">Review and process home loan eligibility submissions.</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><FileText size={24} /></div>
                    <div>
                        <p className="text-slate-500 text-sm font-bold">Total Applications</p>
                        <p className="text-2xl font-black text-slate-900">{totalApps}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Clock size={24} /></div>
                    <div>
                        <p className="text-slate-500 text-sm font-bold">Pending / Review</p>
                        <p className="text-2xl font-black text-slate-900">{pendingApps}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle size={24} /></div>
                    <div>
                        <p className="text-slate-500 text-sm font-bold">Approved</p>
                        <p className="text-2xl font-black text-slate-900">{approvedApps}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><DollarSign size={24} /></div>
                    <div>
                        <p className="text-slate-500 text-sm font-bold">Total Est. Volume</p>
                        <p className="text-2xl font-black text-slate-900">{formatCurrency(totalVolume)}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search app number, name, phone..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                        {['All', 'Pending', 'Under Review', 'Approved', 'Rejected'].map(status => (
                            <button 
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filterStatus === status ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                <button onClick={() => setExportOpen(true)} className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                    <Download size={18} strokeWidth={2.5} /> Export Excel
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="p-4 font-bold">App Number</th>
                                <th className="p-4 font-bold">Applicant</th>
                                <th className="p-4 font-bold">Requirement</th>
                                <th className="p-4 font-bold">Eligible Loan</th>
                                <th className="p-4 font-bold">System Decision</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="7" className="p-8 text-center text-slate-500 font-bold">Loading...</td></tr>
                            ) : applications.length === 0 ? (
                                <tr><td colSpan="7" className="p-8 text-center text-slate-500 font-bold">No applications found.</td></tr>
                            ) : applications.map((app) => (
                                <tr key={app._id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 font-mono font-bold text-blue-600">{app.applicationNumber}</td>
                                    <td className="p-4">
                                        <p className="font-bold text-slate-900">{app.personalDetails?.fullName}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{app.personalDetails?.mobile}</p>
                                    </td>
                                    <td className="p-4 font-bold text-slate-700">{formatCurrency(app.property?.loanRequirement)}</td>
                                    <td className="p-4 font-bold text-emerald-600">{formatCurrency(app.calculatedMetrics?.eligibleLoanAmount)}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                                            app.eligibilityStatus === 'Eligible' ? 'text-emerald-700 bg-emerald-50' : 
                                            app.eligibilityStatus === 'Conditionally Eligible' ? 'text-amber-700 bg-amber-50' : 
                                            'text-red-700 bg-red-50'
                                        }`}>
                                            {app.eligibilityStatus}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold ${getStatusColor(app.applicationStatus)}`}>
                                            {app.applicationStatus}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => setSelectedApp(app)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteApp(app._id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete Application"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Application Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-xl font-black text-amber-400 mb-1">{selectedApp.applicationNumber}</h2>
                                <p className="text-sm text-slate-300 font-medium">Submitted on {format(new Date(selectedApp.createdAt), 'PPP')}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => handleDeleteApp(selectedApp._id)} 
                                    className="text-red-400 hover:text-red-500 hover:bg-white/10 p-2.5 rounded-full transition"
                                    title="Delete Application"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-white transition bg-white/10 p-2 rounded-full">
                                    <XCircle size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto bg-slate-50 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Left Col: Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Personal & Employment */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="font-black text-slate-900 mb-4 border-b pb-2">Applicant Profile</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-slate-500 block mb-1">Full Name</span><span className="font-bold">{selectedApp.personalDetails?.fullName}</span></div>
                                        <div><span className="text-slate-500 block mb-1">Contact</span><span className="font-bold">{selectedApp.personalDetails?.mobile} <br/> {selectedApp.personalDetails?.email}</span></div>
                                        <div><span className="text-slate-500 block mb-1">City</span><span className="font-bold">{selectedApp.personalDetails?.city}, {selectedApp.personalDetails?.state}</span></div>
                                        <div><span className="text-slate-500 block mb-1">Age</span><span className="font-bold">{selectedApp.personalDetails?.age} Yrs</span></div>
                                        <div className="col-span-2 mt-2 pt-4 border-t"><span className="text-slate-500 block mb-1">Employment</span>
                                            <span className="font-bold">{selectedApp.employment?.employmentType} at {selectedApp.employment?.companyOrBusiness}</span>
                                        </div>
                                        <div><span className="text-slate-500 block mb-1">Monthly Income</span><span className="font-bold text-emerald-600">{formatCurrency(selectedApp.employment?.netSalary || (selectedApp.employment?.annualIncome/12))}</span></div>
                                        <div><span className="text-slate-500 block mb-1">Existing EMI</span><span className="font-bold text-red-600">{formatCurrency(selectedApp.obligations?.totalExistingEmi)}</span></div>
                                    </div>
                                </div>

                                {/* Property Details */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="font-black text-slate-900 mb-4 border-b pb-2">Property Details</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-slate-500 block mb-1">Type & Location</span><span className="font-bold">{selectedApp.property?.propertyType} in {selectedApp.property?.location}</span></div>
                                        <div><span className="text-slate-500 block mb-1">Property Value</span><span className="font-bold">{formatCurrency(selectedApp.property?.propertyValue)}</span></div>
                                        <div><span className="text-slate-500 block mb-1">Down Payment</span><span className="font-bold">{formatCurrency(selectedApp.property?.downPayment)}</span></div>
                                        <div><span className="text-slate-500 block mb-1">Loan Requirement</span><span className="font-bold text-blue-600">{formatCurrency(selectedApp.property?.loanRequirement)}</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Col: Banking Engine */}
                            <div className="space-y-6">
                                <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
                                    <h3 className="font-black text-amber-400 mb-4 flex items-center gap-2"><Activity size={18}/> Banking Engine</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                            <span className="text-slate-400 text-sm">System Decision</span>
                                            <span className={`font-bold px-2 py-1 rounded text-xs ${
                                                selectedApp.eligibilityStatus === 'Eligible' ? 'bg-emerald-500/20 text-emerald-400' :
                                                selectedApp.eligibilityStatus === 'Conditionally Eligible' ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>{selectedApp.eligibilityStatus}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                            <span className="text-slate-400 text-sm">Max Eligible Loan</span>
                                            <span className="font-bold text-emerald-400">{formatCurrency(selectedApp.calculatedMetrics?.eligibleLoanAmount)}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                            <span className="text-slate-400 text-sm">Suggested EMI</span>
                                            <span className="font-bold">{formatCurrency(selectedApp.calculatedMetrics?.suggestedEmi)}/mo</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                            <span className="text-slate-400 text-sm">FOIR %</span>
                                            <span className="font-bold">{selectedApp.calculatedMetrics?.foir}%</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                            <span className="text-slate-400 text-sm">LTV %</span>
                                            <span className="font-bold">{selectedApp.calculatedMetrics?.ltv}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 text-sm">Risk Level</span>
                                            <span className={`font-bold px-2 py-1 rounded text-xs ${getRiskColor(selectedApp.calculatedMetrics?.riskLevel)}`}>
                                                {selectedApp.calculatedMetrics?.riskLevel}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Panel */}
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="font-black text-slate-900 mb-4">Process Application</h3>
                                    <div className="space-y-3">
                                        <button onClick={() => updateStatus(selectedApp._id, 'Approved')} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-md shadow-emerald-600/20">
                                            Approve Loan
                                        </button>
                                        <button onClick={() => updateStatus(selectedApp._id, 'Under Review')} className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition shadow-md shadow-amber-500/20">
                                            Mark as Under Review
                                        </button>
                                        <button onClick={() => updateStatus(selectedApp._id, 'Rejected')} className="w-full py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition">
                                            Reject Application
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Modal */}
            <ExportModal 
                isOpen={exportOpen}
                onClose={() => setExportOpen(false)}
                data={applications}
                filename="loan_applications_export.xlsx"
                availableColumns={[
                    { key: 'applicationNumber', label: 'App Number' },
                    { key: 'personalDetails.fullName', label: 'Applicant Name' },
                    { key: 'personalDetails.mobile', label: 'Mobile' },
                    { key: 'personalDetails.email', label: 'Email' },
                    { key: 'property.loanRequirement', label: 'Loan Requirement' },
                    { key: 'calculatedMetrics.eligibleLoanAmount', label: 'Eligible Loan' },
                    { key: 'calculatedMetrics.foir', label: 'FOIR %' },
                    { key: 'calculatedMetrics.ltv', label: 'LTV %' },
                    { key: 'eligibilityStatus', label: 'System Decision' },
                    { key: 'applicationStatus', label: 'Status' },
                    { key: 'createdAt', label: 'Date Applied' }
                ]}
            />
        </div>
    );
}

export default function LoanApplications() {
    return (
        <Suspense fallback={
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-3 text-slate-500">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Loading Loan Desk...</p>
            </div>
        }>
            <LoanApplicationsContent />
        </Suspense>
    );
}
