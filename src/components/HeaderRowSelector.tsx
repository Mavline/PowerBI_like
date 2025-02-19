import React, { useMemo } from 'react';
import { WorkSheet, utils } from 'xlsx';

interface HeaderRowSelectorProps {
  sheet?: WorkSheet;
  headerRowIndex: number;
  onSelectHeaderRow: (index: number) => void;
}

export function HeaderRowSelector({ 
  sheet, 
  headerRowIndex, 
  onSelectHeaderRow 
}: HeaderRowSelectorProps) {
  const rowOptions = useMemo(() => {
    if (!sheet) return [];

    const range = utils.decode_range(sheet['!ref'] || 'A1');
    const totalRows = range.e.r + 1;

    return Array.from({ length: Math.min(10, totalRows) }, (_, i) => i);
  }, [sheet]);

  const previewHeaders = useMemo(() => {
    if (!sheet || rowOptions.length === 0) return [];

    return rowOptions.map(rowIndex => {
      const headers = rowOptions.map(col => {
        const cellAddress = utils.encode_cell({ r: rowIndex, c: col });
        const cell = sheet[cellAddress];
        return cell ? cell.v?.toString().trim() : '';
      });
      return headers;
    });
  }, [sheet, rowOptions]);

  if (!sheet) return null;

  return (
    <div className="w-full space-y-4">
      <label className="block text-sm font-medium text-[var(--color-text-primary)]">
        Выберите строку заголовков
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {previewHeaders.map((headerRow, index) => (
          <div 
            key={index} 
            className={`
              border rounded p-2 cursor-pointer transition-all 
              ${headerRowIndex === rowOptions[index] 
                ? 'border-[var(--color-accent-green)] bg-[var(--color-bg-secondary)]' 
                : 'border-[#333] hover:border-[#666]'}
            `}
            onClick={() => onSelectHeaderRow(rowOptions[index])}
          >
            <div className="text-xs font-bold mb-2">Строка {rowOptions[index] + 1}</div>
            <div className="grid grid-cols-3 gap-1 overflow-hidden">
              {headerRow.slice(0, 3).map((header, colIndex) => (
                <div 
                  key={colIndex} 
                  className="truncate bg-[#222] p-1 rounded text-[0.6rem]"
                >
                  {header || 'Пусто'}
                </div>
              ))}
              {headerRow.length > 3 && (
                <div className="text-[0.5rem] text-[#666] flex items-center">
                  +{headerRow.length - 3} ещё
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}