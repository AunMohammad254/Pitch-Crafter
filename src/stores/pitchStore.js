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

  updatePitchInStore: async (updatedPitch) => {
    const previousPitches = get().pitches;
    
    // Optimistic Update
    set((state) => ({
      pitches: state.pitches.map((p) => (p.id === updatedPitch.id ? updatedPitch : p)),
      selectedPitch: state.selectedPitch?.id === updatedPitch.id ? updatedPitch : state.selectedPitch
    }));

    try {
      const { error } = await supabase
        .from('pitches')
        .update({
          generated_data: updatedPitch.generated_data,
          title: updatedPitch.title,
          short_description: updatedPitch.short_description,
          industry: updatedPitch.industry,
          logo_svg: updatedPitch.logo_svg
        })
        .eq('id', updatedPitch.id);

      if (error) throw error;
    } catch (err) {
      console.error('Failed to update pitch on server, rolling back:', err);
      // Rollback
      set({ pitches: previousPitches });
      throw err;
    }
  },

  deletePitchFromStore: async (id) => {
    const previousPitches = get().pitches;

    // Optimistic Update
    set((state) => ({
      pitches: state.pitches.filter((p) => p.id !== id),
      selectedPitch: state.selectedPitch?.id === id ? null : state.selectedPitch
    }));

    try {
      const { error } = await supabase.from('pitches').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Failed to delete pitch on server, rolling back:', err);
      // Rollback
      set({ pitches: previousPitches });
      throw err;
    }
  }
}));
