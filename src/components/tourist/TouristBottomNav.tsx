import { Search, Map, Shield, MessageCircle, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: Search, label: "Explore", path: "/tourist" },
  { icon: Map, label: "Navigate", path: "/tourist/navigate" },
  { icon: Shield, label: "Safety", path: "/tourist/sos" },
  { icon: MessageCircle, label: "Assistant", path: "/tourist/assistant" },
  { icon: User, label: "Companion", path: "/tourist/companion" },
];

const TouristBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TouristBottomNav;
