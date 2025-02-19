import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { SheetSelector } from './SheetSelector';
import { HeaderRowSelector } from './HeaderRowSelector';
import { ChartTypeSelector } from './ChartTypeSelector';
import { DashboardCanvas } from './DashboardCanvas';
import { useDashboardStore, ChartType } from '../store/dashboardStore';
import { getHeadersFromRow, extractData } from '../utils/excelUtils';

export function Dashboard() {
  const { 
    excelData, 
    addItem, 
    setExcelData 
  } = useDashboardStore();

  const handleSheetSelect = (sheetName: string) => {
    const sheet = excelData.sheets[sheetName];
    const headers = getHeadersFromRow(sheet, excelData.headerRowIndex);
    const data = extractData(sheet, excelData.headerRowIndex);
    
    setExcelData({
      currentSheet: sheetName,
      headers,
      data
    });
  };

  const handleHeaderRowSelect = (rowIndex: number) => {
    if (!excelData.currentSheet) return;

    const currentSheet = excelData.sheets[excelData.currentSheet];
    const headers = getHeadersFromRow(currentSheet, rowIndex);
    const data = extractData(currentSheet, rowIndex);

    setExcelData({
      headers,
      data,
      headerRowIndex: rowIndex
    });
  };

  const handleChartTypeSelect = (type: ChartType) => {
    addItem({
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      columns: [],
      position: { x: 0, y: 0 },
      size: { width: 600, height: 400 }
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <div className="space-y-4 p-4">
        <FileUpload />

        {Object.keys(excelData.sheets).length > 0 && (
          <>
            <SheetSelector 
              sheets={excelData.sheets}
              currentSheet={excelData.currentSheet || null}
              onSelectSheet={handleSheetSelect}
            />

            <HeaderRowSelector 
              sheet={excelData.currentSheet ? excelData.sheets[excelData.currentSheet] : undefined}
              headerRowIndex={excelData.headerRowIndex}
              onSelectHeaderRow={handleHeaderRowSelect}
            />

            {excelData.headers.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select Visualization Type</h3>
                <ChartTypeSelector onSelect={handleChartTypeSelect} />
                <DashboardCanvas />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}