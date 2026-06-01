import { motion } from "framer-motion";
import { useUIStore } from "../../stores/uiStore";
import { usePracticeSession } from "../../hooks/usePracticeSession";
import PracticeSession from "./PracticeSession";
import PracticeResults from "./PracticeResults";
import PracticeHistory from "./PracticeHistory";

export default function PitchPractice({ pitch }) {
    const { setCurrentView } = useUIStore();
    
    const {
        data,
        isRecording,
        pitchText,
        setPitchText,
        analysis,
        loading,
        queueStatus,
        error,
        history,
        showHistory,
        setShowHistory,
        toggleRecording,
        analyzePitch
    } = usePracticeSession(pitch);

    if (!data) {
        return (
            <div className="flex flex-col min-h-[60vh] max-w-5xl mx-auto w-full p-4 items-center justify-center">
                <div className="text-center p-8 card-glass border-red-500/30">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Data Unavailable</h2>
                    <p className="text-neutral-300 mb-6">This pitch is missing the required data for analysis.</p>
                    <button
                        onClick={() => setCurrentView('my-pitches')}
                        className="px-6 py-3 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 font-bold transition-all"
                    >
                        Return to My Pitches
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col max-w-6xl mx-auto w-full p-2.5 sm:p-4">
            {/* Header */}
            <div className="flex flex-row items-center justify-between p-3 sm:p-6 mb-3 sm:mb-4 card-glass gap-2 sm:gap-4 shrink-0">
                <div className="min-w-0">
                    <h2 className="text-lg sm:text-2xl lg:text-3xl font-primary font-bold text-white mb-0.5 sm:mb-1 truncate">Pitch Dojo</h2>
                    <p className="text-neutral-400 text-[10px] sm:text-sm font-medium truncate">Practice & get instant AI feedback</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                    <button
                        onClick={() => setShowHistory(true)}
                        className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors font-medium text-xs sm:text-sm border border-neutral-700 flex items-center space-x-1 cursor-pointer"
                    >
                        <span>📜</span>
                        <span className="hidden xs:inline">History</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('my-pitches')}
                        className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-neutral-850 text-white hover:bg-red-950/40 hover:text-red-400 hover:border-red-500/30 transition-all font-medium text-xs sm:text-sm border border-neutral-700 cursor-pointer"
                    >
                        Exit Dojo
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full">
                <PracticeSession 
                    data={data}
                    pitchText={pitchText}
                    setPitchText={setPitchText}
                    isRecording={isRecording}
                    analysis={analysis}
                    loading={loading}
                    queueStatus={queueStatus}
                    error={error}
                    toggleRecording={toggleRecording}
                    analyzePitch={analyzePitch}
                />

                <PracticeResults analysis={analysis} />
            </div>

            <PracticeHistory 
                history={history} 
                showHistory={showHistory} 
                setShowHistory={setShowHistory} 
            />
        </div>
    );
}
