"use client";
export default function HeroBackgroundVideo() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <video
        className="w-full h-auto object-cover opacity-70"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onError={(e) => console.error("Video loading error:", e)}
      >
        <source src="/bgVideo.mp4" type="video/mp4" />
        <source src="/bgVideo.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
