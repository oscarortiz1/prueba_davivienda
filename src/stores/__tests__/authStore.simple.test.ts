import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../authStore';

describe('authStore - Basic Tests', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.setUser(null);
      result.current.setToken(null);
      result.current.setLoading(false);
    });
  });

  it('should initialize with null user', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
  });

  it('should set user correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
    };

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.loading).toBe(true);
  });

  it('should set token', () => {
    const { result } = renderHook(() => useAuthStore());
    const testToken = 'test-token-123';

    act(() => {
      result.current.setToken(testToken);
    });

    expect(result.current.token).toBe(testToken);
  });

  it('should clear user on logout', async () => {
    const { result } = renderHook(() => useAuthStore());
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
    };

    // Set user first
    act(() => {
      result.current.setUser(mockUser);
      result.current.setToken('test-token');
    });

    expect(result.current.user).toEqual(mockUser);

    // Logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });
});
