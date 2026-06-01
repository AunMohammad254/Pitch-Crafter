import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useUIStore = create(
  devtools(
    persist(
      (set) => ({
        currentView: 'landing',
        activePitch: null,
        mobileMenuOpen: false,
        animationsEnabled: true,
        showShortcuts: false,
        authInitialMode: 'signin',

        // Actions
        setCurrentView: (view) => set({ currentView: view }, false, 'ui/setCurrentView'),
        
        setActivePitch: (pitch) => set({ activePitch: pitch }, false, 'ui/setActivePitch'),
        
        setMobileMenuOpen: (isOpen) => set({ mobileMenuOpen: isOpen }, false, 'ui/setMobileMenuOpen'),
        
        toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }), false, 'ui/toggleMobileMenu'),
        
        setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }, false, 'ui/setAnimationsEnabled'),
        
        setShowShortcuts: (show) => set({ showShortcuts: show }, false, 'ui/setShowShortcuts'),
        
        setAuthInitialMode: (mode) => set({ authInitialMode: mode }, false, 'ui/setAuthInitialMode'),

        navigateToAuth: (mode = 'signin') => set({ 
          currentView: 'auth', 
          authInitialMode: mode 
        }, false, 'ui/navigateToAuth'),

        navigateToPitch: (pitch, view = 'generate') => set({
          activePitch: pitch,
          currentView: view
        }, false, 'ui/navigateToPitch'),

        resetNavigation: () => set({
          currentView: 'landing',
          activePitch: null
        }, false, 'ui/resetNavigation')
      }),
      {
        name: 'pitchcraft-ui-storage',
        partialize: (state) => ({ 
          animationsEnabled: state.animationsEnabled 
        }), // Only persist preferences
      }
    ),
    { name: 'UIStore' }
  )
);
