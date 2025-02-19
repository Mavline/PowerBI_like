import { create } from 'zustand';
import { WorkSheet } from 'xlsx';

export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'column' 
  | 'stackedBar' 
  | 'stackedColumn' 
  | 'pie' 
  | 'donut' 
  | 'treemap' 
  | 'table';

export type ChartFieldType = 
  | 'xAxis'
  | 'yAxis'
  | 'category'
  | 'values'
  | 'series'
  | 'columns';

export interface ChartFields {
  xAxis?: string;
  yAxis?: string;
  category?: string;
  values?: string;
  series?: string;
  columns?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface DashboardItem {
  id: string;
  type: ChartType;
  title: string;
  columns: string[];
  fields: ChartFields;
  position: Position;
  size: Size;
}

interface DataRow {
  [key: string]: string | number;
}

interface ExcelData {
  sheets: { [key: string]: WorkSheet };
  currentSheet?: string;
  headers: string[];
  data: DataRow[];
  headerRowIndex: number;
}

interface DashboardStore {
  // Excel Data
  excelData: ExcelData;
  setExcelData: (data: Partial<ExcelData>) => void;
  
  // Dashboard Items
  items: DashboardItem[];
  addItem: (item: Omit<DashboardItem, 'id' | 'fields'>) => void;
  updateItem: (id: string, updates: Partial<DashboardItem>) => void;
  updateItemFields: (id: string, fields: Partial<ChartFields>) => void;
  updateItemPosition: (id: string, position: Position) => void;
  updateItemSize: (id: string, size: Size) => void;
  removeItem: (id: string) => void;
  
  // Selected Columns
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
  
  // Active Item
  activeItemId: string | null;
  setActiveItemId: (id: string | null) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  // Excel Data
  excelData: {
    sheets: {},
    headers: [],
    data: [],
    headerRowIndex: 0
  },
  setExcelData: (data) => set((state) => ({
    excelData: { ...state.excelData, ...data },
  })),

  // Dashboard Items
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      fields: {} // Start with empty fields
    }],
    activeItemId: null
  })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((item) => 
      item.id === id ? { ...item, ...updates } : item
    ),
  })),
  updateItemFields: (id, fields) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, fields: { ...item.fields, ...fields } } : item
    ),
  })),
  updateItemPosition: (id, position) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, position } : item
    ),
  })),
  updateItemSize: (id, size) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, size } : item
    ),
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
    activeItemId: state.activeItemId === id ? null : state.activeItemId
  })),

  // Selected Columns
  selectedColumns: [],
  setSelectedColumns: (columns) => set({ selectedColumns: columns }),

  // Active Item
  activeItemId: null,
  setActiveItemId: (id) => set({ activeItemId: id }),
}));