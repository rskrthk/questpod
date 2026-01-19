import { useMemo } from "react";

export function usePricingData() {
  const plans = useMemo(
    () => [
      {
        title: "Basic",
        subtitle: "For students",
        price: "$19",
        priceNote: {
          period: "/month",
          detail: "", 
        },
        featuresList: [
          "ATS-Optimized Templates",
          "Basic AI Suggestions",
          "PDF Export",
          "Email Support",
          "1 Resume Version",
        ],
      },
      {
        title: "Pro",
        subtitle: "For job seekers",
        price: "$39",
        priceNote: {
          period: "/month",
          detail: "",
        },
        featuresList: [
          "All Basic Features",
          "Advanced AI Suggestions",
          "Multiple Formats Export",
          "Priority Support",
          "Multiple Resume Versions",
          "Cover Letter Builder",
        ],
      },
      {
        title: "Career",
        subtitle: "For professionals",
        price: "$89",
        priceNote: {
          period: "/month",
          detail: "",
        },
        featuresList: [
          "All Pro Features",
          "Personal Career Coach AI",
          "Interview Preparation",
          "24/7 Support",
          "LinkedIn Optimization",
          "Job Search Strategy",
        ],
      },
    ],
    []
  );

  return {
    heading: "Simple Pricing",
    subheading: "Choose the plan that best fits your needs",
    plans,
  };
}