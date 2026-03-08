import { ArrowLeft, Shield, Clock, Navigation, Star, ChevronRight, AlertTriangle, MapPin } from "lucide-react";
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
  { name: "Fastest Route", time: "24 min", distance: "8.3 km", safety: 82, tag: "Fastest" },
  { name: "Safest Route", time: "31 min", distance: "9.7 km", safety: 96, tag: "Recommended" },
  { name: "Scenic Route", time: "38 min", distance: "11.2 km", safety: 88, tag: "Scenic" },
];

const TouristNavigate = () => {
  const navigate = useNavigate();

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

      {/* Map Area */}
      <div className="relative h-72 bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10" />
        {/* Simulated map with route */}
        <svg viewBox="0 0 400 280" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Grid lines */}
          {[0,1,2,3,4,5,6,7].map(i => (
            <line key={`h${i}`} x1="0" y1={i*40} x2="400" y2={i*40} stroke="hsl(214 20% 88%)" strokeWidth="0.5" />
          ))}
          {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
            <line key={`v${i}`} x1={i*40} y1="0" x2={i*40} y2="280" stroke="hsl(214 20% 88%)" strokeWidth="0.5" />
          ))}
          {/* Roads */}
          <path d="M 50 240 L 50 140 L 180 140 L 180 60 L 340 60" stroke="hsl(215 15% 75%)" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 50 240 L 120 240 L 120 180 L 260 180 L 260 100 L 340 60" stroke="hsl(215 15% 75%)" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* Route line */}
          <path d="M 50 240 L 50 140 L 180 140 L 180 60 L 340 60" stroke="hsl(215 70% 28%)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 4" />
          {/* Current location */}
          <circle cx="50" cy="240" r="10" fill="hsl(215 70% 28%)" opacity="0.2" />
          <circle cx="50" cy="240" r="6" fill="hsl(215 70% 28%)" />
          <circle cx="50" cy="240" r="3" fill="white" />
          {/* Destination */}
          <g transform="translate(340, 45)">
            <path d="M 0 15 L -8 -5 Q 0 -15 8 -5 Z" fill="hsl(0 72% 51%)" />
            <circle cx="0" cy="-5" r="4" fill="white" />
          </g>
          {/* Safe zone indicators */}
          <circle cx="150" cy="100" r="20" fill="hsl(142 60% 42%)" opacity="0.1" stroke="hsl(142 60% 42%)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="280" cy="150" r="25" fill="hsl(142 60% 42%)" opacity="0.1" stroke="hsl(142 60% 42%)" strokeWidth="1" strokeDasharray="3 3" />
        </svg>

        {/* Safety alert overlay */}
        <div className="absolute top-3 left-3 right-3">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm border border-border">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
            <p className="text-xs text-foreground">Local protest reported nearby. Safer route available.</p>
          </div>
        </div>
      </div>

      {/* Route Options */}
      <div className="px-4 py-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Route Options</h3>
        <div className="space-y-2">
          {routes.map((route, i) => (
            <button
              key={route.name}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition ${
                i === 1
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                i === 1 ? "thor-gradient" : "bg-muted"
              }`}>
                <Navigation className={`w-5 h-5 ${i === 1 ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{route.name}</p>
                  {i === 1 && (
                    <span className="text-[10px] font-semibold text-primary-foreground bg-primary px-1.5 py-0.5 rounded">
                      {route.tag}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {route.time}
                  </span>
                  <span className="text-xs text-muted-foreground">{route.distance}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${
                  route.safety >= 90 ? "text-safe" : route.safety >= 80 ? "text-warning" : "text-destructive"
                }`}>
                  {route.safety}%
                </div>
                <p className="text-[10px] text-muted-foreground">Safety</p>
              </div>
            </button>
          ))}
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
