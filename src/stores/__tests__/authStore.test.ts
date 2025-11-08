import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../authStore';

// Mock Firebase
vi.mock('../../config/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(),
  },
  database: {
    ref: vi.fn(),
    set: vi.fn(),
    get: vi.fn(),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useAuthStore.getState();
    store.user = null;
    store.isAuthenticated = false;
    store.isLoading = false;
    store.error = null;
  });

  it('should initialize with default state', () => {
    const store = useAuthStore.getState();
    
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should set loading state', () => {
    const store = useAuthStore.getState();
    
    store.setLoading(true);
    expect(store.isLoading).toBe(true);
    
    store.setLoading(false);
    expect(store.isLoading).toBe(false);
  });

  it('should set error', () => {
    const store = useAuthStore.getState();
    const errorMessage = 'Test error';
    
    store.setError(errorMessage);
    expect(store.error).toBe(errorMessage);
  });

  it('should set user', () => {
    const store = useAuthStore.getState();
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
    };
    
    store.setUser(mockUser);
    expect(store.user).toEqual(mockUser);
    expect(store.isAuthenticated).toBe(true);
  });

  it('should clear user on logout', () => {
    const store = useAuthStore.getState();
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
    };
    
    store.setUser(mockUser);
    expect(store.isAuthenticated).toBe(true);
    
    store.logout();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it('should clear error', () => {
    const store = useAuthStore.getState();
    
    store.setError('Test error');
    expect(store.error).toBe('Test error');
    
    store.clearError();
    expect(store.error).toBeNull();
  });
});
