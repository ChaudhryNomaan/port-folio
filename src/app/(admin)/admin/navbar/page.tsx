"use client";

import { useState, useRef, useEffect, useTransition } from 'react';
import { Cpu, Save, Image as ImageIcon, Upload, X, Fingerprint, CheckCircle2 } from 'lucide-react';
import siteData from "@/lib/site-config.json";
import { updateBrandData } from "@/actions/admin-actions"; 
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- PORTAL ENGINE ---
function GlobalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

// --- LUXURY MODAL ---
function ModalShell({ isOpen, onClose, children }: any) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <GlobalPortal>
      <AnimatePresence mode="wait">
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-crosshair"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-zinc-800 p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] text-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-[60px] -mr-16 -mt-16" />
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </GlobalPortal>
  );
}

export default function AdminNavbarPage() {
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [studioName, setStudioName] = useState(siteData.brand.name);
  const [previewImage, setPreviewImage] = useState(siteData.brand.logoImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreviewImage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Enhanced Save Handler with Transition
  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateBrandData(formData);
      // Assuming your action returns { success: true }
      if (result?.success) {
        setShowSuccess(true);
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 md:space-y-20 pb-20 md:pb-40 px-4 md:px-0 animate-in fade-in duration-1000">
      
      {/* SUCCESS MODAL */}
      <ModalShell isOpen={showSuccess} onClose={() => setShowSuccess(false)}>
        <CheckCircle2 className="mx-auto text-amber-500 mb-6" size={56} strokeWidth={1.5} />
        <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-4">Identity Set</h3>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-10 leading-relaxed">
          Brand assets and visual signatures have been synchronized across the core architecture.
        </p>
        <button 
          onClick={() => setShowSuccess(false)} 
          className="w-full bg-white hover:bg-amber-500 text-black font-black py-6 rounded-2xl text-[11px] uppercase tracking-[0.4em] transition-all"
        >
          Acknowledge
        </button>
      </ModalShell>

      <header className="border-b border-white/5 pb-10 md:pb-12 pt-6 md:pt-0">
        <div className="flex items-center gap-4 mb-4">
          <span className="h-[1px] w-8 md:w-12 bg-amber-500"></span>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-bold text-amber-500">Brand Assets</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-light tracking-tighter uppercase leading-none text-white">
          Visual <span className="italic font-serif lowercase text-neutral-500">Identity</span>
        </h1>
      </header>

      <section className="space-y-10">
        <div className="flex items-center gap-3 ml-2">
          <Fingerprint size={18} className="text-amber-500" />
          <h2 className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-bold text-neutral-200">Global Signature</h2>
        </div>

        <form action={handleAction} className="bg-neutral-900/30 backdrop-blur-3xl p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 space-y-12">
          
          <div className="grid grid-cols-1 gap-12">
            <div className="space-y-4">
              <label className="text-[9px] uppercase font-black text-zinc-500 tracking-[0.3em] ml-2">Studio Name</label>
              <input 
                name="studioName"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full bg-white/[0.02] border-b border-white/10 p-5 md:p-6 rounded-2xl outline-none focus:border-amber-500/50 transition-all text-xl font-light text-white"
                placeholder="Studio Name"
              />
            </div>

            <div className="space-y-6">
              <label className="text-[9px] uppercase font-black text-zinc-500 tracking-[0.3em] ml-2">Brand Mark (Logo)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer border-2 border-dashed border-white/10 hover:border-amber-500/50 rounded-[2rem] p-10 transition-all flex flex-col items-center justify-center gap-4 bg-white/[0.01] hover:bg-amber-500/[0.02]"
                >
                  <input 
                    type="file"
                    name="logoFile"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload size={20} className="text-amber-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-white uppercase tracking-widest font-bold">Upload from Device</p>
                    <p className="text-[8px] text-zinc-500 uppercase mt-1">SVG, PNG, or JPG (Max 2MB)</p>
                  </div>
                </div>

                <div className="bg-black/40 rounded-[2rem] p-8 border border-white/5 flex items-center justify-center">
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-2xl relative border border-white/10">
                        {previewImage ? (
                          <img src={previewImage} alt="Logo" className="w-full h-full object-contain p-4" />
                        ) : (
                          <ImageIcon size={24} className="text-zinc-800 opacity-20" />
                        )}
                      </div>
                      {previewImage && (
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); clearImage(); }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:scale-110 transition-all"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1">
                        <span className="text-white text-xl font-bold uppercase tracking-[0.2em]">{studioName || "Studio"}</span>
                        <span className="text-amber-500 text-xl">.</span>
                      </div>
                      <span className="text-[7px] text-zinc-500 uppercase tracking-[0.5em] mt-1">Studio — 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:justify-between md:items-center pt-10 border-t border-white/5">
            <div className="flex items-center gap-3 bg-white/[0.02] px-6 py-3 rounded-full border border-white/5">
              <Cpu size={14} className="text-amber-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">Core Architecture Sync</span>
            </div>
            
            <button
              type="submit"
              disabled={isPending}
              className="group w-full md:w-auto flex items-center justify-center gap-4 bg-white text-black px-10 md:px-12 py-5 md:py-6 rounded-full font-black uppercase text-[10px] tracking-[0.4em] hover:bg-amber-500 hover:text-white transition-all duration-700 disabled:opacity-50 active:scale-95"
            >
              <Save size={16} className={isPending ? "animate-spin" : "group-hover:rotate-12 transition-transform"} />
              {isPending ? "Synchronizing..." : "Commit Identity"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}