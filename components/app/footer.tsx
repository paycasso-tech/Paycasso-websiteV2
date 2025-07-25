"use client";
import React from "react";

const FOOTER_CONTENT = {
  brand: {
    title: "Paycasso",
    links: [
      { label: "Where", href: "#" },
      { label: "Convenience", href: "#" },
      { label: "Meets Security, Services", href: "#" },
    ],
  },
  nav: [
    { label: "Home", href: "#" },
    { label: "About Wallet", href: "#" },
    { label: "How it works?", href: "#" },
    { label: "Documentation for developers", href: "#" },
  ],
  faq: {
    title: "FAQ",
    contact: "Contact us:",
    queries: [
      {
        label: "Integration related queries:",
        email: "info.paycasso@gmail.com",
      },
      {
        label: "Business related queries:",
        email: "business.paycasso@gmail.com",
      },
    ],
  },
};

export default function Footer() {
  const [isVisible, setIsVisible] = React.useState(false);
  const paycassoRef = React.useRef<HTMLHeadingElement>(null);

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
    <div className="flex flex-col justify-center items-center w-full bg-black">
      <div className="w-full max-w-5xl grid sm:grid-cols-2 md:grid-cols-3 gap-5 p-10 pb-0">
        <div>
          <h3 className="text-white text-2xl  font-semibold mb-4">
            {FOOTER_CONTENT.brand.title}
          </h3>
          <ul className="text-sm space-y-1">
            {FOOTER_CONTENT.brand.links.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="text-neutral-300">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:flex md:justify-center">
          <ul className="text-sm space-y-1">
            {FOOTER_CONTENT.nav.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="text-neutral-300">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:flex md:justify-end">
          <div className="space-y-1">
            <h3 className="text-white text-lg  font-semibold mb-4">
              {FOOTER_CONTENT.faq.title}
            </h3>
            <div className="text-sm">{FOOTER_CONTENT.faq.contact}</div>
            <ul className="text-sm space-y-1">
              {FOOTER_CONTENT.faq.queries.map((item) => (
                <li key={item.email}>
                  <div>{item.label}</div>
                  <a href="#" className="text-neutral-500">
                    {item.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center py-8">
        <h1
          ref={paycassoRef}
          className={`text-5xl font-bold sm:text-8xl md:text-8xl lg:text-[9rem] xl:text-[11rem] 2xl:text-[14rem] bg-linear-to-b from-neutral-700 via-neutral-800 duration-1000 transition-all to-neutral-950 bg-clip-text ease-[cubic-bezier(0.45,0,0.55,1)] text-transparent leading-tight 
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-26"}
          `}
        >
          Paycasso
        </h1>
      </div>
    </div>
  );
}
