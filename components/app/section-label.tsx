import React from "react";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const SectionLabel: React.FC<SectionLabelProps> = ({
  children,
  className = "",
  style = {},
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center gap-2 ${className}`}
      style={{ width: 1442, height: 59, opacity: 1, ...style }}
    >
      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
        }}
      />
      <span className="text-white text-base font-medium tracking-wide text-center select-none">
        {children}
      </span>
      <div
        className="w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
        }}
      />
    </div>
  );
};

export default SectionLabel;
