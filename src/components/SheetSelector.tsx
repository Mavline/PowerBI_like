import React from 'react';
import { WorkSheet } from 'xlsx';

interface SheetSelectorProps {
  sheets: Record<string, WorkSheet>;
  currentSheet: string | null;
  onSelectSheet: (sheetName: string) => void;
}

export function SheetSelector({ sheets, currentSheet, onSelectSheet }: SheetSelectorProps) {
  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-[var(--color-text-primary)]">
        Select Excel Sheet
      </label>
      <select 
        value={currentSheet || ''} 
        onChange={(e) => onSelectSheet(e.target.value)}
        className="w-full px-3 py-2 border border-[#333] rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
      >
        {Object.keys(sheets).map((sheetName) => (
          <option key={sheetName} value={sheetName}>
            {sheetName}
          </option>
        ))}
      </select>
    </div>
  );
}