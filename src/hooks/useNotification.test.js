import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotification } from './useNotification';

describe('useNotification', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should add notification element to document body', () => {
    const { result } = renderHook(() => useNotification());
    
    act(() => {
      result.current.showNotification('Test message', 'success');
    });

    const notification = document.querySelector('.status-success');
    expect(notification).toBeTruthy();
    expect(notification.innerHTML).toContain('Test message');
    expect(notification.innerHTML).toContain('✅');
  });

  it('should handle different notification types', () => {
    const { result } = renderHook(() => useNotification());
    
    act(() => {
      result.current.showNotification('Error message', 'error');
    });

    const notification = document.querySelector('.status-error');
    expect(notification).toBeTruthy();
    expect(notification.innerHTML).toContain('❌');
  });

  it('should remove notification after delay', () => {
    const { result } = renderHook(() => useNotification());
    
    act(() => {
      result.current.showNotification('Transient message');
    });

    expect(document.querySelectorAll('div').length).toBeGreaterThan(0);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Note: The element might still be in the DOM during the fade-out animation 
    // depending on how the hook handles it. Our hook has a 300ms nested timeout.
    act(() => {
      vi.advanceTimersByTime(500);
    });

    const notifications = document.querySelectorAll('.animate-fade-in-right');
    expect(notifications.length).toBe(0);
  });
});
