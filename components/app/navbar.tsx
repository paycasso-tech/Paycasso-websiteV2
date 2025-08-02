"use client";
import LogoSection from "./logo-section";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./navbar-menu";
import { cn } from "@/lib/utils";

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-2 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <div className="flex flex-col space-y-4 text-sm">
          <LogoSection />
        </div>
        {/* Prevent wrapping and add spacing */}
        <div className="flex flex-row gap-x-8 whitespace-nowrap items-center">
          <MenuItem setActive={setActive} active={active} item="Home" route="/"/>
          <MenuItem setActive={setActive} active={active} item="How It Works" route="/how-it-works"/>
          <MenuItem setActive={setActive} active={active} item="Our Flow" route="/experience"/>
          <MenuItem setActive={setActive} active={active} item="Raise Dispute" route="/raise-dispute"/>
        </div>
      </Menu>
    </div>
  );
}
