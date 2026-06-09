'use client';
import { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Edit3, Trash2, MapPin, Briefcase, 
  IndianRupee, Clock, X, ChevronDown, 
  Search, Users, Calendar, Building2, 
  Globe, Tag, PlayCircle, PauseCircle, FileText
} from 'lucide-react';

const DEPARTMENTS = ['Sales', 'Marketing', 'Operations', 'Human Resources', 'Customer Success', 'Engineering'];
const WORK_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship'];
const WORK_MODES = ['On-site', 'Hybrid', 'Remote'];
const EXPERIENCE_LEVELS = ['Fresher (0-1 Yrs)', 'Junior (1-3 Yrs)', 'Mid-Level (3-5 Yrs)', 'Senior (5-8 Yrs)', 'Leadership (8+ Yrs)'];

export default function ManageJobPosts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    _id: null, title: '', department: DEPARTMENTS[0], location: '', salary: '', 
    type: WORK_TYPES[0], mode: WORK_MODES[0], experience: EXPERIENCE_LEVELS[0], 
    status: 'Active', deadline: '', description: '', skills: []
  });
  const [skillInput, setSkillInput] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/job-posts?all=true');
      if (!res.ok) throw new Error('Failed to fetch job postings');
      const jobsData = await res.json();
      
      setJobs(jobsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Derived Metrics
  const metrics = useMemo(() => ({
    total: jobs.length,
    active: jobs.filter(j => j.status === 'Active').length,
    closed: jobs.filter(j => j.status === 'Closed').length,
  }), [jobs]);

  // Filters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);


  // Handlers
  const toggleStatus = async (job) => {
    try {
      const newStatus = job.status === 'Active' ? 'Closed' : 'Active';
      const res = await fetch(`/api/job-posts/${job._id || job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update job status');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (jobId) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      try {
        const res = await fetch(`/api/job-posts/${jobId}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete job posting');
        fetchData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const openModal = (mode, job = null) => {
    setModalMode(mode);
    if (mode === 'edit' && job) {
      setFormData(job);
    } else {
      setFormData({ 
        _id: null, title: '', department: DEPARTMENTS[0], location: '', salary: '', 
        type: WORK_TYPES[0], mode: WORK_MODES[0], experience: EXPERIENCE_LEVELS[0], 
        status: 'Active', deadline: '', description: '', skills: [] 
      });
    }
    setSkillInput('');
    setIsModalOpen(true);
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
        setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
        setSkillInput('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEdit = modalMode === 'edit';
      const url = isEdit ? `/api/job-posts/${formData._id}` : '/api/job-posts';
      const method = isEdit ? 'PUT' : 'POST';
      
      const payload = { ...formData };
      if (!isEdit) {
        delete payload._id;
      }
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save job post');
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* --- HEADER & METRICS --- */}
        <header className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Job Requisitions</h1>
              <p className="text-slate-500 font-medium text-sm mt-1 flex items-center gap-2">
                <Briefcase size={16}/> Talent Acquisition • EUS Realty
              </p>
            </div>
            <button 
              onClick={() => openModal('add')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <Plus size={18} strokeWidth={3} /> Post New Job
            </button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Briefcase size={24}/></div>
              <div><p className="text-sm font-bold text-slate-500">Total Postings</p><p className="text-2xl font-black text-slate-900">{metrics.total}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><PlayCircle size={24}/></div>
              <div><p className="text-sm font-bold text-slate-500">Active Jobs</p><p className="text-2xl font-black text-slate-900">{metrics.active}</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-slate-100 text-slate-600 rounded-xl"><PauseCircle size={24}/></div>
              <div><p className="text-sm font-bold text-slate-500">Closed Jobs</p><p className="text-2xl font-black text-slate-900">{metrics.closed}</p></div>
            </div>
          </div>
        </header>

        {/* --- SEARCH & FILTERS --- */}
        <section className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Search by job title or department..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
            {['All', 'Active', 'Closed'].map(status => (
              <button 
                key={status} onClick={() => setStatusFilter(status)}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === status ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </section>

        {/* --- JOB CARDS GRID --- */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full py-20 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
               <Briefcase size={48} className="mx-auto mb-4 text-slate-300 animate-pulse"/>
               <p className="font-bold text-lg text-slate-700">Loading job postings...</p>
             </div>
          ) : error ? (
             <div className="col-span-full py-20 text-center text-red-500 bg-white rounded-2xl border border-slate-200">
               <p className="font-bold text-lg">Error loading job postings</p>
               <p className="text-sm mt-1">{error}</p>
             </div>
          ) : filteredJobs.length === 0 ? (
             <div className="col-span-full py-20 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
               <Briefcase size={48} className="mx-auto mb-4 text-slate-300"/>
               <p className="font-bold text-lg text-slate-700">No jobs found</p>
               <p className="text-sm mt-1">Adjust your search or create a new posting.</p>
             </div>
          ) : filteredJobs.map((job) => (
            <div key={job._id || job.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col group">
              
              {/* Card Header */}
              <div className="p-6 pb-4 border-b border-slate-100 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${job.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                    {job.status === 'Active' ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> : null}
                    {job.status}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal('edit', job)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Job"><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(job._id || job.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Job"><Trash2 size={16}/></button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <p className="text-sm font-medium text-slate-500 mb-5 flex items-center gap-1.5"><Building2 size={14}/> {job.department}</p>
                
                {/* Meta Tags */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-5">
                  <div className="flex items-start gap-2 text-slate-600 text-sm font-medium">
                    <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" /> 
                    <span className="leading-tight">{job.location} <span className="block text-xs text-slate-400">({job.mode})</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                    <IndianRupee size={16} className="text-slate-400 shrink-0" /> {job.salary}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                    <Briefcase size={16} className="text-slate-400 shrink-0" /> {job.experience}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                    <Clock size={16} className="text-slate-400 shrink-0" /> {job.type}
                  </div>
                </div>

                {/* Skills Preview */}
                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {job.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">{skill}</span>
                    ))}
                    {job.skills.length > 3 && <span className="bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-md">+{job.skills.length - 3}</span>}
                  </div>
                )}
              </div>

              {/* Card Footer (Metrics & Actions) */}
              <div className="p-4 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Deadline</p>
                    <p className="text-sm font-bold text-slate-700 mt-1 flex items-center gap-1"><Calendar size={14}/> {job.deadline || 'Open'}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => toggleStatus(job)}
                  className={`p-2.5 rounded-xl transition-all shadow-sm ${job.status === 'Active' ? 'bg-white text-red-600 hover:bg-red-50 border border-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  title={job.status === 'Active' ? 'Close Job Posting' : 'Re-open Job Posting'}
                >
                  {job.status === 'Active' ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- FULL PAGE MODAL (CREATE / EDIT) --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in slide-in-from-bottom-4 duration-300">
              
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{modalMode === 'add' ? 'Create Job Requisition' : 'Edit Job Details'}</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Fill out the details to publish this opening on the careers portal.</p>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
              </div>
              
              {/* Modal Body (Scrollable) */}
              <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
                <form id="jobForm" onSubmit={handleSubmit} className="space-y-10">
                  
                  {/* Section 1: Basic Info */}
                  <section>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><FileText size={16}/> Basic Details</h3>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Job Title *</label>
                        <input required type="text" placeholder="e.g. Senior Marketing Manager" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium"
                          value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Department *</label>
                        <div className="relative">
                          <select className="appearance-none w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 cursor-pointer text-sm font-medium"
                            value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Location *</label>
                        <input required type="text" placeholder="e.g. Wakad, Pune" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium"
                          value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                      </div>
                    </div>
                  </section>

                  {/* Section 2: Role Specifications */}
                  <section>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Briefcase size={16}/> Role Specifications</h3>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Employment Type</label>
                        <div className="relative">
                          <select className="appearance-none w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 cursor-pointer text-sm font-medium"
                            value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                            {WORK_TYPES.map(t => <option key={t}>{t}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Work Mode</label>
                        <div className="relative">
                          <select className="appearance-none w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 cursor-pointer text-sm font-medium"
                            value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})}>
                            {WORK_MODES.map(m => <option key={m}>{m}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Experience Required</label>
                        <div className="relative">
                          <select className="appearance-none w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 cursor-pointer text-sm font-medium"
                            value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})}>
                            {EXPERIENCE_LEVELS.map(e => <option key={e}>{e}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section 3: Comp & Time */}
                  <section>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><IndianRupee size={16}/> Compensation & Timeline</h3>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Salary Range</label>
                        <input type="text" placeholder="e.g. ₹5L - ₹8L PA (Optional)" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium"
                          value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Application Deadline</label>
                        <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium"
                          value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                      </div>
                    </div>
                  </section>

                  {/* Section 4: Details & Skills */}
                  <section>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Tag size={16}/> Details & Requirements</h3>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Job Description *</label>
                        <textarea required rows={5} placeholder="Describe the role, responsibilities, and benefits..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium resize-none"
                          value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">Required Skills / Tags</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" placeholder="Type a skill and press Enter or Add" className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium"
                            value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={handleAddSkill}
                          />
                          <button type="button" onClick={handleAddSkill} className="px-6 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors">Add</button>
                        </div>
                        {formData.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {formData.skills.map(skill => (
                              <span key={skill} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-blue-100">
                                {skill}
                                <button type="button" onClick={() => setFormData({...formData, skills: formData.skills.filter(s => s !== skill)})} className="text-blue-400 hover:text-blue-800"><X size={14} strokeWidth={3}/></button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                </form>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm">
                  Cancel
                </button>
                <button type="submit" form="jobForm" className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors text-sm">
                  {modalMode === 'add' ? 'Publish Requisition' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}