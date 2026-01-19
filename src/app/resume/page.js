"use client"; 

import dynamic from "next/dynamic";

const ResumeBuilder = dynamic(() => import("@/pagess/ResumePage/ResumePage"), {
  ssr: false,
});

export default function ResumePage() {
  return <ResumeBuilder />;
}
