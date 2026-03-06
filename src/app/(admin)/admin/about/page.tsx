"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { updateAboutData } from "@/actions/admin-actions";
import siteData from "@/lib/site-config.json";
import { useFormStatus } from "react-dom";
import { 
  Sparkles, Upload, Image as ImageIcon, 
  Palette, Type, Target, Layers, ArrowRight, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function GlobalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

function ModalShell({ isOpen, onClose, children }: any) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  return (
    <GlobalPortal>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 999999 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 p-10 rounded-[2.5rem] text-center"
            >
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </GlobalPortal>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="fixed bottom-12 right-12 z-50 bg-amber-500 text-black px-10 py-5 rounded-full text-[10px] uppercase tracking-[0.3em] font-black hover:scale-105 active:scale-95 transition-all duration-500 shadow-[0_20px_50px_rgba(245,158,11,0.3)] disabled:opacity-50 flex items-center gap-3"
    >
      {pending ? "Syncing..." : <>Save All Changes <ArrowRight size={14} /></>}
    </button>
  );
}

export default function AdminAbout() {
  const [imagePreview, setImagePreview] = useState<string | null>(siteData.about.aboutImage || null);
  const [accentColor, setAccentColor] = useState(siteData.about.accentColor || "#F59E0B");
  const [successModal, setSuccessModal] = useState(false);

  async function handleAction(formData: FormData) {
    await updateAboutData(formData);
    setSuccessModal(true);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-32">
      <ModalShell isOpen={successModal} onClose={() => setSuccessModal(false)}>
        <CheckCircle2 className="mx-auto text-amber-500 mb-6" size={56} strokeWidth={1} />
        <h3 className="text-white text-2xl font-black uppercase italic mb-4">Archive Updated</h3>
        <button 
          onClick={() => setSuccessModal(false)}
          className="w-full bg-white text-black font-black py-4 rounded-xl text-[10px] uppercase tracking-widest"
        >
          Close
        </button>
      </ModalShell>

      <form action={handleAction} className="space-y-16">
        {/* ... Rest of your form UI ... */}
        <section className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 flex flex-wrap items-center justify-between gap-8">
           <div className="flex items-center gap-5">
             <Palette size={22} className="text-amber-500" />
             <h2 className="text-[11px] font-black uppercase text-white">Visual Identity</h2>
           </div>
           <input 
              type="color" 
              name="accentColor" 
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
            />
        </section>

        {/* Keeping your existing grid structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Form inputs here */}
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}