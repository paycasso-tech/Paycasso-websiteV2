"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-white hover:text-gray-200 transition-colors duration-300"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          transition={transition as any}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                transition={transition as any}
                layoutId="active"
                className="bg-black/80 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-xl"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate width based on scroll position
  const getNavbarWidth = () => {
    const maxScroll = 500; // Maximum scroll distance to consider
    const minWidth = 600; // Initial width in pixels
    const maxWidth = 400; // Final expanded width in pixels

    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    const currentWidth = minWidth + (maxWidth - minWidth) * scrollProgress;

    return `${currentWidth}px`;
  };

  // Calculate gap based on scroll position
  const getNavbarGap = () => {
    const maxScroll = 500; // Maximum scroll distance to consider
    const initialGap = 12; // Initial gap (space-x-12 equivalent)
    const finalGap = 6; // Final gap (space-x-6 equivalent)

    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    const currentGap = initialGap - (initialGap - finalGap) * scrollProgress;

    return `${currentGap * 0.25}rem`; // Convert to rem (Tailwind uses 0.25rem per unit)
  };

  return (
    <motion.nav
      onMouseLeave={() => setActive(null)}
      animate={{
        width: getNavbarWidth(),
        backdropFilter: isScrolled ? "blur(20px)" : "blur(10px)",
        gap: getNavbarGap(),
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.3,
      }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 rounded-full 
                 bg-gradient-to-r from-gray-900/70 via-black/80 to-gray-900/70 
                 border border-white/10 shadow-2xl backdrop-blur-md
                 flex justify-center items-center px-8 py-4"
      style={{
        background: `linear-gradient(135deg, 
          rgba(15, 23, 42, 0.8) 0%, 
          rgba(0, 0, 0, 0.9) 50%, 
          rgba(15, 23, 42, 0.8) 100%)`,
        gap: getNavbarGap(),
      }}
    >
      {children}
    </motion.nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="flex space-x-2 group">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl group-hover:shadow-white/20 transition-shadow duration-300"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-white group-hover:text-gray-200 transition-colors duration-300">
          {title}
        </h4>
        <p className="text-gray-300 text-sm max-w-[10rem] group-hover:text-gray-100 transition-colors duration-300">
          {description}
        </p>
      </div>
    </a>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <a
      {...rest}
      className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline underline-offset-4"
    >
      {children}
    </a>
  );
};
