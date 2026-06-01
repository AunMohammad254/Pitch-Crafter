import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient';
import { Pitch, PitchData, PitchVersion } from '../types';

interface PitchState {
  pitches: Pitch[];
  selectedPitch: Pitch | null;
  isLoading: boolean;
  isSyncing: boolean;
  syncingIds: Set<string>;
  error: string | null;
  lastFetched: number | null;

  setPitches: (pitches: Pitch[]) => void;
  setSelectedPitch: (pitch: Pitch | null) => void;
  fetchPitches: () => Promise<void>;
  forceFetchPitches: () => Promise<void>;
  addPitch: (newPitchData: Partial<Pitch>) => Promise<Pitch | undefined>;
  updatePitchInStore: (updatedPitch: Pitch) => Promise<void>;
  deletePitchFromStore: (id: string) => Promise<void>;
  fetchVersions: (pitchId: string) => Promise<PitchVersion[]>;
  saveVersion: (pitchId: string, generatedData: PitchData, landingCode: string) => Promise<void>;
}

export const usePitchStore = create<PitchState>()(
  devtools(
    persist(
      (set, get) => ({
        pitches: [],
        selectedPitch: null,
        isLoading: false,
        isSyncing: false,
        syncingIds: new Set<string>(),
        error: null,
        lastFetched: null,

        setPitches: (pitches) => set({ pitches }, false, 'pitch/setPitches'),
        
        setSelectedPitch: (pitch) => set({ selectedPitch: pitch }, false, 'pitch/setSelectedPitch'),

        fetchPitches: async () => {
          const { lastFetched, pitches } = get();
          const now = Date.now();
          // Cache for 60 seconds (60000 ms)
          if (lastFetched && now - lastFetched < 60000 && pitches.length > 0) {
            return; // Use cached data
          }
          await get().forceFetchPitches();
        },

        forceFetchPitches: async () => {
          set({ isLoading: true, error: null }, false, 'pitch/fetchPitches_start');
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
              .from('pitches')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });

            if (error) throw error;
            set({ pitches: data || [], isLoading: false, lastFetched: Date.now() }, false, 'pitch/fetchPitches_success');
          } catch (err: any) {
            console.error('Error fetching pitches:', err);
            set({ error: err.message, isLoading: false }, false, 'pitch/fetchPitches_error');
          }
        },

        addPitch: async (newPitchData) => {
          set({ isSyncing: true }, false, 'pitch/addPitch_start');
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase.from("pitches").insert({
              user_id: user.id,
              ...newPitchData
            }).select();

            if (error) throw error;

            if (data && data.length > 0) {
              const insertedPitch = data[0] as Pitch;
              set((state) => ({
                pitches: [insertedPitch, ...state.pitches],
                isSyncing: false
              }), false, 'pitch/addPitch_success');
              
              // Save initial version
              await supabase.from("pitch_versions").insert({
                pitch_id: insertedPitch.id,
                generated_data: insertedPitch.generated_data,
                landing_code: insertedPitch.landing_code
              });

              return insertedPitch;
            }
          } catch (err: any) {
            console.error('Error adding pitch:', err);
            set({ isSyncing: false, error: err.message }, false, 'pitch/addPitch_error');
            throw err;
          }
        },

        updatePitchInStore: async (updatedPitch) => {
          const previousPitches = get().pitches;
          const { id } = updatedPitch;
          
          set((state) => {
            const newSyncingIds = new Set(state.syncingIds);
            newSyncingIds.add(id);
            return { 
              isSyncing: true, 
              syncingIds: newSyncingIds,
              // Optimistic Update
              pitches: state.pitches.map((p) => (p.id === id ? updatedPitch : p)),
              selectedPitch: state.selectedPitch?.id === id ? updatedPitch : state.selectedPitch
            };
          }, false, 'pitch/updatePitch_optimistic');

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
              .eq('id', id);

            if (error) throw error;
            
            set((state) => {
              const newSyncingIds = new Set(state.syncingIds);
              newSyncingIds.delete(id);
              return { isSyncing: newSyncingIds.size > 0, syncingIds: newSyncingIds };
            }, false, 'pitch/updatePitch_success');
          } catch (err) {
            console.error('Failed to update pitch on server, rolling back:', err);
            // Rollback
            set((state) => {
              const newSyncingIds = new Set(state.syncingIds);
              newSyncingIds.delete(id);
              return { 
                pitches: previousPitches, 
                isSyncing: newSyncingIds.size > 0, 
                syncingIds: newSyncingIds 
              };
            }, false, 'pitch/updatePitch_rollback');
            throw err;
          }
        },

        deletePitchFromStore: async (id) => {
          const previousPitches = get().pitches;
          
          set((state) => {
            const newSyncingIds = new Set(state.syncingIds);
            newSyncingIds.add(id);
            return { 
              isSyncing: true, 
              syncingIds: newSyncingIds,
              // Optimistic Update
              pitches: state.pitches.filter((p) => p.id !== id),
              selectedPitch: state.selectedPitch?.id === id ? null : state.selectedPitch
            };
          }, false, 'pitch/deletePitch_optimistic');

          try {
            const { error } = await supabase.from('pitches').delete().eq('id', id);
            if (error) throw error;
            
            set((state) => {
              const newSyncingIds = new Set(state.syncingIds);
              newSyncingIds.delete(id);
              return { isSyncing: newSyncingIds.size > 0, syncingIds: newSyncingIds };
            }, false, 'pitch/deletePitch_success');
          } catch (err) {
            console.error('Failed to delete pitch on server, rolling back:', err);
            // Rollback
            set((state) => {
              const newSyncingIds = new Set(state.syncingIds);
              newSyncingIds.delete(id);
              return { 
                pitches: previousPitches, 
                isSyncing: newSyncingIds.size > 0, 
                syncingIds: newSyncingIds 
              };
            }, false, 'pitch/deletePitch_rollback');
            throw err;
          }
        },

        fetchVersions: async (pitchId) => {
          try {
            const { data, error } = await supabase
              .from("pitch_versions")
              .select("*")
              .eq("pitch_id", pitchId)
              .order("created_at", { ascending: false });

            if (error) throw error;
            return data || [];
          } catch (err) {
            console.error('Error fetching versions:', err);
            return [];
          }
        },

        saveVersion: async (pitchId, generatedData, landingCode) => {
          try {
            const { error } = await supabase
              .from("pitch_versions")
              .insert({
                pitch_id: pitchId,
                generated_data: generatedData,
                landing_code: landingCode
              });

            if (error) throw error;
          } catch (err) {
            console.error('Error saving version:', err);
            throw err;
          }
        }
      }),
      {
        name: 'pitchcraft-pitch-storage',
        partialize: (state) => ({
          pitches: state.pitches
        })
      }
    ),
    { name: 'PitchStore' }
  )
);
