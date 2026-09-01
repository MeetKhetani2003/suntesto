"use client";

export default function FreezeDryingProcess() {
  const steps = [
    {
      title: "Pick and Prep",
      description: "Fresh fruits are carefully picked, washed, and sliced.",
      icon: (
        <svg className="w-12 h-12 text-[#9EAB75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          {/* Strawberry / Fruit outline */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6c-2 0-3 1-3 3s1 3 3 3 3-1 3-3-1-3-3-3z" opacity="0.5" />
        </svg>
      )
    },
    {
      title: "Freeze Quickly",
      description: "Frozen at -30°C to lock in nutrients and flavour.",
      icon: (
        <svg className="w-12 h-12 text-[#9EAB75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          {/* Snowflake + Thermometer */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m15.5-3.5l-13 7m0-7l13 7" />
          <circle cx="12" cy="12" r="2.5" fill="white" className="stroke-[#9EAB75]" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      title: "Create Vacuum",
      description: "Low pressure removes air for precise drying.",
      icon: (
        <svg className="w-12 h-12 text-[#9EAB75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          {/* Air flow / Low pressure */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25h12.5A2.25 2.25 0 0017.75 6v0a2.25 2.25 0 00-2.25-2.25H12m-9 9.5h15.5A2.25 2.25 0 0020.75 11v0a2.25 2.25 0 00-2.25-2.25H15M3 17.25h9.5A2.25 2.25 0 0014.75 15v0a2.25 2.25 0 00-2.25-2.25H11" />
        </svg>
      )
    },
    {
      title: "Gentle Heating",
      description: "Ice sublimates (turns into vapour) without melting.",
      icon: (
        <svg className="w-12 h-12 text-[#9EAB75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          {/* Heat Waves + Fruit slice */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19c0-1.5 1-2.5 1-4s-1-2.5-1-4 1-2.5 1-4m4 12c0-1.5 1-2.5 1-4s-1-2.5-1-4 1-2.5 1-4m-9 8.5a6 6 0 100-12 6 6 0 000 12z" />
        </svg>
      )
    },
    {
      title: "Repeat and Perfect",
      description: "Process Continue until all moisture is gone.",
      icon: (
        <svg className="w-12 h-12 text-[#9EAB75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          {/* Sync loop arrows */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7C4.547 9.547 4.5 10.768 4.5 12s.047 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10.5l3 3 3-3" />
        </svg>
      )
    },
    {
      title: "Crunchy Goodness",
      description: "fruits are left dry, crisp and nutrient-rich",
      icon: (
        <svg className="w-12 h-12 text-[#9EAB75]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          {/* Crunchy starburst / Sparkle + Fruit */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.904-4.887M18 18l.896-5.113L11.896 9M3 3l16.5 16.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3" opacity="0.3" />
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
