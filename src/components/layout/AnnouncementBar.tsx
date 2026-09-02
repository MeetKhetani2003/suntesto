"use client";

export default function AnnouncementBar() {
  const message = "Use code SUSTENTO10 for 10% off your first order";

  return (
    <div className="w-full bg-[#9EAB75] text-dark h-9 flex items-center justify-center overflow-hidden relative z-[1000] select-none border-b border-black/10">
      <div className="flex items-center text-center px-4 font-primary text-[11px] md:text-xs font-semibold uppercase tracking-widest text-dark">
        <span>{message}</span>
      </div>
    </div>
  );
}
