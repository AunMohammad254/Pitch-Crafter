import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePitchStore } from "../../stores/pitchStore"
import { useUIStore } from "../../stores/uiStore"
import { useNotification } from "../../hooks/useNotification"
import { usePitchList } from "../../hooks/usePitchList"
import { PitchCardSkeleton, Skeleton } from "../ui/Skeleton"
import PitchFilters from "./PitchFilters"
import PitchList from "./PitchList"
import PitchModal from "./PitchModal"

export default function MyPitches() {
  const {
    pitches,
    isLoading,
    isSyncing,
    fetchPitches,
    selectedPitch,
    setSelectedPitch,
    deletePitchFromStore,
    updatePitchInStore
  } = usePitchStore();

  const { setCurrentView, navigateToPitch } = useUIStore();
  const { showNotification } = useNotification();

  const {
    searchTerm,
    setSearchTerm,
    filterIndustry,
    setFilterIndustry,
    sortBy,
    setSortBy,
    filteredPitches,
    industries,
    clearFilters
  } = usePitchList(pitches);

  // 🔹 Fetch user pitches from store
  useEffect(() => {
    fetchPitches();
  }, [fetchPitches])

  // 🔹 Delete pitch
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this pitch?")) return
    
    try {
      await deletePitchFromStore(id)
      showNotification("✅ Pitch deleted successfully!", "success")
    } catch (error) {
      console.error("❌ Delete Error:", error)
      showNotification("❌ Failed to delete pitch", "error")
    }
  }

  // 🔹 Preview landing page
  const previewLandingPage = (pitch) => {
    if (!pitch.landing_code) {
      showNotification("No landing page code available", "error")
      return
    }

    const blob = new Blob([pitch.landing_code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
        <div className="w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 sm:mb-12">
            <div className="flex items-center space-x-6">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <div>
                <Skeleton className="w-48 h-10 mb-2" />
                <Skeleton className="w-64 h-6" />
              </div>
            </div>
            <div className="flex space-x-4 mt-6 lg:mt-0">
              <Skeleton className="w-40 h-12 rounded-xl" />
              <Skeleton className="w-40 h-12 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <PitchCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'transparent' }}>
      <div className="w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 sm:mb-12 animate-fade-in-up"
        >
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6 mb-6 lg:mb-0">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 sm:w-16 sm:h-16 bg-linear-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-xl mx-auto sm:mx-0"
            >
              <span className="text-white text-2xl sm:text-3xl">📋</span>
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-primary font-bold gradient-text mb-1 sm:mb-2">
                My Pitches
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white font-medium">Manage and review your generated startup pitches</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {isSyncing && (
              <div className="flex items-center space-x-2 text-primary-400 animate-pulse px-3">
                <div className="w-1.5 h-1.5 bg-primary-400 rounded-full"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Syncing...</span>
              </div>
            )}
            {/* Create New Pitch Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView('generate')}
              className="btn-primary px-6 py-3 text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            >
              <span className="text-lg">✨</span>
              <span>Create New Pitch</span>
            </motion.button>

            {/* Pitch Count */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="card-glass px-4 sm:px-6 lg:px-8 py-3 sm:py-4"
            >
              <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                <span className="text-sm sm:text-base text-white font-medium">Total Pitches:</span>
                <span className="font-primary font-bold text-primary-600 text-xl sm:text-2xl">{pitches.length}</span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full animate-pulse"></span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <PitchFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterIndustry={filterIndustry}
          setFilterIndustry={setFilterIndustry}
          sortBy={sortBy}
          setSortBy={setSortBy}
          industries={industries}
          clearFilters={clearFilters}
          totalPitches={pitches.length}
          filteredCount={filteredPitches.length}
        />

        <PitchList 
          pitches={pitches}
          filteredPitches={filteredPitches}
          onView={setSelectedPitch}
          onDelete={handleDelete}
          onPreview={previewLandingPage}
          onCreateNew={() => setCurrentView('generate')}
        />

        {/* Pitch Detail Modal */}
        <AnimatePresence>
          {selectedPitch && (
            <PitchModal
              pitch={selectedPitch}
              onClose={() => setSelectedPitch(null)}
              onDelete={() => handleDelete(selectedPitch.id)}
              onPreview={() => previewLandingPage(selectedPitch)}
              onSimulate={() => navigateToPitch(selectedPitch, "investor-chat")}
              onPractice={() => navigateToPitch(selectedPitch, "pitch-practice")}
              onUpdate={(updatedPitch) => {
                updatePitchInStore(updatedPitch);
              }}
              onRestore={() => navigateToPitch(selectedPitch, "generate")}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
