import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Shield, Clock, Zap, ShieldCheck, Scale, AlertTriangle, MapPin } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import TouristBottomNav from "@/components/tourist/TouristBottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";

// Default start: Paris, Notre-Dame area
const DEFAULT_START: [number, number] = [48.8566, 2.3522];
const DEFAULT_END: [number, number] = [48.8584, 2.2945];

const routeConfigs = [
  {
    id: "fastest",
    name: "Fastest Route",
    tag: "Fastest",
    icon: Zap,
    color: "#1e3a5f",
    profile: "driving",
  },
  {
    id: "safest",
    name: "Safest Route",
    tag: "Recommended",
    icon: ShieldCheck,
    color: "#2d8a4e",
    profile: "foot",
  },
  {
    id: "balanced",
    name: "Balanced Route",
    tag: "Balanced",
    icon: Scale,
    color: "#d4940a",
    profile: "driving", // uses alternative route index
  },
];

const safeZones = [
  { pos: [48.8610, 2.3380] as [number, number], name: "Safe Zone - Police" },
  { pos: [48.8620, 2.3050] as [number, number], name: "Safe Zone - Embassy" },
  { pos: [48.8545, 2.3300] as [number, number], name: "Safe Zone - Hospital" },
];

interface RouteData {
  coords: [number, number][];
  time: string;
  distance: string;
  safety: number;
}

const TouristNavigate = () => {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const [selectedRoute, setSelectedRoute] = useState("safest");
  const [destName, setDestName] = useState("Destination");
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [routes, setRoutes] = useState<Record<string, RouteData>>({});
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const lightTiles = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  // Geocode destination
  useEffect(() => {
    const dest = searchParams.get("dest");
    if (!dest) {
      setDestName("Eiffel Tower");
      setDestCoords(DEFAULT_END);
      return;
    }
    setDestName(dest);

    const geocode = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(dest)}&format=json&limit=1&accept-language=en`);
        const data = await res.json();
        if (data.length > 0) {
          setDestCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setDestCoords(DEFAULT_END);
        }
      } catch {
        setDestCoords(DEFAULT_END);
      }
    };
    geocode();
  }, [searchParams]);

  // Fetch route from OSRM
  const fetchRoute = useCallback(async (start: [number, number], end: [number, number], profile: string, altIdx = 0): Promise<{ coords: [number, number][]; duration: number; distance: number }> => {
    const osrmProfile = profile === "foot" ? "foot" : "driving";
    const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&alternatives=true`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const idx = Math.min(altIdx, data.routes.length - 1);
        const r = data.routes[idx];
        const coords = r.geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
        return { coords, duration: r.duration, distance: r.distance };
      }
    } catch (e) {
      console.error("OSRM fetch failed", e);
    }
    return { coords: [start, end], duration: 0, distance: 0 };
  }, []);

  // Format helpers
  const fmtTime = (s: number) => {
    if (s < 60) return "1 min";
    const m = Math.round(s / 60);
    return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`;
  };
  const fmtDist = (m: number) => m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;

  // Init map + fetch routes when destCoords ready
  useEffect(() => {
    if (!destCoords || !mapRef.current) return;

    // Clean up previous map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const start = DEFAULT_START;
    const end = destCoords;

    const bounds = L.latLngBounds([start, end]);
    const map = L.map(mapRef.current, {
      center: bounds.getCenter(),
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(theme === "dark" ? darkTiles : lightTiles, { maxZoom: 19 }).addTo(map);
    map.fitBounds(bounds.pad(0.3));

    // Markers
    const mGroup = L.layerGroup().addTo(map);
    const startIcon = L.divIcon({
      className: "",
      html: `<div style="width:20px;height:20px;border-radius:50%;background:hsl(var(--primary));border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
    L.marker(start, { icon: startIcon }).addTo(mGroup).bindPopup("Your Location");

    const endIcon = L.divIcon({
      className: "",
      html: `<div style="width:14px;height:14px;background:#dc2626;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);margin-top:-7px;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 14],
    });
    L.marker(end, { icon: endIcon }).addTo(mGroup).bindPopup(destName);

    // Safe zones (only near Paris)
    safeZones.forEach((sz) => {
      L.circle(sz.pos, {
        radius: 200,
        color: "#2d8a4e",
        fillColor: "#2d8a4e",
        fillOpacity: 0.08,
        weight: 1,
        dashArray: "5 5",
      }).addTo(mGroup).bindPopup(sz.name);
    });

    markersRef.current = mGroup;
    routeLayersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Fetch all routes
    setLoading(true);
    Promise.all([
      fetchRoute(start, end, "driving", 0),
      fetchRoute(start, end, "foot", 0),
      fetchRoute(start, end, "driving", 1),
    ]).then(([fastest, safest, balanced]) => {
      const newRoutes: Record<string, RouteData> = {
        fastest: { coords: fastest.coords, time: fmtTime(fastest.duration), distance: fmtDist(fastest.distance), safety: 82 },
        safest: { coords: safest.coords, time: fmtTime(safest.duration), distance: fmtDist(safest.distance), safety: 96 },
        balanced: { coords: balanced.coords, time: fmtTime(balanced.duration), distance: fmtDist(balanced.distance), safety: 88 },
      };
      setRoutes(newRoutes);
      setLoading(false);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [destCoords]);

  // Draw routes
  useEffect(() => {
    const group = routeLayersRef.current;
    if (!group || Object.keys(routes).length === 0) return;
    group.clearLayers();

    // Inactive routes dimmed
    routeConfigs.forEach((rc) => {
      const rd = routes[rc.id];
      if (!rd || rc.id === selectedRoute) return;
      L.polyline(rd.coords, { color: rc.color, weight: 4, opacity: 0.2 }).addTo(group);
    });

    // Active route
    const activeRd = routes[selectedRoute];
    const activeRc = routeConfigs.find((r) => r.id === selectedRoute)!;
    if (activeRd) {
      L.polyline(activeRd.coords, { color: activeRc.color, weight: 6, opacity: 0.85 }).addTo(group);
    }
  }, [selectedRoute, routes]);

  // Theme tile swap
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) map.removeLayer(layer);
    });
    L.tileLayer(theme === "dark" ? darkTiles : lightTiles, { maxZoom: 19 }).addTo(map);
  }, [theme]);

  const activeRoute = routes[selectedRoute];
  const activeConfig = routeConfigs.find((r) => r.id === selectedRoute)!;
  const ActiveIcon = activeConfig.icon;

  return (
    <div className="mobile-frame bg-background pb-20 relative">
      {/* Top Bar */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        <button onClick={() => nav("/tourist")} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{destName}</p>
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

      {/* Map */}
      <div className="relative h-72">
        <div ref={mapRef} className="w-full h-full z-0" />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-[1000]">
            <div className="bg-card rounded-lg px-4 py-3 border border-border shadow-sm">
              <p className="text-sm text-muted-foreground">Loading routes…</p>
            </div>
          </div>
        )}

        {/* Safety alert */}
        <div className="absolute top-3 left-3 right-3 z-[1000]">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm border border-border">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
            <p className="text-xs text-foreground">Route safety analysis active. Safer paths highlighted.</p>
          </div>
        </div>

        {/* ETA overlay */}
        {activeRoute && (
          <div className="absolute bottom-3 left-3 z-[1000]">
            <div className="bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-bold text-foreground">{activeRoute.time}</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <span className="text-xs text-muted-foreground">{activeRoute.distance}</span>
                <div className="w-px h-4 bg-border" />
                <span className={`text-xs font-bold ${activeRoute.safety >= 90 ? "text-safe" : activeRoute.safety >= 80 ? "text-warning" : "text-destructive"}`}>
                  {activeRoute.safety}% safe
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Route Details Card */}
      {activeRoute && (
        <div className="px-4 py-3">
          <div className="bg-card rounded-xl border border-border p-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedRoute === "safest" ? "bg-safe/15" : selectedRoute === "fastest" ? "thor-gradient" : "bg-accent/15"
              }`}>
                <ActiveIcon className={`w-5 h-5 ${
                  selectedRoute === "safest" ? "text-safe" : selectedRoute === "fastest" ? "text-primary-foreground" : "text-accent-foreground"
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{activeConfig.name}</p>
                  <span className="text-[10px] font-semibold text-primary-foreground bg-primary px-1.5 py-0.5 rounded">
                    {activeConfig.tag}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {activeRoute.time}
                  </span>
                  <span className="text-xs text-muted-foreground">{activeRoute.distance}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  activeRoute.safety >= 90 ? "text-safe" : activeRoute.safety >= 80 ? "text-warning" : "text-destructive"
                }`}>
                  {activeRoute.safety}%
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
      )}

      <TouristBottomNav />
    </div>
  );
};

export default TouristNavigate;
