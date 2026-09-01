"use client";

export default function AnnouncementBar() {
  const message = "Use code SUSTENTO10 for 10% off your first order";

  return (
    <div className="w-full bg-black/20 backdrop-blur-sm text-white h-9 flex items-center justify-center overflow-hidden relative z-[1000] select-none border-b border-white/10">
      <div className="flex items-center text-center px-4 font-primary text-[11px] md:text-xs font-semibold uppercase tracking-widest text-white">
        <span>{message}</span>
      </div>
    </div>
  );
}
