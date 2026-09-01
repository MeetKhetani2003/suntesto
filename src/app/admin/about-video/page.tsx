"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { uploadFile } from "@/lib/upload";

export default function AdminAboutVideoPage() {
  const [heading, setHeading] = useState("OUR JOURNEY IN MOTION");
  const [videoUrl, setVideoUrl] = useState("/videos/about-story.mp4");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/about-video");
        if (res.ok) {
          const data = await res.json();
          setHeading(data.heading || "OUR JOURNEY IN MOTION");
          setVideoUrl(data.videoUrl || "/videos/about-story.mp4");
          setDescription(data.description || "");
        } else {
          setError("Failed to fetch About Us Video configuration.");
        }
      } catch (err) {
        setError("Error loading configuration from database.");
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setError("");
    setSuccess("");

    const result = await uploadFile(file, { maxSizeMB: 30, allowedTypes: ["video/"] });
    if (result.url) {
      setVideoUrl(result.url);
      setSuccess("Video uploaded successfully.");
    } else {
      setError(result.error || "Failed to upload video file.");
    }
    setUploadingVideo(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/about-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heading, videoUrl, description }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("About Us Video settings saved successfully!");
      } else {
        setError(data.error || "Failed to save settings.");
      }
    } catch (err) {
      setError("Unexpected error saving settings.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">
          Loading Video Config...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 select-none font-primary">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin"
            className="text-xs font-bold text-charcoal/60 hover:text-charcoal flex items-center gap-1 mb-1"
          >
            ← Back to Dashboard
          </Link>
          <h2 className="font-primary font-black text-2xl md:text-3xl uppercase tracking-tight text-charcoal">
            About Video Settings
          </h2>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
          ✅ {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Settings Panel */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-3">
              Video Section Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OUR JOURNEY IN MOTION"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Video File
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Enter video URL or upload file"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white"
                  />
                  <label className="shrink-0 px-4 py-3 bg-charcoal text-white hover:bg-black font-primary text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center h-11 min-w-[120px]">
                    {uploadingVideo ? "Uploading..." : "Upload Video"}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoUpload}
                      disabled={uploadingVideo}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell your story..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal bg-white leading-relaxed"
                />
              </div>
            </div>

            <div className="border-t border-black/5 pt-5 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-charcoal hover:bg-black text-white font-primary text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </form>

        {/* Right Column: Section Live Mock Preview (cols 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal border-b border-black/5 pb-2">
              Live Mock Preview
            </h3>

            <div className="w-full bg-[#fffff9] border border-black/5 rounded-2xl p-6 flex flex-col items-center select-none relative overflow-hidden min-h-[380px] justify-between">
              {/* Simulated Heading */}
              <div className="w-full text-center mb-4">
                <h4 className="font-primary font-black text-[15px] text-charcoal uppercase tracking-tight leading-none border-b-2 border-[#9EAB75]/50 pb-1.5 inline-block">
                  {heading || "OUR STORY IN MOTION"}
                </h4>
              </div>

              {/* Simulated Video Player */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center border border-black/10 shadow-inner">
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-white/40">
                    No Video Selected
                  </div>
                )}
              </div>

              {/* Simulated Description */}
              <div className="w-full text-center mt-4 pt-3 border-t border-black/5">
                <p className="font-primary text-[10px] sm:text-xs text-charcoal/60 leading-relaxed font-semibold">
                  {description || "At Sustento, we believe in bringing you the purest form of nutrition..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
