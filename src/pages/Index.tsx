import { Shield, Map, Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import thorLogo from "@/assets/thor-logo.png";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center mb-12">
        <img src={thorLogo} alt="THOR Logo" className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">THOR</h1>
        <p className="text-sm font-medium text-muted-foreground mt-1 tracking-wide uppercase">
          Tourism Helper & Organizer with Risk Guard
        </p>
        <p className="text-lg text-accent font-semibold mt-2">Guard of Tourism</p>
      </div>

      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Tourist Mode */}
        <button
          onClick={() => navigate("/tourist")}
          className="group bg-card rounded-2xl p-8 text-left thor-shadow hover:thor-shadow-lg transition-all duration-300 border border-border hover:border-primary/30"
        >
          <div className="w-14 h-14 rounded-xl thor-gradient flex items-center justify-center mb-5">
            <Map className="w-7 h-7 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Tourist Mode</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            For travelers who want safe navigation, travel assistance, and emergency protection.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
            Enter <ArrowRight className="w-4 h-4" />
          </span>
        </button>

        {/* Enterprise Mode */}
        <button
          onClick={() => navigate("/enterprise")}
          className="group bg-card rounded-2xl p-8 text-left thor-shadow hover:thor-shadow-lg transition-all duration-300 border border-border hover:border-accent/30"
        >
          <div className="w-14 h-14 rounded-xl thor-gradient-gold flex items-center justify-center mb-5">
            <Building2 className="w-7 h-7 text-accent-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Enterprise Mode</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            For tour operators, safety authorities, and administrators monitoring traveler safety.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
            Enter <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-12">
        © 2026 THOR Platform · Global Tourism Safety
      </p>
    </div>
  );
};

export default Index;
