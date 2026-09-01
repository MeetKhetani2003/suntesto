"use client";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
};

const REVIEWS: Testimonial[] = [
  {
    id: "r1",
    quote: '"Busy days, uncompromised nutrition. 10/10 ✨"',
    name: "Aishwarya",
  },
  {
    id: "r2",
    quote: '"Can\'t stop eating it... Can\'t believe I finished it in a week 😆"',
    name: "Swarrangi",
  },
  {
    id: "r3",
    quote: '"These are some special snacks for kids... perfect for any occasion..."',
    name: "Gayatri K",
  },
  {
    id: "r4",
    quote: '"Healthy and guilt-free snacking made super convenient!"',
    name: "Rohan S",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full bg-warm-white py-16 px-4 md:py-24 select-none">
      {/* ── Section Header ─────────────────────────────────────── */}
      <div className="w-full text-center relative max-w-[900px] mx-auto px-6 mb-16">
        <h2 className="font-primary font-black text-3xl sm:text-[40px] md:text-[49px] text-charcoal leading-none uppercase tracking-tight flex items-center justify-center gap-2 flex-wrap">
          REAL PEOPLE <br className="sm:hidden" />
          PURE{" "}
          <span className="relative inline-block">
            LOVE
            <span className="absolute left-0 bottom-[-4px] w-full h-[6px] bg-[#9EAB75] rounded-full" />
          </span>
          
          {/* Floating Speech Bubble Graphic */}
          <div className="relative inline-flex items-center gap-1 bg-white border-2 border-charcoal/90 rounded-2xl px-4 py-2 shadow-sm rotate-3 ml-3 text-[13px] md:text-sm font-bold leading-none text-charcoal/90 select-none">
            <span className="font-accent lowercase tracking-wide">we are grateful to have you 💖</span>
            {/* Pointer tip at bottom left of speech bubble */}
            <span className="absolute bottom-[-9px] left-5 w-4 h-4 bg-white border-b-2 border-l-2 border-charcoal/90 rotate-[45deg]" />
          </div>
        </h2>
      </div>

      {/* ── Horizontal Scrolling Reviews Gallery ────────────────── */}
      <div className="w-full px-2 md:px-8">
        <div className="scroll-hide flex gap-6 md:gap-8 overflow-x-auto w-full max-w-[1400px] mx-auto px-4 pb-8">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="shrink-0 flex flex-col justify-between items-center text-center w-[290px] md:w-[330px] min-h-[250px] border-[5px] border-[#f5c355] rounded-[40px] p-6 bg-[#fffff9] shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Top Text Review (dark brown, bold) */}
              <h3 className="font-primary font-black text-[15px] md:text-[17px] text-[#6b3117] leading-snug min-h-[90px] px-1 flex items-center justify-center">
                {review.quote}
              </h3>

              {/* Bottom Reviewer Name */}
              <span className="block font-accent font-black text-dark text-[18px] md:text-[20px] mt-4 px-3 border-b-2 border-stone-300 pb-0.5 select-none italic">
                {review.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
