"use client";

import { updateHeroData, updateAboutData } from "@/actions/admin-actions";
import siteData from "@/lib/site-config.json";
import { useFormStatus } from "react-dom";
import { Layout, User, Image as ImageIcon, Cpu, CheckCircle2, X } from "lucide-react";
import { useState, useActionState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- CLIENT-SIDE PORTAL ---
function GlobalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

// --- ENHANCED MODAL SHELL ---
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
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-zinc-800 p-8 md:p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/20 rounded-full blur-[60px] -mr-16 -mt-16" />
              <div className="relative z-10 text-center">
                {children}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </GlobalPortal>
  );
}

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-white text-black font-black px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.4em] hover:bg-amber-500 transition-all duration-500 disabled:opacity-50"
    >
      {pending ? "Syncing..." : label}
    </button>
  );
}

export default function AdminDashboard() {
  const [heroState, heroFormAction] = useActionState(updateHeroData, null);
  const [aboutState, aboutFormAction] = useActionState(updateAboutData, null);
  
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: "" });
  const [preview, setPreview] = useState<string>(siteData.about.aboutImage || "");

  // Monitor server action results to trigger the modal
  useEffect(() => {
    const lastResult = heroState || aboutState;
    if (lastResult?.success) {
      setSuccessModal({ 
        isOpen: true, 
        message: lastResult.message || "System configuration synchronized successfully." 
      });
    }
  }, [heroState, aboutState]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-20 pb-40 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* SUCCESS MODAL */}
      <ModalShell 
        isOpen={successModal.isOpen} 
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
      >
        <CheckCircle2 className="mx-auto text-amber-500 mb-6" size={56} strokeWidth={1.5} />
        <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-4">Verified</h3>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-10 leading-relaxed">
          {successModal.message}
        </p>
        <button 
          onClick={() => setSuccessModal({ ...successModal, isOpen: false })} 
          className="w-full bg-white hover:bg-amber-500 text-black font-black py-6 rounded-2xl text-[11px] uppercase tracking-[0.4em] transition-all"
        >
          Continue
        </button>
      </ModalShell>

      <header className="border-b border-white/5 pb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="h-[1px] w-12 bg-amber-500"></span>
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-amber-500">Studio Command</span>
        </div>
        <h1 className="text-6xl font-light tracking-tighter uppercase leading-none text-white">
          Studio <span className="italic font-serif lowercase text-neutral-500">Control</span>
        </h1>
        <p className="text-neutral-500 mt-6 text-sm font-light tracking-wide max-w-lg leading-relaxed">
          Liza, this is your central command for global site identity and studio philosophy.
        </p>
      </header>

      {/* Hero Configuration */}
      <section className="space-y-10">
        <div className="flex items-center gap-3 ml-2">
          <Layout size={18} className="text-amber-500" />
          <h2 className="text-[11px] uppercase tracking-[0.4em] font-bold text-neutral-200">Hero Configuration</h2>
        </div>
        
        <form action={heroFormAction} className="bg-neutral-900/30 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/5 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest ml-2">Upper Label</label>
              <input name="upperLabel" defaultValue={siteData.hero.upperLabel} className="w-full bg-white/[0.03] border-b border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all text-sm font-light text-white" />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest ml-2">Location</label>
              <input name="location" defaultValue={siteData.hero.location} className="w-full bg-white/[0.03] border-b border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all text-sm font-light text-white" />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest ml-2">Main Headline - Line 1</label>
              <input name="line1" defaultValue={siteData.hero.mainTitleLine1} className="w-full bg-white/[0.03] border-b border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all text-lg font-light text-white" />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest ml-2">Main Headline - Line 2</label>
              <input name="line2" defaultValue={siteData.hero.mainTitleLine2} className="w-full bg-white/[0.03] border-b border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 transition-all text-lg font-serif italic text-white" />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest ml-2">Hero Subtext</label>
            <textarea name="subtext" defaultValue={siteData.hero.subtext} className="w-full bg-white/[0.03] border border-white/5 p-6 rounded-[2.5rem] outline-none focus:border-amber-500 transition-all text-sm font-light text-white min-h-[120px]" />
          </div>

          <div className="flex justify-end">
            <SaveButton label="Update Hero" />
          </div>
        </form>
      </section>

      {/* About Narrative */}
      <section className="space-y-10">
        <div className="flex items-center gap-3 ml-2">
          <User size={18} className="text-amber-500" />
          <h2 className="text-[11px] uppercase tracking-[0.4em] font-bold text-neutral-200">About Narrative</h2>
        </div>

        <form action={aboutFormAction} className="bg-neutral-900/30 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/5 space-y-12">
          <div className="flex items-center gap-8 pb-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] bg-neutral-800 overflow-hidden border border-white/10">
                {preview ? (
                  <img src={preview} alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <input type="file" name="aboutImageFile" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <input type="hidden" name="existingAboutImage" value={siteData?.about?.aboutImage || ""} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Studio Portrait</p>
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Click to upload new signature visual</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest ml-2">Headline Part 1</label>
              <input name="h1" defaultValue={siteData.about.headlineLine1} className="w-full bg-white/[0.03] border-b border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 text-white font-light" />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest ml-2">Headline Part 2</label>
              <input name="h2" defaultValue={siteData.about.headlineLine2} className="w-full bg-white/[0.03] border-b border-white/10 p-4 rounded-xl outline-none focus:border-amber-500 text-white font-light" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest ml-2">Studio Philosophy</label>
            <textarea name="subheading" defaultValue={siteData.about.subheading} className="w-full bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] outline-none focus:border-amber-500 text-white text-sm font-light italic font-serif" rows={2} />
          </div>

          <div className="space-y-3">
            <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest ml-2">Main Biography</label>
            <textarea name="p1" defaultValue={siteData.about.p1} className="w-full bg-white/[0.03] border border-white/5 p-8 rounded-[3rem] outline-none focus:border-amber-500 text-white text-sm font-light leading-relaxed" rows={6} />
          </div>

          <input type="hidden" name="skills" value={siteData.about.capabilities.join(",")} />

          <div className="flex justify-between items-center border-t border-white/5 pt-10">
            <div className="flex items-center gap-3 bg-white/[0.02] px-6 py-3 rounded-full border border-white/5">
                <Cpu size={14} className="text-amber-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">Stack managed in "The Arsenal"</span>
            </div>
            <SaveButton label="Update Narrative" />
          </div>
        </form>
      </section>
    </div>
  );
}