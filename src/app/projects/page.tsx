"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence, LayoutGroup } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';
import projectData from '@/lib/projects.json'; 

const categories = ["All", "Web", "Mobile", "Creative"];

// Animation variants for consistency with your sample
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function ProjectsPage() {
  const containerRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("All");

const projects = (projectData.projects as any[]) || [];

  // Parallax logic for background elements
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -80]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const bgYearY = useTransform(scrollYProgress, [0, 1], ["45%", "55%"]);

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <main ref={containerRef} className="min-h-screen pt-48 pb-60 bg-[#000] relative overflow-hidden">
      
      {/* BACKGROUND WATERMARK */}
      <motion.div 
        style={{ y: bgYearY, rotate: 90 }}
        className="fixed top-1/2 right-[-12%] origin-center pointer-events-none z-0 hidden lg:block"
      >
        <span className="text-[20vw] font-black text-white/[0.015] uppercase tracking-tighter select-none font-serif italic">
          MMXXVI
        </span>
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 relative z-10">
        
        {/* HEADER SECTION - Styled to match "The Archive" aesthetic */}
        <motion.div 
          style={{ y: headerY, opacity: headerOpacity }}
          className="mb-24 md:mb-32"
        >
          <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: 30 }} 
                  className="h-px bg-amber-500" 
                />
                <span className="text-amber-500 uppercase tracking-[0.8em] text-[8px] font-bold block">
                  Portfolio
                </span>
              </div>
              <h1 className="text-6xl md:text-[5vw] font-light tracking-tighter leading-[0.9] uppercase text-white">
                The <span className="italic font-serif lowercase text-amber-500/90">Archive</span>
              </h1>
            </div>

            <div className="text-right font-mono hidden md:block pb-2">
              <p className="text-[8px] uppercase tracking-[0.4em] text-neutral-600 mb-1">Index Size</p>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={filteredProjects.length}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-4xl font-light text-neutral-400 tabular-nums"
                >
                  {filteredProjects.length.toString().padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* CATEGORY NAV */}
          <nav className="flex gap-8 md:gap-10 pt-8 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`text-[8px] uppercase tracking-[0.4em] transition-all duration-500 relative pb-2 whitespace-nowrap ${
                  activeFilter === cat ? "text-white" : "text-neutral-600 hover:text-neutral-400"
                }`}
              >
                {cat}
                {activeFilter === cat && (
                  <motion.div 
                    layoutId="activeFilter" 
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-amber-500"
                  />
                )}
              </button>
            ))}
          </nav>
        </motion.div>
        
        {/* PROJECT GRID - Balanced for 12px Rounded Cards */}
        <LayoutGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 lg:gap-x-20 lg:gap-y-32">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((proj, index) => {
                const isEven = index % 2 !== 0;
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-5%" }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.16, 1, 0.3, 1],
                      delay: (index % 2) * 0.1 
                    }}
                    key={proj.id} 
                    className={`relative w-full group ${isEven ? 'md:mt-24' : ''}`}
                  >
                    {/* Meta Reference Label */}
                    <div className="mb-4 flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                       <span className="text-[7px] uppercase tracking-[0.6em] text-neutral-500 font-mono">
                        MOD_{proj.id.toString().slice(-4)}
                      </span>
                    </div>

                    <ProjectCard 
                      project={proj} 
                      index={index}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </LayoutGroup>

        {/* CTA SECTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="mt-64 pt-32 border-t border-white/5 flex flex-col items-center"
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter text-white text-center mb-10 leading-[1.2]">
            Ready to start <br /> <span className="italic font-serif text-amber-500/80">something new?</span>
          </h2>
          <Link 
            href="/inquiry" 
            className="px-10 py-4 border border-white/10 rounded-full text-[9px] uppercase tracking-[0.5em] text-white hover:bg-white hover:text-black transition-all duration-700 hover:scale-105 active:scale-95"
          >
            Send Inquiry
          </Link>
        </motion.div>
      </div>
    </main>
  );
}