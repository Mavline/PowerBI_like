import { read, utils, WorkSheet } from 'xlsx';

export const readExcelFile = async (file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = read(arrayBuffer);
    const sheets: { [key: string]: WorkSheet } = {};
    
    workbook.SheetNames.forEach((name) => {
      sheets[name] = workbook.Sheets[name];
    });

    return sheets;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw new Error('Failed to read Excel file');
  }
};

export const getHeadersFromRow = (sheet: WorkSheet, rowIndex: number): string[] => {
  if (!sheet['!ref']) return [];
  
  const range = utils.decode_range(sheet['!ref']);
  const headers: string[] = [];
  const seenHeaders = new Set<string>();

  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = utils.encode_cell({ r: rowIndex, c: col });
    const cell = sheet[cellAddress];
    let value = cell ? cell.v?.toString().trim() : '';
    
    // Если значение пустое или уже существует, генерируем уникальное имя
    if (!value || seenHeaders.has(value)) {
      value = `Column ${col + 1}`;
    }
    
    seenHeaders.add(value);
    headers.push(value);
  }

  return headers;
};

export const extractData = (sheet: WorkSheet, headerRowIndex: number): any[] => {
  if (!sheet['!ref']) return [];
  
  const range = utils.decode_range(sheet['!ref']);
  const headers = getHeadersFromRow(sheet, headerRowIndex);
  const data: any[] = [];

  // Начинаем со следующей строки после заголовков
  for (let row = headerRowIndex + 1; row <= range.e.r; row++) {
    const rowData: { [key: string]: any } = {};
    let hasData = false;

    headers.forEach((header, col) => {
      const cellAddress = utils.encode_cell({ r: row, c: col });
      const cell = sheet[cellAddress];
      let value = '';
      
      if (cell) {
        // Преобразуем числовые значения
        value = typeof cell.v === 'number' ? Number(cell.v) : cell.v?.toString().trim();
        if (value !== undefined && value !== null && value !== '') {
          hasData = true;
        }
      }
      
      rowData[header] = value;
    });

    if (hasData) {
      data.push(rowData);
    }
  }

  return data;
};