"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, LayoutGroup } from 'framer-motion';
import Link from 'next/link';
import Hero from '../components/Hero';
import projectData from '@/lib/projects.json'; 

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  const featuredProjects = (projectData.projects || []).filter(
    (project: any) => project.featured === true
  );

  // Global mouse for the subtle background spotlight effect
  const gMouseX = useSpring(0, { damping: 25, stiffness: 150 });
  const gMouseY = useSpring(0, { damping: 25, stiffness: 150 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    const handleMouseMove = (e: MouseEvent) => {
      gMouseX.set(e.clientX);
      gMouseY.set(e.clientY);
    };
    window.addEventListener("resize", checkMobile);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
    };
  }, [gMouseX, gMouseY]);

  const backgroundSpotlight = useTransform(
    [gMouseX, gMouseY],
    ([x, y]) => `radial-gradient(circle 500px at ${x}px ${y}px, rgba(217, 119, 6, 0.08), transparent)`
  );

  return (
    <div className="relative z-10 min-h-screen selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden pt-24">
      
      {!isMobile && (
        <motion.div 
          className="fixed inset-0 z-0 pointer-events-none opacity-50"
          style={{ background: backgroundSpotlight }}
        />
      )}

      <Hero />
      
      <section className="py-48 md:py-80 px-6 flex flex-col items-center justify-center relative z-20 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <p className="text-4xl md:text-8xl font-light tracking-tight leading-[1.1] text-[#e5e5e5]">
            Simplicity is the <br />
            <span className="font-serif italic text-white inline-block relative">
              ultimate sophistication
              <motion.span 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-2 left-0 w-full h-[1px] bg-amber-500/40 origin-left"
              />
            </span>
          </p>
        </motion.div>
      </section>

      <section className="px-6 md:px-12 pb-60 relative z-20 mt-20">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex justify-between items-end mb-32 border-b border-white/5 pb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-[1px] bg-amber-500" />
                <h2 className="text-[10px] uppercase tracking-[0.8em] text-amber-500 font-bold">Selected Works</h2>
              </div>
              <p className="text-gray-400 text-xl font-light">A curated collection of digital experiences.</p>
            </div>
          </div>
          
          <LayoutGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-32">
              {featuredProjects.map((project: any, index: number) => (
                <div 
                  key={project.id} 
                  className={index % 2 !== 0 ? 'md:mt-24' : ''}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </LayoutGroup>

          <div className="mt-40 flex justify-center">
             <Link href="/projects" className="group flex flex-col items-center gap-4 transition-opacity hover:opacity-70">
                <span className="text-[10px] uppercase tracking-[0.6em] text-gray-500">Explore full archive</span>
                <div className="w-px h-20 bg-gradient-to-b from-amber-500 to-transparent" />
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseSpringX = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseSpringY = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseSpringY, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseSpringX, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }} 
      style={{ perspective: '1200px', width: '100%' }}
    >
      <Link href={`/projects/${project.id}`} className="no-underline text-inherit block group">
        <motion.div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ 
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.05)',
            backgroundColor: '#0d0d0d',
            aspectRatio: '16/11',
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
          whileHover="hover"
        >
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '20px',
              padding: '1px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.2))',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              opacity: 0,
              zIndex: 2
            }}
            variants={{ hover: { opacity: 1, transition: { duration: 0.4 } } }}
          />

          <motion.img 
            src={project.coverImage} 
            alt={project.title} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          
          <motion.div
            variants={{ hover: { x: '200%', transition: { duration: 1.2, ease: "easeInOut" } } }}
            initial={{ x: '-100%', skewX: -45 }}
            className="absolute top-0 left-0 w-[50%] h-full z-[1] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
            }}
          />
        </motion.div>

        <div className="py-6 px-1">
          <div className="text-[9px] text-amber-500 font-bold uppercase tracking-[0.5em] mb-2">
            {project.category}
          </div>
          <h3 className="text-xl text-white font-light uppercase tracking-tight group-hover:text-amber-500 transition-colors duration-500">
            {project.title.split(' ').map((word: string, i: number) => (
              <span key={i} className={i % 2 !== 0 ? "italic font-serif opacity-60" : ""}>
                {word}{" "}
              </span>
            ))}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}