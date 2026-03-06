"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { 
  Mail, Calendar, User, MessageSquare, Trash2, 
  CheckCircle, Circle, Save, Share2, CheckCircle2 
} from 'lucide-react';
import { deleteMessage, toggleMessageRead, updateContactSettings } from '@/actions/admin-actions';
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- PORTAL ENGINE (Handles Client-side Rendering of Modals) ---
function GlobalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(children, document.body) : null;
}

// --- LUXURY MODAL COMPONENT ---
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

// --- MAIN DASHBOARD COMPONENT ---
export default function AdminDashboard({ 
  initialMessages = [], 
  initialSettings = { 
    contact: { email: "", location: "", directPhone: "" },
    socials: [] 
  } 
}: any) {
  const [isPending, startTransition] = useTransition();
  const [showSuccess, setShowSuccess] = useState(false);

  // Safety: Ensure we are always filtering an array
  const safeMessages = Array.isArray(initialMessages) ? initialMessages : [];
  const unreadCount = safeMessages.filter((m: any) => !m?.read).length;

  const getSocialUrl = (label: string) => 
    initialSettings?.socials?.find((s: any) => s.label === label)?.url || "";

  const handleSaveSettings = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await updateContactSettings(formData);
        if (result?.success) {
          setShowSuccess(true);
        }
      } catch (error) {
        console.error("Failed to update settings:", error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 max-w-6xl mx-auto px-4 sm:px-6 pb-20 animate-in fade-in duration-700">
      
      {/* SUCCESS MODAL */}
      <ModalShell isOpen={showSuccess} onClose={() => setShowSuccess(false)}>
        <CheckCircle2 className="mx-auto text-amber-500 mb-6" size={56} strokeWidth={1.5} />
        <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-4">Configured</h3>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-10 leading-relaxed">
          Studio contact parameters and social network vectors have been updated successfully.
        </p>
        <button 
          onClick={() => setShowSuccess(false)} 
          className="w-full bg-white hover:bg-amber-500 text-black font-black py-6 rounded-2xl text-[11px] uppercase tracking-[0.4em] transition-all"
        >
          Confirm Update
        </button>
      </ModalShell>

      {/* --- STUDIO SETTINGS SECTION --- */}
      <section className="mb-16 md:mb-20 pt-8 md:pt-12">
        <header className="mb-8">
          <h2 className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-amber-500 font-bold mb-2">Studio Presence</h2>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">Global Configuration</h1>
        </header>

        <form action={handleSaveSettings} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-2xl space-y-10 md:space-y-12">
          {/* Contact Details */}
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <Mail className="text-amber-500" size={16} />
              <h3 className="text-[11px] md:text-sm font-black uppercase tracking-widest text-zinc-300">Direct Contact</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="space-y-2">
                <label className="text-[9px] uppercase font-bold text-zinc-500 ml-2">Email</label>
                <input name="email" defaultValue={initialSettings?.contact?.email || ""} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-xl md:rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-amber-500/20 font-medium text-sm md:text-base" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase font-bold text-zinc-500 ml-2">Location</label>
                <input name="location" defaultValue={initialSettings?.contact?.location || ""} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-xl md:rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-amber-500/20 font-medium text-sm md:text-base" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase font-bold text-zinc-500 ml-2">Phone</label>
                <input name="phone" defaultValue={initialSettings?.contact?.directPhone || ""} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-xl md:rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-amber-500/20 font-medium text-sm md:text-base" />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <Share2 className="text-amber-500" size={16} />
              <h3 className="text-[11px] md:text-sm font-black uppercase tracking-widest text-zinc-300">Social Networks</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {['LI', 'IG', 'TW', 'GH'].map((label) => (
                <div key={label} className="space-y-2">
                  <label className="text-[9px] uppercase font-bold text-zinc-500 ml-2">{label} URL</label>
                  <input 
                    name={`social_${label}`} 
                    defaultValue={getSocialUrl(label)} 
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-4 py-3 text-[11px] md:text-xs outline-none focus:ring-2 focus:ring-amber-500/20 font-mono" 
                    placeholder="https://..."
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex">
            <button 
              type="submit" 
              disabled={isPending}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-zinc-100 text-zinc-900 px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-amber-500 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              <Save size={18} className={isPending ? "animate-spin" : ""} /> 
              {isPending ? "Syncing..." : "Save All Settings"}
            </button>
          </div>
        </form>
      </section>

      {/* --- INBOX SECTION --- */}
      <section>
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-amber-500 block" />
                {unreadCount > 0 && <span className="absolute inset-0 w-3 h-3 rounded-full bg-amber-500 animate-ping" />}
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">Inbox</h1>
            </div>
            <p className="text-zinc-500 text-[9px] md:text-[10px] uppercase font-black tracking-[0.2em]">
              {unreadCount > 0 ? `${unreadCount} New Inquiries` : "All caught up"}
            </p>
          </div>
        </header>

        <div className="grid gap-6 md:gap-8">
          {safeMessages.length === 0 ? (
            <div className="py-24 md:py-32 text-center border-2 border-dashed border-zinc-800 rounded-[2rem] md:rounded-[3rem] bg-zinc-900/50">
              <MessageSquare className="text-zinc-800 mx-auto mb-6" size={32} />
              <p className="text-zinc-600 font-bold uppercase text-[9px] md:text-[10px] tracking-widest">No inquiries yet.</p>
            </div>
          ) : (
            safeMessages.map((msg: any) => (
              <div key={msg.id} className={`group relative overflow-hidden transition-all duration-500 rounded-[2rem] md:rounded-[2.5rem] border ${msg.read ? 'bg-zinc-900/40 border-zinc-800/50 opacity-70' : 'bg-zinc-900 border-zinc-800 shadow-2xl scale-[1.01]'}`}>
                <div className="p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
                  
                  {/* User Profile */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-start gap-4 md:gap-5">
                    <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all flex-shrink-0 ${msg.read ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-100 text-zinc-900'}`}>
                      <User className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-white text-xl md:text-2xl tracking-tighter truncate uppercase italic">{msg.name}</h3>
                      <p className="text-zinc-500 text-[8px] md:text-[9px] uppercase font-black tracking-widest flex items-center gap-1.5 mt-1">
                        <Calendar size={12} className="text-amber-500" /> {msg.date}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow space-y-4 md:space-y-6">
                    <a href={`mailto:${msg.email}`} className="inline-flex items-center gap-2 bg-zinc-950 text-zinc-400 border border-zinc-800 px-4 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all max-w-full">
                      <Mail size={12} /> <span className="truncate">{msg.email}</span>
                    </a>
                    <p className="text-zinc-300 text-sm md:text-lg italic font-serif border-l-2 md:border-l-4 border-zinc-800 pl-4 md:pl-6 py-1">
                      "{msg.vision}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-800/50">
<form action={async () => { await toggleMessageRead(msg.id); }} className="flex-1 lg:flex-initial">                      <button type="submit" className={`h-12 w-full lg:w-14 lg:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-colors ${msg.read ? 'text-zinc-600 bg-zinc-950 border border-zinc-800' : 'text-amber-500 bg-amber-500/10 border border-amber-500/20'}`}>
                        {msg.read ? <Circle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        <span className="lg:hidden ml-2 text-[10px] font-bold uppercase tracking-widest">Mark {msg.read ? 'Unread' : 'Read'}</span>
                      </button>
                    </form>
                    <form action={deleteMessage.bind(null, msg.id)} className="flex-1 lg:flex-initial">
                      <button type="submit" className="h-12 w-full lg:w-14 lg:h-14 bg-zinc-950 border border-zinc-800 text-zinc-600 hover:bg-red-900/30 hover:text-red-500 hover:border-red-500/30 rounded-xl md:rounded-2xl flex items-center justify-center transition-all">
                        <Trash2 className="w-5 h-5" />
                        <span className="lg:hidden ml-2 text-[10px] font-bold uppercase tracking-widest">Delete</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}