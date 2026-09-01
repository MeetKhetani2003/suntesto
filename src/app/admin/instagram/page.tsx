"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { uploadFile } from "@/lib/upload";

interface IInstagramPost {
  _id?: string;
  imageSrc: string;
  textOverlay?: string;
  likes: number;
  order: number;
  mediaType?: "image" | "video";
}

export default function AdminInstagramPage() {
  const [posts, setPosts] = useState<IInstagramPost[]>([
    {
      imageSrc: "",
      textOverlay: "",
      likes: 0,
      order: 0,
    }
  ]);
  const [activePostIndex, setActivePostIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchInstagramPosts() {
      try {
        const res = await fetch("/api/instagram-posts");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPosts(data);
          }
        } else {
          setError("Failed to fetch Instagram posts.");
        }
      } catch (err) {
        setError("Error loading Instagram posts.");
      } finally {
        setLoading(false);
      }
    }
    fetchInstagramPosts();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");
    setSuccess("");

    const isVideo = file.type.startsWith("video/");
    const mediaType = isVideo ? "video" : "image";

    const result = await uploadFile(file, { maxSizeMB: 15, allowedTypes: ["image/", "video/"] });
    if (result.url) {
      setPosts((prev) => {
        const next = [...prev];
        next[activePostIndex] = {
          ...next[activePostIndex],
          imageSrc: result.url!,
          mediaType: mediaType,
        };
        return next;
      });
      setSuccess(`${isVideo ? "Video" : "Image"} for Post ${activePostIndex + 1} uploaded successfully.`);
    } else {
      setError(result.error || "Failed to upload file.");
    }
    setUploadingImage(false);
  };

  const updateActivePostField = (field: keyof IInstagramPost, value: any) => {
    setPosts((prev) => {
      const next = [...prev];
      next[activePostIndex] = {
        ...next[activePostIndex],
        [field]: value,
      };
      return next;
    });
  };

  const movePostUp = (idx: number) => {
    if (idx === 0) return;
    setPosts((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[idx - 1];
      next[idx - 1] = temp;
      return next;
    });
    if (activePostIndex === idx) {
      setActivePostIndex(idx - 1);
    } else if (activePostIndex === idx - 1) {
      setActivePostIndex(idx);
    }
  };

  const movePostDown = (idx: number) => {
    if (idx === posts.length - 1) return;
    setPosts((prev) => {
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[idx + 1];
      next[idx + 1] = temp;
      return next;
    });
    if (activePostIndex === idx) {
      setActivePostIndex(idx + 1);
    } else if (activePostIndex === idx + 1) {
      setActivePostIndex(idx);
    }
  };

  const deletePost = (idx: number) => {
    if (posts.length <= 1) {
      setError("You must keep at least one post.");
      return;
    }
    setPosts((prev) => prev.filter((_, i) => i !== idx));
    if (activePostIndex === idx) {
      setActivePostIndex(idx > 0 ? idx - 1 : 0);
    } else if (activePostIndex > idx) {
      setActivePostIndex(activePostIndex - 1);
    }
    setSuccess(`Post ${idx + 1} deleted from local list. Save configuration to apply.`);
  };

  const addPost = () => {
    const newPost: IInstagramPost = {
      imageSrc: "",
      textOverlay: "New Instagram Post",
      likes: 50,
      order: posts.length,
      mediaType: "image",
    };
    setPosts((prev) => [...prev, newPost]);
    setActivePostIndex(posts.length);
    setSuccess("New post added to the list. Configure its details and click Save.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate that all posts have an image URL
    const invalidPostIdx = posts.findIndex(p => !p.imageSrc);
    if (invalidPostIdx !== -1) {
      setError(`Post ${invalidPostIdx + 1} is missing an Image URL.`);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/instagram-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Instagram Feed posts saved successfully!");
      } else {
        setError(data.error || "Failed to save feed.");
      }
    } catch (err) {
      setError("Unexpected error saving Instagram feed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">
          Loading Instagram Feed...
        </p>
      </div>
    );
  }

  const activePost = posts[activePostIndex] || posts[0] || {};

  return (
    <div className="max-w-7xl mx-auto space-y-6 select-none font-primary">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/admin"
            className="text-xs font-bold text-charcoal/60 hover:text-charcoal flex items-center gap-1 mb-1"
          >
            ← Back to Dashboard
          </Link>
          <h2 className="font-primary font-black text-2xl md:text-3xl uppercase tracking-tight text-charcoal">
            Instagram Feed Settings
          </h2>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-8 py-3 bg-[#9EAB75] text-dark hover:bg-[#FFE58F] font-primary text-sm font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              Saving Feed...
            </>
          ) : (
            "Save Feed Config"
          )}
        </button>
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
        {/* Left Pane - Posts List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-sm uppercase tracking-wider text-charcoal border-b border-black/5 pb-2">
              📸 Feed Items List ({posts.length})
            </h3>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {posts.map((post, idx) => {
                const isActive = activePostIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActivePostIndex(idx)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? "bg-[#9EAB75]/10 border-[#9EAB75]"
                        : "bg-stone-50 border-black/5 hover:border-black/10"
                    }`}
                  >
                    <div className="min-w-0 flex-1 flex items-center gap-3">
                      {post.imageSrc ? (
                        <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0 bg-stone-200 border border-black/5">
                          {post.mediaType === "video" ? (
                            <video
                              src={post.imageSrc}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                          ) : (
                            <Image
                              src={post.imageSrc}
                              alt=""
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-stone-200 shrink-0 border border-black/5 flex items-center justify-center text-[10px] font-black uppercase text-charcoal/30">
                          N/A
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-black uppercase text-charcoal/40 block">
                          Post {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-charcoal truncate block uppercase tracking-tight">
                          {post.textOverlay || "(No text overlay)"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {/* Move Up */}
                      <button
                        disabled={idx === 0}
                        onClick={() => movePostUp(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-stone-200/60 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-xs"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      {/* Move Down */}
                      <button
                        disabled={idx === posts.length - 1}
                        onClick={() => movePostDown(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-stone-200/60 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center text-xs"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => deletePost(idx)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center text-xs"
                        title="Delete Post"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={addPost}
              className="w-full py-3 border-2 border-dashed border-charcoal/20 hover:border-charcoal hover:bg-stone-50 rounded-2xl font-primary text-xs font-black uppercase tracking-wider text-charcoal transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>➕</span> Add New Post
            </button>
          </div>
        </div>

        {/* Right Pane - Form Editor & Preview */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <div className="border-b border-black/5 pb-3">
              <h3 className="font-primary font-black text-lg uppercase text-charcoal">
                📝 Post {activePostIndex + 1} Editor
              </h3>
            </div>

            <div className="space-y-4">
              {/* Image/Video Input & Uploader */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Post Media (Image/Video URL) *
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Enter Image/Video URL or upload one"
                    value={activePost.imageSrc || ""}
                    onChange={(e) => updateActivePostField("imageSrc", e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                  <label className="shrink-0 px-4 py-3 bg-charcoal text-white hover:bg-black font-primary text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-colors flex items-center justify-center h-11 min-w-[120px]">
                    {uploadingImage ? "Uploading..." : "Upload Media"}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Media Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                  Media Type
                </label>
                <div className="flex gap-6 mt-1">
                  <label className="flex items-center gap-2 text-sm font-bold text-charcoal cursor-pointer select-none">
                    <input
                      type="radio"
                      name="mediaType"
                      value="image"
                      checked={activePost.mediaType !== "video"}
                      onChange={() => updateActivePostField("mediaType", "image")}
                      className="w-4 h-4 accent-[#9EAB75]"
                    />
                    📸 Image
                  </label>
                  <label className="flex items-center gap-2 text-sm font-bold text-charcoal cursor-pointer select-none">
                    <input
                      type="radio"
                      name="mediaType"
                      value="video"
                      checked={activePost.mediaType === "video"}
                      onChange={() => updateActivePostField("mediaType", "video")}
                      className="w-4 h-4 accent-[#9EAB75]"
                    />
                    🎥 Video
                  </label>
                </div>
              </div>

              {/* Text Overlay & Likes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Text Overlay (Uppercase tag overlay at bottom)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hooked on the colors of nutrition"
                    value={activePost.textOverlay || ""}
                    onChange={(e) => updateActivePostField("textOverlay", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80 mb-1">
                    Likes Counter (Shows on Hover overlay)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 120"
                    value={activePost.likes}
                    onChange={(e) => updateActivePostField("likes", Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-charcoal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Post Preview Card */}
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
            <h3 className="font-primary font-black text-lg uppercase text-charcoal border-b border-black/5 pb-2">
              Post {activePostIndex + 1} Layout Preview
            </h3>

            <div className="flex items-center justify-center p-6 bg-stone-50 rounded-2xl border border-black/5">
              {/* Scaled Representation of the card */}
              <div className="group relative shrink-0 w-[200px] aspect-square rounded-2xl overflow-hidden bg-stone-200 border border-stone-200/50 shadow-md">
                {activePost.imageSrc && (
                  activePost.mediaType === "video" ? (
                    <video
                      src={activePost.imageSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  ) : (
                    <Image
                      src={activePost.imageSrc}
                      alt="Mockup Preview"
                      fill
                      className="object-cover z-0"
                      unoptimized
                    />
                  )
                )}

                {/* Gradient text protection overlay */}
                {activePost.textOverlay && (
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent z-10" />
                )}

                {/* Bold White Title Text Overlay */}
                {activePost.textOverlay && (
                  <p className="absolute inset-x-3 bottom-3 z-10 font-primary font-black text-white text-[12px] leading-tight uppercase text-left drop-shadow-sm select-none">
                    {activePost.textOverlay}
                  </p>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center text-white pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center gap-1.5 font-primary font-black text-base">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span>{activePost.likes}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-charcoal/50 font-bold uppercase text-center">
              * Hover cursor over image to reveal Likes Count overlay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
