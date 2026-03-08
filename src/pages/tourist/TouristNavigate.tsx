import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Shield, Clock, Zap, ShieldCheck, Scale, AlertTriangle, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import TouristBottomNav from "@/components/tourist/TouristBottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import destParis from "@/assets/dest-paris.jpg";
import destRome from "@/assets/dest-rome.jpg";
import destTokyo from "@/assets/dest-tokyo.jpg";

const nearbySpots = [
  { name: "Eiffel Tower", distance: "1.2 km", rating: 4.9, image: destParis },
  { name: "Colosseum", distance: "3.5 km", rating: 4.8, image: destRome },
  { name: "Shibuya Crossing", distance: "5.1 km", rating: 4.6, image: destTokyo },
];

// Paris coordinates
const START: [number, number] = [48.8566, 2.3522]; // Notre-Dame area
const END: [number, number] = [48.8584, 2.2945]; // Eiffel Tower

const routeConfigs = [
  {
    id: "fastest",
    name: "Fastest Route",
    time: "12 min",
    distance: "3.2 km",
    safety: 82,
    tag: "Fastest",
    icon: Zap,
    color: "#1e3a5f",
    profile: "car",
  },
  {
    id: "safest",
    name: "Safest Route",
    time: "18 min",
    distance: "4.1 km",
    safety: 96,
    tag: "Recommended",
    icon: ShieldCheck,
    color: "#2d8a4e",
    profile: "foot",
  },
  {
    id: "balanced",
    name: "Balanced Route",
    time: "15 min",
    distance: "3.6 km",
    safety: 88,
    tag: "Balanced",
    icon: Scale,
    color: "#d4940a",
    profile: "bike",
  },
];

const safeZones = [
  { pos: [48.8610, 2.3380] as [number, number], name: "Safe Zone - Police" },
  { pos: [48.8620, 2.3050] as [number, number], name: "Safe Zone - Embassy" },
  { pos: [48.8545, 2.3300] as [number, number], name: "Safe Zone - Hospital" },
];

const TouristNavigate = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [selectedRoute, setSelectedRoute] = useState("safest");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<L.LayerGroup | null>(null);

  const active = routeConfigs.find((r) => r.id === selectedRoute)!;

  const lightTiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [48.8575, 2.3230],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(theme === "dark" ? darkTiles : lightTiles, {
      maxZoom: 19,
    }).addTo(map);

    // Start marker
    const startIcon = L.divIcon({
      className: "",
      html: `<div style="width:20px;height:20px;border-radius:50%;background:#1e3a5f;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
    L.marker(START, { icon: startIcon }).addTo(map).bindPopup("Your Location");

    // End marker
    const endIcon = L.divIcon({
      className: "",
      html: `<div style="width:14px;height:14px;background:#dc2626;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);margin-top:-7px;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 14],
    });
    L.marker(END, { icon: endIcon }).addTo(map).bindPopup("Eiffel Tower");

    // Safe zone circles
    safeZones.forEach((sz) => {
      L.circle(sz.pos, {
        radius: 200,
        color: "#2d8a4e",
        fillColor: "#2d8a4e",
        fillOpacity: 0.08,
        weight: 1,
        dashArray: "5 5",
      }).addTo(map).bindPopup(sz.name);
    });

    routeLayersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile layer on theme change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) map.removeLayer(layer);
    });
    L.tileLayer(theme === "dark" ? darkTiles : lightTiles, { maxZoom: 19 }).addTo(map);
  }, [theme]);

  // Update routes on selection change
  useEffect(() => {
    const group = routeLayersRef.current;
    if (!group) return;
    group.clearLayers();

    // Draw inactive routes first (dimmed)
    routeConfigs.forEach((route) => {
      if (route.id === selectedRoute) return;
      L.polyline(route.coords, {
        color: route.color,
        weight: 4,
        opacity: 0.2,
        dashArray: "6 8",
      }).addTo(group);
    });

    // Draw active route on top
    L.polyline(active.coords, {
      color: active.color,
      weight: 6,
      opacity: 0.85,
      dashArray: "10 6",
    }).addTo(group);
  }, [selectedRoute]);

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
        <ThemeToggle />
        <div className="flex items-center gap-1.5 bg-safe/10 px-2.5 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5 text-safe" />
          <span className="text-xs font-semibold text-safe">Safe</span>
        </div>
      </div>

      {/* Route selector tabs */}
      <div className="px-3 py-2 bg-card border-b border-border flex gap-2">
        {routeConfigs.map((route) => {
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

      {/* Leaflet Map */}
      <div className="relative h-72">
        <div ref={mapRef} className="w-full h-full z-0" />

        {/* Safety alert overlay */}
        <div className="absolute top-3 left-3 right-3 z-[1000]">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm border border-border">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
            <p className="text-xs text-foreground">Local protest reported nearby. Safer route available.</p>
          </div>
        </div>

        {/* ETA overlay */}
        <div className="absolute bottom-3 left-3 z-[1000]">
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
            <div key={spot.name} className="bg-card rounded-xl border border-border overflow-hidden min-w-[160px] shrink-0">
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
