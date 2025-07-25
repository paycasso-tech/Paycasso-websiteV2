"use client";
import { useState, useEffect } from "react";
import AboutCard from "./about-card";
import Image from "next/image";
// import "./home.css"

const cards = [
  {
    image: "/vision.svg",
    title: "Our Vision",
    alt: "Vision Icon",
    content:
      "Our vision is to revolutionize global work payments with secure, low-cost, and transparent smart contract-based escrow and instant USDC settlements",
  },
  {
    image: "/advantages.svg",
    title: "Bypass local currency instability",
    alt: "Advantages Icon",
    content:
      "Pay and get paid in stablecoins USDC which are pegged 1:1 with US dollars",
  },
  {
    image: "/how-it-works.svg",
    title: "Dual sided protection",
    alt: "How it Works Icon",
    content:
      "Fairness guaranteed for both sides. Funds locked in smart contract escrow until contract conditions are met",
  },
  {
    image: "/about-rocket.svg",
    title: "Put Your Idle Crypto to Work",
    alt: "Lorem Ipsum Icon",
    content:
      "Convert Bitcoin, Ethereum, and other tokens to USDC and pay freelancers and gig workers instantly",
  },
];

function getColumn(idx: number) {
  return idx % 2;
}
function getOtherRowIdx(idx: number) {
  return idx < 2 ? idx + 2 : idx - 2;
}

export default function AboutSection() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [leftAnim, setLeftAnim] = useState(0);
  const [rightAnim, setRightAnim] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const leftDir = 0.8;
    const rightDir = -0.8;
    let leftPos = 0;
    let rightPos = 0;

    const interval = setInterval(() => {
      leftPos += leftDir;
      rightPos += rightDir;

      // Enhanced floating animation with sine wave for smoother movement
      setLeftAnim(
        Math.sin(leftPos * 0.02) * 24 + Math.cos(leftPos * 0.015) * 12,
      );
      setRightAnim(
        Math.sin(rightPos * 0.02) * 24 + Math.cos(rightPos * 0.015) * 12,
      );
    }, 16); // 60fps for smoother animation

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCardMouseEnter = (idx: number) => {
    setExpanded(idx);
    setHoveredCard(idx);
  };

  const handleCardMouseLeave = () => {
    setExpanded(null);
    setHoveredCard(null);
  };

  return (
    <section
      className="relative w-full flex flex-col items-center justify-center min-h-screen py-16"
      style={{ overflow: "visible" }}
    >
      {/* Enhanced background images with improved animations */}
      <Image
        src="/about-bg-left.svg"
        alt="Background Left"
        width={600}
        height={800}
        className={`absolute left-0 z-0 pointer-events-none select-none transition-all duration-1000 ease-out`}
        style={{
          top: "20%",
          transform: `translateX(${leftAnim}px) translateY(${Math.sin(leftAnim * 0.1) * 8}px) rotate(${Math.sin(leftAnim * 0.05) * 2}deg)`,
          opacity: hoveredCard !== null ? 0.7 : 0.9,
          filter: `blur(${hoveredCard !== null ? "1px" : "0px"})`,
        }}
        draggable={false}
      />
      <Image
        src="/about-bg-right.svg"
        alt="Background Right"
        width={700}
        height={900}
        className={`absolute right-0 z-0 pointer-events-none select-none transition-all duration-1000 ease-out`}
        style={{
          top: "25%",
          transform: `translateX(${rightAnim}px) translateY(${Math.sin(rightAnim * 0.1) * -6}px) rotate(${Math.sin(rightAnim * 0.05) * -1.5}deg)`,
          opacity: hoveredCard !== null ? 0.7 : 0.9,
          filter: `blur(${hoveredCard !== null ? "1px" : "0px"})`,
        }}
        draggable={false}
      />

      {/* Subtle parallax effect overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.02), transparent 40%)`,
          transition: "background 0.3s ease",
        }}
      />

      <div
        className="relative z-10 grid grid-cols-2 gap-y-8 gap-x-24"
        style={{
          width: 560,
          transform: hoveredCard !== null ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {cards.map((card, idx: number) => {
          let isExpanded = false;
          let isCollapsed = false;
          if (expanded === idx) {
            isExpanded = true;
          } else if (
            expanded !== null &&
            getOtherRowIdx(expanded) === idx &&
            getColumn(expanded) === getColumn(idx)
          ) {
            isCollapsed = true;
          }

          const isNonExpandedCard = expanded !== null && expanded !== idx;

          return (
            <AboutCard
              key={card.title}
              image={card.image}
              title={card.title}
              alt={card.alt}
              collapsed={isCollapsed}
              highlighted={expanded === idx}
              onMouseEnter={() => handleCardMouseEnter(idx)}
              onMouseLeave={handleCardMouseLeave}
              style={{
                width: 300,
                height: isExpanded ? 260 : isCollapsed ? 60 : 200,
                transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isExpanded
                  ? "scale(1.05) translateY(-8px)"
                  : isNonExpandedCard
                    ? "scale(0.95) translateY(4px)"
                    : "scale(1) translateY(0px)",
                filter: isExpanded
                  ? "brightness(1.1) contrast(1.05)"
                  : isNonExpandedCard
                    ? "brightness(0.8) contrast(0.9)"
                    : "brightness(1) contrast(1)",
                boxShadow: isExpanded
                  ? "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)"
                  : isNonExpandedCard
                    ? "0 2px 8px rgba(0,0,0,0.1)"
                    : "0 8px 16px rgba(0,0,0,0.1)",
                zIndex: isExpanded ? 20 : 10,
              }}
            >
              {expanded === idx && (
                <div
                  style={{
                    animation: "fadeInUp 0.4s ease-out forwards",
                    opacity: 0,
                    transform: "translateY(10px)",
                  }}
                  className="animate-fade-in-up"
                >
                  {card.content}
                </div>
              )}
            </AboutCard>
          );
        })}
      </div>

      {/* Add some floating particles effect */}
      <div className="absolute inset-0 pointer-events-none z-1">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animation: `floatParticle${i} ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }

        @keyframes floatParticle0 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes floatParticle1 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-15px) translateX(-8px);
          }
        }

        @keyframes floatParticle2 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-25px) translateX(5px);
          }
        }

        @keyframes floatParticle3 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-18px) translateX(-12px);
          }
        }

        @keyframes floatParticle4 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-22px) translateX(7px);
          }
        }

        @keyframes floatParticle5 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-16px) translateX(-6px);
          }
        }
      `}</style>
    </section>
  );
}
