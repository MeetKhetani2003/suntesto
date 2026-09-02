"use client";

export default function FreezeDryingProcess() {
  const steps = [
    {
      title: "Pick and Prep",
      description: "Fresh fruits are carefully picked, washed, and sliced.",
      icon: (
        <svg className="w-12 h-12 text-[#9EAB75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
          <g transform="rotate(30, 12, 12)">
            {/* Pineapple Body */}
            <ellipse cx="12" cy="14.5" rx="5.5" ry="7.5" />
            {/* Crown Leaves */}
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7L8 2l2.5 3L12 1.5l1.5 3.5L16 2l-1 5" />
            {/* Texture marks */}
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 11l.5.5.5-.5M13 11l.5.5.5-.5M11.5 14l.5.5.5-.5M9.5 16l.5.5.5-.5M13.5 16l.5.5.5-.5" />
          </g>
        </svg>
      )
    },
    {
      title: "Freeze Quickly",
      description: "Frozen at -30°C to lock in nutrients and flavour.",
      icon: (
        <svg className="w-12 h-12 text-[#9EAB75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
          {/* Thermometer */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 5a2 2 0 012 2v7.5a3.5 3.5 0 11-4 0V7a2 2 0 012-2z" />
          <circle cx="16" cy="16.5" r="1.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1.5M18 10h1.5M18 12h1.5" />
          {/* Snowflake */}
          <g transform="translate(7.5, 11)">
            <path strokeLinecap="round" strokeLinejoin="round" d="M0 -5v10M-4.33 -2.5l8.66 5M4.33 -2.5l-8.66 5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M0 -5l-.8.8M0 -5l.8.8 M0 5l-.8-.8M0 5l.8-.8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M-4.33 -2.5l0 1.2M-4.33 -2.5l1.2.6 M4.33 2.5l0 -1.2M4.33 2.5l-1.2-.6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.33 -2.5l0 1.2M4.33 -2.5l-1.2.6 M-4.33 2.5l0 -1.2M-4.33 2.5l1.2-.6" />
          </g>
        </svg>
      )
    },
    {
      title: "Create Vacuum",
      description: "Low pressure removes air for precise drying.",
      icon: (
        <svg className="w-12 h-12 text-[#9EAB75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
          {/* Snowflake */}
          <g transform="translate(8, 8) scale(0.9)">
            <path strokeLinecap="round" strokeLinejoin="round" d="M0 -5v10M-4.33 -2.5l8.66 5M4.33 -2.5l-8.66 5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M0 -5l-.8.8M0 -5l.8.8 M0 5l-.8-.8M0 5l.8-.8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M-4.33 -2.5l0 1.2M-4.33 -2.5l1.2.6 M4.33 2.5l0 -1.2M4.33 2.5l-1.2-.6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.33 -2.5l0 1.2M4.33 -2.5l-1.2.6 M-4.33 2.5l0 -1.2M-4.33 2.5l1.2-.6" />
          </g>
          {/* Wind Lines */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10h5a2.5 2.5 0 010 5h-2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14h8a2.5 2.5 0 010 5h-2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 19h7a2 2 0 100-4h-2" />
        </svg>
      )
    },
    {
      title: "Gentle Heating",
      description: "Ice sublimates (turns into vapour) without melting.",
      icon: (
        <svg className="w-12 h-12 text-[#9EAB75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
          {/* Fruit Slice */}
          <g transform="translate(8, 14)">
            <circle cx="0" cy="0" r="6" />
            <circle cx="0" cy="0" r="4.5" strokeDasharray="1.5 2.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M0 -6v12M-5.2 -3l10.4 6M5.2 -3l-10.4 6" />
            <circle cx="0" cy="0" r="1.5" fill="none" />
          </g>
          {/* Heat Vapour Lines */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13c0-1-1-1.5-1-2.5s1-1.5 1-2.5s-1-1.5-1-2.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 11c0-1-1-1.5-1-2.5s1-1.5 1-2.5s-1-1.5-1-2.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 9c0-1-1-1.5-1-2.5s1-1.5 1-2.5s-1-1.5-1-2.5" />
        </svg>
      )
    },
    {
      title: "Repeat and Perfect",
      description: "Process Continue until all moisture is gone.",
      icon: (
        <svg className="w-12 h-12 text-[#9EAB75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
          {/* Circular Arrows */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 8.5a8 8 0 0112 6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 15l4-.5.5-4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 15.5a8 8 0 01-12-6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 9l-4 .5-.5 4" />
          {/* Target Center */}
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="5" />
        </svg>
      )
    },
    {
      title: "Crunchy Goodness",
      description: "fruits are left dry, crisp and nutrient-rich",
      icon: (
        <svg className="w-12 h-12 text-[#9EAB75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.3">
          {/* Powder Pile */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15L7 6l2.5 4 2-1 2 4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 9.5l1.5 2M10 11l.5 1" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 15h11" />
          
          {/* Scoop */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 13h7a1 1 0 010 2h-7" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 11h4a2 2 0 012 2v2h-6v-2a2 2 0 010-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 15v1a1 1 0 001 1h3a1 1 0 001-1v-1" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 11c.5-1.5 1.5-1.5 2 0" />
        </svg>
      )
    }
  ];

  return (
    <section className="w-full bg-[#fffff9] py-16 md:py-24 border-t border-black/5 select-none relative overflow-hidden">
      <div className="w-full max-w-[1240px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-[650px] mx-auto mb-16 md:mb-20">
          <span className="font-primary font-bold text-xs sm:text-sm tracking-widest text-[#9EAB75] uppercase">
            HOW WE MAKE IT
          </span>
          <h2 className="font-primary font-black text-3xl sm:text-4xl md:text-[46px] text-charcoal leading-none uppercase tracking-tight mt-3">
            The Freeze-Drying Journey
          </h2>
          <div className="w-12 h-[3px] bg-[#9EAB75] mx-auto mt-6 rounded-full" />
        </div>

        {/* Divided Step Row Layout */}
        <div className="w-full overflow-x-auto scroll-hide pb-6 lg:pb-0">
          <div className="min-w-[1000px] lg:min-w-0 grid grid-cols-6 divide-x divide-black/10">
            
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center text-center px-6 space-y-6 hover:translate-y-[-4px] transition-transform duration-300 group"
              >
                {/* Step Title */}
                <h3 className="font-primary font-black text-[15px] sm:text-[17px] text-charcoal uppercase tracking-tight leading-tight min-h-[42px] flex items-center justify-center">
                  {step.title}
                </h3>
                
                {/* Step Icon Container with dynamic hover effect */}
                <div className="w-20 h-20 rounded-full bg-[#FAF9F5] border border-black/5 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-[#9EAB75]/30 transition-all duration-300 relative">
                  {step.icon}
                </div>

                {/* Step Description */}
                <p className="font-accent text-xs sm:text-[13px] text-charcoal/60 leading-relaxed font-semibold italic max-w-[160px]">
                  {step.description}
                </p>

              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
