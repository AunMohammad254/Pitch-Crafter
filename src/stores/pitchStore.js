import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export const usePitchStore = create((set, get) => ({
  pitches: [],
  selectedPitch: null,
  isLoading: false,
  error: null,

  // Actions
  setPitches: (pitches) => set({ pitches }),
  
  setSelectedPitch: (pitch) => set({ selectedPitch: pitch }),

  fetchPitches: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('pitches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ pitches: data || [], isLoading: false });
    } catch (err) {
      console.error('Error fetching pitches:', err);
      set({ error: err.message, isLoading: false });
    }
  },

  addPitch: (newPitch) => {
    set((state) => ({
      pitches: [newPitch, ...state.pitches]
    }));
  },

  updatePitchInStore: (updatedPitch) => {
    set((state) => ({
      pitches: state.pitches.map((p) => (p.id === updatedPitch.id ? updatedPitch : p)),
      selectedPitch: state.selectedPitch?.id === updatedPitch.id ? updatedPitch : state.selectedPitch
    }));
  },

  deletePitchFromStore: (id) => {
    set((state) => ({
      pitches: state.pitches.filter((p) => p.id !== id),
      selectedPitch: state.selectedPitch?.id === id ? null : state.selectedPitch
    }));
  }
}));
