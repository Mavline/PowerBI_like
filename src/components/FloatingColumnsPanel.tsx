import React, { useState } from 'react';
import { useDashboardStore } from '../store/dashboardStore';

export function FloatingColumnsPanel() {
  const { excelData } = useDashboardStore();
  const { headers } = excelData;
  const [position, setPosition] = useState({ x: window.innerWidth - 300, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.column-item')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = Math.max(0, Math.min(window.innerWidth - 250, e.clientX - dragStart.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 400, e.clientY - dragStart.y));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleDragStart = (e: React.DragEvent, column: string) => {
    e.dataTransfer.setData('column', column);
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1000,
      }}
      className="w-64 bg-[var(--color-bg-secondary)] border border-[#333] rounded-lg shadow-lg"
      onMouseDown={handleMouseDown}
    >
      <div className="p-3 border-b border-[#333] cursor-move bg-[var(--color-bg-primary)] rounded-t-lg">
        <h3 className="text-sm font-medium select-none">Доступные колонки</h3>
      </div>
      <div className="p-2 max-h-[400px] overflow-y-auto">
        {headers.map((column) => (
          <div
            key={column}
            draggable
            onDragStart={(e) => handleDragStart(e, column)}
            className="column-item p-2 my-1 bg-[var(--color-bg-primary)] border border-[#333] rounded cursor-move hover:border-[var(--color-accent-green)] transition-colors"
          >
            {column}
          </div>
        ))}
      </div>
    </div>
  );
}