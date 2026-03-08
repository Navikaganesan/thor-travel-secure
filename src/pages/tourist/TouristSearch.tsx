import { useState } from "react";
import { Search, Star, MapPin, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TouristBottomNav from "@/components/tourist/TouristBottomNav";
import thorLogo from "@/assets/thor-logo.png";
import destParis from "@/assets/dest-paris.jpg";
import destKerala from "@/assets/dest-kerala.jpg";
import destTajmahal from "@/assets/dest-tajmahal.jpg";
import destTokyo from "@/assets/dest-tokyo.jpg";
import destRome from "@/assets/dest-rome.jpg";
import destBali from "@/assets/dest-bali.jpg";
import destCoimbatore from "@/assets/dest-coimbatore.jpg";

const suggestions = [
  { name: "Paris", country: "France" },
  { name: "Kerala Backwaters", country: "India" },
  { name: "Coimbatore", country: "India" },
  { name: "Taj Mahal", country: "India" },
  { name: "Tokyo", country: "Japan" },
  { name: "Rome", country: "Italy" },
  { name: "Bali", country: "Indonesia" },
];

const destinations = [
  { name: "Paris", image: destParis, rating: 4.8, country: "France" },
  { name: "Kerala Backwaters", image: destKerala, rating: 4.7, country: "India" },
  { name: "Taj Mahal", image: destTajmahal, rating: 4.9, country: "India" },
  { name: "Tokyo", image: destTokyo, rating: 4.7, country: "Japan" },
  { name: "Rome", image: destRome, rating: 4.6, country: "Italy" },
  { name: "Bali", image: destBali, rating: 4.8, country: "Indonesia" },
  { name: "Coimbatore", image: destCoimbatore, rating: 4.3, country: "India" },
];

const TouristSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const filtered = query
    ? suggestions.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="mobile-frame bg-background pb-20">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-5">
          <img src={thorLogo} alt="THOR" className="w-8 h-8" />
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">THOR</h1>
            <p className="text-[11px] text-muted-foreground">Guard of Tourism</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Where do you want to travel?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        {/* Autocomplete */}
        {filtered.length > 0 && (
          <div className="mt-2 bg-card border border-border rounded-xl overflow-hidden shadow-lg">
            {filtered.map((s) => (
              <button
                key={s.name}
                onClick={() => {
                  setQuery(s.name);
                  navigate("/tourist/navigate");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition text-left"
              >
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.country}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular Destinations */}
      <div className="px-5 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-accent" />
          <h2 className="text-base font-semibold text-foreground">Popular Destinations</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {destinations.map((dest) => (
            <button
              key={dest.name}
              onClick={() => navigate("/tourist/navigate")}
              className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/20 transition group"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-foreground truncate">{dest.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{dest.country}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    <span className="text-xs font-medium text-foreground">{dest.rating}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <TouristBottomNav />
    </div>
  );
};

export default TouristSearch;
