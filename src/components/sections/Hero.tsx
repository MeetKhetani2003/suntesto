"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const TICKER_TEXT = "Fiber ✦ Anti-oxidants ✦ Vitamins ✦ 100% Real Fruit ✦ Good Fats ✦ Plant based ✦ No added Sugar ✦ No Preservatives ✦ Fiber ✦ Anti-oxidants ✦ Vitamins ✦ 100% Real Fruit ✦ Good Fats ✦ Plant based ✦ No added Sugar ✦ No Preservatives";

interface IHeroSlide {
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  titleHighlight: string;
  backgroundImageUrl?: string;
  backgroundVideoUrl?: string;
  mobileBackgroundImageUrl?: string;
  mobileBackgroundVideoUrl?: string;
}

export default function Hero() {
  const [slides, setSlides] = useState<IHeroSlide[]>([
    {
      badgeText: "Snacks",
      titleLine1: "WORLD'S LIGHTEST",
      titleLine2: "WHOLE FRUIT",
      titleLine3: "FREEZE-DRIED",
      titleHighlight: "Snacks",
      backgroundImageUrl: "",
      backgroundVideoUrl: "https://player.vimeo.com/external/435674703.sd.mp4?s=7f3747190d5656157e108e4726615b3c5a6104f6&profile_id=139&oauth2_token_id=57447761",
      mobileBackgroundImageUrl: "",
      mobileBackgroundVideoUrl: "",
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalTime, setIntervalTime] = useState(5000);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // States to trigger entrance staggered animation and deferred video play
  const [isMounted, setIsMounted] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [hideText, setHideText] = useState(false);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const mobileVideoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  useEffect(() => {
    // Reset animations on slide change
    setIsMounted(false);
    setHideText(false);

    // Staggered text entrance trigger
    const entranceTimer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    // Hide text timer after animations have fully settled and been readable
    const hideTimer = setTimeout(() => {
      setHideText(true);
    }, 3800);

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(hideTimer);
    };
  }, [currentIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPlayVideo(true);
    }, 1800); // 1.8 seconds delay allowing text animations to fully settle
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const activeVideo = videoRefs.current[currentIndex];
    if (activeVideo) {
      activeVideo.play().catch((err) => {
        console.log("Programmatic background video autoplay failed or pending interaction:", err);
      });
    }
    const activeMobileVideo = mobileVideoRefs.current[currentIndex];
    if (activeMobileVideo) {
      activeMobileVideo.play().catch((err) => {
        console.log("Programmatic mobile background video autoplay failed or pending interaction:", err);
      });
    }
  }, [currentIndex, slides]);

  useEffect(() => {
    async function fetchHeroSettings() {
      try {
        const res = await fetch("/api/hero");
        if (res.ok) {
          const data = await res.json();
          if (data.slides && data.slides.length > 0) {
            setSlides(data.slides);
          }
          if (data.autoPlayInterval) {
            setIntervalTime(data.autoPlayInterval);
          }
        }
      } catch (err) {
        console.error("Failed to load hero settings dynamically:", err);
      }
    }
    fetchHeroSettings();
  }, []);

  // Setup autoplay timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, intervalTime);
  };

  useEffect(() => {
    if (slides.length > 1) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, slides.length, intervalTime]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <section className="relative w-full h-[100dvh] min-h-[600px] bg-charcoal overflow-hidden group">
      {/* ── Slides Container (Horizontal Shift) ──────────────── */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="w-full h-full shrink-0 relative flex items-center justify-center"
          >
            {/* Background Media */}
            <div className="absolute inset-0 w-full h-full">
              {/* Desktop background image */}
              {slide.backgroundImageUrl && (
                <Image
                  src={slide.backgroundImageUrl}
                  alt={`Hero slide ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  className={`object-cover ${slide.mobileBackgroundImageUrl ? "hidden md:block" : "block"}`}
                  unoptimized
                />
              )}

              {/* Mobile background image */}
              {slide.mobileBackgroundImageUrl && (
                <Image
                  src={slide.mobileBackgroundImageUrl}
                  alt={`Hero slide ${idx + 1} mobile`}
                  fill
                  priority={idx === 0}
                  className="object-cover block md:hidden"
                  unoptimized
                />
              )}

              {/* Desktop Video */}
              {slide.backgroundVideoUrl && (
                <video
                  ref={(el) => { videoRefs.current[idx] = el; }}
                  src={slide.backgroundVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className={`absolute inset-0 w-full h-full object-cover ${slide.mobileBackgroundVideoUrl ? "hidden md:block" : "block"}`}
                />
              )}

              {/* Mobile Video */}
              {slide.mobileBackgroundVideoUrl && (
                <video
                  ref={(el) => { mobileVideoRefs.current[idx] = el; }}
                  src={slide.mobileBackgroundVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover block md:hidden"
                />
              )}
              {/* Media Overlay Mask (overlay on top of all media for text contrast) */}
              <div className="absolute inset-0 bg-black/15 bg-gradient-to-b from-black/15 to-black/30" />
            </div>

            {/* Slide Text Content */}
            <div className={`relative z-10 w-full max-w-[1200px] mx-auto px-6 text-center -mt-16 transition-all duration-1000 ${
              hideText ? "opacity-0 pointer-events-none translate-y-[-12px]" : "opacity-100 translate-y-0"
            }`}>
              <div className="flex flex-col items-center">
                {/* <p className={`font-accent text-3xl md:text-4xl text-yellow mb-2 -rotate-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-700 ease-out ${
                  isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                }`}>
                  {slide.badgeText}
                </p> */}
                <h1 className="font-primary font-black text-white leading-[1.05] uppercase tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex flex-col items-center">
                  <span className={`text-[34px] sm:text-[50px] md:text-[70px] lg:text-[84px] transition-all duration-700 ease-out delay-200 ${
                    isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}>
                    {slide.titleLine1}
                  </span>
                  <span className={`text-[38px] sm:text-[56px] md:text-[80px] lg:text-[96px] text-white transition-all duration-700 ease-out delay-400 ${
                    isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}>
                    {slide.titleLine2}
                  </span>
                  <span className={`text-[38px] sm:text-[56px] md:text-[80px] lg:text-[96px] text-white transition-all duration-700 ease-out delay-600 ${
                    isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}>
                    {slide.titleLine3}{" "}
                    <em className="font-accent text-white not-italic inline-block -rotate-2">
                      {slide.titleHighlight}
                    </em>
                  </span>
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Left / Right Navigation Chevrons ────────────────── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 active:scale-95 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-md cursor-pointer opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Previous Slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 active:scale-95 text-white w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-md cursor-pointer opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Next Slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? "bg-[#9EAB75] w-6" : "bg-white/45 hover:bg-white"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Wavy Yellow Bottom Ticker Ribbon ────────────────── */}
      <div className="absolute left-0 bottom-0 w-full z-20 pointer-events-none translate-y-[1px]">
        <svg
          viewBox="0 0 1440 190"
          preserveAspectRatio="none"
          className="w-full h-24 sm:h-32 md:h-40 xl:h-48 block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <path
              id="text-wave"
              d="M -20 110 Q 240 30 480 110 T 960 110 T 1460 110"
              fill="none"
            />
            <path
              id="solid-wave"
              d="M 0 110 Q 240 30 480 110 T 960 110 T 1440 110 L 1440 190 L 0 190 Z"
            />
          </defs>

          {/* Solid base that matches the next section's background color */}
          <use href="#solid-wave" fill="#fffff9" />

          {/* The Olive Green Ribbon */}
          <use
            href="#text-wave"
            stroke="#9EAB75"
            strokeWidth="45"
            fill="none"
            strokeLinecap="round"
          />

          <text
            className="font-primary font-extrabold uppercase fill-black"
            style={{ fontSize: "16px", letterSpacing: "1px" }}
          >
            <textPath href="#text-wave" startOffset="0%">
              {TICKER_TEXT}
              <animate
                attributeName="startOffset"
                from="0%"
                to="-50%"
                dur="35s"
                repeatCount="indefinite"
              />
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  );
}