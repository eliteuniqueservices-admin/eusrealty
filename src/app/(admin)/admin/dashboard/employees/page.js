'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, Search, Phone, Mail, Edit, Trash2, MoreHorizontal, Building2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

const DEPARTMENTS = ['Sales', 'HR', 'Management', 'Operations', 'Marketing'];
const DESIGNATIONS = ['Relationship Manager', 'Software Engineer','Sales Executive', 'HR Manager', 'Team Leader', 'Assistant Manager', 'Branch Manager', 'Marketing Executive'];

const deptColors = {
  Sales: 'success',
  HR: 'info',
  Management: 'brand',
  Operations: 'warning',
  Marketing: 'secondary',
};

const defaultForm = {
  name: '', email: '', mobile: '', department: '', designation: '',
  joiningDate: '', basicSalary: '', panNumber: '', aadhaarNumber: '',
  bankName: '', accountNumber: '', ifscCode: '', employeeId: '',
};

export default function EmployeesPage() {
  const { data: session } = useSession();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.employeeId?.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  const openCreate = () => {
    setForm(defaultForm);
    setEditId(null);
    setDialogOpen(true);
  };

  const openEdit = (emp) => {
    setForm({
      name: emp.name, email: emp.email, mobile: emp.mobile,
      department: emp.department, designation: emp.designation,
      joiningDate: emp.joiningDate?.split('T')[0] || '',
      basicSalary: emp.basicSalary || '', panNumber: emp.panNumber || '',
      aadhaarNumber: emp.aadhaarNumber || '', bankName: emp.bankName || '',
      accountNumber: emp.accountNumber || '', ifscCode: emp.ifscCode || '',
      employeeId: emp.employeeId || '',
    });
    setEditId(emp._id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const phoneDigits = form.mobile.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSaving(true);
    try {
      const url = editId ? `/api/employees/${editId}` : '/api/employees';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, mobile: phoneDigits }),
      });
      if (res.ok) {
        setDialogOpen(false);
        fetchEmployees();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await fetch(`/api/employees/${deletingId}`, { method: 'DELETE' });
    setDeleteDialogOpen(false);
    setDeletingId(null);
    fetchEmployees();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employees</h1>
          <p className="text-slate-500 text-sm mt-1">{employees.length} team members</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={16} /> Add Employee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {DEPARTMENTS.slice(0, 4).map(dept => (
          <Card key={dept} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setDeptFilter(dept === deptFilter ? 'All' : dept)}>
            <CardContent className="p-4">
              <p className="text-2xl font-black text-slate-900">{employees.filter(e => e.department === dept).length}</p>
              <p className="text-sm text-slate-500 font-medium">{dept}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by name, email or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="animate-spin w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full mx-auto mb-3" />
              Loading employees...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={40} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-semibold">No employees found</p>
              <p className="text-slate-400 text-sm mt-1">Add your first team member to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden lg:table-cell">Designation</TableHead>
                  <TableHead className="hidden md:table-cell">Joining Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Salary</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(emp => (
                  <TableRow key={emp._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm flex-shrink-0">
                          {emp.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{emp.name}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-slate-400 flex items-center gap-1"><Mail size={11} />{emp.email}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={deptColors[emp.department] || 'secondary'}>{emp.department}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <p className="text-sm text-slate-700">{emp.designation}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="text-sm text-slate-600">{emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString('en-IN') : '—'}</p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <p className="text-sm font-bold text-slate-900">₹{Number(emp.basicSalary || 0).toLocaleString('en-IN')}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(emp)} className="h-8 w-8">
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setDeletingId(emp._id); setDeleteDialogOpen(true); }} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
            <DialogDescription>Fill in the employee details below.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Employee ID</Label>
              <Input placeholder="EUS-001" value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input placeholder="Rahul Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" placeholder="rahul@eusrealty.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Mobile *</Label>
              <Input 
                type="tel"
                maxLength={10}
                placeholder="e.g. 9876543210" 
                value={form.mobile} 
                onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Department *</Label>
              <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">Select department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Designation *</Label>
              <select value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">Select designation</option>
                {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Joining Date *</Label>
              <Input type="date" value={form.joiningDate} onChange={e => setForm({ ...form, joiningDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Basic Salary (₹)</Label>
              <Input type="number" placeholder="35000" value={form.basicSalary} onChange={e => setForm({ ...form, basicSalary: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>PAN Number</Label>
              <Input placeholder="ABCDE1234F" value={form.panNumber} onChange={e => setForm({ ...form, panNumber: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Aadhaar Number</Label>
              <Input placeholder="XXXX XXXX XXXX" value={form.aadhaarNumber} onChange={e => setForm({ ...form, aadhaarNumber: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Input placeholder="HDFC Bank" value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input placeholder="1234567890" value={form.accountNumber} onChange={e => setForm({ ...form, accountNumber: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>IFSC Code</Label>
              <Input placeholder="HDFC0001234" value={form.ifscCode} onChange={e => setForm({ ...form, ifscCode: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editId ? 'Update Employee' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Employee?</DialogTitle>
            <DialogDescription>This action cannot be undone. The employee record will be permanently removed.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
