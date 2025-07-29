"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

export default function LaptopScreenView() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = divRef.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [])

  return (
    <div ref={divRef} className="px-5 py-10 flex justify-center items-center overflow-hidden">
      <div className={`w-full duration-1000 transition-all ${isVisible ? "opacity-100 translate-y-0 scale-90" : "opacity-0 translate-y-[20rem] scale-100"} ease-[cubic-bezier(0.45,0,0.55,1)]`}>
        <Image
          src="/how-it-works/macbook-bg.svg"
          width={500}
          height={500}
          alt=""
          className="w-full"
        />
      </div>
    </div>
  )
}