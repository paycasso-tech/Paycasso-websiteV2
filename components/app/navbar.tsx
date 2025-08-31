"use client";
import LogoSection from "./logo-section";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./navbar-menu";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { IoArrowRedoCircleOutline } from "react-icons/io5";
import Link from "next/link";

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
          <MenuItem setActive={setActive} active={active} item="Our Flow"  route="/experience"/>
          <Link href="/dashboard">  
          <Button className="py-3 px-4 bg-white text-black font-semibold text-md rounded-4xl hover:bg-gray-300" >Get App<IoArrowRedoCircleOutline/></Button>
          </Link>
        </div>
      </Menu>
    </div>
  );
}
