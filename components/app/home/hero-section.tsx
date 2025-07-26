"use client";
import HeroHeading from "./hero-heading";
import HeroButton from "./hero-button";
import HeroImage from "./hero-image";
import SectionLabel from "@/components/app/section-label";
import React, { useEffect, useState } from "react";

function AnimatedPaycasso() {
  const text = "Paycasso";
  const [visibleCount, setVisibleCount] = useState(0);
  useEffect(() => {
    if (visibleCount < text.length) {
      const timeout = setTimeout(() => setVisibleCount(visibleCount + 1), 100);
      return () => clearTimeout(timeout);
    }
  }, [visibleCount]);
  return (
    <div
      className="mx-auto text-center font-poppins font-bold"
      style={{
        width: 725,
        height: 90,
        color: "#E3E3E3",
        fontWeight: 700,
        fontSize: 72,
        lineHeight: "115%",
        marginTop: 220,
        marginBottom: 8,
      }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            opacity: i < visibleCount ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="w-full flex flex-col items-center font-poppins">
      <AnimatedPaycasso />
      <HeroHeading />
      <div className="mb-8 w-full flex justify-center">
        <HeroButton />
      </div>
      <div className="mb-8 w-full flex justify-center">
        <HeroImage />
      </div>
      <SectionLabel className="mt-12 mb-8 text-xl">
        Shaping the future of finance together
      </SectionLabel>
    </section>
  );
}
