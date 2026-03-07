import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Camera,
  CameraOff,
  MessageSquare,
  Volume2,
  Copy,
  Trash2,
  Save,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DetectionStatus = "idle" | "detecting" | "no-hand" | "buffering";
type DetectionMode = "letter" | "gesture";

export default function TranslatorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stableLabelRef = useRef<{ label: string; count: number }>({
    label: "",
    count: 0,
  });

  const [cameraOn, setCameraOn] = useState(false);
  const [status, setStatus] = useState<DetectionStatus>("idle");
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [sentence, setSentence] = useState("");
  const [mode, setMode] = useState<DetectionMode>("letter");
  const { toast } = useToast();

  // ---------- camera ----------
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      setStatus("detecting");
    } catch {
      toast({
        title: "Camera Error",
        description:
          "Unable to access camera. Please allow camera permission.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    wsRef.current?.close();
    wsRef.current = null;

    setCameraOn(false);
    setStatus("idle");
    setDetectedLabel(null);
    setConfidence(0);
    stableLabelRef.current = { label: "", count: 0 };
  }, []);

  // ---------- websocket + frame loop ----------
  useEffect(() => {
    if (!cameraOn) return;

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsPath = mode === "gesture" ? "/ws/detect-gesture" : "/ws/detect";
    const ws = new WebSocket(`${protocol}://${window.location.host}${wsPath}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as {
        hand_detected: boolean;
        label: string | null;
        confidence: number;
        buffering?: number;
        buffer_needed?: number;
      };

      if (!data.hand_detected) {
        setStatus("no-hand");
        setDetectedLabel(null);
        setConfidence(0);
        stableLabelRef.current = { label: "", count: 0 };
        return;
      }

      // LSTM buffering state
      if (data.buffering != null && data.label == null) {
        setStatus("buffering");
        setDetectedLabel(null);
        setConfidence(0);
        return;
      }

      setStatus("detecting");
      setDetectedLabel(data.label);
      setConfidence(data.confidence);

      // sentence builder
      if (mode === "gesture") {
        // For gesture mode: commit after 3 stable consecutive detections
        const prev = stableLabelRef.current;
        if (data.label && data.label === prev.label) {
          prev.count += 1;
          if (prev.count === 3) {
            setSentence((s) => {
              const words = s.trim().split(" ").filter(Boolean);
              if (words.length === 0 || words[words.length - 1] !== data.label) {
                return s ? s + " " + data.label : data.label!;
              }
              return s;
            });
          }
        } else {
          stableLabelRef.current = { label: data.label ?? "", count: 1 };
        }
      } else {
        // For letter mode: commit after 8 stable consecutive frames
        const prev = stableLabelRef.current;
        if (data.label === prev.label) {
          prev.count += 1;
          if (prev.count === 8) {
            setSentence((s) => s + data.label);
          }
        } else {
          stableLabelRef.current = { label: data.label ?? "", count: 1 };
        }
      }
    };

    ws.onopen = () => {
      // start sending frames at ~8 fps
      intervalRef.current = setInterval(() => {
        if (
          !videoRef.current ||
          !canvasRef.current ||
          ws.readyState !== WebSocket.OPEN
        )
          return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        ws.send(dataUrl);
      }, 125);
    };

    ws.onerror = () => {
      toast({
        title: "Connection Error",
        description:
          "Could not connect to backend. Make sure the server is running.",
        variant: "destructive",
      });
    };

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraOn, mode]);

  // cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  // ---------- actions ----------
  const handleSpeak = () => {
    if (!sentence) return;
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = async () => {
    if (!sentence) return;
    await navigator.clipboard.writeText(sentence);
    toast({ title: "Copied", description: "Sentence copied to clipboard." });
  };

  const handleSave = () => {
    if (!sentence) return;
    const saved: string[] = JSON.parse(
      localStorage.getItem("ishara_saved") ?? "[]"
    );
    saved.push(sentence);
    localStorage.setItem("ishara_saved", JSON.stringify(saved));
    toast({ title: "Saved", description: "Sentence saved locally." });
  };

  const handleClear = () => {
    setSentence("");
    setDetectedLabel(null);
    setConfidence(0);
    stableLabelRef.current = { label: "", count: 0 };
  };

  const handleAddSpace = () => setSentence((s) => s + " ");
  const handleBackspace = () => setSentence((s) => s.slice(0, -1));

  // ---------- mode switch ----------
  const handleModeSwitch = (newMode: DetectionMode) => {
    if (newMode === mode) return;
    stableLabelRef.current = { label: "", count: 0 };
    setDetectedLabel(null);
    setConfidence(0);
    setMode(newMode);
  };

  // ---------- status badge ----------
  const statusConfig: Record<
    DetectionStatus,
    { text: string; color: string }
  > = {
    idle: { text: "Detection: Idle", color: "text-muted-soft" },
    detecting: { text: "Detection: Active", color: "text-primary" },
    "no-hand": { text: "No Hand Detected", color: "text-amber-500" },
    buffering: { text: "Buffering frames...", color: "text-blue-500" },
  };
  const { text: statusText, color: statusColor } = statusConfig[status];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
              Sign Language Translator
            </h1>
            <p className="text-muted-foreground mb-4">
              Show signs to your camera and see real-time translations.
            </p>

            {/* Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={mode === "letter" ? "hero" : "outline"}
                size="sm"
                onClick={() => handleModeSwitch("letter")}
              >
                Letter Mode (A-Z, 1-9)
              </Button>
              <Button
                variant={mode === "gesture" ? "hero" : "outline"}
                size="sm"
                onClick={() => handleModeSwitch("gesture")}
              >
                Gesture Mode (Words)
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera Panel */}
            <div className="rounded-2xl glass-card-static overflow-hidden">
              <div className="aspect-video bg-secondary/50 flex items-center justify-center relative">
                {/* Hidden canvas for frame capture */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Video element — always mounted so the ref is available */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover ${cameraOn ? "" : "hidden"}`}
                />

                {!cameraOn && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Camera size={32} className="text-primary" />
                    </div>
                    <p className="text-muted-soft text-sm mb-4">
                      Camera access required
                    </p>
                    <Button variant="hero" size="lg" onClick={startCamera}>
                      Enable Camera
                    </Button>
                  </div>
                )}

                {/* Overlay controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span
                    className={`text-xs glass-surface px-3 py-1.5 rounded-full ${statusColor}`}
                  >
                    {statusText}
                  </span>
                  {cameraOn && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={stopCamera}
                      className="gap-1.5 glass-surface text-xs"
                    >
                      <CameraOff size={14} />
                      Stop
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Translation Output Panel */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <Link to="/speech-to-sign">
                  <Button variant="hero" size="sm" className="gap-1.5">
                    Sign to Speech
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>

              <div className="rounded-2xl glass-card-static p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={18} className="text-primary" />
                  <h2 className="font-display font-semibold text-lg text-foreground">
                    Translation Output
                  </h2>
                </div>

                {/* Confidence meter */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Confidence</span>
                    <span>
                      {confidence > 0 ? `${confidence.toFixed(1)}%` : "—"}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>

                {/* Gesture display */}
                <div className="rounded-xl bg-muted/50 p-4 mb-4 min-h-[80px] flex items-center justify-center">
                  {detectedLabel ? (
                    <span className="text-4xl font-display font-bold text-primary">
                      {detectedLabel}
                    </span>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Detected gestures will appear here...
                    </p>
                  )}
                </div>

                {/* Sentence builder */}
                <div className="flex-1 rounded-xl border border-border p-4 mb-2 min-h-[120px]">
                  {sentence ? (
                    <p className="text-foreground text-lg font-medium tracking-wider break-all">
                      {sentence}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Translated sentence will build here...
                    </p>
                  )}
                </div>

                {/* Sentence helpers */}
                <div className="flex gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddSpace}
                    className="text-xs"
                  >
                    Space
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackspace}
                    className="text-xs"
                  >
                    ← Backspace
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="hero"
                    size="sm"
                    className="gap-1.5"
                    onClick={handleSpeak}
                  >
                    <Volume2 size={14} />
                    Speak
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={handleCopy}
                  >
                    <Copy size={14} />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={handleSave}
                  >
                    <Save size={14} />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 ml-auto"
                    onClick={handleClear}
                  >
                    <Trash2 size={14} />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
