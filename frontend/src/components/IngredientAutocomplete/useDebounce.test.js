import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    expect(result.current).toBe('initial');

    // Changer la valeur
    rerender({ value: 'updated', delay: 300 });

    // La valeur ne devrait pas changer immédiatement
    expect(result.current).toBe('initial');

    // Attendre le debounce
    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 500 }
    );
  });

  it('should reset timer on rapid value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    // Changements rapides
    rerender({ value: 'first', delay: 300 });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    rerender({ value: 'second', delay: 300 });
    await new Promise(resolve => setTimeout(resolve, 100));
    
    rerender({ value: 'third', delay: 300 });

    // La valeur ne devrait pas avoir changé encore
    expect(result.current).toBe('initial');

    // Attendre le debounce
    await waitFor(
      () => {
        expect(result.current).toBe('third');
      },
      { timeout: 500 }
    );
  });

  it('should work with different delay values', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial');

    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 700 }
    );
  });

  it('should cleanup timeout on unmount', () => {
    const { unmount } = renderHook(() => useDebounce('test', 300));
    // Ne devrait pas lancer d'erreur
    expect(() => unmount()).not.toThrow();
  });

  it('should handle empty string value', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 300 } }
    );

    rerender({ value: '', delay: 300 });

    await waitFor(
      () => {
        expect(result.current).toBe('');
      },
      { timeout: 500 }
    );
  });

  it('should handle numeric values', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } }
    );

    expect(result.current).toBe(0);

    rerender({ value: 42, delay: 300 });

    await waitFor(
      () => {
        expect(result.current).toBe(42);
      },
      { timeout: 500 }
    );
  });

  it('should handle object values', async () => {
    const initialObj = { name: 'test' };
    const updatedObj = { name: 'updated' };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 300 } }
    );

    expect(result.current).toBe(initialObj);

    rerender({ value: updatedObj, delay: 300 });

    await waitFor(
      () => {
        expect(result.current).toBe(updatedObj);
      },
      { timeout: 500 }
    );
  });
});
