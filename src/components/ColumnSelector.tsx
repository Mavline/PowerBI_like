import { useDashboardStore } from '../store/dashboardStore';

export function ColumnSelector() {
  const { excelData, selectedColumns, setSelectedColumns } = useDashboardStore();
  const { headers } = excelData;

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(
      selectedColumns.includes(column)
        ? selectedColumns.filter(col => col !== column)
        : [...selectedColumns, column]
    );
  };

  const handleClearSelection = () => {
    setSelectedColumns([]);
  };

  if (!headers.length) {
    return null;
  }

  const getColumnHint = () => {
    if (selectedColumns.length === 0) {
      return 'Выберите колонки для визуализации:';
    }
    if (selectedColumns.length === 1) {
      return 'Для создания графика нужно минимум 2 колонки';
    }
    if (selectedColumns.length === 2) {
      return 'Можно создать линейный график, столбчатую или круговую диаграмму';
    }
    if (selectedColumns.length === 3) {
      return 'Можно создать сложные визуализации, например, стековую диаграмму';
    }
    return `Выбрано ${selectedColumns.length} колонок`;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
            Доступные колонки
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {getColumnHint()}
          </p>
        </div>
        {selectedColumns.length > 0 && (
          <button
            onClick={handleClearSelection}
            className="px-3 py-1 text-sm border border-[#333] rounded hover:border-[var(--color-accent-green)]"
          >
            Очистить
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {headers.map((column) => (
          <label
            key={column}
            className={`
              flex items-center space-x-2 p-2 border rounded cursor-pointer transition-colors
              ${selectedColumns.includes(column) 
                ? 'border-[var(--color-accent-green)] bg-[var(--color-accent-green)] bg-opacity-10' 
                : 'border-[#333] hover:border-[var(--color-accent-green)]'}
            `}
          >
            <input
              type="checkbox"
              className="rounded border-[#333] text-[var(--color-accent-green)] focus:ring-[var(--color-accent-green)]"
              checked={selectedColumns.includes(column)}
              onChange={() => handleColumnToggle(column)}
            />
            <span className="text-sm text-[var(--color-text-primary)] truncate">
              {column}
            </span>
          </label>
        ))}
      </div>

      {selectedColumns.length > 0 && (
        <div className="mt-4 p-2 bg-[var(--color-bg-secondary)] rounded border border-[#333]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--color-accent-green)]">
              Выбрано: {selectedColumns.length} {selectedColumns.length === 1 ? 'колонка' : selectedColumns.length < 5 ? 'колонки' : 'колонок'}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearSelection}
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Очистить все
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedColumns.map((column) => (
              <div
                key={column}
                className="flex items-center space-x-1 px-2 py-1 bg-[var(--color-accent-green)] bg-opacity-10 rounded"
              >
                <span className="text-xs text-[var(--color-text-primary)]">
                  {column}
                </span>
                <button
                  onClick={() => handleColumnToggle(column)}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  title="Удалить"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}