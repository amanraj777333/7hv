import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, FileSpreadsheet, CheckSquare, Square } from 'lucide-react';
import AdminModal from './AdminModal';

export default function ExcelExportModal({
  isOpen,
  onClose,
  records = [],
  selectedRecords = [],
  availableColumns = [],
  defaultFileName = '7Horse-Export',
  collectionName = 'data'
}) {
  const [format, setFormat] = useState('xlsx'); // 'xlsx' | 'csv'
  const [scope, setScope] = useState(selectedRecords.length > 0 ? 'selected' : 'all'); // 'selected' | 'all'
  const [selectedColumns, setSelectedColumns] = useState(
    availableColumns.length > 0 ? availableColumns.map((c) => c.key) : []
  );

  const toggleColumn = (colKey) => {
    setSelectedColumns((prev) =>
      prev.includes(colKey) ? prev.filter((k) => k !== colKey) : [...prev, colKey]
    );
  };

  const selectAllColumns = () => {
    setSelectedColumns(availableColumns.map((c) => c.key));
  };

  const deselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const handleExecuteExport = () => {
    const targetItems = scope === 'selected' && selectedRecords.length > 0 ? selectedRecords : records;

    if (targetItems.length === 0) {
      alert('No records available to export.');
      return;
    }

    if (selectedColumns.length === 0) {
      alert('Please select at least one column to export.');
      return;
    }

    // Build filtered data rows
    const exportRows = targetItems.map((item) => {
      const row = {};
      selectedColumns.forEach((colKey) => {
        const colDef = availableColumns.find((c) => c.key === colKey);
        const colHeader = colDef ? colDef.label : colKey;
        row[colHeader] = item[colKey] !== undefined ? item[colKey] : '';
      });
      return row;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportRows);
    XLSX.utils.book_append_sheet(wb, ws, collectionName.slice(0, 30));

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `${defaultFileName}-${timestamp}.${format}`;

    if (format === 'csv') {
      const csvData = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      XLSX.writeFile(wb, filename);
    }

    onClose();
  };

  const targetCount = scope === 'selected' && selectedRecords.length > 0 ? selectedRecords.length : records.length;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Records to Excel / CSV"
      subtitle={`Configure export format and selected columns (${targetCount} records)`}
      maxWidth="max-w-xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#333333] hover:bg-[#222222] text-stone-300 rounded-lg text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecuteExport}
            disabled={selectedColumns.length === 0 || targetCount === 0}
            className="px-5 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {format.toUpperCase()} ({targetCount})</span>
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Scope Selection */}
        <div className="space-y-1.5">
          <label className="text-stone-300 font-semibold block text-xs">Export Scope</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setScope('all')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                scope === 'all'
                  ? 'bg-[#1e1e1e] border-[#C5A46D] text-white'
                  : 'bg-[#141414] border-[#2a2a2a] text-stone-400 hover:text-white'
              }`}
            >
              <span className="font-bold block">All Filtered Records</span>
              <span className="text-[11px] text-stone-500">{records.length} records in current view</span>
            </button>

            <button
              type="button"
              disabled={selectedRecords.length === 0}
              onClick={() => setScope('selected')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                scope === 'selected'
                  ? 'bg-[#1e1e1e] border-[#C5A46D] text-white'
                  : 'bg-[#141414] border-[#2a2a2a] text-stone-400 hover:text-white'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <span className="font-bold block">Selected Records Only</span>
              <span className="text-[11px] text-stone-500">
                {selectedRecords.length > 0 ? `${selectedRecords.length} records selected` : 'No records selected'}
              </span>
            </button>
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-1.5">
          <label className="text-stone-300 font-semibold block text-xs">File Format</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormat('xlsx')}
              className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                format === 'xlsx'
                  ? 'bg-[#101010] text-[#D8C39A] border-[#C5A46D]'
                  : 'bg-[#181818] text-stone-400 border-[#2a2a2a]'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Microsoft Excel (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                format === 'csv'
                  ? 'bg-[#101010] text-[#D8C39A] border-[#C5A46D]'
                  : 'bg-[#181818] text-stone-400 border-[#2a2a2a]'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-400" />
              <span>Comma Separated (.csv)</span>
            </button>
          </div>
        </div>

        {/* Column Selection */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-stone-300 font-semibold block text-xs">Include Columns</label>
            <div className="flex gap-2 text-[10px]">
              <button
                type="button"
                onClick={selectAllColumns}
                className="text-[#C5A46D] hover:underline cursor-pointer"
              >
                Select All
              </button>
              <span className="text-stone-600">•</span>
              <button
                type="button"
                onClick={deselectAllColumns}
                className="text-stone-500 hover:underline cursor-pointer"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-[#111111] border border-[#242424] rounded-xl max-h-48 overflow-y-auto">
            {availableColumns.map((col) => {
              const isChecked = selectedColumns.includes(col.key);
              return (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => toggleColumn(col.key)}
                  className="flex items-center gap-2 p-1.5 rounded hover:bg-[#1a1a1a] text-left text-xs cursor-pointer text-stone-300"
                >
                  {isChecked ? (
                    <CheckSquare className="w-3.5 h-3.5 text-[#C5A46D] shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                  )}
                  <span className="truncate">{col.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
