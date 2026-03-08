import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, AlertTriangle, MapPin, Shield, Cloud, Bell, Settings, LogOut,
  Search, ChevronDown, Eye, Phone, Battery, Wifi, WifiOff, ArrowLeft,
  Map, Database, BarChart3, UserCheck, Building, Thermometer
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import thorLogo from "@/assets/thor-logo.png";
import { useTheme } from "@/components/ThemeProvider";

const sidebarItems = [
  { icon: Users, label: "Traveler Monitoring", key: "monitoring" },
  { icon: AlertTriangle, label: "Emergency Alerts", key: "alerts" },
  { icon: UserCheck, label: "Group Safety", key: "groups" },
  { icon: Database, label: "Safe Zone Database", key: "safezones" },
  { icon: BarChart3, label: "Hazard Intelligence", key: "hazards" },
  { icon: Settings, label: "Settings", key: "settings" },
];

const travelers = [
  { id: "TRV-001", name: "Alice Martin", location: "Paris, France", status: "safe", battery: 85, connectivity: "online", pos: [48.8566, 2.3522] as [number, number] },
  { id: "TRV-002", name: "Raj Patel", location: "Kerala, India", status: "safe", battery: 62, connectivity: "online", pos: [9.9312, 76.2673] as [number, number] },
  { id: "TRV-003", name: "Yuki Tanaka", location: "Tokyo, Japan", status: "warning", battery: 23, connectivity: "weak", pos: [35.6762, 139.6503] as [number, number] },
  { id: "TRV-004", name: "Marco Rossi", location: "Rome, Italy", status: "emergency", battery: 8, connectivity: "offline", pos: [41.9028, 12.4964] as [number, number] },
  { id: "TRV-005", name: "Sarah Chen", location: "Bali, Indonesia", status: "safe", battery: 91, connectivity: "online", pos: [-8.3405, 115.092] as [number, number] },
  { id: "TRV-006", name: "James Wilson", location: "Coimbatore, India", status: "safe", battery: 74, connectivity: "online", pos: [11.0168, 76.9558] as [number, number] },
];

const alerts = [
  { type: "sos", traveler: "Marco Rossi", location: "Rome, Italy", time: "2 min ago", message: "SOS activated — device battery critical" },
  { type: "offline", traveler: "Yuki Tanaka", location: "Tokyo, Japan", time: "8 min ago", message: "Offline sentinel triggered — SMS backup sent" },
  { type: "pulse", traveler: "James Wilson", location: "Coimbatore, India", time: "15 min ago", message: "Safety pulse check-in missed" },
  { type: "hazard", traveler: "System", location: "Paris, France", time: "32 min ago", message: "Protest reported near Champs-Élysées — 12 travelers in zone" },
];

const hazards = [
  { type: "Weather", title: "Tropical Storm Warning", location: "Bali, Indonesia", severity: "high", time: "Active" },
  { type: "Civil", title: "Public Protest", location: "Paris, France", severity: "medium", time: "Since 2h ago" },
  { type: "Crime", title: "Pickpocket Zone", location: "Rome, Italy", severity: "medium", time: "Ongoing" },
  { type: "Advisory", title: "Travel Advisory Update", location: "Tokyo, Japan", severity: "low", time: "Updated 1h ago" },
];

const EnterpriseDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("monitoring");
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const lightTiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || activeTab !== "monitoring") return;

    const map = L.map(mapRef.current, {
      center: [25, 40],
      zoom: 2,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer(theme === "dark" ? darkTiles : lightTiles, { maxZoom: 18 }).addTo(map);

    const statusColors: Record<string, string> = {
      safe: "#2d8a4e",
      warning: "#d4940a",
      emergency: "#dc2626",
    };

    travelers.forEach((t) => {
      const color = statusColors[t.status] || "#2d8a4e";
      const pulseClass = t.status === "emergency" ? "animation: pulse 1.5s infinite;" : "";
      const icon = L.divIcon({
        className: "",
        html: `<div style="position:relative;">
          <div style="width:14px;height:14px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);${pulseClass}"></div>
          ${t.status === "emergency" ? `<div style="position:absolute;top:-5px;left:-5px;width:24px;height:24px;border-radius:50%;background:${color};opacity:0.25;animation:pulse 1.5s infinite;"></div>` : ""}
        </div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const batteryColor = t.battery < 20 ? "#dc2626" : t.battery < 50 ? "#d4940a" : "#2d8a4e";
      const connIcon = t.connectivity === "online" ? "🟢" : t.connectivity === "weak" ? "🟡" : "🔴";

      L.marker(t.pos, { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Inter,sans-serif;min-width:180px;">
            <div style="font-weight:700;font-size:13px;margin-bottom:6px;">${t.name}</div>
            <div style="font-size:11px;color:#666;margin-bottom:3px;"><b>ID:</b> ${t.id}</div>
            <div style="font-size:11px;color:#666;margin-bottom:3px;"><b>Location:</b> ${t.location}</div>
            <div style="font-size:11px;margin-bottom:3px;"><b>Status:</b> <span style="color:${color};font-weight:600;text-transform:capitalize;">${t.status}</span></div>
            <div style="font-size:11px;color:#666;margin-bottom:3px;"><b>Battery:</b> <span style="color:${batteryColor};font-weight:600;">${t.battery}%</span></div>
            <div style="font-size:11px;color:#666;"><b>Connectivity:</b> ${connIcon} ${t.connectivity}</div>
          </div>`,
          { className: "enterprise-popup" }
        );
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activeTab]);

  // Update tiles on theme change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) map.removeLayer(layer);
    });
    L.tileLayer(theme === "dark" ? darkTiles : lightTiles, { maxZoom: 18 }).addTo(map);
  }, [theme]);

  const filteredTravelers = travelers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColor = (s: string) =>
    s === "safe" ? "text-safe" : s === "warning" ? "text-warning" : "text-destructive";
  const statusBg = (s: string) =>
    s === "safe" ? "bg-safe/10" : s === "warning" ? "bg-warning/10" : "bg-destructive/10";
  const statusDot = (s: string) =>
    s === "safe" ? "status-safe" : s === "warning" ? "status-warning" : "status-danger";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
        <div className="p-5 flex items-center gap-3 border-b border-sidebar-border">
          <img src={thorLogo} alt="THOR" className="w-8 h-8" />
          <div>
            <p className="text-sm font-bold text-sidebar-foreground">THOR Enterprise</p>
            <p className="text-[10px] text-sidebar-foreground/60">Command Center</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {sidebarItems.map(({ icon: Icon, label, key }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                activeTab === key
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-2 text-sidebar-foreground/60 text-sm hover:text-sidebar-foreground transition px-3 py-2">
            <LogOut className="w-4 h-4" /> Exit Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
          <h1 className="text-base font-semibold text-foreground">
            {sidebarItems.find((i) => i.key === activeTab)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-muted transition">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <div className="w-8 h-8 rounded-full thor-gradient flex items-center justify-center text-primary-foreground text-xs font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "monitoring" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Active Travelers", value: "2,847", icon: Users, color: "text-primary" },
                  { label: "Safe", value: "2,691", icon: Shield, color: "text-safe" },
                  { label: "Warnings", value: "142", icon: AlertTriangle, color: "text-warning" },
                  { label: "Emergencies", value: "14", icon: Phone, color: "text-destructive" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Icon className={`w-5 h-5 ${color}`} />
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                  </div>
                ))}
              </div>

              {/* Map + Table */}
              <div className="grid grid-cols-3 gap-6">
                {/* Map */}
                <div className="col-span-2 bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">Live Tourist Monitoring</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><span className="status-dot status-safe" /> Safe</span>
                      <span className="flex items-center gap-1"><span className="status-dot status-warning" /> Warning</span>
                      <span className="flex items-center gap-1"><span className="status-dot status-danger" /> Emergency</span>
                    </div>
                  </div>
                  <div className="h-80 relative">
                    <div ref={mapRef} className="w-full h-full z-0" />
                  </div>
                </div>

                {/* Alerts Panel */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">Emergency Alerts</h3>
                    <span className="text-[10px] font-bold bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">
                      {alerts.length}
                    </span>
                  </div>
                  <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
                    {alerts.map((alert, i) => (
                      <div
                        key={i}
                        className={`px-4 py-3 ${alert.type === "sos" ? "bg-destructive/5" : ""}`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${
                            alert.type === "sos" ? "text-destructive" : alert.type === "hazard" ? "text-warning" : "text-muted-foreground"
                          }`} />
                          <div>
                            <p className="text-xs font-semibold text-foreground">{alert.traveler}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{alert.message}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-muted-foreground">{alert.location}</span>
                              <span className="text-[10px] text-muted-foreground">· {alert.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Traveler Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Traveler Status</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search travelers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Traveler ID</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Battery</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Connectivity</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredTravelers.map((t) => (
                      <tr key={t.id} className={`hover:bg-muted/30 transition ${t.status === "emergency" ? "bg-destructive/5" : ""}`}>
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{t.id}</td>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{t.name}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {t.location}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium capitalize px-2 py-0.5 rounded-full ${statusBg(t.status)} ${statusColor(t.status)}`}>
                            <span className={`status-dot ${statusDot(t.status)}`} />
                            {t.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Battery className={`w-4 h-4 ${t.battery < 20 ? "text-destructive" : t.battery < 50 ? "text-warning" : "text-safe"}`} />
                            <span className="text-xs text-muted-foreground">{t.battery}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {t.connectivity === "online" ? (
                              <Wifi className="w-3.5 h-3.5 text-safe" />
                            ) : t.connectivity === "weak" ? (
                              <Wifi className="w-3.5 h-3.5 text-warning" />
                            ) : (
                              <WifiOff className="w-3.5 h-3.5 text-destructive" />
                            )}
                            <span className="text-xs text-muted-foreground capitalize">{t.connectivity}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">All Emergency Alerts</h2>
              {alerts.map((alert, i) => (
                <div key={i} className={`bg-card border rounded-xl p-4 flex items-start gap-3 ${alert.type === "sos" ? "border-destructive/30 bg-destructive/5" : "border-border"}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    alert.type === "sos" ? "bg-destructive/10" : "bg-warning/10"
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${alert.type === "sos" ? "text-destructive" : "text-warning"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{alert.traveler}</p>
                      <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> {alert.location}</p>
                  </div>
                  <button className="text-xs text-primary font-medium hover:underline shrink-0">Respond</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "groups" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Group Safety Management</h2>
              {[
                { name: "Paris Walking Tour", guide: "Pierre Duval", size: 12, status: "active" },
                { name: "Kerala Backwater Cruise", guide: "Anita Nair", size: 8, status: "active" },
                { name: "Tokyo Cultural Tour", guide: "Kenji Sato", size: 15, status: "attention" },
              ].map((group) => (
                <div key={group.name} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{group.name}</p>
                      <p className="text-xs text-muted-foreground">Guide: {group.guide} · {group.size} travelers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                      group.status === "active" ? "bg-safe/10 text-safe" : "bg-warning/10 text-warning"
                    }`}>{group.status}</span>
                    <button className="text-xs text-primary font-medium">Broadcast</button>
                    <button className="text-xs text-primary font-medium">Track</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "safezones" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Safe Zone Database</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Building, name: "Police Stations", count: 1247 },
                  { icon: Building, name: "Hospitals", count: 892 },
                  { icon: Building, name: "Embassies", count: 456 },
                  { icon: Shield, name: "Emergency Shelters", count: 634 },
                ].map(({ icon: Icon, name, count }) => (
                  <div key={name} className="bg-card border border-border rounded-xl p-5">
                    <Icon className="w-6 h-6 text-primary mb-3" />
                    <p className="text-sm font-semibold text-foreground">{name}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Verified locations worldwide</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "hazards" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Real-Time Hazard Intelligence</h2>
              {hazards.map((h, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    h.severity === "high" ? "bg-destructive/10" : h.severity === "medium" ? "bg-warning/10" : "bg-muted"
                  }`}>
                    <Thermometer className={`w-5 h-5 ${
                      h.severity === "high" ? "text-destructive" : h.severity === "medium" ? "text-warning" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{h.title}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize ${
                        h.severity === "high" ? "bg-destructive/10 text-destructive" : h.severity === "medium" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                      }`}>{h.severity}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> {h.location} · {h.time}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded">{h.type}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-lg">
              <h2 className="text-lg font-semibold text-foreground mb-4">Settings</h2>
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <p className="text-sm text-muted-foreground">Dashboard settings and configuration options will appear here.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;
