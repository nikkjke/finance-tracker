import { useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'ghost';
}

// Container 60px, knob 24px, 4px gap each edge
// Sun fixed at left (center=16px), Moon fixed at right (center=44px)
// Knob: light=4px, dark=32px  (60-24-4)
const KNOB_LIGHT = '4px';
const KNOB_DARK  = '32px';

export function ThemeToggle({ className, variant = 'default' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const isGhost = variant === 'ghost';
  const knobRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);

  const handleToggle = () => {
    if (knobRef.current) {
      // Cancel any running animation so we always start from the correct position
      if (animRef.current) animRef.current.cancel();

      animRef.current = knobRef.current.animate(
        [
          { left: isDark ? KNOB_DARK  : KNOB_LIGHT },
          { left: isDark ? KNOB_LIGHT : KNOB_DARK  },
        ],
        { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
      );
    }
    toggleTheme();
  };

  return (
    <div
      className={cn(
        'relative h-8 w-[3.75rem] cursor-pointer rounded-full border',
        isDark
          ? isGhost ? 'border-surface-800 bg-surface-900' : 'border-surface-700 bg-surface-800'
          : 'border-surface-200 bg-white',
        className
      )}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      {/* Sliding circle only — no icon inside, animated by Web Animations API */}
      <div
        ref={knobRef}
        className={cn(
          'absolute top-1 bottom-1 w-6 rounded-full shadow-sm',
          isDark ? (isGhost ? 'bg-surface-700' : 'bg-surface-600') : 'bg-surface-100'
        )}
        style={{ left: isDark ? KNOB_DARK : KNOB_LIGHT }}
      />

      {/* Sun — always fixed on LEFT, sits above the sliding circle */}
      <Sun
        className={cn(
          'absolute left-[9px] z-10 h-3.5 w-3.5',
          isDark ? 'text-surface-500 opacity-40' : 'text-primary-500'
        )}
        style={{ top: '9px' }}
        strokeWidth={1.5}
      />

      {/* Moon — always fixed on RIGHT, sits above the sliding circle */}
      <Moon
        className={cn(
          'absolute right-[7px] z-10 h-3.5 w-3.5',
          isDark ? 'text-primary-400' : 'text-surface-400 opacity-40'
        )}
        style={{ top: '8px' }}
        strokeWidth={1.5}
      />
    </div>
  );
}
