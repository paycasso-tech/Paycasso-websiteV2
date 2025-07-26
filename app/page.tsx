import HeroSection from "@/components/app/home/hero-section";
import AboutSection from "@/components/app/home/about-section";
import VisionSection from "@/components/app/home/vision-section";
import Footer from "@/components/app/footer";
import CallToAction from "@/components/app/home/call-to-action";
import WhyChooseUs from "@/components/app/home/why-choose-us";
import OurServices from "@/components/app/home/our-services";
import Navbar from "@/components/app/navbar";
import HeroBackgroundVideo from "@/components/app/home/hero-background-video";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen relative">
        <HeroBackgroundVideo />
        <div className="relative z-10 overflow-hidden">
          <HeroSection />
          <AboutSection />
          <WhyChooseUs />
          <OurServices />
          <VisionSection />
          <CallToAction />
          <Footer />
        </div>
      </main>
    </>
  );
}
