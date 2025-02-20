import { useRef, useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { useDashboardStore, DashboardItem as DashboardItemType, ChartType } from '../store/dashboardStore';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

interface DashboardItemProps {
  item: DashboardItemType;
  isActive: boolean;
  onActivate: () => void;
  onRemove: () => void;
  onExport: () => void;
}

interface FieldConfig {
  name: keyof DashboardItemType['fields'];
  label: string;
  maxColumns?: number;
}

interface ChartData {
  labels: string[];
  values: (number | string)[];
  series?: { name: string; data: string[] }[];
  type: 'numeric' | 'text'
}

const colorPalette = [
  'rgba(255, 99, 132, 0.8)',   // Red
  'rgba(54, 162, 235, 0.8)',   // Blue
  'rgba(255, 206, 86, 0.8)',   // Yellow
  'rgba(75, 192, 192, 0.8)',   // Teal
  'rgba(153, 102, 255, 0.8)',  // Purple
  'rgba(255, 159, 64, 0.8)',   // Orange
  'rgba(0, 204, 102, 0.8)',    // Green
  'rgba(255, 0, 255, 0.8)',    // Magenta
];

const chartConfigs: Record<ChartType, { fields: FieldConfig[]; colors: string[] }> = {
  'bar': {
    fields: [
      { name: 'xAxis', label: 'X Axis', maxColumns: 1 },
      { name: 'yAxis', label: 'Y Axis', maxColumns: 1 }
    ],
    colors: colorPalette
  },
  'line': {
    fields: [
      { name: 'xAxis', label: 'X Axis', maxColumns: 1 },
      { name: 'yAxis', label: 'Y Axis', maxColumns: 1 }
    ],
    colors: colorPalette
  },
  'column': {
    fields: [
      { name: 'xAxis', label: 'X Axis', maxColumns: 1 },
      { name: 'yAxis', label: 'Y Axis', maxColumns: 1 }
    ],
    colors: colorPalette
  },
  'stackedBar': {
    fields: [
      { name: 'xAxis', label: 'X Axis', maxColumns: 1 },
      { name: 'yAxis', label: 'Y Axis', maxColumns: 1 },
      { name: 'series', label: 'Series', maxColumns: 1 }
    ],
    colors: colorPalette
  },
  'stackedColumn': {
    fields: [
      { name: 'xAxis', label: 'X Axis', maxColumns: 1 },
      { name: 'yAxis', label: 'Y Axis', maxColumns: 1 },
      { name: 'series', label: 'Series', maxColumns: 1 }
    ],
    colors: colorPalette
  },
  'pie': {
    fields: [
      { name: 'category', label: 'Category', maxColumns: 1 },
      { name: 'values', label: 'Values', maxColumns: 1 }
    ],
    colors: colorPalette
  },
  'donut': {
    fields: [
      { name: 'category', label: 'Category', maxColumns: 1 },
      { name: 'values', label: 'Values', maxColumns: 1 }
    ],
    colors: colorPalette
  },
  'treemap': {
    fields: [
      { name: 'category', label: 'Category', maxColumns: 1 },
      { name: 'values', label: 'Values', maxColumns: 1 }
    ],
    colors: colorPalette
  },
  'table': {
    fields: [
      { name: 'columns', label: 'Table Columns' }
    ],
    colors: []
  }
};

export function DashboardItem({ item, isActive, onActivate, onRemove, onExport }: DashboardItemProps) {
  const { excelData, updateItemFields, updateItemPosition, updateItemSize } = useDashboardStore();
  const { data } = excelData;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [itemColumns, setItemColumns] = useState<string[]>([]);

  // Process data for visualization
  const processedData = useMemo<ChartData | null>(() => {
    if (!data || !item.fields) return null;

    // For regular charts (bar, line, column)
    if (['bar', 'line', 'column'].includes(item.type)) {
      const xField = item.fields.xAxis;
      const yField = item.fields.yAxis;
      
      if (!xField || !yField) return null;

      try {
        const uniqueX = Array.from(new Set(data.map(row => String(row[xField]))));
        const values = uniqueX.map(x => {
          const row = data.find(r => String(r[xField]) === x);
          return row ? String(row[yField]) : '';
        });

        return {
          labels: uniqueX,
          values: values,
          type: 'text'
        }
      } catch (error) {
        console.error('Error processing data:', error);
        return null;
      }
    }

    // For pie and donut charts
    if (['pie', 'donut'].includes(item.type)) {
      const categoryField = item.fields.category;
      const valuesField = item.fields.values;
      
      if (!categoryField || !valuesField) return null;

      const categories = Array.from(new Set(data.map(row => String(row[categoryField]))));
      const values = categories.map(cat => {
        const row = data.find(row => String(row[categoryField]) === cat);
        return row ? String(row[valuesField]) : '';
      });

      return {
        labels: categories,
        values,
        type: 'text'
      };
    }

    // For treemap
    if (item.type === 'treemap') {
      const categoryField = item.fields.category;
      const valuesField = item.fields.values;
      
      if (!categoryField || !valuesField) return null;

      const categories = Array.from(new Set(data.map(row => String(row[categoryField]))));
      const values = categories.map(cat => {
        const row = data.find(row => String(row[categoryField]) === cat);
        return row ? String(row[valuesField]) : '';
      });

      return {
        labels: categories,
        values,
        type: 'text'
      };
    }

    // For stacked charts
    if (['stackedBar', 'stackedColumn'].includes(item.type)) {
      const xField = item.fields.xAxis;
      const yField = item.fields.yAxis;
      const seriesField = item.fields.series;
      
      if (!xField || !yField || !seriesField) return null;

      const uniqueX = Array.from(new Set(data.map(row => String(row[xField]))));
      const uniqueSeries = Array.from(new Set(data.map(row => String(row[seriesField]))));

      const series = uniqueSeries.map(seriesName => {
        const seriesData = uniqueX.map(x => {
          const row = data.find(row => 
            String(row[xField]) === x && 
            String(row[seriesField]) === seriesName
          );
          return row ? String(row[yField]) : '';
        });

        return {
          name: seriesName,
          data: seriesData
        };
      });

      return {
        labels: uniqueX,
        values: [],
        series,
        type: 'text'
      };
    }

    return null;
  }, [data, item.fields, item.type]);

  // Handle drag-n-drop for fields
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, fieldName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const column = e.dataTransfer.getData('column');
    if (!column) return;

    if (item.type === 'table') {
      setItemColumns(prev => [...prev, column]);
    } else {
      updateItemFields(item.id, { [fieldName]: column });
    }
  };

  // Handle move and resize
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: 'resize' | 'drag') => {
    e.stopPropagation();
    onActivate();

    if (type === 'resize') {
      setIsResizing(true);
    } else if (type === 'drag') {
      setIsDragging(true);
    }
    
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: item.size.width, height: item.size.height });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging && !isResizing) return;

    if (isResizing) {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      const newWidth = Math.max(300, startSize.width + deltaX);
      const newHeight = Math.max(200, startSize.height + deltaY);
      updateItemSize(item.id, { width: newWidth, height: newHeight });
    }

    if (isDragging) {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      updateItemPosition(item.id, { 
        x: Math.max(0, item.position.x + deltaX),
        y: Math.max(0, item.position.y + deltaY)
      });
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setIsDragging(false);
  };

  useEffect(() => {
    if (isResizing || isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, isDragging]);

  const renderFieldDropZones = () => {
    if (!isActive) return null;

    const config = chartConfigs[item.type];
    if (!config.fields.length) return null;

    if (item.type === 'table') {
      return (
        <div 
          className="absolute top-12 right-4 border border-[#333] rounded p-2 shadow-lg z-20 bg-[var(--color-bg-primary)]"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'columns')}
        >
          <div className="mb-2">
            <label className="block text-xs text-[#666] mb-1">Table Columns</label>
            <div className="min-h-[32px] p-2 border border-dashed border-[#333] rounded">
              {itemColumns.length === 0 ? (
                <span className="text-[#666] text-sm">Drag columns here</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {itemColumns.map((column, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-[var(--color-accent-green)] bg-opacity-10 rounded text-sm"
                    >
                      {column}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="absolute top-12 right-4 border border-[#333] rounded p-2 shadow-lg z-20 bg-[var(--color-bg-primary)]">
        {config.fields.map(({ name, label }) => (
          <div 
            key={name}
            className="mb-2 p-2 border border-dashed border-[#333] rounded"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, name)}
          >
            <label className="block text-xs text-[#666] mb-1">{label}</label>
            <div className="h-8 flex items-center justify-center">
              {item.fields[name] ? (
                <span className="px-2 py-1 bg-[var(--color-accent-green)] bg-opacity-10 rounded">
                  {item.fields[name]}
                </span>
              ) : (
                <span className="text-[#666] text-sm">Drag column here</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (!processedData) {
      return (
        <div className="h-full flex items-center justify-center text-[#666]">
          Drag columns to display data
        </div>
      );
    }

    if (item.type === 'table') {
      if (itemColumns.length === 0) {
        return (
          <div className="h-full flex items-center justify-center text-[#666]">
            Drag columns to display data
          </div>
        );
      }

      return (
        <div className="overflow-auto h-full">
          <table className="min-w-full divide-y divide-[#333]">
            <thead>
              <tr>
                {itemColumns.map((column) => (
                  <th key={column} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {data.map((row, i) => (
                <tr key={i}>
                  {itemColumns.map((column) => (
                    <td key={column} className="px-6 py-4 whitespace-nowrap text-sm">
                      {row[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (item.type === 'treemap') {
      const treeData = {
        name: 'root',
        children: processedData.labels.map((label, i) => ({
          name: label,
          value: processedData.values[i]
        }))
      };

      return (
        <div style={{ width: '100%', height: '100%' }}>
          <ResponsiveTreeMap
            data={treeData}
            identity="name"
            value="value"
            label={d => `${d.id}`}
            labelSkipSize={0}
            labelTextColor="#fff"
            enableLabel={true}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            colors={colorPalette}
            valueFormat=" >-"
            innerPadding={3}
            outerPadding={3}
          />
        </div>
      );
    }

    const chartOptions: ChartOptions<any> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: ['pie', 'donut', 'stackedBar', 'stackedColumn'].includes(item.type),
          position: 'bottom',
          labels: {
            padding: 20,
            generateLabels: (chart: any) => {
              const defaultLabels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
              return defaultLabels.map(label => ({ 
                ...label, 
                text: label.text
              }));
            }
          }
        },
        title: {
          display: true,
          text: item.title,
          font: { size: 16 }
        },
        datalabels: {
          display: true,
          color: '#fff',
          font: { size: 14, weight: 'bold' },
          formatter: (value: any, context: any) => {
            const idx = context.dataIndex;
             return processedData ? processedData.values[idx] : '';
          },
          anchor: 'center',
          rotation: ['bar', 'stackedBar'].includes(item.type) ? -45 : 0,
          offset: 4,
          clamp: true
        }
      },
      scales: !['pie', 'donut'].includes(item.type) ? {
        x: {
          type: 'category',
          grid: { color: 'rgba(51, 51, 51, 0.5)' },
          stacked: ['stackedBar', 'stackedColumn'].includes(item.type),
          ticks: {
            maxRotation: 0,
            minRotation: 0,
           autoSkip: true,
             padding: 10
          }
        },
        y: {
          type: 'category',
          grid: { color: 'rgba(51, 51, 51, 0.5)' },
          stacked: ['stackedBar', 'stackedColumn'].includes(item.type),
          beginAtZero: true,
          ticks: {
            padding: 10,
            callback: (value: any) => String(value)
          }
        }
      } : undefined,
      layout: {
        padding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }
      },
      barPercentage: 0.8,
      categoryPercentage: 0.7,
      elements: {
        line: { tension: 0.3 },
        arc: {
          borderWidth: 2,
          backgroundColor: colorPalette,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderAlign: 'inner',
          spacing: 1
        }
      }
    };

    const chartData = {
      labels: processedData.labels,
      datasets: processedData.series ? 
        processedData.series.map((series, i) => ({
          label: series.name,
          data: series.data,
          backgroundColor: chartConfigs[item.type].colors[i % colorPalette.length],
          borderColor: chartConfigs[item.type].colors[i % colorPalette.length],
          borderWidth: 1,
          stack: 'stack-1'
        })) : 
        [{
          label: item.fields.yAxis || '',
          data: processedData.values,
          backgroundColor: item.type === 'line' ? chartConfigs[item.type].colors[0] : colorPalette,
          borderColor: item.type === 'line' ? chartConfigs[item.type].colors[0] : colorPalette.map(c => c.replace('0.8', '1')),
          borderWidth: 1
        }]
    };

    switch (item.type) {
      case 'bar':
      case 'stackedBar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'column':
      case 'stackedColumn':
        return <Bar data={chartData} options={{ ...chartOptions, indexAxis: 'y' as const }} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      case 'donut':
        return <Doughnut data={chartData} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <div
      id={`dashboard-item-${item.id}`}
      ref={containerRef}
      style={{
        width: item.size.width,
        height: item.size.height,
        position: 'absolute',
        left: item.position.x,
        top: item.position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      className={`
        relative border border-[#333] bg-[var(--color-bg-primary)]
        ${isActive ? 'ring-1 ring-[#666] z-10' : ''}
      `}
      onMouseDown={(e) => handleMouseDown(e, 'drag')}
      onClick={onActivate}
    >
      {/* Title Bar */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#333]">
        <span>{item.title}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onExport(); }}
            className="hover:text-[var(--color-accent-green)] transition-colors"
            title="Export"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="hover:text-[#666] transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* Chart Content */}
      <div className="absolute inset-0 top-12 p-4">
        {renderContent()}
      </div>

      {renderFieldDropZones()}

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => handleMouseDown(e, 'resize')}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-[#444]">
          <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM18 18H16V16H18V18ZM14 22H12V20H14V22Z" />
        </svg>
      </div>
    </div>
  );
}