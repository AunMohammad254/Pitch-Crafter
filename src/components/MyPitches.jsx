import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { motion, AnimatePresence } from "framer-motion"

export default function MyPitches({ user, onNavigate }) {
  const [pitches, setPitches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPitch, setSelectedPitch] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterIndustry, setFilterIndustry] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // 🔹 Fetch user pitches from Supabase
  useEffect(() => {
    async function fetchPitches() {
      setLoading(true)
      const { data, error } = await supabase
        .from("pitches")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("❌ Error fetching pitches:", error)
        showNotification("❌ Failed to load pitches", "error")
      } else {
        setPitches(data)
      }
      setLoading(false)
    }

    fetchPitches()
  }, [user.id])

  // 🔹 Delete pitch
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this pitch?")) return
    const { error } = await supabase.from("pitches").delete().eq("id", id)
    if (error) {
      console.error("❌ Delete Error:", error)
      showNotification("❌ Failed to delete pitch", "error")
    } else {
      setPitches(pitches.filter((p) => p.id !== id))
      showNotification("✅ Pitch deleted successfully!", "success")
      setSelectedPitch(null)
    }
  }

  // 🔹 Filter and sort pitches
  const filteredPitches = pitches
    .filter(pitch => {
      const matchesSearch = pitch.generated_data?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pitch.generated_data?.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pitch.industry?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesIndustry = filterIndustry === "all" || pitch.industry === filterIndustry
      
      return matchesSearch && matchesIndustry
    })
    .sort((a, b) => {
      switch(sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at)
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at)
        case "name":
          return a.generated_data?.name?.localeCompare(b.generated_data?.name)
        default:
          return 0
      }
    })

  // 🔹 Get unique industries for filter
  const industries = ["all", ...new Set(pitches.map(p => p.industry).filter(Boolean))]

  // 🔹 Notification function
  const showNotification = (message, type) => {
    const el = document.createElement("div")
    el.className = `fixed top-4 right-4 px-6 py-4 rounded-xl shadow-2xl z-50 font-semibold backdrop-blur-sm border animate-fade-in-right ${
      type === "success" 
        ? "bg-green-500/90 text-white border-green-400" 
        : "bg-red-500/90 text-white border-red-400"
    }`
    el.innerHTML = `
      <div class="flex items-center">
        <span class="mr-3 text-lg">${type === "success" ? "✅" : "❌"}</span>
        <span>${message}</span>
      </div>
    `
    document.body.appendChild(el)
    setTimeout(() => {
      el.style.opacity = "0"
      el.style.transform = "translateX(100%)"
      setTimeout(() => el.remove(), 300)
    }, 4000)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center py-12 sm:py-16">
            <div className="loading-spinner mx-auto mb-4 sm:mb-6"></div>
            {/* DARK THEME: Changed text from neutral-700 to white for better contrast on black background */}
            <h2 className="text-xl sm:text-2xl font-primary font-bold text-white mb-2">Loading Your Pitches</h2>
            {/* DARK THEME: Changed text from neutral-600 to white for better contrast */}
            <p className="text-sm sm:text-base text-white font-medium">Gathering your startup portfolio...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
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
            {/* GRADIENT TEXT: Preserved gradient-text class as it contains gradient styling */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-primary font-bold gradient-text mb-1 sm:mb-2">
              My Pitches
            </h1>
            {/* DARK THEME: Changed text from neutral-600 to white for better contrast */}
            <p className="text-base sm:text-lg lg:text-xl text-white font-medium">Manage and review your generated startup pitches</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Create New Pitch Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate && onNavigate('generate')}
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
            {/* DARK THEME: Changed text from neutral-600 to white for better contrast */}
            <span className="text-sm sm:text-base text-white font-medium">Total Pitches:</span>
            <span className="font-primary font-bold text-primary-600 text-xl sm:text-2xl">{pitches.length}</span>
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full animate-pulse"></span>
          </div>
        </motion.div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-glass p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 animate-fade-in-up"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* DARK THEME: Changed label text from neutral-700 to white for better contrast */}
            <label className="flex items-center text-xs sm:text-sm font-primary font-bold text-white mb-2 sm:mb-3">
              <span className="mr-1.5 sm:mr-2 text-base sm:text-lg">🔍</span>
              Search Pitches
            </label>
            <input
              type="text"
              placeholder="Search by name, tagline, or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field text-sm sm:text-base"
            />
          </div>

          {/* Industry Filter */}
          <div>
            {/* DARK THEME: Changed label text from neutral-700 to white for better contrast */}
            <label className="flex items-center text-xs sm:text-sm font-primary font-bold text-white mb-2 sm:mb-3">
              <span className="mr-1.5 sm:mr-2 text-base sm:text-lg">🏢</span>
              <span className="hidden sm:inline">Filter by Industry</span>
              <span className="sm:hidden">Industry</span>
            </label>
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="input-field text-sm sm:text-base"
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry === "all" ? "All Industries" : industry}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            {/* DARK THEME: Changed label text from neutral-700 to white for better contrast */}
            <label className="flex items-center text-xs sm:text-sm font-primary font-bold text-white mb-2 sm:mb-3">
              <span className="mr-1.5 sm:mr-2 text-base sm:text-lg">📊</span>
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field text-sm sm:text-base"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {(searchTerm || filterIndustry !== "all") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-neutral-200"
          >
            {/* DARK THEME: Changed text from neutral-600 to white for better contrast */}
            <div className="flex items-center justify-center space-x-2 text-white">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent-500 rounded-full animate-pulse"></span>
              <p className="font-medium text-sm sm:text-base text-center">
                Showing {filteredPitches.length} of {pitches.length} pitches
                {searchTerm && ` for "${searchTerm}"`}
                {filterIndustry !== "all" && ` in ${filterIndustry}`}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Pitches Grid */}
      {filteredPitches.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-glass p-8 sm:p-12 lg:p-16 text-center animate-fade-in-up"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-primary-100 to-secondary-100 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <span className="text-4xl sm:text-6xl">💡</span>
          </div>
          {/* DARK THEME: Changed heading text from neutral-700 to white for better contrast */}
          <h3 className="text-2xl sm:text-3xl font-primary font-bold text-white mb-3 sm:mb-4">No Pitches Found</h3>
          {/* DARK THEME: Changed paragraph text from neutral-600 to white for better contrast */}
          <p className="text-base sm:text-lg text-white max-w-md mx-auto mb-6 sm:mb-8 font-medium leading-relaxed">
            {pitches.length === 0 
              ? "You haven't generated any startup pitches yet. Create your first pitch to see it here!"
              : "No pitches match your search criteria. Try adjusting your filters."
            }
          </p>
          {pitches.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.hash = "#generate"}
              className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
            >
              <span className="mr-2 sm:mr-3 text-lg sm:text-xl">✨</span>
              Create Your First Pitch
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 animate-stagger"
        >
          {filteredPitches.map((pitch, index) => (
            <PitchCard 
              key={pitch.id} 
              pitch={pitch} 
              index={index}
              onView={() => setSelectedPitch(pitch)}
              onDelete={() => handleDelete(pitch.id)}
              onPreview={() => previewLandingPage(pitch)}
            />
          ))}
        </motion.div>
      )}

      {/* Pitch Detail Modal */}
      <AnimatePresence>
        {selectedPitch && (
          <PitchModal 
            pitch={selectedPitch} 
            onClose={() => setSelectedPitch(null)}
            onDelete={() => handleDelete(selectedPitch.id)}
            onPreview={() => previewLandingPage(selectedPitch)}
          />
        )}
        
      </AnimatePresence>
      </div>
    </div>
  )
}

// Enhanced Pitch Card Component
//──────────────────────────────────────────────────────────────
function PitchCard({ pitch, index, onView, onDelete, onPreview }) {
  const data = pitch.generated_data
  const createdDate = new Date(pitch.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="bg-gray-900 rounded-2xl card-glass p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-gray-700"
      onClick={onView}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-primary font-bold text-white mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {data?.name || "Untitled Pitch"}
          </h3>
          <p className="text-sm sm:text-base text-gray-300 font-medium line-clamp-2 leading-relaxed">
            {data?.tagline || "No tagline available"}
          </p>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4 shrink-0">
          <span className="status-indicator bg-accent-100 text-accent-700 border-accent-200 text-xs px-2 py-1">
            🚀 <span className="hidden sm:inline">Active</span>
          </span>
        </div>
      </div>

      {/* Industry & Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium text-xs sm:text-sm w-fit">
          <span className="mr-1 sm:mr-2">🏢</span>
          {pitch.industry || "General"}
        </span>
        {/* DARK THEME: Changed text from neutral-500 to light gray for better contrast */}
        <span className="text-xs sm:text-sm text-gray-400 font-medium">
          {createdDate}
        </span>
      </div>

      {/* Pitch Preview */}
      <div className="mb-4 sm:mb-6">
        {/* DARK THEME: Changed text from neutral-600 to light gray for better contrast */}
        <p className="text-gray-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
          {data?.elevator_pitch || data?.problem || "No preview available"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation()
            onView()
          }}
          className="btn-primary flex-1 text-xs sm:text-sm py-2 flex items-center justify-center"
        >
          <span className="mr-1 sm:mr-2">👁️</span>
          <span className="hidden sm:inline">View Details</span>
          <span className="sm:hidden">View</span>
        </motion.button>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          {pitch.landing_code && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                onPreview()
              }}
              className="btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-4 flex-1 sm:flex-none"
              title="Preview Landing Page"
            >
              🌐 <span className="ml-1 sm:hidden">Preview</span>
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors shrink-0"
            title="Delete Pitch"
          >
            🗑️
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Enhanced Pitch Modal Component (MyPitches - View Details)
function PitchModal({ pitch, onClose, onDelete, onPreview }) {
  const d = pitch.generated_data

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 z-50 overflow-y-auto mt-15"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="rounded-xl shadow-2xl card-glass w-full max-w-6xl max-h-[80vh] sm:max-h-[92vh] lg:max-h-[95vh] overflow-hidden flex flex-col my-4 sm:my-6 lg:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className=" bg-linear-to-br from-cyan-700 to-blue-800 p-4 sm:p-6 lg:p-8 text-white bg-clip-padding backdrop-filter backdrop-blur-sm mt-10 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-2 sm:pr-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-primary font-bold mb-2 sm:mb-3 line-clamp-2">{d?.name || "Untitled Pitch"}</h2>
              <p className="text-primary-100 text-base sm:text-lg lg:text-xl font-medium mb-4 sm:mb-6 italic line-clamp-2">{d?.tagline || "No tagline available"}</p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="bg-white/20 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm font-medium border border-white/30">
                  🏢 {pitch.industry || "General"}
                </span>
                <span className="bg-white/20 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm font-medium border border-white/30">
                  📅 {new Date(pitch.created_at).toLocaleDateString()}
                </span>
                {d?.target_audience?.segments && (
                  <span className="bg-white/20 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm font-medium border border-white/30">
                    🎯 {d.target_audience.segments.length} segments
                  </span>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors text-lg sm:text-xl lg:text-2xl border border-white/30 shrink-0"
            >
              ✕
            </motion.button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 lg:space-y-10 bg-linear-to-br from-blue-400 to-blue-200">
          {/* Elevator Pitch */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* DARK THEME: Changed text from neutral-800 to white for better contrast */}
            <h3 className="text-3xl font-primary font-bold text-white mb-6 flex items-center space-x-4">
              <span className="w-12 h-12 bg-linear-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white text-xl">🎯</span>
              <span>Elevator Pitch</span>
            </h3>
            <div className="card-glass p-8 bg-linear-to-br from-primary-50 to-secondary-50 border-primary-200">
              {/* DARK THEME: Changed text from neutral-700 to gray-800 for readability on light background */}
              <p className="text-gray-800 text-lg leading-relaxed font-medium">{d?.elevator_pitch || "No elevator pitch available"}</p>
            </div>
          </motion.section>

          {/* Problem & Solution */}
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* DARK THEME: Changed text from neutral-800 to white for better contrast */}
              <h3 className="text-3xl font-primary font-bold text-white mb-6 flex items-center space-x-4">
                <span className="w-12 h-12 bg-linear-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">🧩</span>
              <span>Problem</span>
            </h3>
            <div className="rounded-xl card-glass p-8 bg-linear-to-r from-red-50 to-pink-50 border-red-200">
                {/* DARK THEME: Changed text from neutral-700 to gray-800 for readability on light background */}
                <p className="text-gray-800 leading-relaxed font-medium">{d?.problem || "No problem description available"}</p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* DARK THEME: Changed text from neutral-800 to white for better contrast */}
              <h3 className="text-3xl font-primary font-bold text-white mb-6 flex items-center space-x-4">
                <span className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-xl">💡</span>
              <span>Solution</span>
            </h3>
            <div className="rounded-xl card-glass p-8 bg-linear-to-r from-green-50 to-emerald-50 border-green-200">
                {/* DARK THEME: Changed text from neutral-700 to gray-800 for readability on light background */}
                <p className="text-gray-800 leading-relaxed font-medium">{d?.solution || "No solution description available"}</p>
              </div>
            </motion.section>
          </div>

          {/* Unique Value Proposition */}
          {d?.unique_value_proposition && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* DARK THEME: Changed text from neutral-800 to white for better contrast */}
              <h3 className="text-3xl font-primary font-bold text-white mb-6 flex items-center space-x-4">
                <span className="w-12 h-12 bg-linear-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center text-white text-xl">💎</span>
              <span>Value Proposition</span>
            </h3>
            <div className="rounded-xl card-glass p-8 bg-linear-to-r from-yellow-50 to-amber-50 border-yellow-200">
                {/* DARK THEME: Changed text from neutral-700 to gray-800 for readability on light background */}
                <p className="text-gray-800 text-xl font-bold leading-relaxed">{d.unique_value_proposition}</p>
              </div>
            </motion.section>
          )}

          {/* Target Audience */}
          {d?.target_audience && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* DARK THEME: Changed text from neutral-800 to white for better contrast */}
              <h3 className="text-3xl font-primary font-bold text-white mb-6 flex items-center space-x-4">
                <span className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl">🎯</span>
              <span>Target Market</span>
            </h3>
            <div className="rounded-xl card-glass p-8 bg-linear-to-r from-indigo-50 to-purple-50 border-indigo-200">
                {/* DARK THEME: Changed text from neutral-700 to gray-800 for readability on light background */}
                <p className="text-gray-800 mb-6 text-lg font-medium leading-relaxed">{d.target_audience.description}</p>
                {Array.isArray(d.target_audience.segments) && (
                  <div className="flex flex-wrap gap-3">
                    {d.target_audience.segments.map((seg, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="status-indicator bg-indigo-100 text-indigo-700 border-indigo-200 px-4 py-2 font-medium"
                      >
                        {seg}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* Branding Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Colors */}
            {d?.colors && (
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                {/* DARK THEME: Changed text from neutral-800 to white for better contrast */}
                <h3 className="text-3xl font-primary font-bold text-white mb-6 flex items-center space-x-4">
                  <span className="w-12 h-12 bg-linear-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white text-xl">🎨</span>
                  <span>Color Palette</span>
                </h3>
                <div className="card-glass p-8">
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(d.colors).map(([name, color], i) => (
                      <motion.div 
                        key={name} 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="text-center"
                      >
                        <div
                          className="w-24 h-24 rounded-2xl shadow-xl border-4 border-white mx-auto mb-3 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                        {/* DARK THEME: Changed text from neutral-700 to gray-800 for readability on light background */}
                        <p className="text-sm font-primary font-bold text-gray-800 capitalize mb-1">{name}</p>
                        {/* DARK THEME: Changed text from neutral-500 to gray-600 for readability on light background */}
                        <p className="text-xs text-gray-600 font-mono bg-neutral-100 px-2 py-1 rounded">{color}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Logo Ideas */}
            {d?.logo_ideas && (
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                {/* DARK THEME: Changed text from neutral-800 to white for better contrast */}
                <h3 className="text-3xl font-primary font-bold text-white mb-6 flex items-center space-x-4">
                  <span className="w-12 h-12 bg-linear-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white text-xl">🚀</span>
                  <span>Logo Concepts</span>
                </h3>
                <div className="card-glass p-8">
                  <ul className="space-y-4">
                    {d.logo_ideas.map((idea, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="flex items-center space-x-4 bg-linear-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200 hover:shadow-md transition-shadow"
                      >
                        <span className="w-8 h-8 bg-linear-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white text-sm">✦</span>
                        {/* DARK THEME: Changed text from neutral-700 to gray-800 for readability on light background */}
                        <span className="text-gray-800 font-medium">{idea}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.section>
            )}
          </div>

          {/* Landing Copy */}
          {d?.landing_copy && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {/* DARK THEME: Changed text from neutral-800 to white for better contrast */}
              <h3 className="text-3xl font-primary font-bold text-white mb-6 flex items-center space-x-4">
                <span className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">🌐</span>
                <span>Landing Page Copy</span>
              </h3>
              <div className="rounded-xl card-glass p-8 bg-linear-to-r from-purple-50 to-pink-50 border-purple-200 space-y-6">
                <div>
                  <p className="text-sm font-primary font-bold text-purple-700 mb-3 flex items-center">
                    <span className="mr-2">📢</span>
                    Headline
                  </p>
                  {/* DARK THEME: Changed text from neutral-800 to gray-800 for readability on light background */}
                  <p className="text-2xl font-primary font-bold text-gray-800 leading-tight">{d.landing_copy.headline}</p>
                </div>
                <div>
                  <p className="text-sm font-primary font-bold text-purple-700 mb-3 flex items-center">
                    <span className="mr-2">📝</span>
                    Subheadline
                  </p>
                  {/* DARK THEME: Changed text from neutral-700 to gray-800 for readability on light background */}
                  <p className="text-lg text-gray-800 font-medium leading-relaxed">{d.landing_copy.subheadline}</p>
                </div>
                <div>
                  <p className="text-sm font-primary font-bold text-purple-700 mb-3 flex items-center">
                    <span className="mr-2">🎯</span>
                    Call to Action
                  </p>
                  <p className="text-xl text-primary-600 font-bold bg-primary-100 px-4 py-2 rounded-lg inline-block">{d.landing_copy.call_to_action}</p>
                </div>
              </div>
            </motion.section>
          )}
        </div>

        {/* Modal Footer */}
        {/* DARK THEME: Changed footer background from neutral-50 to gray-900 for dark theme consistency */}
        <div className="border-t border-gray-700 p-1.5 bg-gray-900">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-1">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPreview}
                className="btn-primary px-6 py-4 text-lg font-primary font-bold shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-r from-green-500 to-emerald-600 flex items-center space-x-2"
              >
                <span>🌐</span>
                <span>Preview Landing Page</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (pitch.landing_code) {
                    navigator.clipboard.writeText(pitch.landing_code)
                    const el = document.createElement("div")
                    el.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
                    el.innerText = "✅ Code copied to clipboard!"
                    document.body.appendChild(el)
                    setTimeout(() => el.remove(), 3000)
                  }
                }}
                className="btn-secondary px-6 py-3 text-lg font-primary font-bold shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-r from-blue-500 to-purple-600 text-white border-0 flex items-center space-x-1"
              >
                <span>📋</span>
                <span>Copy Code</span>
              </motion.button>
            </div>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDelete}
                className="px-6 py-3 ml-2 text-lg font-primary font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-r from-red-500 to-pink-600 text-white border-0 flex items-center space-x-1"
              >
                <span>🗑️</span>
                <span>Delete Pitch</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-4 text-lg font-primary font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-r from-neutral-500 to-neutral-600 text-white border-0"
              >
                Close
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}