import { useCallback } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { readExcelFile, getHeadersFromRow, extractData } from '../utils/excelUtils';

export function FileUpload() {
  const { setExcelData, setSelectedColumns } = useDashboardStore();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const sheets = await readExcelFile(file);
      const firstSheetName = Object.keys(sheets)[0];
      
      if (!firstSheetName) {
        throw new Error('No sheets found in Excel file');
      }

      const firstSheet = sheets[firstSheetName];
      const headers = getHeadersFromRow(firstSheet, 0);
      const data = extractData(firstSheet, 0);

      setExcelData({
        sheets,
        currentSheet: firstSheetName,
        headers,
        data,
        headerRowIndex: 0
      });
      
      setSelectedColumns([]);
    } catch (error) {
      console.error('Error processing Excel file:', error);
      alert('Error processing Excel file. Please try again.');
    }
  }, [setExcelData, setSelectedColumns]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#333] rounded-lg cursor-pointer bg-[var(--color-bg-secondary)] hover:bg-[#222]">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-[var(--color-accent-green)]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-[var(--color-text-primary)]">
              <span className="font-semibold">Нажмите для загрузки</span> или перетащите файл
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">Excel файлы</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
          />
        </label>
      </div>
    </div>
  );
}