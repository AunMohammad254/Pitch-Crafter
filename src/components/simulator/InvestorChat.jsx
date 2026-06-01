import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GeminiAPIManager } from "../../utils/geminiApi";
import { generateInvestorPrompt } from "../../utils/prompts";
import { useUIStore } from "../../stores/uiStore";

export default function InvestorChat({ pitch }) {
    const { setCurrentView } = useUIStore();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [queueStatus, setQueueStatus] = useState(null);
    const messagesEndRef = useRef(null);
    const apiManager = useRef(new GeminiAPIManager());
    const abortControllerRef = useRef(null);

    // Gamified Simulation Stats
    const [interestLevel, setInterestLevel] = useState(50);
    const [tension, setTension] = useState("Medium");
    const [fundingProgress, setFundingProgress] = useState(0);
    const [feedbackTip, setFeedbackTip] = useState("Explain the core problem you are solving and why it is a big opportunity.");

    // Dynamic stats recalculation based on text analysis
    const recalculateStats = (currentMessages) => {
        const cleanMessages = currentMessages.filter(m => m.sender !== "system");
        let newInterest = 50;
        
        cleanMessages.forEach(m => {
            if (m.sender === "user") {
                const uText = m.text.toLowerCase();
                const positiveKeywords = ["revenue", "profit", "margin", "growth", "scale", "traction", "patent", "proprietary", "technology", "customers", "recurring", "ltv", "cac", "valuable", "validated", "market"];
                const negativeKeywords = ["unsure", "maybe", "don't know", "hope", "wish", "probably", "guess", "assume"];
                
                let positiveCount = positiveKeywords.filter(k => uText.includes(k)).length;
                let negativeCount = negativeKeywords.filter(k => uText.includes(k)).length;
                
                newInterest += positiveCount * 5;
                newInterest -= negativeCount * 5;
                
                if (uText.length < 30) {
                    newInterest -= 4;
                } else if (uText.length > 100) {
                    newInterest += 3;
                }
            } else if (m.sender === "shark") {
                const sText = m.text.toLowerCase();
                const positiveVC = ["impressed", "good", "strong", "makes sense", "interesting", "tell me more", "revenue is good", "like the market", "viable", "scalable"];
                const negativeVC = ["skeptical", "hard to believe", "doubt", "unrealistic", "concerning", "risk", "wishful thinking", "laws of physics", "hole", "weak", "flaw", "intimidated"];
                
                let positiveCount = positiveVC.filter(k => sText.includes(k)).length;
                let negativeCount = negativeVC.filter(k => sText.includes(k)).length;
                
                newInterest += positiveCount * 6;
                newInterest -= negativeCount * 5;
            }
        });
        
        newInterest = Math.max(10, Math.min(100, newInterest));
        setInterestLevel(newInterest);
        
        let newTension = "Medium";
        if (newInterest < 35) {
            newTension = "High";
        } else if (newInterest > 75) {
            newTension = "Low";
        }
        if (cleanMessages.length > 5) {
            newTension = newInterest < 50 ? "Critical" : "High";
        }
        setTension(newTension);
        
        const turnCount = cleanMessages.filter(m => m.sender === "user").length;
        let progress = Math.round((newInterest * 0.7) + (turnCount * 4));
        progress = Math.max(0, Math.min(newInterest > 40 ? 95 : 40, progress));
        if (turnCount >= 4 && newInterest > 70) {
            progress = 100; // Deal secured!
        }
        setFundingProgress(progress);
        
        // Provide tips
        if (newInterest < 40) {
            setFeedbackTip("💡 Pro-Tip: Marcus is losing interest. Share concrete numbers (e.g., margins, growth rate, or customer size).");
        } else if (newTension === "Critical" || newTension === "High") {
            setFeedbackTip("💡 Pro-Tip: Pressure is intense! Address his doubts directly with facts. Don't be defensive.");
        } else if (progress > 80) {
            setFeedbackTip("💡 Pro-Tip: Marcus is hooked! Ask for the investment or summarize the deal terms.");
        } else {
            setFeedbackTip("💡 Pro-Tip: Great progress. Keep defending your business model and customer acquisition plan.");
        }
    };

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const startSimulation = async () => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        
        setLoading(true);
        setMessages([]);
        setInterestLevel(50);
        setTension("Medium");
        setFundingProgress(0);
        setFeedbackTip("Marcus is ready. Pitch your startup vision clearly.");
        try {
            const prompt = generateInvestorPrompt(pitch.generated_data);

            const response = await apiManager.current.makeRequest(
                { contents: [{ parts: [{ text: prompt }] }] },
                "auto",
                0,
                setQueueStatus,
                abortControllerRef.current.signal
            );

            if (response) {
                const sharkMessage = typeof response === "string" ? response : response.candidates?.[0]?.content?.parts?.[0]?.text || "";
                const newMsg = {
                    id: Date.now(),
                    sender: "shark",
                    text: sharkMessage,
                    timestamp: new Date()
                };
                setMessages([newMsg]);
                recalculateStats([newMsg]);
            }
        } catch (error) {
            if (error.name === 'AbortError') return;
            console.error("Failed to start simulation:", error);
            setMessages([{
                id: Date.now(),
                sender: "system",
                text: "⚠️ Connection to the Tank lost. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    // Initial Shark Greeting
    useEffect(() => {
        startSimulation();
    }, [pitch]);

    const handleRetrySendMessage = async () => {
        const userMessages = messages.filter(m => m.sender === "user");
        if (userMessages.length === 0) {
            startSimulation();
            return;
        }

        const lastUserMsg = userMessages[userMessages.length - 1];
        const cleanHistory = messages.filter(m => m.sender !== "system");
        setMessages(cleanHistory);
        recalculateStats(cleanHistory);
        setLoading(true);

        try {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            abortControllerRef.current = new AbortController();

            const chatHistory = cleanHistory.map(m =>
                `${m.sender === "shark" ? "Shark" : "Founder"}: ${m.text}`
            ).join("\n");

            const nextPrompt = `
      CONTEXT:
      ${chatHistory}
      
      Founder just said: "${lastUserMsg.text}"

      Respond as the skeptical Shark named Marcus. Keep it short, tough, and ask another question.
      `;

            const responseText = await apiManager.current.makeRequest(
                { contents: [{ parts: [{ text: nextPrompt }] }] },
                "auto",
                0,
                setQueueStatus,
                abortControllerRef.current.signal
            );

            if (responseText) {
                const newMsg = {
                    id: Date.now(),
                    sender: "shark",
                    text: responseText,
                    timestamp: new Date()
                };
                const updated = [...cleanHistory, newMsg];
                setMessages(updated);
                recalculateStats(updated);
            }
        } catch (error) {
            if (error.name === 'AbortError') return;
            console.error("Error getting response on retry:", error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: "system",
                text: "⚠️ Connection to the Tank lost. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        const userMessages = messages.filter(m => m.sender === "user");
        if (userMessages.length === 0) {
            startSimulation();
        } else {
            handleRetrySendMessage();
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || loading) return;

        const userMsg = {
            id: Date.now(),
            sender: "user",
            text: inputText,
            timestamp: new Date()
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        recalculateStats(updatedMessages);
        setInputText("");
        setLoading(true);

        try {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            abortControllerRef.current = new AbortController();

            const chatHistory = updatedMessages.map(m =>
                `${m.sender === "shark" ? "Shark" : "Founder"}: ${m.text}`
            ).join("\n");

            const nextPrompt = `
      CONTEXT:
      ${chatHistory}
      
      Founder just said: "${userMsg.text}"

      Respond as the skeptical Shark named Marcus. Keep it short, tough, and ask another question.
      `;

            const responseText = await apiManager.current.makeRequest(
                { contents: [{ parts: [{ text: nextPrompt }] }] },
                "auto",
                0,
                setQueueStatus,
                abortControllerRef.current.signal
            );

            if (responseText) {
                const sharkMsg = {
                    id: Date.now() + 1,
                    sender: "shark",
                    text: responseText,
                    timestamp: new Date()
                };
                const finalMessages = [...updatedMessages, sharkMsg];
                setMessages(finalMessages);
                recalculateStats(finalMessages);
            }
        } catch (error) {
            if (error.name === 'AbortError') return;
            console.error("Error getting response:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 2,
                sender: "system",
                text: "⚠️ Connection to the Tank lost. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const isSystemErrorAtStart = messages.length === 1 && messages[0].sender === "system";

    return (
        <div className="flex flex-col h-[calc(100vh-160px)] sm:h-[calc(100vh-220px)] md:h-[calc(100vh-240px)] max-w-6xl mx-auto w-full p-2 sm:p-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-row items-center justify-between p-3 sm:p-6 mb-3 sm:mb-4 card-glass gap-2 sm:gap-4 shrink-0"
            >
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg animate-pulse shrink-0">
                        <span className="text-xl sm:text-2xl">🦈</span>
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-lg sm:text-2xl font-bold text-white font-primary truncate">The Tank</h2>
                        <p className="text-red-300 text-[10px] sm:text-sm font-medium truncate">Live simulation with Marcus</p>
                    </div>
                </div>
                <button
                    onClick={() => setCurrentView('my-pitches')}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors font-medium text-xs sm:text-sm border border-neutral-700 cursor-pointer shrink-0"
                >
                    Exit Simulation
                </button>
            </motion.div>

            {/* Mobile Stats Bar (only visible on mobile, lg:hidden) */}
            {!isSystemErrorAtStart && (
                <div className="lg:hidden grid grid-cols-3 gap-2.5 p-3 card-glass mb-3 rounded-xl border border-neutral-800/60 shrink-0 text-center">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Interest</span>
                        <span className={`text-sm font-bold mt-0.5 ${interestLevel > 70 ? 'text-green-400' : interestLevel > 40 ? 'text-yellow-400' : 'text-red-500'}`}>{interestLevel}%</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-neutral-800/60">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Tension</span>
                        <span className={`text-sm font-bold mt-0.5 ${tension === 'Critical' ? 'text-red-500 animate-pulse' : tension === 'High' ? 'text-orange-400' : tension === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>{tension}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Deal</span>
                        <span className="text-sm font-bold mt-0.5 text-indigo-400">{fundingProgress}%</span>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                {/* Left Side Panel - Desktop Only (hidden on mobile) */}
                {!isSystemErrorAtStart && (
                    <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 min-h-0 bg-neutral-900/40 border border-neutral-800/80 p-5 rounded-2xl backdrop-blur-md">
                        <div className="text-center pb-4 border-b border-neutral-800">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-red-950/40 relative">
                                <span className="text-3xl">🦈</span>
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-neutral-950 rounded-full animate-pulse"></span>
                            </div>
                            <h3 className="text-lg font-bold text-white mt-3 font-primary">Marcus</h3>
                            <p className="text-[10px] text-red-400 font-semibold tracking-wider uppercase mt-0.5">Lead VC Shark</p>
                        </div>

                        <div className="flex-1 flex flex-col justify-around py-2 gap-4">
                            {/* Metric: Interest Level */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-neutral-400 font-medium">Interest Level</span>
                                    <span className={`font-bold ${interestLevel > 70 ? 'text-green-400' : interestLevel > 40 ? 'text-yellow-400' : 'text-red-500'}`}>{interestLevel}%</span>
                                </div>
                                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-500 rounded-full ${interestLevel > 70 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : interestLevel > 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-red-600 to-red-400'}`}
                                        style={{ width: `${interestLevel}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Metric: Tension Level */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-neutral-400 font-medium">Tension Level</span>
                                    <span className={`font-bold uppercase tracking-wide text-[10px] ${tension === 'Critical' ? 'text-red-500 animate-pulse' : tension === 'High' ? 'text-orange-400' : tension === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>{tension}</span>
                                </div>
                                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-500 rounded-full ${tension === 'Critical' ? 'bg-red-600 animate-pulse' : tension === 'High' ? 'bg-orange-500' : tension === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                                        style={{ width: tension === 'Critical' ? '100%' : tension === 'High' ? '75%' : tension === 'Medium' ? '50%' : '25%' }}
                                    ></div>
                                </div>
                            </div>

                            {/* Metric: Funding Progress */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-neutral-400 font-medium">Deal Progress</span>
                                    <span className="text-indigo-400 font-bold">{fundingProgress}%</span>
                                </div>
                                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-500 rounded-full"
                                        style={{ width: `${fundingProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto bg-neutral-950/40 border border-neutral-800/80 p-3 rounded-xl min-h-[70px] flex items-center">
                            <p className="text-xs text-neutral-300 leading-relaxed italic">{feedbackTip}</p>
                        </div>
                    </div>
                )}

                {/* Right Side - Chat Interface */}
                <div className={`flex flex-col min-h-0 h-full card-glass p-3 sm:p-4 rounded-2xl border border-neutral-800/60 ${isSystemErrorAtStart ? 'lg:col-span-12' : 'lg:col-span-8'}`}>
                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto mb-3 pr-1 custom-scrollbar space-y-3">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] sm:max-w-[75%] p-3 sm:p-4 rounded-2xl shadow-lg relative ${
                                        msg.sender === "user"
                                            ? "bg-primary-600 text-white rounded-br-none bg-gradient-to-r from-primary-600 to-indigo-600 shadow-indigo-500/10"
                                            : msg.sender === "system"
                                            ? "bg-red-950/40 text-red-200 rounded-bl-none border border-red-900/40 w-full sm:w-auto"
                                            : "bg-neutral-800/85 text-neutral-100 rounded-bl-none border border-neutral-700/60 shadow-black/20 hover:border-red-500/30 transition-all"
                                    }`}
                                >
                                    {msg.sender === "shark" && (
                                        <div className="text-[9px] font-bold text-red-400 mb-1 tracking-wider uppercase flex items-center gap-1">
                                            <span>🦈</span> MARCUS
                                        </div>
                                    )}
                                    {msg.sender === "system" && (
                                        <div className="text-[9px] font-bold text-red-400 mb-1 tracking-wider">SYSTEM ERROR</div>
                                    )}
                                    <p className="leading-relaxed whitespace-pre-wrap text-xs sm:text-sm">{msg.text}</p>
                                    
                                    {msg.sender === "system" && (
                                        <div className="mt-3">
                                            <button
                                                onClick={handleRetry}
                                                disabled={loading}
                                                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg text-[10px] sm:text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-red-600/20 active:scale-95"
                                            >
                                                <span>🔄</span> Try Again
                                            </button>
                                        </div>
                                    )}

                                    <div className={`text-[9px] mt-2 opacity-50 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-neutral-800/50 p-3 rounded-2xl rounded-bl-none flex space-x-2 items-center">
                                    {queueStatus ? (
                                        <span className="text-xs text-neutral-400 font-mono animate-pulse">{queueStatus}</span>
                                    ) : (
                                        <>
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-100"></span>
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-200"></span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Cheat Sheet Quick Actions */}
                    {!isSystemErrorAtStart && (
                        <div className="flex flex-wrap gap-1 mb-2.5 px-0.5">
                            {[
                                { icon: "📊", label: "Financials", text: "Our financial projections show we will reach profitability in " },
                                { icon: "🛡️", label: "Moat", text: "Our defensive moat is based on " },
                                { icon: "📈", label: "Scaling", text: "To scale customer acquisition, we plan to " },
                                { icon: "👥", label: "Team", text: "Our founding team is uniquely qualified because " }
                            ].map((btn) => (
                                <button
                                    key={btn.label}
                                    type="button"
                                    onClick={() => {
                                        setInputText(prev => prev ? `${prev} ${btn.text}` : btn.text);
                                    }}
                                    className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-semibold bg-neutral-850 hover:bg-neutral-750 text-neutral-300 hover:text-white border border-neutral-700/60 hover:border-neutral-600 transition-all cursor-pointer active:scale-95"
                                >
                                    <span>{btn.icon}</span>
                                    <span>{btn.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-0">
                        <form onSubmit={handleSendMessage} className="flex space-x-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={isSystemErrorAtStart ? "Click 'Try Again' to connect..." : "Type your answer..."}
                                className="flex-1 bg-black/40 border border-neutral-700/70 text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder-neutral-500 text-xs sm:text-sm"
                                disabled={loading || isSystemErrorAtStart}
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || loading || isSystemErrorAtStart}
                                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 text-xs sm:text-sm shrink-0"
                            >
                                Send ↵
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
