import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { useAuthStore } from '../authStore';

vi.mock('axios', () => {
  const mockAxios = {
    post: vi.fn(),
    get: vi.fn(),
    defaults: { baseURL: '' },
    interceptors: { request: { use: vi.fn() } },
  };
  return { default: mockAxios };
});

const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
};

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      loading: true,
      token: null,
    });
  });

  it('initializes with default state values', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.token).toBeNull();
  });

  it('updates loading flag through setLoading', () => {
    const { setLoading } = useAuthStore.getState();
    setLoading(false);
    expect(useAuthStore.getState().loading).toBe(false);

    setLoading(true);
    expect(useAuthStore.getState().loading).toBe(true);
  });

  it('stores the user via setUser', () => {
    const mockUser = { id: 'user-123', name: 'Test User', email: 'test@example.com' };
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('persists the token via setToken', () => {
    useAuthStore.getState().setToken('token-123');
    expect(useAuthStore.getState().token).toBe('token-123');
    expect(localStorage.getItem('token')).toBe('token-123');

    useAuthStore.getState().setToken(null);
    expect(useAuthStore.getState().token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('clears user and token on logout', async () => {
    localStorage.setItem('token', 'token-123');
    useAuthStore.setState({ user: { id: '1', name: 'User', email: 'user@example.com' }, token: 'token-123' });

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('logs in and stores credentials', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        token: 'token-abc',
        userId: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
      },
    });

    await useAuthStore.getState().login('test@example.com', 'password');

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password',
    });
    expect(useAuthStore.getState().user).toEqual({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
    });
    expect(useAuthStore.getState().token).toBe('token-abc');
    expect(localStorage.getItem('token')).toBe('token-abc');
  });

  it('propagates backend login errors', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    await expect(useAuthStore.getState().login('fail@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
  });

  it('initializes auth silently when there is no token', async () => {
    await useAuthStore.getState().initAuth();
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(useAuthStore.getState().loading).toBe(false);
  });

  it('loads user info during initAuth when token exists', async () => {
    const mockUser = { id: 'user-2', name: 'Persisted User', email: 'persisted@example.com' };
    localStorage.setItem('token', 'persisted-token');
    useAuthStore.setState({ token: 'persisted-token' });
    mockedAxios.get.mockResolvedValueOnce({ data: mockUser });

    await useAuthStore.getState().initAuth();

    expect(mockedAxios.get).toHaveBeenCalledWith('/auth/me');
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().loading).toBe(false);
  });
});
