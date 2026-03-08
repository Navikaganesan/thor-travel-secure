import { useState } from "react";
import { ArrowLeft, Send, Mic, Globe, Utensils, Shield, Route, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TouristBottomNav from "@/components/tourist/TouristBottomNav";

const quickActions = [
  { icon: Globe, label: "Translate emergency phrases" },
  { icon: Utensils, label: "Safe restaurants nearby" },
  { icon: Shield, label: "Cultural etiquette tips" },
  { icon: Route, label: "Suggest safer routes" },
  { icon: Phone, label: "Contact authorities" },
];

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  time: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hello! I'm your THOR AI Travel Concierge. I can help you with translations, safety tips, local recommendations, and more. How can I assist you today?",
    sender: "ai",
    time: "10:30 AM",
  },
];

const TouristAssistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), text, sender: "user", time: "Now" };
    const aiResponses: Record<string, string> = {
      "Translate emergency phrases": "Here are key emergency phrases in French:\n\n🚨 Help! → Au secours !\n🏥 Hospital → Hôpital\n👮 Police → Police\n🔥 Fire → Incendie\n📞 Emergency → Urgence\n\nThe emergency number in France is 112.",
      "Safe restaurants nearby": "Here are 3 verified safe restaurants near you:\n\n1. 🍽️ Le Petit Cler — 0.3 km, Rating: 4.7\n2. 🍽️ Café Constant — 0.5 km, Rating: 4.6\n3. 🍽️ Les Cocottes — 0.7 km, Rating: 4.5\n\nAll locations are in well-lit, high-traffic areas.",
      "Cultural etiquette tips": "🇫🇷 French Etiquette Tips:\n\n• Always greet with 'Bonjour' before any interaction\n• Tipping is not required but appreciated (5-10%)\n• Dress modestly when visiting churches\n• Avoid loud conversations in public\n• Don't rush meals — dining is a cultural experience",
      "Suggest safer routes": "I've analyzed nearby routes. The safest route to your destination avoids the protest area on Rue de Rivoli and routes through well-lit Boulevard Saint-Germain.\n\n✅ Safety Score: 96%\n⏱️ Estimated time: 31 min\n📏 Distance: 9.7 km",
      "Contact authorities": "🚔 Emergency Contacts in Paris:\n\n• General Emergency: 112\n• Police: 17\n• Fire: 18\n• Medical: 15\n• Tourist Police: +33 1 53 71 53 71\n• Nearest Embassy: Contact via THOR directory",
    };
    const responseText = aiResponses[text] || "I understand your concern. Let me help you with that. Based on your current location and safety profile, I recommend staying in well-populated areas and keeping your THOR safety features active. Is there anything specific I can help with?";
    const aiMsg: Message = { id: Date.now() + 1, text: responseText, sender: "ai", time: "Now" };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="mobile-frame bg-background pb-20 flex flex-col h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
        <button onClick={() => navigate("/tourist")} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="w-8 h-8 rounded-full thor-gradient flex items-center justify-center">
          <Shield className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">THOR AI Assistant</h1>
          <p className="text-[10px] text-safe font-medium">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border text-foreground rounded-bl-md"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        {messages.length <= 2 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(label)}
                  className="flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-2 hover:border-primary/30 transition"
                >
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-card border-t border-border px-4 py-3 shrink-0 mb-16">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full bg-muted hover:bg-primary/10 transition">
            <Mic className="w-5 h-5 text-muted-foreground" />
          </button>
          <input
            type="text"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={() => sendMessage(input)}
            className="p-2 rounded-full thor-gradient"
          >
            <Send className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>

      <TouristBottomNav />
    </div>
  );
};

export default TouristAssistant;
