"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type InstagramPost = {
  _id?: string;
  imageSrc: string;
  textOverlay?: string;
  likes: number;
  mediaType?: "image" | "video";
};

export default function InstagramGrid() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/instagram-posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error("Failed to load Instagram posts dynamically:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#FAF9F5] py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-3 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <p className="font-primary font-bold text-xs uppercase tracking-wider text-charcoal/50">
          Loading Instagram Feed...
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-warm-white py-8 overflow-hidden select-none border-t border-black/5">
      {/* Inline styles for custom marquee animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-marquee {
          animation: marquee 70s linear infinite;
        }
      `}} />

      {/* ── Section Header ─────────────────────────────────────── */}
      <div className="w-full text-center relative max-w-[800px] mx-auto px-6 mb-12">
        <h2 className="relative font-primary font-black text-3xl sm:text-[40px] md:text-[49px] text-charcoal leading-tight sm:leading-none uppercase tracking-tight text-center">
          <div className="inline-flex items-center justify-center gap-2 align-middle">
            {/* Yellow vector sunburst */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#9EAB75] shrink-0">
              <path d="M12,2 L12,6 M12,18 L12,22 M2,12 L6,12 M18,12 L22,12 M5,5 L8,8 M16,16 L19,19 M5,19 L8,16 M16,8 L19,5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span>ON THE</span>
          </div>
          <span className="relative inline-block ml-2 mt-2 sm:mt-0">
            #SUSTENTO FEED
            <span className="absolute left-0 bottom-[-4px] w-full h-[4px] bg-[#9EAB75] rounded-full"></span>
          </span>
        </h2>
      </div>

      {/* ── Horizontal Instagram Carousel Track ────────────────── */}
      <div className="w-full overflow-hidden py-2">
        <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
          {[...posts, ...posts].map((post, idx) => (
            <div
              key={post._id ? `${post._id}-${idx}` : idx}
              className="group relative shrink-0 w-[185px] sm:w-[225px] aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              {/* Instagram post media (image or video) */}
              {post.imageSrc && (
                post.mediaType === "video" ? (
                  <video
                    src={post.imageSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <Image
                    src={post.imageSrc}
                    alt="Instagram post feed mockup"
                    fill
                    sizes="(max-width: 768px) 185px, 225px"
                    className="object-cover z-0 transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                )
              )}

              {/* Gradient text protection overlay */}
              {post.textOverlay && (
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
              )}

              {/* Bold White Title Text Overlay */}
              {post.textOverlay && (
                <p className="absolute inset-x-3 bottom-3 z-10 font-primary font-black text-white text-[11px] sm:text-[13px] leading-tight uppercase text-left drop-shadow-sm select-none pointer-events-none">
                  {post.textOverlay}
                </p>
              )}

              {/* Hover Dark Overlay showing Likes Counter */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex items-center justify-center text-white pointer-events-none">
                <div className="flex items-center gap-1.5 font-primary font-black text-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-red-500 animate-pulse">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>{post.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
