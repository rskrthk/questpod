"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const BlobCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        ease: "power2.out",
        duration: 0.15,
      });
    };

    document.addEventListener("mousemove", moveCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 pointer-events-none z-[9999] rounded-full border border-white/30 shadow-lg backdrop-blur-md"
      style={{
        background: "linear-gradient(to bottom right, rgba(203, 184, 246, 0.3), rgba(115, 58, 237, 0.3))",
        transform: "translate(-50%, -50%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(115, 58, 237, 0.4)",
      }}
    />
  );
};

export default BlobCursor;
