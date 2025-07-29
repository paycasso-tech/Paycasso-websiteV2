"use client";
import SectionUnderlineLabel from "@/components/app/section-underline-label";
import Image from "next/image";
import React from "react";

export default function OurServices() {
  const [isVisible, setIsVisible] = React.useState(false);
  const paycassoRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = paycassoRef.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col my-10 md:my-20 justify-center items-center w-full relative">
      <Image
        alt=""
        width={200}
        height={200}
        src="/website/square-grid-bg.svg"
        className="w-full absolute top-0 lg:-top-56"
      />
      <SectionUnderlineLabel title="Our Services" />
      <div className="w-full max-w-5xl grid md:grid-cols-4 relative gap-5 py-10 pb-0 z-3">
        <div className="px-3 md:px-5 py-5 space-y-3 border border-neutral-800 rounded-xl bg-black md:col-span-1">
          <Image
            src="/website/smart-contract-escrow.svg"
            alt=""
            className="w-12 h-12 mb-3"
            width={400}
            height={400}
          />
          <h3 className="text-xl font-medium text-white">
            Smart Contract Escrow
          </h3>
          <p className="text-neutral-500 text-sm">
            Create trustless agreements between clients and freelancers funds
            are locked until work is completed and approved.
          </p>
        </div>
        <div className="md:col-span-2 relative">
          <Image
            width={200}
            height={200} src="/our-services/welcome.svg" className="w-full" alt="" />
          <div ref={paycassoRef}>
            <Image
              alt=""
              width={200}
              height={200}
              src="/our-services/middle-sphere.svg"
              className="absolute w-56 left-1/2 mt-3  z-2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>
        {/* <div className="px-3 md:px-5 py-5 flex justify-center bg-linear-to-b from-neutral-950 to-neutral-800  border rounded-xl md:col-span-2 border-t-0 border-b-0 relative">
          <h1 className="font-medium text-3xl md:text-4xl lg:text-5xl mt-5">
            Welcome!
          </h1>
          <div className="bg-black absolute -bottom-px border border-b-0 left-1/2 -translate-x-1/2 rounded-t-full w-66 h-33"></div>
        </div> */}
        <div className="px-3 md:px-5 py-5 space-y-3 border border-neutral-800 rounded-xl bg-black col-span-1">
          <Image
            src="/website/gasless-transaction.svg"
            alt=""
            width={200}
            height={200}
            className="w-12 h-12 mb-3"
          />
          <h3 className="text-xl font-medium text-white">
            Gasless Transactions
          </h3>
          <p className="text-neutral-500 text-sm">
            Transact without worrying about gas fees powered by Base and
            optimized for efficiency.
          </p>
        </div>
        <div className="px-3 md:px-5 py-5 space-y-3 border border-neutral-800 rounded-xl bg-black col-span-1 md:pt-10">
          <Image
            src="/our-services/instant-settlement.svg"
            alt=""
            width={200}
            height={200}
            className="w-12 h-12 mb-3"
          />
          <h3 className="text-xl font-medium text-white">
            Instant USDC Settlements
          </h3>
          <p className="text-neutral-500 text-sm">
            Receive or send payments globally with zero delays settle in USDC
            instantly through blockchain rails.
          </p>
        </div>
        <div
          className="px-3 md:px-5 py-5 space-y-3 border border-neutral-800 rounded-xl bg-transparent col-span-1 md:pt-22"
          style={{
            backgroundImage: "url(/our-services/orange-svg-bg.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Image
            src="/our-services/fiat-onboarding.svg"
            alt=""
            width={200}
            height={200}
            className="w-12 h-12 mb-3"
          />
          <h3 className="text-xl font-medium text-white mt-7">
            Fiat & Crypto Onboarding
          </h3>
          <p className="text-neutral-500 text-sm">
            Top up using fiat or existing crypto convert directly to USDC in
            your Paycasso wallet to get started.
          </p>
        </div>
        <div
          className="px-3 md:px-5 py-5 space-y-3 border border-neutral-800 rounded-xl bg-transparent col-span-1 md:pt-22"
          style={{
            backgroundImage: "url(/our-services/purple-svg-bg.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex justify-end">
            <Image
              width={200}
              height={200}
              src="/our-services/borderless-tools.svg"
              alt=""
              className="w-12 h-12 mb-3"
            />
          </div>
          <h3 className="text-xl font-medium text-white">
            Borderless Business Tools
          </h3>
          <p className="text-neutral-500 text-sm">
            Enable your freelance agency or business to serve global clients
            securely with blockchain-powered infrastructure.
          </p>
        </div>
        <div className="px-3 md:px-5 py-5 space-y-3 border border-neutral-800 rounded-xl bg-black col-span-1 md:pt-10">
          <Image
            width={200}
            height={200}
            src="/our-services/dispute-res.svg"
            alt=""
            className="w-12 h-12 mb-3"
          />
          <h3 className="text-xl font-medium text-white">
            Decentralized Dispute Resolution
          </h3>
          <p className="text-neutral-500 text-sm">
            Raise disputes when needed DAO-based reviewers ensure fair, unbiased
            outcomes without centralized interference.
          </p>
        </div>
      </div>
      <Image
        width={200}
        height={200}
        alt=""
        src="/our-services/services-background.svg"
        className={`absolute w-full z-1 bottom-0 transition-all duration-700 ease-[cubic-bezier(0.45,0,0.55,1)] ${isVisible
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-32"
          }`}
      />
    </div>
  );
}
