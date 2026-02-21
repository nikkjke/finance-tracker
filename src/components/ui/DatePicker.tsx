import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: boolean;
}

export default function DatePicker({ value, onChange, label, error }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => {
    if (value) {
      const [, m] = value.split('-').map(Number);
      return m - 1;
    }
    return new Date().getMonth();
  });
  const [year, setYear] = useState(() => {
    if (value) {
      const [y] = value.split('-').map(Number);
      return y;
    }
    return new Date().getFullYear();
  });
  const ref = useRef<HTMLDivElement>(null);

  const selectedDate = value ? (() => {
    const [y, m, d] = value.split('-').map(Number);
    return { year: y, month: m - 1, day: d };
  })() : null;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (m: number, y: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (m: number, y: number) => {
    return new Date(y, m, 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateString = `${year}-${m}-${d}`;
    onChange(dateString);
    setOpen(false);
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const days: (number | null)[] = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const displayDate = selectedDate 
    ? `${String(selectedDate.month + 1).padStart(2, '0')}/${String(selectedDate.day).padStart(2, '0')}/${selectedDate.year}`
    : 'Select date...';

  return (
    <div ref={ref} className="relative">
      {label && <label className="label">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full rounded-lg border px-3.5 py-2.5 text-sm font-medium shadow-sm transition-all ${
          error
            ? 'border-danger-500'
            : open
            ? 'border-primary-500 bg-white ring-2 ring-primary-500/20 dark:border-primary-500 dark:bg-surface-800 dark:ring-primary-500/20'
            : 'border-surface-300 bg-white hover:border-surface-400 dark:border-surface-600 dark:bg-surface-800 dark:hover:border-surface-500'
        }`}
      >
        <span className={`truncate ${!selectedDate ? 'text-surface-400' : 'text-surface-700 dark:text-surface-200'}`}>
          {displayDate}
        </span>
        <ChevronRight size={16} className="text-surface-400 shrink-0 ml-2" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 bottom-full mb-2 w-72 rounded-xl border border-surface-200 bg-white shadow-xl shadow-surface-900/10 dark:border-surface-700 dark:bg-surface-800 dark:shadow-surface-950/30 overflow-hidden"
            style={{
              bottom: ref.current ? `${window.innerHeight - ref.current.getBoundingClientRect().top + 8}px` : undefined,
              right: ref.current ? `${window.innerWidth - ref.current.getBoundingClientRect().right}px` : undefined,
              maxHeight: '420px'
            }}
          >
            <div className="p-4">
              {/* Month/Year Navigation */}
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">
                    {monthNames[month]} {year}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2 flex-shrink-0">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-surface-500 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {days.map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => day && handleDateClick(day)}
                    disabled={!day}
                    className={`p-2 text-sm rounded-lg transition-colors ${
                      !day
                        ? 'text-transparent cursor-default'
                        : selectedDate && selectedDate.day === day && selectedDate.month === month && selectedDate.year === year
                        ? 'bg-primary-500 text-white font-semibold'
                        : 'text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-2 pt-2 border-t border-surface-200 dark:border-surface-700">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center text-sm text-primary-500 hover:text-primary-600 py-2 font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    onChange(today);
                    setMonth(new Date().getMonth());
                    setYear(new Date().getFullYear());
                    setOpen(false);
                  }}
                  className="flex-1 text-center text-sm text-primary-500 hover:text-primary-600 py-2 font-medium transition-colors"
                >
                  Today
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
