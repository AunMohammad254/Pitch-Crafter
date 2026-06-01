import { useState, useRef, useEffect } from "react";
import { GeminiAPIManager } from "../utils/geminiApi";
import { generatePitchFeedback } from "../utils/prompts";

export function usePracticeSession(pitch) {
    const [practiceMode, setPracticeMode] = useState("record"); 
    const [isRecording, setIsRecording] = useState(false);
    const [pitchText, setPitchText] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [queueStatus, setQueueStatus] = useState(null);
    const [error, setError] = useState("");
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    const recognitionRef = useRef(null);
    const finalTranscriptRef = useRef("");
    const initialTextRef = useRef("");
    const apiManager = useRef(new GeminiAPIManager());
    const abortControllerRef = useRef(null);

    const data = pitch?.generated_data;

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    // Ignore already stopped
                }
            }
        };
    }, []);

    useEffect(() => {
        if (!pitch?.id) return;
        try {
            const saved = localStorage.getItem(`pitch_history_${pitch.id}`);
            if (saved) {
                setHistory(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }
    }, [pitch?.id]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                setIsRecording(true);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };

            recognitionRef.current.onresult = (event) => {
                let finalTrans = "";
                let interimTrans = "";
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTrans += event.results[i][0].transcript + " ";
                    } else {
                        interimTrans += event.results[i][0].transcript;
                    }
                }
                if (finalTrans) {
                    finalTranscriptRef.current += finalTrans;
                }
                const updatedText = initialTextRef.current + finalTranscriptRef.current + interimTrans;
                setPitchText(updatedText);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed') {
                    setError("Microphone access denied. Please enable permission or type/paste your pitch.");
                } else {
                    setError(`Recording error: ${event.error}. You can type or edit your pitch directly.`);
                }
            };
        } else {
            console.log("Speech recognition not supported in this browser.");
        }
    }, []);

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            setError("Speech recognition is not supported in this browser. You can type/paste your pitch directly.");
            return;
        }
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            finalTranscriptRef.current = "";
            initialTextRef.current = pitchText ? pitchText.trim() + " " : "";
            setAnalysis(null);
            setError("");
            try {
                recognitionRef.current.start();
            } catch (err) {
                console.error("Failed to start speech recognition:", err);
                setError("Failed to start recording. Please try typing your pitch.");
            }
        }
    };

    const analyzePitch = async () => {
        if (!pitchText.trim() || !data) return;
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        
        setLoading(true);
        setError("");

        try {
            const prompt = generatePitchFeedback(data, pitchText);

            const text = await apiManager.current.makeRequest(
                { contents: [{ parts: [{ text: prompt }] }] },
                "auto",
                0,
                setQueueStatus,
                abortControllerRef.current.signal
            );

            if (text) {
                const parsedData = apiManager.current.extractAndParseJSON(text);
                setAnalysis(parsedData);

                const newAttempt = {
                    id: Date.now(),
                    date: new Date().toISOString(),
                    score: parsedData.score,
                    pacing: parsedData.pacing,
                    feedback_summary: parsedData.positive_feedback
                };

                const updatedHistory = [newAttempt, ...history];
                setHistory(updatedHistory);
                localStorage.setItem(`pitch_history_${pitch.id}`, JSON.stringify(updatedHistory));
            }
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error("Analysis failed:", err);
            setError("Failed to analyze pitch. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        practiceMode,
        setPracticeMode,
        isRecording,
        pitchText,
        setPitchText,
        transcript: pitchText, // fallback for legacy components
        textTranscript: pitchText, // fallback for legacy components
        setTextTranscript: setPitchText, // fallback for legacy components
        analysis,
        loading,
        queueStatus,
        error,
        history,
        showHistory,
        setShowHistory,
        toggleRecording,
        analyzePitch
    };
}
