"use client";

import { useState, useEffect } from "react";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";

export default function Header() {
  const [hideBar, setHideBar] = useState(false);

  useEffect(() => {
    const onScroll = () => setHideBar(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-[1000] shrink-0 w-full overflow-hidden transition-all duration-300 ease-out ${
          hideBar ? "-translate-y-full opacity-0 h-0" : "opacity-100"
        }`}
      >
        <AnnouncementBar />
      </div>

      <Navbar />
    </>
  );
}