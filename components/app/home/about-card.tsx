import React, { CSSProperties } from "react";
import Image from "next/image";

interface AboutCardProps {
  image: string;
  title: string;
  alt: string;
  children?: React.ReactNode;
  collapsed?: boolean;
  highlighted?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: CSSProperties;
}

export default function AboutCard({
  image,
  title,
  alt,
  children,
  collapsed,
  highlighted,
  onMouseEnter,
  onMouseLeave,
  style,
}: AboutCardProps) {
  return (
    <div
      className={`rounded-[24px] ${highlighted ? "bg-[#232323]/80" : "bg-[radial-gradient(135.33%_135.33%_at_5.71%_-44.13%,#000_0%,rgba(0,0,0,0.27)_100%)]"} backdrop-blur-[74.39px] flex flex-col items-center justify-center px-6 py-4 shadow-[9.35px_4.67px_16.59px_0px_#00000061] transition-all duration-500 overflow-hidden ${collapsed ? "h-[60px] py-2" : "h-[260px] py-4"}`}
      style={{ minHeight: collapsed ? 60 : 260, ...style }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {!collapsed && (
        <Image
          src={image}
          alt={alt}
          width={75}
          height={80}
          className="mb-3"
          style={{ objectFit: "contain" }}
        />
      )}
      <span className="block w-full text-center text-[18px] leading-[115%] font font-urbanist text-[#D7D7D7] drop-shadow-[9.35px_4.67px_16.59px_rgba(0,0,0,0.38)]">
        {title}
      </span>
      {/* Expandable content below title */}
      {!collapsed && children && (
        <div className="mt-2 w-full text-center text-white text-sm transition-opacity duration-500">
          {children}
        </div>
      )}
    </div>
  );
}
