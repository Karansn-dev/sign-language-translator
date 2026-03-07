import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Mic, MicOff, Play, Pause, SkipBack, SkipForward,
  Share2, Download, AlertCircle, Hand,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SignWord {
  word: string;
  chars: string[]; // individual A-Z / 1-9 characters
}

export default function SpeechToSignPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState<"en-IN" | "hi-IN">("en-IN");
  const [words, setWords] = useState<SignWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([1]);
  const [slowMode, setSlowMode] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const recognitionRef = useRef<any>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const processTranscript = useCallback((text: string) => {
    const rawWords = text.split(/\s+/).filter(Boolean);
    const result: SignWord[] = [];
    for (const w of rawWords) {
      const chars: string[] = [];
      for (const ch of w) {
        const upper = ch.toUpperCase();
        if (/[A-Z1-9]/.test(upper)) chars.push(upper);
      }
      if (chars.length > 0) result.push({ word: w, chars });
    }
    setWords(result);
    setCurrentWordIndex(0);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
      processTranscript(finalTranscript);
    };

    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        setPermissionDenied(true);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
      setPermissionDenied(false);
    } catch {
      setPermissionDenied(true);
    }
  }, [language, processTranscript]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // Auto-play words
  useEffect(() => {
    if (isPlaying && words.length > 0) {
      const interval = (slowMode ? 3000 : 1500) / speed[0];
      playIntervalRef.current = setInterval(() => {
        setCurrentWordIndex((prev) => {
          if (prev + 1 >= words.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, interval);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, words, speed, slowMode]);

  const currentWord = words[currentWordIndex];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
              Talk with Deaf
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Speak naturally and see the corresponding Indian Sign Language gestures in real time.
            </p>
          </div>

          {/* Permission denied banner */}
          <AnimatePresence>
            {permissionDenied && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex items-center gap-3"
              >
                <AlertCircle size={20} className="text-destructive shrink-0" />
                <p className="text-sm text-foreground">
                  Microphone access was denied. Please enable it in your browser settings to use speech recognition.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel — Speech Input */}
            <div className="rounded-2xl glass-card-static p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
                  <Mic size={18} className="text-primary" /> Speech Input
                </h2>
                {/* Language selector */}
                <div className="flex rounded-lg border border-border overflow-hidden text-sm">
                  <button
                    onClick={() => setLanguage("en-IN")}
                    className={`px-3 py-1.5 transition-colors ${language === "en-IN" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("hi-IN")}
                    className={`px-3 py-1.5 transition-colors ${language === "hi-IN" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>

              {/* Mic button */}
              <div className="flex-1 flex flex-col items-center justify-center py-8">
                <div className="relative">
                  {isListening && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20"
                        animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/10"
                        animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                      />
                    </>
                  )}
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isListening
                        ? "bg-destructive text-destructive-foreground shadow-lg scale-110"
                        : "bg-primary text-primary-foreground shadow-elegant hover:scale-105"
                    }`}
                    aria-label={isListening ? "Stop listening" : "Start listening"}
                  >
                    {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                  </button>
                </div>
                <p className="mt-6 text-sm text-muted-foreground">
                  {isListening ? "Listening… speak now" : "Tap to start speaking"}
                </p>
              </div>

              {/* Transcript */}
              <div className="rounded-xl border border-border bg-card p-4 min-h-[100px]">
                <p className="text-xs text-muted-foreground mb-2 font-display font-medium">
                  Transcript
                </p>
                {transcript ? (
                  <p className="text-sm text-foreground leading-relaxed">{transcript}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Speech transcript will appear here…
                  </p>
                )}
              </div>
            </div>

            {/* Right Panel — Sign Display */}
            <div className="rounded-2xl glass-card-static p-6 flex flex-col">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                <Hand size={18} className="text-primary" /> ISL Sign Display
              </h2>

              {/* Current word — all letters displayed at once */}
              <div className="flex-1 flex items-center justify-center py-8">
                <AnimatePresence mode="wait">
                  {currentWord ? (
                    <motion.div
                      key={currentWordIndex}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <p className="font-display font-bold text-2xl text-foreground uppercase tracking-wide mb-4">
                        {currentWord.word}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        {currentWord.chars.map((ch, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                              <img
                                src={`/api/signs/${ch}`}
                                alt={`Sign for ${ch}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            </div>
                            <span className="text-xs font-bold text-muted-foreground mt-1">{ch}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Word {currentWordIndex + 1} / {words.length}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <div className="w-48 h-48 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                        <Hand size={48} className="text-muted-foreground/40" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Hand gesture images will appear here when you speak
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Playback controls */}
              {words.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentWordIndex((p) => Math.max(0, p - 1))}
                      aria-label="Previous word"
                    >
                      <SkipBack size={16} />
                    </Button>
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() => setIsPlaying(!isPlaying)}
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentWordIndex((p) => Math.min(words.length - 1, p + 1))}
                      aria-label="Next word"
                    >
                      <SkipForward size={16} />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-display w-12">Speed</span>
                    <Slider
                      value={speed}
                      onValueChange={setSpeed}
                      min={0.5}
                      max={2}
                      step={0.25}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-8 text-right">{speed[0]}x</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-display">Slow Mode</span>
                    <Switch checked={slowMode} onCheckedChange={setSlowMode} aria-label="Toggle slow mode" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Word display strip */}
          {words.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl glass-card-static p-6"
            >
              <h3 className="font-display font-semibold text-sm text-muted-foreground mb-3">
                Words — click a word to see its sign gestures
              </h3>
              <div className="flex flex-wrap gap-2">
                {words.map((w, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentWordIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                      idx === currentWordIndex
                        ? "bg-primary text-primary-foreground shadow-elegant"
                        : "bg-muted text-foreground hover:bg-primary/10"
                    }`}
                  >
                    {w.word}
                  </button>
                ))}
              </div>

              {/* Export buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                  const blob = new Blob([transcript], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "ishara-translation.txt";
                  a.click();
                  URL.revokeObjectURL(url);
                }}>
                  <Download size={14} /> Save Translation
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}>
                  <Share2 size={14} /> Share Link
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
