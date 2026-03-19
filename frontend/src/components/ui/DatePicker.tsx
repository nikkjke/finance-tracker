import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';

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

  const selectedDate = value ? (() => {
    const [y, m, d] = value.split('-').map(Number);
    return { year: y, month: m - 1, day: d };
  })() : null;

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

  const handleToday = () => {
    const now = new Date();
    onChange(now.toISOString().split('T')[0]);
    setMonth(now.getMonth());
    setYear(now.getFullYear());
    setOpen(false);
  };

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close date picker"
          className="fixed inset-0 z-[90] cursor-default bg-transparent"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="relative z-[95]">
      {label && (
        <div className="mb-1.5 flex items-center justify-between">
          <label className="label mb-0">{label}</label>
          <button
            type="button"
            onClick={handleToday}
            className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            Today
          </button>
        </div>
      )}
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
        <Calendar size={16} className="text-surface-400 shrink-0 ml-auto" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-[100] mt-2 w-72 overflow-hidden rounded-xl border border-surface-200 bg-white shadow-xl shadow-surface-900/10 dark:border-surface-700 dark:bg-surface-800 dark:shadow-surface-950/30"
        >
            <div className="p-3">
              {/* Month/Year Navigation */}
              <div className="flex items-center justify-between mb-2 gap-2">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">
                    {monthNames[month]} {year}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded transition-colors text-surface-500"
                    aria-label="Close date picker"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-1.5">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-surface-500 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => day && handleDateClick(day)}
                    disabled={!day}
                    className={`aspect-square flex items-center justify-center text-sm rounded transition-colors ${
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
            </div>
        </div>
      )}
      </div>
    </>
  );
}
