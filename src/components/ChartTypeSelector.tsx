import { ChartType } from '../store/dashboardStore';

interface ChartTypeSelectorProps {
  onSelect: (type: ChartType) => void;
}

interface ChartOption {
  type: ChartType;
  label: string;
  icon: string;
}

const chartOptions: ChartOption[] = [
  {
    type: 'bar',
    label: 'Bar Chart',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h4v8H3v-8zm6-6h4v14H9V7zm6-5h4v19h-4V2z"/>
      </svg>
    `
  },
  {
    type: 'line',
    label: 'Line Chart',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.5 18.5L9.5 12.5L13.5 16.5L22 6.92L20.59 5.5L13.5 13.5L9.5 9.5L2 17L3.5 18.5Z"/>
      </svg>
    `
  },
  {
    type: 'column',
    label: 'Column Chart',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 20h2v-5h4v5h2v-9h4v9h2V8h4v12h2V4H2v16z"/>
      </svg>
    `
  },
  {
    type: 'stackedBar',
    label: 'Stacked Bar Chart',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h6v8H3v-8zm0-10h18v8H3V3zm8 12h10v6H11v-6z"/>
      </svg>
    `
  },
  {
    type: 'stackedColumn',
    label: 'Stacked Column Chart',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 20h2V8h4v12h2v-8h4v8h2V4h4v16h2V2H2v18z"/>
      </svg>
    `
  },
  {
    type: 'pie',
    label: 'Pie Chart',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z"/>
      </svg>
    `
  },
  {
    type: 'donut',
    label: 'Donut Chart',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.5 2.54l2.62 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
      </svg>
    `
  },
  {
    type: 'treemap',
    label: 'Treemap',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h4v4H7V7zm0 6h4v4H7v-4zm6-6h4v4h-4V7zm0 6h4v4h-4v-4z"/>
      </svg>
    `
  },
  {
    type: 'table',
    label: 'Table View',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h18v18H3V3zm16 2H5v3h14V5zM5 19h14V10H5v9zm2-8h4v3H7v-3zm6 0h4v3h-4v-3zm-6 4h4v3H7v-3zm6 0h4v3h-4v-3z"/>
      </svg>
    `
  }
];

export function ChartTypeSelector({ onSelect }: ChartTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {chartOptions.map(({ type, label, icon }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className="flex flex-col items-center p-4 border border-[#333] rounded hover:border-[var(--color-accent-green)] transition-colors bg-[var(--color-bg-secondary)]"
        >
          <div 
            className="w-8 h-8 mb-2 text-[var(--color-text-primary)]"
            dangerouslySetInnerHTML={{ __html: icon }}
          />
          <span className="text-sm">{label}</span>
        </button>
      ))}
    </div>
  );
}