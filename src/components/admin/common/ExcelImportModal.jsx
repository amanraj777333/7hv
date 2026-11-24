import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import AdminModal from './AdminModal';

export default function ExcelImportModal({
  isOpen,
  onClose,
  collectionName,
  title = 'Import Records from Excel / CSV',
  existingRecords = [],
  onImportComplete
}) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState([]);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFileName(selectedFile.name);
    setFile(selectedFile);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (data.length === 0) {
          alert('Uploaded spreadsheet appears empty.');
          return;
        }

        // Detect duplicates against existing items
        const existingEmails = new Set(existingRecords.map((r) => (r.email || '').toLowerCase()).filter(Boolean));
        const existingTitles = new Set(existingRecords.map((r) => (r.name || r.title || '').toLowerCase()).filter(Boolean));

        let dups = 0;
        let invalids = 0;

        const evaluatedRows = data.map((row, idx) => {
          const email = (row.email || row.Email || '').trim().toLowerCase();
          const titleOrName = (row.name || row.Name || row.title || row.Title || '').trim();

          const isInvalid = !email && !titleOrName;
          const isDuplicate = (email && existingEmails.has(email)) || (titleOrName && existingTitles.has(titleOrName.toLowerCase()));

          if (isInvalid) invalids++;
          if (isDuplicate) dups++;

          return {
            ...row,
            _rowId: idx + 1,
            _isDuplicate: isDuplicate,
            _isInvalid: isInvalid
          };
        });

        setParsedRows(evaluatedRows);
        setDuplicateCount(dups);
        setInvalidCount(invalids);
      } catch (err) {
        alert('Failed to parse file: ' + err.message);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleDownloadSample = () => {
    window.open(`/api/bulk/template/${collectionName}`, '_blank');
  };

  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);

    try {
      // Filter out invalid rows before sending to backend
      const validRows = parsedRows.filter((r) => !r._isInvalid);

      const res = await fetch('/api/bulk/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('7h_auth_token') || ''}`
        },
        body: JSON.stringify({
          collection: collectionName,
          records: validRows
        })
      });

      const data = await res.json();
      if (res.ok) {
        setImportResult(data);
        if (onImportComplete) {
          onImportComplete(data);
        }
      } else {
        alert(data.error || 'Failed to complete import');
      }
    } catch (err) {
      alert('Error importing data: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileName('');
    setParsedRows([]);
    setDuplicateCount(0);
    setInvalidCount(0);
    setImportResult(null);
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={() => {
        handleReset();
        onClose();
      }}
      title={title}
      subtitle={`Supported formats: .xlsx, .xls, .csv • Target: ${collectionName}`}
      maxWidth="max-w-3xl"
      footer={
        importResult ? (
          <button
            type="button"
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="px-5 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-bold rounded-lg text-xs cursor-pointer"
          >
            Done
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="px-4 py-2 border border-[#333333] hover:bg-[#222222] text-stone-300 rounded-lg text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isProcessing || parsedRows.length === 0}
              onClick={handleConfirmImport}
              className="px-5 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{isProcessing ? 'Importing...' : `Confirm Import (${parsedRows.length - invalidCount} Valid Records)`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )
      }
    >
      <div className="space-y-4">
        {/* Step 1: Upload or Download Template */}
        {!importResult && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-[#181818] border border-[#282828] rounded-xl">
            <div>
              <span className="text-xs font-bold text-white block">Excel Template Specification</span>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Ensure your columns match our format or download a pre-formatted template.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadSample}
              className="px-3.5 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-[#D8C39A] border border-[#C5A46D]/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-center"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Sample .xlsx</span>
            </button>
          </div>
        )}

        {/* Upload Zone */}
        {!importResult && (
          <div>
            <label className="border-2 border-dashed border-[#333333] hover:border-[#C5A46D] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#111111] hover:bg-[#161616]">
              <Upload className="w-8 h-8 text-[#C5A46D] mb-2" />
              <span className="text-xs font-bold text-white">Click or drag Excel / CSV file here</span>
              <span className="text-[11px] text-stone-500 mt-0.5">
                {fileName ? `Selected: ${fileName}` : 'Accepts .xlsx, .xls, .csv (Max 10MB)'}
              </span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Validation and Preview Table */}
        {!importResult && parsedRows.length > 0 && (
          <div className="space-y-3">
            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-2.5 bg-[#181818] border border-[#2a2a2a] rounded-lg">
                <span className="text-stone-400 text-[10px] block">Total Rows Read</span>
                <span className="text-sm font-bold text-white">{parsedRows.length}</span>
              </div>
              <div className="p-2.5 bg-[#181818] border border-[#2a2a2a] rounded-lg">
                <span className="text-amber-400 text-[10px] block">Potential Duplicates</span>
                <span className="text-sm font-bold text-amber-400">{duplicateCount}</span>
              </div>
              <div className="p-2.5 bg-[#181818] border border-[#2a2a2a] rounded-lg">
                <span className="text-emerald-400 text-[10px] block">Ready to Import</span>
                <span className="text-sm font-bold text-emerald-400">{parsedRows.length - invalidCount}</span>
              </div>
            </div>

            {/* Preview Scrollable Table */}
            <div className="border border-[#262626] rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              <table className="w-full text-left text-[11px] text-stone-300">
                <thead className="bg-[#181818] border-b border-[#282828] text-stone-400 uppercase tracking-wider text-[9px] sticky top-0">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Title / Name</th>
                    <th className="py-2 px-3">Email / Company</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222]">
                  {parsedRows.slice(0, 30).map((row, idx) => (
                    <tr
                      key={idx}
                      className={
                        row._isInvalid
                          ? 'bg-red-950/20 text-red-300'
                          : row._isDuplicate
                          ? 'bg-amber-950/20 text-amber-300'
                          : 'hover:bg-[#181818]'
                      }
                    >
                      <td className="py-2 px-3 font-mono">{idx + 1}</td>
                      <td className="py-2 px-3 font-medium">
                        {row.name || row.Name || row.title || row.Title || <span className="text-red-400 italic">Missing</span>}
                      </td>
                      <td className="py-2 px-3">
                        {row.email || row.company || row.organization || '-'}
                      </td>
                      <td className="py-2 px-3">
                        {row._isInvalid ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-900/60 text-red-200">Invalid</span>
                        ) : row._isDuplicate ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-900/60 text-amber-200">Duplicate</span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-900/60 text-emerald-200">Valid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedRows.length > 30 && (
              <p className="text-[10px] text-stone-500 text-center">
                Showing first 30 of {parsedRows.length} rows. All valid rows will be committed.
              </p>
            )}
          </div>
        )}

        {/* Import Complete Results */}
        {importResult && (
          <div className="p-6 bg-[#161616] border border-[#C5A46D]/40 rounded-xl space-y-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div>
              <h4 className="text-base font-bold text-white font-serif">Import Processed Successfully</h4>
              <p className="text-xs text-stone-400 mt-1">
                Records have been inserted into the database and synchronized with the operations audit log.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-xs">
              <div className="p-3 bg-[#1e1e1e] rounded-lg">
                <span className="text-stone-400 text-[10px] block">Imported</span>
                <span className="text-base font-bold text-emerald-400">{importResult.importedCount}</span>
              </div>
              <div className="p-3 bg-[#1e1e1e] rounded-lg">
                <span className="text-stone-400 text-[10px] block">Skipped Duplicates</span>
                <span className="text-base font-bold text-stone-400">{importResult.skippedCount}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminModal>
  );
}
