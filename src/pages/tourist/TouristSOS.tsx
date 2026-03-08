import { ArrowLeft, Phone, MapPin, Share2, Navigation, Shield, AlertTriangle, Hospital, Building, Wifi, WifiOff, CheckCircle2, Bell, X, PhoneCall } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TouristBottomNav from "@/components/tourist/TouristBottomNav";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const safetyTools = [
  { icon: Shield, label: "Safe Zones", desc: "View nearby verified safe locations" },
  { icon: Bell, label: "Safety Check-In", desc: "Send safety pulse to contacts" },
  { icon: MapPin, label: "Geofencing", desc: "Dynamic area monitoring active" },
  { icon: WifiOff, label: "Offline Sentinel", desc: "SMS backup when offline" },
];

const TouristSOS = () => {
  const navigate = useNavigate();
  const [sosTriggered, setSosTriggered] = useState(false);
  const [showSafeZoneMap, setShowSafeZoneMap] = useState(false);
  const [showShareConfirm, setShowShareConfirm] = useState(false);
  const [showCallScreen, setShowCallScreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const safeMapRef = useRef<HTMLDivElement>(null);
  const safeMapInstanceRef = useRef<L.Map | null>(null);

  // Emergency call timer
  useEffect(() => {
    if (!showCallScreen) { setCallDuration(0); return; }
    const interval = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, [showCallScreen]);

  // Safe zone map
  useEffect(() => {
    if (!showSafeZoneMap || !safeMapRef.current || safeMapInstanceRef.current) return;

    const userPos: [number, number] = [48.8566, 2.3522];
    const safeZone: [number, number] = [48.8530, 2.3499]; // Nearest police

    const map = L.map(safeMapRef.current, {
      center: userPos,
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", { maxZoom: 18 }).addTo(map);

    // User marker
    const userIcon = L.divIcon({
      className: "",
      html: `<div style="width:16px;height:16px;border-radius:50%;background:hsl(215,70%,45%);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker(userPos, { icon: userIcon }).addTo(map).bindPopup("<b>Your Location</b>");

    // Safe zone marker
    const safeIcon = L.divIcon({
      className: "",
      html: `<div style="width:16px;height:16px;border-radius:50%;background:hsl(142,60%,42%);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker(safeZone, { icon: safeIcon }).addTo(map).bindPopup("<b>Commissariat du 7e</b><br/>Nearest Police Station");

    // Fetch route
    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/foot/${userPos[1]},${userPos[0]};${safeZone[1]},${safeZone[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          const coords: [number, number][] = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
          L.polyline(coords, { color: "hsl(215, 70%, 45%)", weight: 5, opacity: 0.8 }).addTo(map);
          const distKm = (route.distance / 1000).toFixed(1);
          const durMin = Math.ceil(route.duration / 60);
          setRouteInfo({ distance: `${distKm} km`, duration: `${durMin} min` });
          map.fitBounds(L.polyline(coords).getBounds(), { padding: [30, 30] });
        }
      } catch {
        // Fallback straight line
        L.polyline([userPos, safeZone], { color: "hsl(215, 70%, 45%)", weight: 4, dashArray: "8,8" }).addTo(map);
        setRouteInfo({ distance: "0.5 km", duration: "6 min" });
      }
    };
    fetchRoute();

    safeMapInstanceRef.current = map;

    return () => {
      map.remove();
      safeMapInstanceRef.current = null;
    };
  }, [showSafeZoneMap]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Call screen overlay
  if (showCallScreen) {
    return (
      <div className="mobile-frame bg-background pb-20 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6 animate-pulse">
            <PhoneCall className="w-10 h-10 text-destructive" />
          </div>
          <p className="text-lg font-bold text-foreground mb-1">Calling Emergency Services</p>
          <p className="text-sm text-muted-foreground mb-2">Emergency number dialed: 112</p>
          <p className="text-2xl font-mono font-bold text-foreground mt-4">{formatTime(callDuration)}</p>
          <p className="text-xs text-muted-foreground mt-2">Connected to local emergency dispatch</p>
          <button
            onClick={() => setShowCallScreen(false)}
            className="mt-10 w-16 h-16 rounded-full bg-destructive flex items-center justify-center"
          >
            <Phone className="w-7 h-7 text-destructive-foreground rotate-[135deg]" />
          </button>
          <p className="text-xs text-muted-foreground mt-3">Tap to end call</p>
        </div>
        <TouristBottomNav />
      </div>
    );
  }

  // Safe zone map overlay
  if (showSafeZoneMap) {
    return (
      <div className="mobile-frame bg-background pb-20">
        <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
          <button onClick={() => { setShowSafeZoneMap(false); safeMapInstanceRef.current = null; }} className="p-1">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-base font-semibold text-foreground">Navigate to Safe Zone</h1>
        </div>
        {routeInfo && (
          <div className="px-4 py-3 bg-safe/10 border-b border-safe/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-safe" />
              <span className="text-sm font-semibold text-foreground">Commissariat du 7e</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{routeInfo.distance}</span>
              <span className="font-semibold text-foreground">{routeInfo.duration} walk</span>
            </div>
          </div>
        )}
        <div className="h-[calc(100vh-180px)]">
          <div ref={safeMapRef} className="w-full h-full" />
        </div>
        <TouristBottomNav />
      </div>
    );
  }

  // Share location confirmation toast
  const ShareConfirmOverlay = () => (
    showShareConfirm ? (
      <div className="fixed inset-0 z-50 flex items-end justify-center pb-24 pointer-events-none">
        <div className="bg-safe text-safe-foreground rounded-xl px-5 py-3 flex items-center gap-3 shadow-lg pointer-events-auto animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Live location shared</p>
            <p className="text-xs opacity-90">3 emergency contacts notified with your GPS coordinates</p>
          </div>
          <button onClick={() => setShowShareConfirm(false)} className="p-1 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    ) : null
  );

  if (sosTriggered) {
    return (
      <div className="mobile-frame bg-background pb-20">
        <ShareConfirmOverlay />
        {/* Emergency Header */}
        <div className="bg-destructive px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSosTriggered(false)} className="p-1">
            <ArrowLeft className="w-5 h-5 text-destructive-foreground" />
          </button>
          <div className="flex-1">
            <p className="text-sm font-bold text-destructive-foreground">EMERGENCY ACTIVE</p>
            <p className="text-xs text-destructive-foreground/80">Help is on the way</p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-destructive-foreground animate-pulse" />
        </div>

        {/* Status Cards */}
        <div className="px-4 py-4 space-y-3">
          <div className="bg-safe/10 border border-safe/20 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-safe shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Emergency contacts notified</p>
              <p className="text-xs text-muted-foreground">3 contacts alerted with your live location</p>
            </div>
          </div>

          {/* Live GPS */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-destructive" />
              <p className="text-sm font-semibold text-foreground">Live GPS Location</p>
            </div>
            <p className="text-xs text-muted-foreground mb-1">48.8566° N, 2.3522° E</p>
            <p className="text-xs text-muted-foreground">Champ de Mars, Paris, France</p>
            <div className="mt-3 h-32 bg-muted rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 animate-ping absolute -inset-2" />
                  <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-destructive" />
                  </div>
                </div>
              </div>
              <p className="absolute bottom-2 left-2 text-[10px] text-muted-foreground bg-card/80 px-2 py-0.5 rounded">Sharing live location</p>
            </div>
          </div>

          {/* Nearest Services */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-xl p-3">
              <Building className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs font-semibold text-foreground">Nearest Police</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Commissariat du 7e</p>
              <p className="text-xs font-semibold text-primary mt-1">0.8 km away</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-3">
              <Hospital className="w-5 h-5 text-destructive mb-2" />
              <p className="text-xs font-semibold text-foreground">Nearest Hospital</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Hôpital Necker</p>
              <p className="text-xs font-semibold text-primary mt-1">1.2 km away</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setShowCallScreen(true)}
              className="w-full flex items-center justify-center gap-2 bg-destructive text-destructive-foreground py-3.5 rounded-xl font-semibold text-sm"
            >
              <Phone className="w-4 h-4" /> Call Emergency Services
            </button>
            <button
              onClick={() => { setShowShareConfirm(true); setTimeout(() => setShowShareConfirm(false), 4000); }}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm"
            >
              <Share2 className="w-4 h-4" /> Share Live Location
            </button>
            <button
              onClick={() => setShowSafeZoneMap(true)}
              className="w-full flex items-center justify-center gap-2 bg-safe text-safe-foreground py-3.5 rounded-xl font-semibold text-sm"
            >
              <Navigation className="w-4 h-4" /> Navigate to Nearest Safe Zone
            </button>
          </div>
        </div>

        <TouristBottomNav />
      </div>
    );
  }

  return (
    <div className="mobile-frame bg-background pb-20">
      <ShareConfirmOverlay />
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/tourist")} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Safety Center</h1>
      </div>

      <div className="px-4 py-5">
        {/* SOS Button */}
        <div className="flex flex-col items-center py-8">
          <button
            onClick={() => setSosTriggered(true)}
            className="w-32 h-32 rounded-full bg-destructive text-destructive-foreground flex flex-col items-center justify-center gap-1 sos-pulse"
          >
            <AlertTriangle className="w-10 h-10" />
            <span className="text-lg font-bold">SOS</span>
          </button>
          <p className="text-xs text-muted-foreground mt-4">Tap for emergency assistance</p>
        </div>

        {/* Safety Status */}
        <div className="bg-safe/10 border border-safe/20 rounded-xl p-4 flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-safe" />
          <div>
            <p className="text-sm font-semibold text-foreground">You are in a safe zone</p>
            <p className="text-xs text-muted-foreground">Last check-in: 5 minutes ago</p>
          </div>
        </div>

        {/* Hazard Alerts */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Active Alerts</h3>
          <div className="space-y-2">
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">You are approaching a restricted zone.</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Dynamic geofencing alert</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 flex items-start gap-3">
              <Wifi className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">You are currently offline. Your location will be shared via SMS backup.</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Offline Sentinel Mode active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Tools */}
        <h3 className="text-sm font-semibold text-foreground mb-3">Safety Features</h3>
        <div className="space-y-2">
          {safetyTools.map(({ icon: Icon, label, desc }) => (
            <button
              key={label}
              onClick={() => {
                if (label === "Safe Zones") setShowSafeZoneMap(true);
              }}
              className="w-full bg-card border border-border rounded-xl p-3 flex items-center gap-3 hover:border-primary/20 transition text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <TouristBottomNav />
    </div>
  );
};

export default TouristSOS;
