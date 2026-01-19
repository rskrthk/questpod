"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

function PricingCard({
  title,
  subtitle,
  price,
  priceNote,
  featuresList,
  buttonText = "Get Started",
  isBest = false,
  isSelected = false,
  onClick,
}) {
  return (
    <div
      className={`relative p-6 rounded-2xl bg-white border transition-all duration-300 cursor-pointer ${
        isBest ? "border-indigo-500" : "border-gray-200"
      } ${
        isSelected
          ? "scale-105 shadow-xl border-indigo-600 z-10"
          : "hover:shadow-md"
      }`}
      onClick={onClick}
    >
      {isBest && (
        <div className="absolute -top-3 right-4 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-md">
          Best Value
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{subtitle}</p>

      <div className="mb-6">
        <div className="text-4xl font-extrabold text-gray-900">
          {price}
          {priceNote?.period && (
            <span className="text-base font-medium text-gray-500 ml-1">
              {priceNote.period}
            </span>
          )}
        </div>
        {priceNote?.detail && (
          <p className="text-sm text-gray-500 mt-1">{priceNote.detail}</p>
        )}
      </div>

      <ul className="space-y-3 text-sm text-gray-700 mb-6">
        {featuresList.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-[2px]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="block w-full text-center py-3 rounded-xl theme-colors text-white font-semibold hover:opacity-90 transition-all">
        {buttonText}
      </div>
    </div>
  );
}

export default PricingCard;