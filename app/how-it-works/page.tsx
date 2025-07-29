"use client";
import Footer from "@/components/app/footer";
import CallToAction from "@/components/app/home/call-to-action";
import LaptopScreenView from "@/components/app/laptop-screen-view";
import Navbar from "@/components/app/navbar";
import SectionUnderlineLabel from "@/components/app/section-underline-label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BlurFade } from "@/components/ui/blur-fade";
import { motion } from "motion/react";
export default function HowItWorks() {
  return (
    <>
      <Navbar />
      <div className="w-full bg-gradient-to-br min-h-screen h-full flex items-center pt-10 md:pt-20 relative">
        <BlurFade delay={0.25} inView>
          <div className="space-y-3 px-5 md:px-10 lg:px-20 xl:px-30 z-3">
            <div className="font-medium text-3xl sm:text-7xl md:text-7xl lg:text-7xl xl:text-7xl">
              <h3>
                One Wallet
              </h3>
              <h3>
                Infinite Possibilities
              </h3>
            </div>
            <p className="text-sm sm:text-base max-w-lg md:max-w-xl text-neutral-400 md:text-lg ">
              We break down every step - from setup to transactions, making crypto management clear, quick and stress-free
            </p>
            <Button className="rounded-full hover:bg-white bg-white text-black font-normal px-5 md:py-5 shadow-none sm:text-base md:text-lg">
              Try Now
            </Button>
          </div>
        </BlurFade>
        <motion.div
          initial={{ y: 0, scale: 1 }}
          animate={{
            y: [-10, 10, -10],
            scale: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeOut"
          }}
          className="absolute center md:top-0 sm:w-full -z-1"
        >
          <Image
            src="/how-it-works/cubes-bg.svg"
            alt=""
            height={300}
            width={400}
            className="w-full"
          />
        </motion.div>
      </div>
      <div className="px-5 my-5 sm:my-10">
        <SectionUnderlineLabel title="How It Works ?" />
        <div className="w-full flex justify-center items-center relative" style={{
          backgroundImage: "url('/how-it-works/bg-text.svg')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}>
          <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 z-2">
            <div className="space-y-3 px-8 py-10 rounded-br-none rounded-[3.75rem] relative timeline-1">
              <BlurFade delay={0.25} inView className="space-y-3">
                <Image
                  src="/how-it-works/timeline-1.svg"
                  alt=""
                  width={400}
                  height={300}
                  className="w-16 md:w-20"
                />
                <h3 className="font-medium">
                  Signup on Paycasso
                </h3>
                <p className="max-w-xs text-neutral-500 text-sm sm:text-base">
                  Create your Web3 wallet in minutes with our intuitive platform. Experienced secure, blockchain-powered transactions.
                </p>
                {/* <div className="absolute right-0 top-0 w-2 h-2 bg-white"></div> */}
              </BlurFade>
            </div>
            <div className="hidden md:flex">

            </div>
            <div className="hidden md:flex">

            </div>
            <div className="space-y-3 px-8 py-10 border border-t-0 md:border-t -my-[0.2px] border-neutral-600 rounded-tl-none border-l-0 flex justify-end rounded-bl-none rounded-[3.75rem]">
              <BlurFade delay={0.25} inView className="space-y-3">
                <Image
                  src="/how-it-works/timeline-2.svg"
                  alt=""
                  width={400}
                  height={300}
                  className="w-16 md:w-20"
                />
                <h3 className="font-medium">
                  Top-up your wallet (Client Side)
                </h3>
                <p className="max-w-xs text-neutral-500 text-sm sm:text-base">
                  Top up with your preferred fiat currency or transfer crypto from your existing wallet (like MetaMask) to your Paycasso wallet created at signup. Instantly convert your assets whether fiat or crypto into USDC.
                </p>
              </BlurFade>
            </div>
            <div className="space-y-3 px-8 py-10 border border-t-0 md:border-t rounded-r-none border-r-0 border-neutral-600 rounded-[3.75rem] -my-[0.7px]">
              <BlurFade delay={0.25} inView className="space-y-3">
                <Image
                  src="/how-it-works/timeline-3.svg"
                  alt=""
                  width={400}
                  height={300}
                  className="w-16 md:w-20"
                />
                <h3 className="font-medium">
                  Form a Smart Contract
                </h3>
                <p className="max-w-xs text-neutral-500 text-sm sm:text-base">
                  Initiate secure, blockchain-powered agreements with service provider/freelancer.
                </p>
              </BlurFade>
            </div>
            <div className="hidden md:flex">

            </div>
            <div className="hidden md:flex">

            </div>
            <div className="space-y-3 px-8 py-10 border flex justify-end border-t-0 md:border-t -mt-[0.2px] rounded-l-none border-l-0 border-neutral-600 rounded-[3.75rem]">
              <BlurFade delay={0.25} inView className="space-y-3">
                <Image
                  src="/how-it-works/timeline-4.svg"
                  alt=""
                  width={400}
                  height={300}
                  className="w-16 md:w-20"
                />
                <h3 className="font-medium">
                  Work Delivered. Funds Released.
                </h3>
                <p className="max-w-xs text-neutral-500 text-sm sm:text-base">
                  Escrowed USDC is unlocked as soon as milestones are met—removing delays, disputes, and friction from global payments.
                </p>
              </BlurFade>
            </div>
            <div className="space-y-3 px-8 py-10 border-t-0 md:border-t border -my-[0.75px] rounded-r-none border-r-0 border-neutral-600 rounded-[3.75rem]">
              <BlurFade delay={0.25} inView className="space-y-3">
                <Image
                  src="/how-it-works/timeline-5.svg"
                  alt=""
                  width={400}
                  height={300}
                  className="w-16 md:w-20"
                />
                <h3 className="font-medium">
                  Decentralized Dispute Resolution
                </h3>
                <p className="max-w-xs text-neutral-500 text-sm sm:text-base">
                  If issues arise, raise a dispute—neutral DAO reviewers ensure fair, transparent outcomes for both parties.
                </p>
              </BlurFade>
            </div>
            <div className="hidden md:flex">

            </div>
          </div>
          <Image src="/how-it-works/asteroid-1.png" width={300} height={300} alt="" className="absolute rotate-15 top-0 left-0 z-1 w-32 sm:w-44 md:w-72" />
        </div>
      </div>
      <LaptopScreenView />
      <div className="px-5 z-2">
        <CallToAction />

      </div>
      <Footer />
    </>
  )
}