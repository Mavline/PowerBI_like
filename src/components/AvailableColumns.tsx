import React from 'react';
import { useDashboardStore } from '../store/dashboardStore';

export function AvailableColumns() {
  const { excelData } = useDashboardStore();
  const { headers } = excelData;

  const handleDragStart = (e: React.DragEvent, column: string) => {
    e.dataTransfer.setData('column', column);
  };

  return (
    <div className="fixed right-4 top-4 w-64 bg-[var(--color-bg-secondary)] border border-[#333] rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Доступные колонки</h3>
      <div className="space-y-2">
        {headers.map((column) => (
          <div
            key={column}
            draggable
            onDragStart={(e) => handleDragStart(e, column)}
            className="p-2 bg-[var(--color-bg-primary)] border border-[#333] rounded cursor-move hover:border-[var(--color-accent-green)]"
          >
            {column}
          </div>
        ))}
      </div>
    </div>
  );
}