"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface ILabReport {
  _id: string;
  title: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
}

export default function LabReportsPublicPage() {
  const [reports, setReports] = useState<ILabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/lab-reports");
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } catch (err) {
        console.error("Error loading lab reports:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#fafaf5] pt-32 pb-24 select-none font-primary">
        <div className="max-w-[1200px] mx-auto px-6">
          
          {/* Header Block */}
          <div className="text-center mb-16 relative">
            <span className="bg-[#9EAB75] text-dark text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Safety & Verification
            </span>
            <h1 className="font-primary font-black text-3xl sm:text-4xl md:text-[50px] text-charcoal uppercase tracking-tight leading-none mt-4">
              Lab Analysis Reports
            </h1>
            <div className="relative inline-block mt-3">
              <span className="font-accent text-lg sm:text-[21px] text-charcoal/60 italic font-bold">
                100% clean ingredients, tested and certified
              </span>
              <span className="absolute left-0 right-0 bottom-[-4px] h-[3px] bg-[#9EAB75] rounded-full" />
            </div>
            <p className="max-w-[650px] mx-auto text-xs font-bold text-charcoal/50 leading-relaxed uppercase tracking-wider mt-8">
              At Sustento, what you see is what you eat. We periodically test our freeze-dried fruit products and dynamic nut butter spreads in third-party labs to ensure zero contamination, heavy metals, or pesticide residues.
            </p>
          </div>

          {/* Loader or Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-4 border-[#9EAB75] border-t-transparent rounded-full animate-spin" />
              <p className="font-bold text-xs uppercase tracking-wider text-charcoal/60">
                Loading Quality Certificates...
              </p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-20 bg-white border border-black/5 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
              <span className="text-4xl block mb-2">🔬</span>
              <h3 className="font-primary font-black text-lg text-charcoal uppercase">No Reports Available</h3>
              <p className="text-xs font-semibold text-charcoal/60 mt-1 mb-4">
                Lab testing reports are currently being compiled. Please check back soon.
              </p>
              <Link
                href="/collections/all"
                className="inline-block bg-[#9EAB75] text-dark font-black text-xs uppercase px-5 py-2.5 rounded-xl hover:bg-[#869360] transition-colors"
              >
                Back To Shop
              </Link>
            </div>
          ) : (
            /* Premium Responsive Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {reports.map((report) => (
                <div
                  key={report._id}
                  onClick={() => setSelectedImage(report.imageUrl)}
                  className="group bg-white rounded-3xl border border-black/5 shadow-sm p-4 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Document Container */}
                  <div className="relative w-full aspect-[3/4] bg-stone-50 rounded-2xl border border-black/10 overflow-hidden flex items-center justify-center">
                    <Image
                      src={report.imageUrl}
                      alt={report.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/5 transition-colors flex items-center justify-center">
                      <span className="bg-white/90 text-dark font-primary text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-full border border-black/10 shadow-lg scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                        🔍 Click to Zoom
                      </span>
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div className="mt-4 border-t border-black/5 pt-3">
                    <h3 className="font-primary font-black text-sm uppercase text-charcoal tracking-tight group-hover:text-dark transition-colors truncate">
                      {report.title}
                    </h3>
                    <span className="block text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mt-1">
                      Tested On {new Date(report.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Lightbox Enlargement Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 z-[1010] bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12 text-lg font-bold flex items-center justify-center shadow-2xl transition-colors"
          >
            ✕
          </button>
          
          <div
            className="relative max-w-4xl w-full h-[85vh] flex items-center justify-center bg-white/5 rounded-3xl p-2 md:p-4 select-none cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Enlarged Lab Analysis Certificate"
                fill
                className="object-contain rounded-2xl"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
