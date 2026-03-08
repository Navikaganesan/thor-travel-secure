import { ArrowLeft, Phone, MapPin, Share2, Navigation, Shield, AlertTriangle, Hospital, Building, Wifi, WifiOff, CheckCircle2, Bell } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TouristBottomNav from "@/components/tourist/TouristBottomNav";

const safetyTools = [
  { icon: Shield, label: "Safe Zones", desc: "View nearby verified safe locations" },
  { icon: Bell, label: "Safety Check-In", desc: "Send safety pulse to contacts" },
  { icon: MapPin, label: "Geofencing", desc: "Dynamic area monitoring active" },
  { icon: WifiOff, label: "Offline Sentinel", desc: "SMS backup when offline" },
];

const TouristSOS = () => {
  const navigate = useNavigate();
  const [sosTriggered, setSosTriggered] = useState(false);

  if (sosTriggered) {
    return (
      <div className="mobile-frame bg-background pb-20">
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
            <button className="w-full flex items-center justify-center gap-2 bg-destructive text-destructive-foreground py-3.5 rounded-xl font-semibold text-sm">
              <Phone className="w-4 h-4" /> Call Emergency Services
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm">
              <Share2 className="w-4 h-4" /> Share Live Location
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-safe text-safe-foreground py-3.5 rounded-xl font-semibold text-sm">
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
