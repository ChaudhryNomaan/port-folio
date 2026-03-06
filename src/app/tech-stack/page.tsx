"use client";

import React from 'react';
import { motion } from 'framer-motion';
import siteConfig from '@/lib/site-config.json';

// Luxury descriptions for specific tools
const toolMetadata: Record<string, { category: string, desc: string }> = {
  "Next.js": { category: "Framework", desc: "Architecting high-performance, SEO-optimized digital environments with server-side excellence." },
  "Motion Design": { category: "Animation", desc: "Bringing cinematic fluidity and physics-based motion to modern user interfaces." },
  "Architectural UI/UX": { category: "Design", desc: "Crafting meticulous, user-centric interfaces rooted in structural elegance and functional precision." },
  "TypeScript": { category: "Language", desc: "Ensuring type-safety and robust logic across complex, scalable digital ecosystems." },
  "Tailwind CSS": { category: "Styling", desc: "Crafting pixel-perfect minimalist layouts with utility-first precision and fluid design." },
};

export default function TechStackPage() {
  const easeExpo = [0.19, 1, 0.22, 1];
  
  // FIX: Cast siteConfig as any to prevent "property does not exist" errors
  const config = siteConfig as any;
  const dynamicTools = config.about?.capabilities || [];

  // FIX: Cast variants as any to allow the cubic-bezier array (easeExpo)
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1.2, ease: easeExpo } 
    }
  };

  return (
    <main className="min-h-screen pt-48 pb-40 px-8 md:px-16 lg:px-24 bg-[#0a0a0a] overflow-hidden relative">
      <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-amber-500/[0.02] blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        <header className="mb-32 space-y-8">
          <div className="flex items-center gap-4">
            <motion.div initial={{ width: 0 }} animate={{ width: 40 }} transition={{ duration: 1 }} className="h-px bg-amber-500" />
            <span className="text-amber-500 uppercase tracking-[0.8em] text-[10px] font-bold">The Arsenal</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-[9vw] font-light tracking-tighter leading-[0.8] text-white uppercase"
          >
            Core <span className="italic font-serif text-amber-500/90 lowercase">Stack</span>
          </motion.h1>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-white/5"
        >
          {dynamicTools.map((toolName: string, index: number) => {
            const meta = toolMetadata[toolName] || { 
              category: "Technology", 
              desc: "Specialized expertise utilized to deliver high-performance digital solutions and seamless user experiences." 
            };

            return (
              <motion.div
                key={toolName}
                variants={itemVariants}
                className="relative p-12 md:p-16 border-r border-b border-white/5 group overflow-hidden cursor-crosshair"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-16">
                    <span className="text-[10px] font-mono text-neutral-600 tracking-[0.4em] uppercase italic">REF.0{index + 1}</span>
                    <div className="h-2 w-2 bg-white/10 rounded-full group-hover:bg-amber-500 transition-colors duration-500" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-light text-white mb-4 group-hover:italic group-hover:text-amber-500 transition-all duration-500 font-serif">
                    {toolName}
                  </h3>
                  <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-10 font-bold">{meta.category}</p>
                  <p className="text-sm text-neutral-400 leading-relaxed font-light opacity-60 group-hover:opacity-100 transition-all duration-700">
                    {meta.desc}
                  </p>
                </div>
                <span className="absolute -bottom-4 -right-2 text-white/[0.02] text-[12rem] font-black select-none pointer-events-none group-hover:text-white/[0.04] transition-all duration-1000 font-serif italic">
                  {index + 1}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </main>
  );
}