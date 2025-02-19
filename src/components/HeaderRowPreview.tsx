import { utils, WorkSheet } from 'xlsx';

interface HeaderRowPreviewProps {
  sheet: WorkSheet;
  currentHeaderRow: number;
  onSelectRow: (rowIndex: number) => void;
  maxColumns?: number;
}

export function HeaderRowPreview({ 
  sheet, 
  currentHeaderRow, 
  onSelectRow,
  maxColumns = 10 
}: HeaderRowPreviewProps) {
  const range = utils.decode_range(sheet['!ref'] || 'A1');
  const rows: string[][] = [];

  // Get first 20 rows
  for (let row = 0; row <= Math.min(range.e.r, 19); row++) {
    const rowData: string[] = [];
    // Get first maxColumns columns
    for (let col = 0; col <= Math.min(range.e.c, maxColumns - 1); col++) {
      const cellAddress = utils.encode_cell({ r: row, c: col });
      const cell = sheet[cellAddress];
      rowData.push(cell ? cell.v?.toString() || '' : '');
    }
    rows.push(rowData);
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-[#333]">
          <tbody className="divide-y divide-[#333]">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onSelectRow(rowIndex)}
                className={`cursor-pointer transition-colors
                  ${rowIndex === currentHeaderRow 
                    ? 'bg-[var(--color-accent-green)] bg-opacity-20' 
                    : 'hover:bg-[var(--color-bg-secondary)]'
                  }`}
              >
                <td className="whitespace-nowrap py-2 px-4 text-sm text-[var(--color-text-secondary)] w-20">
                  Row {rowIndex}
                </td>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="whitespace-nowrap py-2 px-4 text-sm text-[var(--color-text-primary)]"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => onSelectRow(currentHeaderRow)}
          className="btn-secondary"
        >
          Reset Selection
        </button>
        <span className="text-sm text-[var(--color-text-secondary)]">
          Showing first {maxColumns} columns of each row
        </span>
      </div>
    </div>
  );
}