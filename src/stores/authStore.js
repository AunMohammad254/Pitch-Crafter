import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient';

export const useAuthStore = create(
  devtools(
    (set) => ({
      user: null,
      session: null,
      loading: true,
      error: null,

      // Actions
      setUser: (user) => set({ user }, false, 'auth/setUser'),
      
      setSession: (session) => set({ session, user: session?.user ?? null, loading: false }, false, 'auth/setSession'),

      initAuth: async () => {
        set({ loading: true }, false, 'auth/initAuth_start');
        try {
          const { data: { session } } = await supabase.auth.getSession();
          set({ session, user: session?.user ?? null, loading: false }, false, 'auth/initAuth_success');
        } catch (err) {
          console.error('Auth Init Error:', err);
          set({ error: err.message, loading: false }, false, 'auth/initAuth_error');
        }

        // Set up listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          set({ session, user: session?.user ?? null, loading: false }, false, 'auth/onAuthStateChange');
        });

        return () => subscription.unsubscribe();
      },

      signOut: async () => {
        set({ loading: true }, false, 'auth/signOut_start');
        try {
          await supabase.auth.signOut();
          set({ user: null, session: null, loading: false }, false, 'auth/signOut_success');
        } catch (err) {
          set({ error: err.message, loading: false }, false, 'auth/signOut_error');
        }
      }
    }),
    { name: 'AuthStore' }
  )
);
