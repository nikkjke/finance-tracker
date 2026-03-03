import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Dropdown from './Dropdown';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange?: (count: number) => void;
  totalItems: number;
  loading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  loading = false,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= halfVisible + 1) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - halfVisible) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - halfVisible; i <= currentPage + halfVisible; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const itemsPerPageOptions = [
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '50', label: '50' },
    { value: '100', label: '100' },
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Items per page selector */}
      {onItemsPerPageChange && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-surface-600 dark:text-surface-400">
            Items per page:
          </label>
          <Dropdown
            value={itemsPerPage.toString()}
            onChange={(value) => onItemsPerPageChange(parseInt(value))}
            options={itemsPerPageOptions}
          />
        </div>
      )}

      {/* Info text */}
      <div className="text-sm text-surface-600 dark:text-surface-400">
        Showing <span className="font-semibold text-surface-900 dark:text-white">{startItem}</span>
        {' '}to{' '}
        <span className="font-semibold text-surface-900 dark:text-white">{endItem}</span>
        {' '}of{' '}
        <span className="font-semibold text-surface-900 dark:text-white">{totalItems}</span>
        {' '}items
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || loading}
          className="rounded-lg border border-surface-200 bg-white p-2 text-surface-600 shadow-sm transition-all hover:border-surface-300 hover:bg-surface-50 hover:text-surface-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400 dark:hover:border-surface-600 dark:hover:bg-surface-700/50 dark:hover:text-surface-300"
          aria-label="First page"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="rounded-lg border border-surface-200 bg-white p-2 text-surface-600 shadow-sm transition-all hover:border-surface-300 hover:bg-surface-50 hover:text-surface-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400 dark:hover:border-surface-600 dark:hover:bg-surface-700/50 dark:hover:text-surface-300"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, idx) => (
            pageNum === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-surface-400 dark:text-surface-500">
                ···
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum as number)}
                disabled={loading}
                className={`min-w-10 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  currentPage === pageNum
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'border border-surface-200 bg-white text-surface-600 hover:border-surface-300 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400 dark:hover:border-surface-600 dark:hover:bg-surface-700/50'
                } disabled:cursor-not-allowed disabled:opacity-50`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="rounded-lg border border-surface-200 bg-white p-2 text-surface-600 shadow-sm transition-all hover:border-surface-300 hover:bg-surface-50 hover:text-surface-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400 dark:hover:border-surface-600 dark:hover:bg-surface-700/50 dark:hover:text-surface-300"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || loading}
          className="rounded-lg border border-surface-200 bg-white p-2 text-surface-600 shadow-sm transition-all hover:border-surface-300 hover:bg-surface-50 hover:text-surface-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400 dark:hover:border-surface-600 dark:hover:bg-surface-700/50 dark:hover:text-surface-300"
          aria-label="Last page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
