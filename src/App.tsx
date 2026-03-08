import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TouristSearch from "./pages/tourist/TouristSearch";
import TouristNavigate from "./pages/tourist/TouristNavigate";
import TouristSOS from "./pages/tourist/TouristSOS";
import TouristAssistant from "./pages/tourist/TouristAssistant";
import TouristCompanion from "./pages/tourist/TouristCompanion";
import EnterpriseDashboard from "./pages/enterprise/EnterpriseDashboard";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tourist" element={<TouristSearch />} />
            <Route path="/tourist/navigate" element={<TouristNavigate />} />
            <Route path="/tourist/sos" element={<TouristSOS />} />
            <Route path="/tourist/assistant" element={<TouristAssistant />} />
            <Route path="/tourist/companion" element={<TouristCompanion />} />
            <Route path="/enterprise" element={<EnterpriseDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
