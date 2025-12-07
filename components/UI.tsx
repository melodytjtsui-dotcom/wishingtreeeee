import React, { useState, useEffect, useRef } from 'react';
import { generateChristmasWish } from '../services/geminiService';
import { Sparkles, Loader2, Music2, Camera, Upload } from 'lucide-react';
import { WishState } from '../types';

interface UIProps {
  onAddPhoto: (url: string) => void;
}

const UI: React.FC<UIProps> = ({ onAddPhoto }) => {
  const [wishState, setWishState] = useState<WishState>({
    text: "",
    loading: false,
    error: null,
  });

  const [topic, setTopic] = useState("");
  // Phase 0: Input, Phase 1: Wish Reveal, Phase 2: Photo Upload
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    const searchTopic = topic.trim() || "Magic and Hope";
    setWishState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const text = await generateChristmasWish(searchTopic);
      setWishState({ text, loading: false, error: null });
      setPhase(1);
    } catch (err) {
      setWishState({ 
        text: "", 
        loading: false, 
        error: "The holiday spirits are busy. Please try again." 
      });
    }
  };

  // Timer to transition from Wish Reveal (1) to Photo Upload (2)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (phase === 1) {
      // Wait 8 seconds then fade out text and show photo options
      timer = setTimeout(() => {
        setPhase(2);
      }, 8000);
    }
    return () => clearTimeout(timer);
  }, [phase]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onAddPhoto(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col items-center justify-center z-10">
      
      {/* PHASE 0: Input */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-between p-8 transition-opacity duration-1000 ${phase === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <header className="text-center mt-4">
          <h1 className="text-3xl md:text-5xl font-serif text-[#F4C2C2] tracking-widest uppercase opacity-90 drop-shadow-[0_0_10px_rgba(244,194,194,0.5)]">
            Arix Signature
          </h1>
          <p className="text-sm md:text-base text-white/60 tracking-[0.2em] mt-2 font-light">
            THE ART OF GIVING
          </p>
        </header>

        <div className={`pointer-events-auto max-w-md w-full backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center transition-transform duration-700 ${phase === 0 ? 'scale-100' : 'scale-95'}`}>
          <div className="mb-6">
            <Sparkles className="w-8 h-8 text-[#FFD700] animate-pulse" />
          </div>
          <p className="font-serif text-lg text-white/80 mb-6 font-light">
            Curate your holiday wish.
          </p>
          <div className="flex flex-col gap-4 w-full">
              <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Theme: e.g. Elegance, Warmth"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white/90 placeholder-white/30 text-center focus:outline-none focus:border-[#F4C2C2] focus:bg-black/40 transition-all font-light tracking-wide"
              />
              <button
                  onClick={handleGenerate}
                  disabled={wishState.loading}
                  className="group relative w-full py-3 px-6 bg-gradient-to-r from-[#F4C2C2] to-[#B76E79] rounded-lg text-black font-semibold tracking-wider overflow-hidden transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_20px_rgba(183,110,121,0.3)]"
              >
                  <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                      {wishState.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ILLUMINATE'}
                  </span>
              </button>
          </div>
        </div>

        <footer className="text-white/30 text-xs tracking-widest mb-4 flex items-center gap-2">
           <Music2 className="w-3 h-3" /> 
           <span>IMMERSIVE EXPERIENCE</span>
        </footer>
      </div>

      {/* PHASE 1: Text Reveal */}
      <div 
        className={`absolute inset-x-0 bottom-24 flex flex-col items-center justify-center transition-all duration-1000 ${phase === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-3xl px-8 text-center pointer-events-auto">
            <h2 className="font-serif text-2xl md:text-4xl lg:text-5xl text-[#F4C2C2] leading-snug drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] italic">
               "{wishState.text}"
            </h2>
        </div>
      </div>

      {/* PHASE 2: Photo Upload */}
      <div 
         className={`absolute inset-x-0 bottom-16 flex flex-col items-center justify-center transition-all duration-1000 ${phase === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <div className="flex flex-col items-center gap-4 pointer-events-auto">
          <p className="text-white/70 font-serif tracking-widest text-sm uppercase">The wish has been cast.</p>
          <p className="text-[#F4C2C2] font-light text-lg">Now, hang a memory on the tree.</p>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            className="hidden" 
          />
          
          <button 
            onClick={triggerFileUpload}
            className="flex items-center gap-3 px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all hover:scale-105 group"
          >
            <Camera className="w-5 h-5 text-[#FFD700]" />
            <span className="tracking-widest text-sm font-semibold">UPLOAD PHOTO</span>
          </button>
          
          <p className="text-white/30 text-xs mt-2">Supports JPG, PNG</p>
        </div>
      </div>

    </div>
  );
};

export default UI;