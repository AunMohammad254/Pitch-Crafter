import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    // Reset store state
    useUIStore.setState({
      currentView: 'landing',
      activePitch: null,
      mobileMenuOpen: false,
      animationsEnabled: true,
      showShortcuts: false,
      authInitialMode: 'signin',
    });
  });

  it('should initialize with default values', () => {
    const state = useUIStore.getState();
    expect(state.currentView).toBe('landing');
    expect(state.activePitch).toBeNull();
    expect(state.mobileMenuOpen).toBe(false);
  });

  it('should navigate to auth correctly', () => {
    useUIStore.getState().navigateToAuth('signup');
    
    const state = useUIStore.getState();
    expect(state.currentView).toBe('auth');
    expect(state.authInitialMode).toBe('signup');
  });

  it('should navigate to pitch correctly', () => {
    const mockPitch = { id: '1', title: 'Test Pitch' };
    useUIStore.getState().navigateToPitch(mockPitch, 'investor-chat');
    
    const state = useUIStore.getState();
    expect(state.currentView).toBe('investor-chat');
    expect(state.activePitch).toEqual(mockPitch);
  });

  it('should toggle mobile menu', () => {
    useUIStore.getState().toggleMobileMenu();
    expect(useUIStore.getState().mobileMenuOpen).toBe(true);
    
    useUIStore.getState().toggleMobileMenu();
    expect(useUIStore.getState().mobileMenuOpen).toBe(false);
  });

  it('should reset navigation', () => {
    useUIStore.setState({ currentView: 'generate', activePitch: {} });
    useUIStore.getState().resetNavigation();
    
    const state = useUIStore.getState();
    expect(state.currentView).toBe('landing');
    expect(state.activePitch).toBeNull();
  });
});
