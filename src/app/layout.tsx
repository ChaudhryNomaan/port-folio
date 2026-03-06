"use client";

import { usePathname } from 'next/navigation';
import { Montserrat, Playfair_Display } from 'next/font/google';
import { motion, useSpring } from 'framer-motion'; // Added Framer Motion
import React, { useEffect, useState } from 'react';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat',
  display: 'swap', 
  weight: ['300', '400', '500', '700'],
});

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-serif', 
  style: ['italic', 'normal'],
  display: 'swap',
});

// Internal Custom Cursor Component
function CustomCursor() {
  const mouseX = useSpring(0, { damping: 25, stiffness: 250 });
  const mouseY = useSpring(0, { damping: 25, stiffness: 250 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Detect if hovering over interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], .group');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div 
      className="fixed top-0 left-0 w-4 h-4 bg-amber-500 rounded-full z-[9999] pointer-events-none mix-blend-difference hidden lg:block"
      style={{ 
        x: mouseX, 
        y: mouseY, 
        translateX: "-50%", 
        translateY: "-50%" 
      }}
      animate={{
        scale: isHovering ? 3.5 : 1,
      }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className={`${montserrat.variable} ${playfair.variable} font-sans bg-[#0a0a0a] text-[#fafafa] antialiased selection:bg-amber-500/30 selection:text-amber-200 lg:cursor-none`}
      >
        {/* The Global Cursor */}
        {!isAdmin && <CustomCursor />}

        {!isAdmin && (
          <>
            <div className="fixed inset-0 pointer-events-none z-[9999]">
              <div className="absolute inset-0 bg-grain opacity-[0.03] mix-blend-overlay" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(10,10,10,0.2)_100%)]" />
            </div>
            <div className="fixed hidden md:block inset-6 border border-white/5 pointer-events-none z-[50]" />
          </>
        )}

        <div className="relative z-10 flex flex-col min-h-screen">
          {!isAdmin && <Navbar />}
          
          <main className="flex-grow">
            {children}
          </main>

          {!isAdmin && <Footer />}
        </div>

        <div id="cursor-portal" />
      </body>
    </html>
  );
}