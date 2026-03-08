import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TouristBottomNav from "@/components/tourist/TouristBottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import thorLogo from "@/assets/thor-logo.png";

const TouristSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/tourist/navigate?dest=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="mobile-frame bg-background pb-20 flex flex-col">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src={thorLogo} alt="THOR" className="w-8 h-8" />
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">THOR</h1>
              <p className="text-[11px] text-muted-foreground">Guard of Tourism</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Search */}
        <div className="flex flex-col items-center mt-16">
          <MapPin className="w-10 h-10 text-primary mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-1 text-center">Where to?</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center">Search any destination worldwide</p>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter the place you want to travel"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={!query.trim()}
            className="mt-4 w-full max-w-sm py-3 rounded-xl text-sm font-semibold transition-all bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Search & Navigate
          </button>
        </div>
      </div>

      <TouristBottomNav />
    </div>
  );
};

export default TouristSearch;
