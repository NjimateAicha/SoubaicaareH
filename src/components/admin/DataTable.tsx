import React from 'react';
import { Search, Inbox } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor?: keyof T;
  className?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  searchPlaceholder = 'Rechercher...',
  searchValue,
  onSearchChange,
  filters,
  actions,
  emptyMessage = 'Aucun élément trouvé.',
  isLoading = false,
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
      {/* Top Toolbar (Search, Filters, Action Button) */}
      {(onSearchChange || filters || actions) && (
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {onSearchChange && (
              <div className="relative min-w-[240px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute top-2.5 start-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchValue || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-[#F6F7FA] border border-slate-200 text-xs text-[#15265A] font-medium rounded-xl py-2 ps-9 pe-3 focus:outline-hidden focus:ring-2 focus:ring-[#263B86]"
                />
              </div>
            )}

            {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
          </div>

          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start">
          <thead className="bg-[#F6F7FA] text-[#667085] uppercase font-bold text-[10px] tracking-wider border-b border-slate-200/80">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`p-4 text-start ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-400 font-medium">
                  Chargement des données...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Inbox className="w-10 h-10 mb-2 stroke-1" />
                    <p className="text-xs font-semibold text-slate-500">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={keyExtractor(item)} className="hover:bg-slate-50/80 transition-colors">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={`p-4 ${col.className || ''}`}>
                      {col.render
                        ? col.render(item, index)
                        : col.accessor
                        ? String(item[col.accessor] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Counter */}
      <div className="px-5 py-3 bg-[#F6F7FA]/60 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#667085] font-medium">
        <span>
          Affichage de <strong className="text-[#15265A] tabular-nums">{data.length}</strong> éléments
        </span>
        <span className="text-[10px] text-slate-400">SOUBAICAR Operations</span>
      </div>
    </div>
  );
}
