import { motion } from "framer-motion";

export default function PitchFilters({ 
  searchTerm, 
  setSearchTerm, 
  filterIndustry, 
  setFilterIndustry, 
  sortBy, 
  setSortBy, 
  industries, 
  clearFilters,
  totalPitches,
  filteredCount
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-glass p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 animate-fade-in-up"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-1">
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
          <label className="flex items-center text-xs sm:text-sm font-primary font-bold text-white mb-2 sm:mb-3">
            <span className="mr-1.5 sm:mr-2 text-base sm:text-lg">🏢</span>
            <span className="hidden sm:inline">Filter by Industry</span>
            <span className="sm:hidden">Industry</span>
          </label>
          <div className="relative group">
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="input-field appearance-none cursor-pointer pr-10 text-sm sm:text-base relative bg-transparent focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white'
              }}
            >
              {industries.map(industry => (
                <option key={industry} value={industry} className="bg-neutral-900 text-white py-2">
                  {industry === "all" ? "All Industries" : industry}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-neutral-400 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="flex items-center text-xs sm:text-sm font-primary font-bold text-white mb-2 sm:mb-3">
            <span className="mr-1.5 sm:mr-2 text-base sm:text-lg">📊</span>
            Sort By
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative group flex-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field appearance-none cursor-pointer pr-10 text-sm sm:text-base relative bg-transparent focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-full"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              >
                <option value="newest" className="bg-neutral-900 text-white py-2">Newest First</option>
                <option value="oldest" className="bg-neutral-900 text-white py-2">Oldest First</option>
                <option value="name" className="bg-neutral-900 text-white py-2">Name A-Z</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {(searchTerm || filterIndustry !== "all") && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all shadow-lg"
                title="Clear all filters"
              >
                🧹
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      {(searchTerm || filterIndustry !== "all") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-neutral-200"
        >
          <div className="flex items-center justify-center space-x-2 text-white">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent-500 rounded-full animate-pulse"></span>
            <p className="font-medium text-sm sm:text-base text-center">
              Showing {filteredCount} of {totalPitches} pitches
              {searchTerm && ` for "${searchTerm}"`}
              {filterIndustry !== "all" && ` in ${filterIndustry}`}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
