import React from "react";
import PitchEditor from "./PitchEditor";
import { usePitchDetails } from "../../hooks/usePitchDetails";
import { PitchActionButtons, PitchHeader } from "./details/PitchHeader";
import { PitchProblemSolution, PitchUniqueValue } from "./details/PitchProblemSolution";
import { PitchBrandIdentity } from "./details/PitchBrandIdentity";
import { PitchTargetAudience } from "./details/PitchTargetAudience";

const PitchDetails = ({ data: propData, onUpdate }) => {
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
    handleCopySvg
  } = usePitchDetails(propData, onUpdate);

  if (!displayData) return null;

  return (
    <>
      <PitchActionButtons 
        onEdit={() => setIsEditing(true)} 
        data={displayData} 
        saveStatus={saveStatus}
      />

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
