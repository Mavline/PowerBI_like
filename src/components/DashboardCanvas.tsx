import { useState, useRef } from 'react';
import { DashboardItem } from './DashboardItem';
import { FloatingColumnsPanel } from './FloatingColumnsPanel';
import { useDashboardStore } from '../store/dashboardStore';
import html2canvas from 'html2canvas';

export function DashboardCanvas() {
  const { items, activeItemId, setActiveItemId, removeItem } = useDashboardStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleActivateItem = (id: string) => {
    setActiveItemId(id);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  // Export functions
  const exportDashboard = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true
      });

      // Create download link
      const link = document.createElement('a');
      link.download = 'dashboard.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting dashboard:', error);
    }
  };

  const exportItem = async (itemId: string) => {
    const itemElement = document.getElementById(`dashboard-item-${itemId}`);
    if (!itemElement) return;

    try {
      const canvas = await html2canvas(itemElement, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `visualization-${itemId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error exporting item:', error);
    }
  };

  return (
    <div className="relative" style={{ minHeight: '600px' }}>
      {/* Canvas area */}
      <div 
        ref={canvasRef}
        className="absolute w-full"
        style={{ 
          minHeight: '100%',
          height: 'auto',
          paddingBottom: '100px' // Extra space for scrolling
        }}
      >
        {/* Hint when empty */}
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-[#666]">
            Select visualization type and drag columns to it
          </div>
        )}

        {/* Visualization items */}
        {items.map((item) => (
          <DashboardItem
            key={item.id}
            item={item}
            isActive={item.id === activeItemId}
            onActivate={() => handleActivateItem(item.id)}
            onRemove={() => handleRemoveItem(item.id)}
            onExport={() => exportItem(item.id)}
          />
        ))}

        {/* Floating columns panel */}
        {items.length > 0 && <FloatingColumnsPanel />}
      </div>

      {/* Export button */}
      {items.length > 0 && (
        <div className="fixed bottom-4 right-4 flex gap-2">
          <button
            onClick={() => exportDashboard()}
            className="px-4 py-2 bg-[var(--color-accent-green)] text-white rounded hover:opacity-90 transition-opacity"
          >
            Export Dashboard
          </button>
        </div>
      )}
    </div>
  );
}