"use client";

import Layout from "@/components/Layout/Layout";
import React, { useState } from "react";
import { usePricingData } from "./usePrice";
import PricingCard from "./PricingCard";
import PricingPopup from "./PricingPopup/PricingPopup";

export default function PricePage() {
  const { heading, subheading, plans } = usePricingData();
  const [activeTab, setActiveTab] = useState("Resume Builder");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const tabs = ["Mock Interview", "Resume Builder"];

  const handleOpenPopup = (plan) => {
    // Use formatted string so it matches dropdown options
    setSelectedPlan(`${plan.title} Plan - ${plan.price}/month`);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedPlan("");
  };

  return (
    <Layout>
      <section className="min-h-screen flex flex-col items-center py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl text-center mb-8 px-4">
          <h1 className="text-4xl font-bold text-gray-900">{heading}</h1>
          <p className="mt-4 text-lg text-gray-600">{subheading}</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-12 space-x-2 bg-gray-100 p-2 rounded-full shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm md:text-base font-medium rounded-full transition-all duration-200 ${
                activeTab === tab
                  ? "theme-colors text-white shadow-md"
                  : "text-gray-700 hover:bg-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 w-full max-w-7xl">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              {...plan}
              isBest={plan.title === "Pro"}
              isSelected={selectedPlan.includes(plan.title)}
              onClick={() => handleOpenPopup(plan)}
            />
          ))}
        </div>

        {/* Popup */}
        {showPopup && (
          <PricingPopup
            selectedPlan={selectedPlan}
            onClose={handleClosePopup}
          />
        )}
      </section>
    </Layout>
  );
}
