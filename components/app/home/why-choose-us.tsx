"use client";
import React, { useState, useEffect } from "react";
import { IconBrandOpenai } from "@tabler/icons-react";
import { SiHuggingface } from "react-icons/si";
import SectionUnderlineLabel from "@/components/app/section-underline-label";
import Image from "next/image";

export default function WhyChooseUs() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById("why-choose-us");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      id: 0,
      colSpan: "col-span-3 lg:col-span-2",
      icon: "/website/dual.svg",
      title: "Dual Sided Protection",
      description: (
        <div className="text-neutral-400">
          <p className="w-full max-w-xs text-sm mb-2">
            Fairness{" "}
            <span className="text-neutral-200 font-semibold">
              guaranteed for both sides
            </span>
          </p>
          <p className="w-full max-w-[18rem] text-sm">
            Funds locked in{" "}
            <span className="text-neutral-200 font-semibold">
              smart escrow contract
            </span>{" "}
            until milestones are completed
          </p>
        </div>
      ),
      features: [
        "✓ 100% user friendly",
        "✓ Will become your companion",
        "✓ Easy to use",
      ],
      illustration: "/website/lock-vector.svg",
    },
    {
      id: 1,
      colSpan: "col-span-3 lg:col-span-1",
      icon: "/website/secure-icon.svg",
      title: "Secure and Trust-free",
      description: (
        <p className="w-full text-sm text-neutral-400">
          <span className="text-neutral-200 font-semibold">
            Funds are secured in decentralized escrow
          </span>{" "}
          until tasks are verified.
        </p>
      ),
      hasMarquee: true,
    },
    {
      id: 2,
      colSpan: "col-span-3 lg:col-span-1",
      icon: "/website/dispute.svg",
      title: "Dispute Resolution with DAOs",
      description: (
        <p className="w-full text-sm text-neutral-400">
          Disputes are handled transparently{" "}
          <span className="text-neutral-200 font-semibold">
            not controlled by Paycasso servers.
          </span>
        </p>
      ),
      hasDispute: true,
    },
    {
      id: 3,
      colSpan: "col-span-3 lg:col-span-1",
      icon: "/website/choose-arrow.svg",
      title: "Your Pocket Friendly Crypto",
      bgImage: true,
    },
    {
      id: 4,
      colSpan: "col-span-3 lg:col-span-1",
      icon: "/website/ml.svg",
      title: "AI Integration",
      description: (
        <p className="w-full text-sm text-neutral-400">
          Integrate your favourite ML-models to{" "}
          <span className="text-neutral-200 font-semibold">
            store, index and search vector embeddings
          </span>
        </p>
      ),
      hasML: true,
    },
  ];

  return (
    <div
      id="why-choose-us"
      className="flex flex-col justify-center mt-10 md:mt-20 items-center w-full px-4 md:px-6 lg:px-8"
    >
      <SectionUnderlineLabel title="Why Choose Us" />

      <div className="w-full max-w-5xl py-10">
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`${card.colSpan} relative bg-neutral-950/80 backdrop-blur-sm border border-neutral-800/50 flex flex-col justify-between h-80 md:h-96 lg:h-112 rounded-2xl overflow-hidden group transition-all duration-700 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 ${isInView
                ? "translate-y-0 opacity-100"
                : "translate-y-16 opacity-0"
                }`}
              style={{
                transitionDelay: `${index * 150}ms`,
                ...(card.bgImage && {
                  backgroundImage: "url('/website/pocket-friendly.svg')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }),
              }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10 space-y-4 p-4 md:p-6 lg:p-7">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Image
                      width={200}
                      height={200}
                      src={card.icon}
                      className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                      alt=""
                    />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl text-white group-hover:text-blue-100 transition-colors duration-300">
                    {card.title}
                  </h3>
                </div>
                {card.description && (
                  <div className="transform group-hover:translate-y-[-2px] transition-transform duration-300">
                    {card.description}
                  </div>
                )}
              </div>

              {/* Card-specific content */}
              {card.features && (
                <div className="relative z-10 px-4 md:px-6 lg:px-7">
                  <ul className="text-sm space-y-1 text-neutral-300">
                    {card.features.map((feature, i) => (
                      <li
                        key={i}
                        className={`transform transition-all duration-500 ${hoveredCard === card.id
                          ? "translate-x-2 text-green-400"
                          : ""
                          } pb-4`}
                        style={{ transitionDelay: `${i * 100}ms` }}
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {card.illustration && (
                <Image
                  width={200}
                  height={200}
                  src={card.illustration}
                  className={`absolute w-full max-w-64 lg:max-w-70 right-4 md:right-8 top-1/2 -translate-y-1/3 opacity-30 group-hover:opacity-50 transition-all duration-500 ${hoveredCard === card.id ? "scale-110 rotate-3" : ""
                    }`}
                  alt="Illustration"
                />
              )}

              {card.hasMarquee && (
                <div className="space-y-3 overflow-hidden pb-5 md:pb-10 lg:pb-16">
                  {[60, 30, 45].map((duration, i) => (
                    <div
                      key={i}
                      className={`animate-marquee-horizontal flex gap-3 text-neutral-400 group-hover:text-neutral-300 transition-colors duration-500`}
                      style={
                        { "--duration": `${duration}s` } as React.CSSProperties
                      }
                    >
                      {new Array(20).fill(0).map((_, index) => (
                        <div
                          key={index}
                          className="py-2 px-4 border rounded-lg border-neutral-700 hover:border-blue-500/30 transition-colors duration-300 whitespace-nowrap text-xs"
                        >
                          user{Math.floor(Math.random() * 9999)}@example.com
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {card.hasDispute && (
                <div className="pb-5 md:pb-16 relative px-4 md:px-6 lg:px-7">
                  <div
                    className={`transition-transform duration-500 ${hoveredCard === card.id ? "scale-105" : ""}`}
                  >
                    <Image
                      width={200}
                      height={200}
                      src="/website/dispute-resolution.svg"
                      className="w-full max-w-60 lg:max-w-72 mb-10 opacity-80"
                      alt="Dispute resolution"
                    />
                  </div>
                  <div
                    className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-full text-xs text-nowrap w-fit border border-green-500/30 bg-green-500/10 px-4 py-2 backdrop-blur-sm transition-all duration-500 ${hoveredCard === card.id ? "scale-105 glow-green" : ""
                      }`}
                  >
                    Verified reviewers{" "}
                    <span className="text-green-400 font-semibold">
                      across globe
                    </span>
                  </div>
                </div>
              )}

              {card.hasML && (
                <>
                  <div className="p-4 md:p-6 lg:p-7 text-sm space-y-3 z-10 relative">
                    <div
                      className={`flex items-center gap-3 text-neutral-300 hover:text-white transition-all duration-300 ${hoveredCard === card.id ? "translate-x-2" : ""}`}
                    >
                      <IconBrandOpenai className="w-5 h-5" />
                      <span>OpenAI</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 text-neutral-300 hover:text-white transition-all duration-300 ${hoveredCard === card.id ? "translate-x-2" : ""}`}
                      style={{ transitionDelay: "100ms" }}
                    >
                      <SiHuggingface className="w-5 h-5" />
                      <span>Hugging Face</span>
                    </div>
                  </div>
                  <Image
                    width={200}
                    height={200}
                    src="/website/ml-models.svg"
                    className={`absolute h-full -bottom-7 right-0 opacity-20 group-hover:opacity-30 transition-all duration-500 ${hoveredCard === card.id ? "scale-110" : ""
                      }`}
                    alt="ML models"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-horizontal {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee-horizontal {
          animation: marquee-horizontal var(--duration, 30s) linear infinite;
        }

        .glow-green {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }

        @media (max-width: 768px) {
          .grid-cols-3 > * {
            grid-column: span 3;
          }
        }

        @media (min-width: 1024px) {
          .lg\\:col-span-2 {
            grid-column: span 2;
          }
          .lg\\:col-span-1 {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
