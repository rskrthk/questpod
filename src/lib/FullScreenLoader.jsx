"use client";

import React from "react";
import { Loader2 } from "lucide-react";

const FullScreenLoader = ({
  message = "Generating your AI interview...",
}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden px-4">
      {/* Animated Background Blobs */}
      <div className="absolute -top-32 -left-32 w-72 h-72 xs:w-80 xs:h-80 sm:w-96 sm:h-96 bg-gradient-to-br from-purple-400 via-purple-600 to-fuchsia-500 rounded-full blur-[90px] sm:blur-[120px] opacity-20 animate-blob" />
      <div className="absolute -bottom-32 -right-32 w-72 h-72 xs:w-80 xs:h-80 sm:w-96 sm:h-96 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full blur-[90px] sm:blur-[120px] opacity-20 animate-blob animation-delay-2000" />

      {/* Loader Card */}
      <div className="relative z-10 flex flex-col items-center justify-center p-5 xs:p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-[0_0_40px_rgba(147,51,234,0.3)] w-full max-w-[320px] xs:max-w-xs sm:max-w-sm md:max-w-md xl:max-w-lg animate-fade-in">
        {/* Spinner Aura */}
        <div className="relative mb-5 sm:mb-6">
          <div className="absolute inset-0 w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-500 blur-xl opacity-40 animate-pulse" />
          <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 border-4 border-white/30 flex items-center justify-center animate-spin shadow-inner">
            <Loader2 className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-white animate-spin" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center px-2 xs:px-3 sm:px-4">
          <p className="text-base xs:text-lg sm:text-xl font-semibold text-white">
            {message}
          </p>
          <p className="text-xs xs:text-sm text-white/70 mt-2">
            Please wait while we prepare your personalized experience...
          </p>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
