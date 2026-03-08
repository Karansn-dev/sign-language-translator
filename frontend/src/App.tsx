import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Grainient from "@/components/Grainient";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TranslatorPage from "./pages/Translator";
import LearnPage from "./pages/Learn";
import CommunityPage from "./pages/Community";
import PricingPage from "./pages/Pricing";
import AuthPage from "./pages/Auth";
import DashboardPage from "./pages/Dashboard";
import SpeechToSignPage from "./pages/SpeechToSign";
import ProfilePage from "./pages/Profile";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
      <TooltipProvider>
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <Grainient
            color1="#F2A7D8"
            color2="#4B2BD6"
            color3="#9A6BFF"
            timeSpeed={0.25}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        <div className="relative z-10">
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/translator" element={<TranslatorPage />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/speech-to-sign" element={<SpeechToSignPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
