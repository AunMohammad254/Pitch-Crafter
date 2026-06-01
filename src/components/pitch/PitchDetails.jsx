import React from "react";
import PitchEditor from "./PitchEditor";
import { usePitchDetails } from "../../hooks/usePitchDetails";
import { PitchActionButtons, PitchHeader } from "./details/PitchHeader";
import { PitchProblemSolution, PitchUniqueValue } from "./details/PitchProblemSolution";
import { PitchBrandIdentity } from "./details/PitchBrandIdentity";
import { PitchTargetAudience } from "./details/PitchTargetAudience";

const PitchDetails = ({ data: propData, onUpdate, pitchId }) => {
  const {
    displayData,
    isEditing,
    setIsEditing,
    logoSvg,
    generatingLogo,
    generatingConcept,
    imageModel,
    setImageModel,
    copied,
    saveStatus,
    handleSave,
    handleGenerateLogo,
    handleDownloadSvg,
    handleCopySvg,
    // Version history
    versions,
    isLoadingVersions,
    showVersionHistory,
    setShowVersionHistory,
    handleCreateVersion,
    handleRestoreVersion
  } = usePitchDetails(propData, onUpdate, pitchId);

  if (!displayData) return null;

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800/40">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowVersionHistory(!showVersionHistory)}
            className="flex-1 sm:flex-none px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center border border-neutral-700 cursor-pointer"
            title="View Previous Versions"
          >
            <span className="mr-2">🕒</span> History ({versions.length})
          </button>
          
          <button
            onClick={handleCreateVersion}
            className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center border border-emerald-500/30 cursor-pointer"
            title="Save Current State as Snapshot"
          >
            <span className="mr-2">📸</span> Snapshot
          </button>
        </div>

        <PitchActionButtons 
          onEdit={() => setIsEditing(true)} 
          data={displayData} 
          saveStatus={saveStatus}
        />
      </div>

      {/* Version History Dropdown/Panel */}
      {showVersionHistory && (
        <div className="mb-8 p-4 bg-gray-900/50 border border-gray-800 rounded-xl animate-fade-in">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <span>Version History</span>
            {isLoadingVersions && <div className="ml-3 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          </h3>
          
          {versions.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No previous versions saved yet. Click 'Snapshot' to save the current state.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {versions.map((v, i) => (
                <div 
                  key={v.id} 
                  className="p-3 bg-gray-800/40 border border-gray-700/50 rounded-lg hover:border-blue-500/50 transition-all group cursor-pointer"
                  onClick={() => handleRestoreVersion(v)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Version {versions.length - i}</span>
                    <span className="text-[10px] text-gray-500">{new Date(v.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2 italic mb-3">
                    "{v.generated_data.elevator_pitch?.substring(0, 80)}..."
                  </p>
                  <button className="w-full py-1.5 text-[11px] font-bold bg-blue-600/20 text-blue-400 rounded group-hover:bg-blue-600 group-hover:text-white transition-all">
                    Restore this Version
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <PitchEditor 
        data={displayData}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      />

      <div id="pitch-content" className="space-y-8 animate-fade-in-up">
        <PitchHeader data={displayData} />
        
        <PitchProblemSolution data={displayData} />
        
        <PitchUniqueValue data={displayData} />
        
        <PitchBrandIdentity 
          data={displayData}
          logoSvg={logoSvg}
          generatingLogo={generatingLogo}
          generatingConcept={generatingConcept}
          onGenerateLogo={handleGenerateLogo}
          imageModel={imageModel}
          onModelSelect={setImageModel}
          onDownload={handleDownloadSvg}
          onCopy={handleCopySvg}
          copied={copied}
        />
        
        <PitchTargetAudience data={displayData} />
      </div>

      <style>{`
        .logo-preview-container svg {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </>
  );
};

export default PitchDetails;
