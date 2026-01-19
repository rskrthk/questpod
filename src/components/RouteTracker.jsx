"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function RouteTracker() {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    try {
      const prevPath = prevPathRef.current;
      if (prevPath) {
        sessionStorage.setItem("previousPath", prevPath);
      }
      prevPathRef.current = pathname;
    } catch (_) {}
  }, [pathname]);

  return null;
}

