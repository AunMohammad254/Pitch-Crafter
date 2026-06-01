import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';
import { supabase } from '../lib/supabaseClient';

// Mock supabase client
vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Zustand store state manually if needed, 
    // but usually just setting values back is enough
    useAuthStore.setState({
      user: null,
      session: null,
      loading: true,
      error: null,
    });
  });

  it('should initialize with default values', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(true);
  });

  it('should set user and session correctly', () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'abc' };

    useAuthStore.getState().setSession(mockSession);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.session).toEqual(mockSession);
    expect(state.loading).toBe(false);
  });

  it('should handle signOut', async () => {
    supabase.auth.signOut.mockResolvedValue({ error: null });
    
    // Set initial logged in state
    useAuthStore.setState({ user: { id: '123' }, session: { user: {} } });

    await useAuthStore.getState().signOut();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('should handle initAuth success', async () => {
    const mockSession = { user: { id: '123' } };
    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });

    await useAuthStore.getState().initAuth();

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockSession.user);
    expect(state.loading).toBe(false);
    expect(supabase.auth.getSession).toHaveBeenCalled();
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
  });
});
