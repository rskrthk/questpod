import About from "@/components/About/About";
import React from "react";

export const metadata = {
  title: "About QuestPodAI — Academic Intelligence Platform",
  description:
    "QuestPodAI is built by Preneurs to give every Indian student access to AI-powered academic coaching and career readiness, and every institution the tools to improve outcomes.",
};

function aboutPage() {
  return (
    <div>
      <About />
    </div>
  );
}

export default aboutPage;
