"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, Globe } from 'lucide-react';
import { saveInquiry } from '../../actions/admin-actions';

export default function ContactForm({ settings }: { settings: any }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', vision: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setStatus('sending');
    try {
      const result = await saveInquiry(formData);
      if (result.success) {
        setStatus('success');
      } else {
        alert("Something went wrong. Please try again.");
        setStatus('idle');
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("A network error occurred.");
      setStatus('idle');
    }
  };

  const containerClasses = "group border-b border-white/10 py-8 focus-within:border-amber-500/50 transition-all duration-700 relative";
  const labelClasses = "text-[10px] uppercase tracking-[0.4em] text-neutral-600 group-focus-within:text-amber-500 group-focus-within:-translate-y-2 transition-all duration-500";
  const inputClasses = "w-full bg-transparent outline-none pt-4 pb-2 text-xl md:text-3xl font-light placeholder:text-neutral-800 focus:placeholder:opacity-0 transition-all text-white font-sans";

  return (
    <main className="min-h-screen pt-48 pb-20 px-8 md:px-16 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-10%,#fbbf2408,transparent_60%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-amber-500" />
              <span className="text-amber-500 uppercase tracking-[0.8em] text-[10px] font-bold">Inquiries</span>
            </div>
            <h1 className="text-6xl md:text-[9rem] font-light tracking-tighter leading-[0.85] text-white">
              Let&apos;s build <br />
              <span className="italic font-serif text-amber-500/90 lowercase">iconic</span> things.
            </h1>
          </motion.div>
        </header>
        
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <SuccessState reset={() => { setStatus('idle'); setFormData({name:'', email:'', vision:''}); }} />
          ) : (
            <motion.form 
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <input type="checkbox" name="_honeypot" className="hidden" tabIndex={-1} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24">
                <div className={containerClasses}>
                  <p className={labelClasses}>01. Your Name</p>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={inputClasses} 
                    placeholder="Name.."
                  />
                </div>
                
                <div className={containerClasses}>
                  <p className={labelClasses}>02. Email Address</p>
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={inputClasses} 
                    placeholder="Email..."
                  />
                </div>
              </div>
              
              <div className={containerClasses}>
                <div className="flex justify-between items-center">
                  <p className={labelClasses}>03. The Vision</p>
                  <span className="text-[10px] font-mono text-neutral-700 tabular-nums">
                    {formData.vision.length} / 500
                  </span>
                </div>
                <textarea 
                  required
                  maxLength={500}
                  value={formData.vision}
                  onChange={(e) => setFormData({...formData, vision: e.target.value})}
                  className={`${inputClasses} h-32 md:h-48 resize-none`} 
                  placeholder="Tell me about your project goals..." 
                />
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center pt-16 gap-8">
                <p className="text-neutral-500 text-[11px] max-w-xs font-light leading-relaxed uppercase tracking-wider">
                  By submitting, you acknowledge that quality takes time. Expect a curated response within 24 hours.
                </p>
                
                <button 
                  disabled={status === 'sending'}
                  className="relative group w-full md:w-auto px-12 py-6 overflow-hidden rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all hover:border-amber-500/50 disabled:opacity-50"
                >
                  <motion.div 
                    className="absolute inset-0 bg-amber-500"
                    initial={{ y: "101%" }}
                    whileHover={status !== 'sending' ? { y: 0 } : {}}
                    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.5em] font-bold text-white group-hover:text-black transition-colors duration-500">
                    {status === 'sending' ? "Transmitting..." : "Send Inquiry"}
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-16 pt-20 border-t border-white/5">
          <ContactDetail 
            label="Direct" 
            value={settings.contact.email} 
            subValue={settings.contact.directPhone} 
          />
          <ContactDetail 
            label="Location" 
            value={settings.contact.location} 
            subValue={<LiveClock />} 
          />
          <div className="space-y-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-600">Socials</p>
            <div className="flex gap-8">
              {settings.socials?.map((social: any) => (
                <a 
                  key={social.label} 
                  href={social.url || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-white hover:text-amber-500 transition-all font-mono tracking-tighter hover:-translate-y-1 inline-block"
                >
                  [{social.label}]
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit', minute: '2-digit', hour12: true
      }).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="flex items-center gap-2">
      <Globe size={12} className="text-amber-500 animate-[spin_10s_linear_infinite]" />
      {time} GMT
    </span>
  );
}

function ContactDetail({ label, value, subValue }: { label: string, value: string, subValue: React.ReactNode }) {
  return (
    <div className="space-y-4 group">
      <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-600 group-hover:text-amber-500 transition-colors">{label}</p>
      <p className="text-lg font-light text-neutral-200">{value}</p>
      <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{subValue}</div>
    </div>
  );
}

function SuccessState({ reset }: { reset: () => void }) {
  return (
    <motion.div 
      key="success"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-32 flex flex-col items-center text-center gap-8"
    >
      <div className="h-24 w-24 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
        <CheckCircle2 size={48} className="text-amber-500" />
      </div>
      <div className="space-y-4">
        <h3 className="text-5xl font-serif italic tracking-tight text-white">Transmission Complete.</h3>
        <p className="text-neutral-500 text-lg font-light max-w-md mx-auto">
          Your vision has been received. Expect a response as soon as the creative alignment is processed.
        </p>
      </div>
      <button 
        type="button"
        onClick={reset}
        className="mt-12 text-[10px] uppercase tracking-[0.4em] text-amber-500 hover:text-white transition-colors border-b border-amber-500/20 pb-2"
      >
        Send another message
      </button>
    </motion.div>
  );
}