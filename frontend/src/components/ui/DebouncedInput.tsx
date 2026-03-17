import { useState, useEffect } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface DebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export function DebouncedInput({ value: initialValue, onChange, debounceMs = 300, ...props }: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== initialValue) {
        onChange(value);
      }
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [value, initialValue, debounceMs, onChange]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

interface DebouncedTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export function DebouncedTextarea({ value: initialValue, onChange, debounceMs = 300, ...props }: DebouncedTextareaProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== initialValue) {
        onChange(value);
      }
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [value, initialValue, debounceMs, onChange]);

  return (
    <textarea
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
