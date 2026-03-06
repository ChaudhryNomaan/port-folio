"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from 'next/image';
import siteData from '@/lib/site-config.json';

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 150]), 
    { stiffness: 60, damping: 20 }
  );

  const maskReveal = {
    initial: { y: "100%" },
    animate: { y: "0%" },
  };

  // Dynamic Accent Color from Admin
const accentColor = (siteData.about as any).accentColor || "#f59e0b";

  return (
    <main ref={containerRef} className="relative min-h-screen pt-56 pb-40 bg-[#0a0a0a] overflow-hidden">
      
      {/* ATMOSPHERIC GRADIENTS */}
      <div className="fixed top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full blur-[120px] pointer-events-none" 
           style={{ backgroundColor: `${accentColor}08` }} />
      
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 relative z-10">
        
        <header className="mb-40">
          <div className="flex items-center gap-4 mb-10">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 40 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="h-[1px]" 
              style={{ backgroundColor: accentColor }}
            />
            <span className="uppercase tracking-[0.8em] text-[10px] font-bold" style={{ color: accentColor }}>
              The Philosophy
            </span>
          </div>
          
          <h1 className="text-[12vw] md:text-[8.5vw] font-light leading-[0.85] tracking-tighter uppercase">
            <div className="overflow-hidden pb-2">
              <motion.span className="block text-white" variants={maskReveal} initial="initial" animate="animate" transition={{ duration: 1.2 }}>
                {siteData.about.headlineLine1}
              </motion.span>
            </div>
            <div className="overflow-hidden pb-4 -mt-2 md:-mt-6">
              <motion.span 
                className="block italic font-serif lowercase" 
                style={{ color: accentColor }}
                variants={maskReveal} initial="initial" animate="animate" transition={{ delay: 0.15, duration: 1.2 }}
              >
                {siteData.about.headlineLine2}
              </motion.span>
            </div>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24 items-start">
          <div className="lg:col-span-7 space-y-16">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
              <h2 className="text-3xl md:text-5xl font-light text-[#fafafa] leading-[1.15] tracking-tight">
                {siteData.about.subheading}
              </h2>
            </motion.div>

            {/* CUSTOMIZABLE IMAGE */}
            <motion.div 
              initial={{ opacity: 0, scale: 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900 border border-white/5 grayscale hover:grayscale-0 transition-all duration-1000"
            >
              <Image 
                src={siteData.about.aboutImage || "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85"} 
                alt="Studio Aesthetic" 
                fill 
                className="object-cover opacity-80"
              />
            </motion.div>

            <motion.div className="space-y-10 text-neutral-400 text-lg md:text-2xl font-light leading-relaxed max-w-2xl">
              <p>{siteData.about.p1}</p>
              {siteData.about.philosophy && <p className="text-neutral-200">{siteData.about.philosophy}</p>}

              <div className="pt-12 flex items-center gap-8">
                <span className="font-serif italic text-white/40 text-3xl">Portfolio.</span>
                <div className="flex-grow h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
              </div>
            </motion.div>
          </div>

          <motion.aside style={{ y: smoothY }} className="lg:col-span-5 space-y-16 lg:pl-16 relative mt-20 lg:mt-0">
            <div className="hidden lg:block absolute left-0 top-0 w-px h-full bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

            <div className="space-y-8">
              <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-500 font-bold">Capabilities</p>
              <ul className="space-y-6">
                {siteData.about.capabilities.map((item, i) => (
                  <li key={i} className="flex items-center gap-6 group cursor-default">
                    <span className="text-[10px] font-mono opacity-50 transition-colors" style={{ color: accentColor }}>0{i+1}</span>
                    <span className="text-sm uppercase tracking-widest text-neutral-300 group-hover:text-white transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-500 font-bold">Experience</p>
              <div className="flex items-end gap-3">
                <span className="text-7xl font-light text-white italic font-serif leading-none tabular-nums">
{(siteData.about as any).experienceYears}
                </span>
                <div className="pb-1 text-neutral-500">
                   <p className="text-[9px] uppercase tracking-widest leading-tight">Years of</p>
                   <p className="text-[9px] uppercase tracking-widest leading-tight">Industry Craft</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}