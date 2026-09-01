"use client";

import { useEffect, useState, useRef } from "react";
import { uploadFile } from "@/lib/upload";

interface ITestimonial {
  _id: string;
  name: string;
  title: string;
  videoUrl: string;
  sortOrder: number;
}

export default function RealPeoplePureLove() {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  // Video playback reference map to handle individual hover play/pause
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Drag scroll state references
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -340,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 340,
        behavior: "smooth",
      });
    }
  };

  async function loadTestimonials() {
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    setUploading(true);
    setModalError("");

    const result = await uploadFile(file, { maxSizeMB: 15, allowedTypes: ["video/"] });
    if (result.url) {
      setVideoUrl(result.url);
    } else {
      setModalError(result.error || "Failed to upload video file.");
      setVideoFile(null);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!name.trim() || !title.trim() || !videoUrl) {
      setModalError("Please fill in all fields and upload a short video review.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          title: title.trim(),
          videoUrl,
        }),
      });

      if (res.ok) {
        setModalSuccess(true);
        setName("");
        setTitle("");
        setVideoFile(null);
        setVideoUrl("");
      } else {
        const data = await res.json();
        setModalError(data.error || "Failed to submit video review.");
      }
    } catch (err) {
      setModalError("An unexpected error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  // Programmatically trigger autoplay as soon as testimonials are loaded/rendered
  useEffect(() => {
    if (testimonials.length > 0) {
      // Delay slightly to ensure video element references are fully mounted in React
      const timer = setTimeout(() => {
        testimonials.forEach((item) => {
          const video = videoRefs.current[item._id];
          if (video) {
            video.play().catch((err) => {
              console.log("Autoplay blocked by browser policy until interaction:", err);
            });
          }
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [testimonials]);

  if (loading) {
    return (
      <div className="py-16 bg-[#fffdf9] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-charcoal/50 uppercase tracking-widest">
          Loading stories of love...
        </span>
      </div>
    );
  }

  return (
    <section className="relative w-full bg-[#fffdf9] py-10 overflow-hidden select-none font-primary text-charcoal">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 w-full space-y-16">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative w-full">
          {/* Left/Center Group: Heading and Bubble */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-center md:text-left relative">
              <h2 className="text-center font-primary font-black text-3xl sm:text-[44px] leading-[1.05] uppercase tracking-tight text-[#4A4A4A]">
                OUR TRUSTED <br />
                <span className="relative inline-block mt-1">
                  REVIEW
                  <span className="absolute left-0 bottom-[-4px] w-full h-[4px] bg-[#9EAB75] rounded-full" />
                </span>
              </h2>
            </div>

            {/* Grateful Speech Bubble */}
            <div className="relative flex items-center justify-center shrink-0">
              {/* Speech Bubble Wrapper */}
              <div className="relative bg-white border-2 border-charcoal rounded-full px-6 py-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center z-10">
                {/* Pink Heart Behind Text */}
                <span className="absolute inset-0 flex items-center justify-center opacity-[0.15] z-0 pointer-events-none text-red-500 text-5xl">
                  ❤️
                </span>
                <p className="font-accent text-sm md:text-base font-bold text-[#4A4A4A] leading-tight text-center z-10">
                  we are grateful <br />
                  to have you
                </p>
              </div>
              {/* Bubble Tail */}
              <div className="absolute left-4 bottom-[-10px] w-5 h-5 bg-white border-r-2 border-b-2 border-charcoal rotate-45 z-0 shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
            </div>
          </div>

          {/* Right Group: Share your love button */}
          <div className="shrink-0 z-10">
            <button
              onClick={() => {
                setModalSuccess(false);
                setModalError("");
                setIsOpen(true);
              }}
              className="bg-[#9EAB75] text-dark hover:bg-[#869360] font-primary text-xs font-black uppercase tracking-wider px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all scale-100 active:scale-95 cursor-pointer"
            >
              + Share Your Love
            </button>
          </div>
        </div>

        {/* Dynamic Cards Container (Horizontal scroll on mobile, grid or flex on desktop) */}
        {testimonials.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-[#9EAB75]/40 rounded-3xl p-8 max-w-md mx-auto">
            <span className="text-3xl block mb-2">❤️</span>
            <p className="text-sm font-bold text-charcoal/60 uppercase tracking-wide">
              No stories shared yet. Be the first to share!
            </p>
          </div>
        ) : (
          <div className="relative group/slider w-full">
            {/* Left Scroll Button */}
            <button
              onClick={handleScrollLeft}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 bg-[#9EAB75] hover:bg-[#869360] text-dark w-12 h-12 rounded-full border border-black/5 flex items-center justify-center shadow-lg active:scale-95 transition-all opacity-0 group-hover/slider:opacity-100 duration-300 hidden lg:flex cursor-pointer animate-fadeIn"
              aria-label="Scroll Left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Drag scrollable flex container */}
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="flex overflow-x-auto scroll-hide gap-8 pb-10 pt-4 snap-x snap-mandatory px-4 cursor-grab active:cursor-grabbing select-none"
            >
              {testimonials.map((item) => (
                <div
                  key={item._id}
                  className="w-[290px] sm:w-[320px] shrink-0 snap-center bg-white border-4 border-[#9EAB75] rounded-[44px] p-6 shadow-[0_12px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between items-center text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(0,0,0,0.04)]"
                >
                  {/* Quote Header */}
                  <div className="h-16 flex items-center justify-center w-full mb-6">
                    <p className="font-primary font-black text-sm uppercase text-charcoal tracking-tight px-1 leading-tight line-clamp-3">
                      &ldquo;{item.title}&rdquo;
                    </p>
                  </div>

                  {/* Video container */}
                  <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden bg-stone-50 border border-black/5">
                    <video
                      ref={(el) => { videoRefs.current[item._id] = el; }}
                      src={item.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Customer footer name */}
                  <div className="mt-6 w-full text-center">
                    <span className="font-accent text-[20px] font-black text-charcoal italic border-b-2 border-black/25 pb-0.5 px-3">
                      {item.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Scroll Button */}
            <button
              onClick={handleScrollRight}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 bg-[#9EAB75] hover:bg-[#869360] text-dark w-12 h-12 rounded-full border border-black/5 flex items-center justify-center shadow-lg active:scale-95 transition-all opacity-0 group-hover/slider:opacity-100 duration-300 hidden lg:flex cursor-pointer animate-fadeIn"
              aria-label="Scroll Right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}



      </div>

      {/* Upload Love Video Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#fffdf9] border-4 border-[#9EAB75] rounded-[44px] p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 bg-charcoal/10 hover:bg-charcoal/20 text-charcoal rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all"
            >
              ✕
            </button>

            {!modalSuccess ? (
              <>
                <div className="text-center">
                  <h3 className="font-primary font-black text-xl uppercase tracking-tight text-charcoal">
                    Share Your Story
                  </h3>
                  <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider mt-1">
                    Upload a video sharing what you love about Sustento!
                  </p>
                </div>

                {modalError && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
                    ⚠️ {modalError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-charcoal/60 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Swarrangi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal bg-white"
                    />
                  </div>

                  {/* Review Text / Quote Input */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-charcoal/60 mb-1">
                      Your Quote / Review Title
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      placeholder="e.g. Can't stop eating it... finishing it in a week! 😂"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-black/10 text-xs font-bold focus:outline-none focus:border-charcoal bg-white"
                    />
                  </div>

                  {/* Video File Upload */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-charcoal/60 mb-1">
                      Short Video Review (MP4, Max 15MB)
                    </label>
                    <div className="flex flex-col gap-2">
                      <label className="w-full h-11 bg-charcoal hover:bg-black text-white font-primary text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors">
                        {uploading ? "Uploading Video..." : videoFile ? "Change Video File" : "📁 Choose Video File"}
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoSelect}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      {videoFile && (
                        <span className="block text-[9px] font-black text-[#84bd5e] text-center uppercase tracking-wider">
                          ✓ {videoFile.name} (Ready to submit)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="w-full bg-[#9EAB75] hover:bg-[#869360] text-dark font-black uppercase text-xs py-3.5 rounded-2xl shadow-md transition-all disabled:opacity-50 mt-4 cursor-pointer"
                  >
                    {submitting ? "Submitting..." : "Submit for Approval"}
                  </button>
                </form>
              </>
            ) : (
              // Success Screen inside Modal
              <div className="text-center py-6 space-y-4">
                <span className="text-5xl block animate-bounce">💖</span>
                <h3 className="font-primary font-black text-xl uppercase tracking-tight text-charcoal">
                  Thank You!
                </h3>
                <p className="text-xs font-bold text-charcoal/60 leading-relaxed uppercase tracking-wider">
                  Your video review has been successfully submitted. It will show up on our homepage as soon as the team approves it!
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-charcoal text-white hover:bg-black font-primary text-xs font-black uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-md transition-all mt-4 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
