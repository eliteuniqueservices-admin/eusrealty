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
  const [exportFormat, setExportFormat] = useState('xlsx'); // xlsx, csv
  const [whatsAppFormat, setWhatsAppFormat] = useState(false); // Optimize for WhatsApp Broadcast

  const toggleColumn = (key) => {
    if (whatsAppFormat) return; // Column selection is locked in WhatsApp mode
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
    
    const exportRows = filteredData.map(item => {
      const row = {};
      columnsToExport.forEach(col => {
        // Handle nested paths like "personalDetails.fullName"
        let val = '';
        if (col.key.includes('.')) {
          const keys = col.key.split('.');
          val = keys.reduce((obj, k) => (obj || {})[k], item) || '';
        } else {
          val = item[col.key] || '';
        }

        // WhatsApp specific formatting: Clean phone numbers to digits and ensure country prefix
        if (whatsAppFormat && col.key.toLowerCase().includes('phone')) {
          let cleaned = String(val).replace(/\D/g, ''); // strip non-digits
          if (cleaned.length === 10) {
            cleaned = '91' + cleaned; // Add India country code as default fallback
          }
          val = cleaned ? '+' + cleaned : '';
        }

        row[col.label] = val;
      });
      return row;
    });

    if (exportRows.length === 0) {
      alert("No data available to export for the selected date range.");
      return;
    }

    // 3. Export depending on format
    if (exportFormat === 'csv') {
      // Generate CSV
      const escapeCSVValue = (val) => {
        if (val === null || val === undefined) return '';
        let str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          str = '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      };

      const csvRows = [];
      // Headers
      csvRows.push(columnsToExport.map(col => escapeCSVValue(col.label)).join(','));
      // Data Rows
      exportRows.forEach(row => {
        csvRows.push(columnsToExport.map(col => escapeCSVValue(row[col.label])).join(','));
      });

      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      const downloadName = filename.replace(/\.xlsx$/, '.csv');
      link.setAttribute("download", downloadName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Generate Excel .xlsx
      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      XLSX.writeFile(workbook, filename);
    }
    
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
                <h3 className="font-bold text-slate-900 text-lg">Export Data</h3>
                <p className="text-xs text-slate-500 font-medium">{data.length} Total Records Available</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            
            {/* WhatsApp Broadcast Optimization Toggle */}
            <div className="mb-6 p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-center justify-between shadow-sm shadow-emerald-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  WA
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">WhatsApp Broadcast Format</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Filter for Name + Phone (clean digits) and export as CSV.</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={whatsAppFormat}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setWhatsAppFormat(checked);
                  if (checked) {
                    setExportFormat('csv');
                    // Select only name, phone and email columns
                    const updated = {};
                    availableColumns.forEach(col => {
                      const k = col.key.toLowerCase();
                      if (k.includes('name') || k.includes('phone') || k.includes('email') || k.includes('fullname')) {
                        updated[col.key] = true;
                      } else {
                        updated[col.key] = false;
                      }
                    });
                    setSelectedColumns(updated);
                  } else {
                    setExportFormat('xlsx');
                    // Select all by default when unchecked
                    setSelectedColumns(availableColumns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {}));
                  }
                }}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Export Format (Hidden in WhatsApp mode since CSV is forced) */}
            {!whatsAppFormat && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Export Format</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setExportFormat('xlsx')}
                    className={`flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-bold transition-all ${exportFormat === 'xlsx' ? 'border-cyan-500 bg-cyan-50/30 text-cyan-700 font-black shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`}
                  >
                    <FileSpreadsheet size={16} />
                    Excel Document (.xlsx)
                  </button>
                  <button
                    type="button"
                    onClick={() => setExportFormat('csv')}
                    className={`flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-bold transition-all ${exportFormat === 'csv' ? 'border-cyan-500 bg-cyan-50/30 text-cyan-700 font-black shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`}
                  >
                    <FileSpreadsheet size={16} />
                    CSV Document (.csv)
                  </button>
                </div>
              </div>
            )}

            {/* Date Filter */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Date Range</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {[{ label: 'All Time', val: 'all' }, { label: 'Last 30 Days', val: '30' }, { label: 'Last 7 Days', val: '7' }].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setDateFilter(opt.val)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${dateFilter === opt.val ? 'bg-white shadow text-cyan-600 font-black' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Column Selection (Disabled and greyed out in WhatsApp mode) */}
            <div className={whatsAppFormat ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Columns to Export</label>
                {!whatsAppFormat && (
                  <button 
                    type="button"
                    onClick={() => {
                      const allSelected = Object.values(selectedColumns).every(Boolean);
                      setSelectedColumns(availableColumns.reduce((acc, col) => ({ ...acc, [col.key]: !allSelected }), {}));
                    }}
                    className="text-xs font-bold text-cyan-600 hover:text-cyan-700"
                  >
                    {Object.values(selectedColumns).every(Boolean) ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {availableColumns.map(col => (
                  <label 
                    key={col.key} 
                    onClick={() => toggleColumn(col.key)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      whatsAppFormat ? 'cursor-default' : 'cursor-pointer'
                    } ${selectedColumns[col.key] ? 'border-cyan-500 bg-cyan-50/20' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedColumns[col.key] ? 'bg-cyan-500 text-white' : 'bg-slate-200'}`}>
                      {selectedColumns[col.key] && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span className={`text-sm font-medium ${selectedColumns[col.key] ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>{col.label}</span>
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
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md ${
                whatsAppFormat 
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' 
                  : 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20'
              }`}
            >
              <Download size={16} />
              {whatsAppFormat ? 'Export CSV for Broadcast' : `Export .${exportFormat}`}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
