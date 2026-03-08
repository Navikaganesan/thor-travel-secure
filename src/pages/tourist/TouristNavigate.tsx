import { useState } from "react";
import { ArrowLeft, Shield, Clock, Navigation, Star, AlertTriangle, MapPin, Zap, ShieldCheck, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TouristBottomNav from "@/components/tourist/TouristBottomNav";
import destParis from "@/assets/dest-paris.jpg";
import destRome from "@/assets/dest-rome.jpg";
import destTokyo from "@/assets/dest-tokyo.jpg";

const nearbySpots = [
  { name: "Eiffel Tower", distance: "1.2 km", rating: 4.9, image: destParis },
  { name: "Colosseum", distance: "3.5 km", rating: 4.8, image: destRome },
  { name: "Shibuya Crossing", distance: "5.1 km", rating: 4.6, image: destTokyo },
];

const routes = [
  {
    id: "fastest",
    name: "Fastest Route",
    time: "24 min",
    distance: "8.3 km",
    safety: 82,
    tag: "Fastest",
    icon: Zap,
    path: "M 50 240 L 90 200 L 160 180 L 240 120 L 300 80 L 340 60",
    color: "hsl(215 70% 28%)",
  },
  {
    id: "safest",
    name: "Safest Route",
    time: "31 min",
    distance: "9.7 km",
    safety: 96,
    tag: "Recommended",
    icon: ShieldCheck,
    path: "M 50 240 L 50 190 L 80 160 L 140 150 L 180 130 L 220 100 L 280 80 L 340 60",
    color: "hsl(142 60% 38%)",
  },
  {
    id: "balanced",
    name: "Balanced Route",
    time: "28 min",
    distance: "9.1 km",
    safety: 88,
    tag: "Balanced",
    icon: Scale,
    path: "M 50 240 L 80 210 L 120 190 L 180 160 L 230 110 L 290 75 L 340 60",
    color: "hsl(38 92% 50%)",
  },
];

const TouristNavigate = () => {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState("safest");

  const active = routes.find((r) => r.id === selectedRoute)!;

  return (
    <div className="mobile-frame bg-background pb-20 relative">
      {/* Top Bar */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <button onClick={() => navigate("/tourist")} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Paris, France</p>
          <p className="text-xs text-muted-foreground">Destination selected</p>
        </div>
        <div className="flex items-center gap-1.5 bg-safe/10 px-2.5 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5 text-safe" />
          <span className="text-xs font-semibold text-safe">Safe</span>
        </div>
      </div>

      {/* Route selector tabs */}
      <div className="px-3 py-2 bg-card border-b border-border flex gap-2">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = selectedRoute === route.id;
          return (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {route.tag}
            </button>
          );
        })}
      </div>

      {/* Map Area */}
      <div className="relative h-72 bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10" />
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Grid lines */}
          {[0,1,2,3,4,5,6,7].map(i => (
            <line key={`h${i}`} x1="0" y1={i*40} x2="400" y2={i*40} stroke="hsl(214 20% 88%)" strokeWidth="0.5" />
          ))}
          {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
            <line key={`v${i}`} x1={i*40} y1="0" x2={i*40} y2="280" stroke="hsl(214 20% 88%)" strokeWidth="0.5" />
          ))}
          {/* Roads */}
          <path d="M 50 240 L 50 140 L 180 140 L 180 60 L 340 60" stroke="hsl(215 15% 82%)" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 50 240 L 50 190 L 80 160 L 140 150 L 180 130 L 220 100 L 280 80 L 340 60" stroke="hsl(215 15% 82%)" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 50 240 L 80 210 L 120 190 L 180 160 L 230 110 L 290 75 L 340 60" stroke="hsl(215 15% 82%)" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Inactive route lines (dimmed) */}
          {routes.filter(r => r.id !== selectedRoute).map(route => (
            <path key={route.id} d={route.path} stroke={route.color} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" />
          ))}

          {/* Active route line */}
          <path d={active.path} stroke={active.color} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 5">
            <animate attributeName="stroke-dashoffset" from="30" to="0" dur="1.5s" repeatCount="indefinite" />
          </path>

          {/* Safe zone indicators */}
          {selectedRoute === "safest" && (
            <>
              <circle cx="140" cy="150" r="22" fill="hsl(142 60% 42%)" opacity="0.1" stroke="hsl(142 60% 42%)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="220" cy="100" r="18" fill="hsl(142 60% 42%)" opacity="0.1" stroke="hsl(142 60% 42%)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="280" cy="80" r="20" fill="hsl(142 60% 42%)" opacity="0.1" stroke="hsl(142 60% 42%)" strokeWidth="1" strokeDasharray="3 3" />
            </>
          )}

          {/* Current location */}
          <circle cx="50" cy="240" r="12" fill={active.color} opacity="0.15" />
          <circle cx="50" cy="240" r="7" fill={active.color} />
          <circle cx="50" cy="240" r="3" fill="white" />

          {/* Destination */}
          <g transform="translate(340, 45)">
            <path d="M 0 15 L -8 -5 Q 0 -15 8 -5 Z" fill="hsl(0 72% 51%)" />
            <circle cx="0" cy="-5" r="4" fill="white" />
          </g>
        </svg>

        {/* Safety alert overlay */}
        <div className="absolute top-3 left-3 right-3">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm border border-border">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
            <p className="text-xs text-foreground">Local protest reported nearby. Safer route available.</p>
          </div>
        </div>

        {/* ETA overlay */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-bold text-foreground">{active.time}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <span className="text-xs text-muted-foreground">{active.distance}</span>
              <div className="w-px h-4 bg-border" />
              <span className={`text-xs font-bold ${active.safety >= 90 ? "text-safe" : active.safety >= 80 ? "text-warning" : "text-destructive"}`}>
                {active.safety}% safe
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Details Card */}
      <div className="px-4 py-3">
        <div className="bg-card rounded-xl border border-border p-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              selectedRoute === "safest" ? "bg-safe/15" : selectedRoute === "fastest" ? "thor-gradient" : "bg-accent/15"
            }`}>
              <active.icon className={`w-5 h-5 ${
                selectedRoute === "safest" ? "text-safe" : selectedRoute === "fastest" ? "text-primary-foreground" : "text-accent-foreground"
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{active.name}</p>
                <span className="text-[10px] font-semibold text-primary-foreground bg-primary px-1.5 py-0.5 rounded">
                  {active.tag}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {active.time}
                </span>
                <span className="text-xs text-muted-foreground">{active.distance}</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${
                active.safety >= 90 ? "text-safe" : active.safety >= 80 ? "text-warning" : "text-destructive"
              }`}>
                {active.safety}%
              </div>
              <p className="text-[10px] text-muted-foreground">Safety</p>
            </div>
          </div>
          {selectedRoute === "safest" && (
            <div className="mt-2 pt-2 border-t border-border flex flex-wrap gap-1.5">
              {["Well-lit streets", "Populated areas", "Safe zones"].map(tag => (
                <span key={tag} className="text-[10px] bg-safe/10 text-safe font-medium px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nearby Attractions */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Nearby Attractions</h3>
          <button className="text-xs text-primary font-medium">See all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {nearbySpots.map((spot) => (
            <div
              key={spot.name}
              className="bg-card rounded-xl border border-border overflow-hidden min-w-[160px] shrink-0"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium text-foreground truncate">{spot.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" /> {spot.distance}
                  </span>
                  <span className="text-[10px] font-medium text-foreground flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-accent text-accent" /> {spot.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TouristBottomNav />
    </div>
  );
};

export default TouristNavigate;
