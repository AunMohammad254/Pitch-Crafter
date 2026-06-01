import { useState, useMemo } from 'react';

export function usePitchList(pitches) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredPitches = useMemo(() => {
    return pitches
      .filter(pitch => {
        const matchesSearch = pitch.generated_data?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pitch.generated_data?.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pitch.industry?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesIndustry = filterIndustry === "all" || pitch.industry === filterIndustry;

        return matchesSearch && matchesIndustry;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case "oldest":
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case "name":
            return (a.generated_data?.name || "").localeCompare(b.generated_data?.name || "");
          default:
            return 0;
        }
      });
  }, [pitches, searchTerm, filterIndustry, sortBy]);

  const industries = useMemo(() => {
    return ["all", ...new Set(pitches.map(p => p.industry).filter(Boolean))];
  }, [pitches]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterIndustry("all");
  };

  return {
    searchTerm,
    setSearchTerm,
    filterIndustry,
    setFilterIndustry,
    sortBy,
    setSortBy,
    filteredPitches,
    industries,
    clearFilters
  };
}
