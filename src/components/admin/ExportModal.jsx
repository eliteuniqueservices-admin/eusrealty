'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileSpreadsheet, Check } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ExportModal({ 
  isOpen, 
  onClose, 
  data, 
  availableColumns, 
  filename = 'export.xlsx' 
}) {
  // Select all columns by default
  const [selectedColumns, setSelectedColumns] = useState(
    availableColumns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );

  const [dateFilter, setDateFilter] = useState('all'); // all, 7, 30

  const toggleColumn = (key) => {
    setSelectedColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = () => {
    // 1. Filter Data by Date
    let filteredData = [...data];
    if (dateFilter !== 'all') {
      const days = parseInt(dateFilter, 10);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      filteredData = filteredData.filter(item => new Date(item.createdAt || item.date) >= cutoff);
    }

    // 2. Map Data to selected columns
    const columnsToExport = availableColumns.filter(col => selectedColumns[col.key]);
    
    const excelData = filteredData.map(item => {
      const row = {};
      columnsToExport.forEach(col => {
        // Handle nested paths like "personalDetails.fullName"
        if (col.key.includes('.')) {
          const keys = col.key.split('.');
          row[col.label] = keys.reduce((obj, k) => (obj || {})[k], item) || '';
        } else {
          row[col.label] = item[col.key] || '';
        }
      });
      return row;
    });

    if (excelData.length === 0) {
      alert("No data available to export for the selected date range.");
      return;
    }

    // 3. Generate Excel
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, filename);
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Export to Excel</h3>
                <p className="text-xs text-slate-500 font-medium">{data.length} Total Records Available</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            
            {/* Date Filter */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Date Range</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {[{ label: 'All Time', val: 'all' }, { label: 'Last 30 Days', val: '30' }, { label: 'Last 7 Days', val: '7' }].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setDateFilter(opt.val)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${dateFilter === opt.val ? 'bg-white shadow text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Column Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider">Columns to Export</label>
                <button 
                  onClick={() => {
                    const allSelected = Object.values(selectedColumns).every(Boolean);
                    setSelectedColumns(availableColumns.reduce((acc, col) => ({ ...acc, [col.key]: !allSelected }), {}));
                  }}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700"
                >
                  {Object.values(selectedColumns).every(Boolean) ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {availableColumns.map(col => (
                  <label 
                    key={col.key} 
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedColumns[col.key] ? 'border-cyan-500 bg-cyan-50/30' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedColumns[col.key] ? 'bg-cyan-500 text-white' : 'bg-slate-200'}`}>
                      {selectedColumns[col.key] && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span className={`text-sm font-medium ${selectedColumns[col.key] ? 'text-slate-900' : 'text-slate-500'}`}>{col.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button 
              onClick={handleExport}
              disabled={Object.values(selectedColumns).every(v => !v)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-bold hover:bg-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-600/20"
            >
              <Download size={16} />
              Export .xlsx
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
