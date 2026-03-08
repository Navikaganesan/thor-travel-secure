import { ArrowLeft, Video, UserPlus, Share2, Camera, Mic, MicOff, VideoOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TouristBottomNav from "@/components/tourist/TouristBottomNav";
import destParis from "@/assets/dest-paris.jpg";
import destBali from "@/assets/dest-bali.jpg";

const TouristCompanion = () => {
  const navigate = useNavigate();
  const [sessionActive, setSessionActive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  return (
    <div className="mobile-frame bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/tourist")} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Avatar Companion</h1>
      </div>

      {sessionActive ? (
        <div className="px-4 py-4">
          {/* Main video */}
          <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-foreground/5">
            <img src={destParis} alt="Live view" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive-foreground animate-pulse" />
              LIVE
            </div>

            {/* Companion floating window */}
            <div className="absolute bottom-4 right-4 w-28 h-36 rounded-xl overflow-hidden border-2 border-card shadow-lg">
              <img src={destBali} alt="Companion view" className="w-full h-full object-cover" />
              <div className="absolute bottom-1 left-1 bg-foreground/60 text-primary-foreground text-[9px] px-1.5 py-0.5 rounded">
                Sarah
              </div>
            </div>

            {/* Controls overlay */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${micOn ? "bg-card/80" : "bg-destructive"}`}
              >
                {micOn ? <Mic className="w-5 h-5 text-foreground" /> : <MicOff className="w-5 h-5 text-destructive-foreground" />}
              </button>
              <button
                onClick={() => setCamOn(!camOn)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${camOn ? "bg-card/80" : "bg-destructive"}`}
              >
                {camOn ? <Camera className="w-5 h-5 text-foreground" /> : <VideoOff className="w-5 h-5 text-destructive-foreground" />}
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button className="w-full bg-destructive text-destructive-foreground py-3 rounded-xl font-semibold text-sm" onClick={() => setSessionActive(false)}>
              End Session
            </button>
            <button className="w-full bg-card border border-border text-foreground py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" /> Share Travel Experience
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-8 text-center">
          <div className="w-20 h-20 rounded-full thor-gradient mx-auto flex items-center justify-center mb-6">
            <Video className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Share Your Journey</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
            Let your friends and family experience your travels in real-time through a shared video session.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setSessionActive(true)}
              className="w-full thor-gradient text-primary-foreground py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Video className="w-5 h-5" /> Start Session
            </button>
            <button className="w-full bg-card border border-border text-foreground py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5" /> Invite Companion
            </button>
          </div>

          <div className="mt-8 bg-muted rounded-xl p-4 text-left">
            <p className="text-xs font-semibold text-foreground mb-2">How it works</p>
            <div className="space-y-2">
              {[
                "Start a live session from your camera",
                "Invite a friend or family member",
                "They see your live travel experience",
                "Stay connected with voice and video",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-xs text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <TouristBottomNav />
    </div>
  );
};

export default TouristCompanion;
