import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  icon?: ReactNode;
  placeholder?: string;
  fullWidth?: boolean;
}

export default function Dropdown({ value, onChange, options, icon, placeholder, fullWidth }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${fullWidth ? 'w-full' : 'inline-block'}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm font-medium shadow-sm transition-all ${fullWidth ? 'w-full' : ''} ${
          open
            ? 'border-primary-500 bg-white ring-2 ring-primary-500/20 dark:border-primary-500 dark:bg-surface-800 dark:ring-primary-500/20'
            : 'border-surface-300 bg-white hover:border-surface-400 dark:border-surface-600 dark:bg-surface-800 dark:hover:border-surface-500'
        }`}
      >
        {icon && <span className="text-primary-500 shrink-0">{icon}</span>}
        <span className={`text-surface-700 dark:text-surface-200 ${fullWidth ? 'flex-1 text-left truncate' : 'whitespace-nowrap'}`}>
          {selected?.label || placeholder || 'Select...'}
        </span>
        <ChevronDown
          size={14}
          className={`text-surface-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-surface-200 bg-white shadow-xl shadow-surface-900/10 dark:border-surface-700 dark:bg-surface-800 dark:shadow-surface-950/30">
          <div className="p-1.5">
            {options.map((option) => {
              const isActive = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-500/10 dark:text-primary-400'
                      : 'text-surface-600 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-700/50'
                  }`}
                >
                  <span>{option.label}</span>
                  {isActive && <Check size={14} className="text-primary-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
