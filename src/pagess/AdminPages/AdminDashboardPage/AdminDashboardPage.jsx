// app/(admin)/admin-dashboard/page.jsx
"use client";

import React, { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Briefcase,
  FileText,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Code,
  GitPullRequest,
  ChevronDown,
  ChevronUp,
  GraduationCap,
} from "lucide-react";
import AdminLayout from "@/components/AdminComponents/AdminLayout";
import useAdminDashboardViewModel from "./UseAdminDashboardPage";
import Skeleton from "@/components/FormComponents/Skeleton";
import withAuth from "@/middleware/withAuth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const generateDiverseColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const hue = ((i * 360) / numColors + 20) % 360;
    const saturation = 60 + (i % 3) * 10;
    const lightness = 50 + (i % 2) * 10;
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};

function Dashboard() {
  const { stats, loading, error } = useAdminDashboardViewModel();
  const [showAllTechStacks, setShowAllTechStacks] = useState(false);

  const getRandomPercentage = () => (Math.random() * 10 + 1).toFixed(1);
  const getRandomPositive = () => Math.random() > 0.5;

  const statCards = [
    {
      title: "Total Colleges",
      value: stats?.colleges,
      change: getRandomPercentage(),
      positive: getRandomPositive(),
      icon: <Briefcase size={20} className="text-white" />,
      bg: "bg-purple-600",
      text: "text-purple-600",
      ring: "ring-purple-200",
    },
    {
      title: "Total Students",
      value: stats?.students,
      change: getRandomPercentage(),
      positive: getRandomPositive(),
      icon: <FileText size={20} className="text-white" />,
      bg: "bg-pink-600",
      text: "text-pink-600",
      ring: "ring-pink-200",
    },
    {
      title: "Mock Interviews",
      value: stats?.interviews,
      change: getRandomPercentage(),
      positive: getRandomPositive(),
      icon: <Users size={20} className="text-white" />,
      bg: "bg-indigo-600",
      text: "text-indigo-600",
      ring: "ring-indigo-200",
    },
    {
      title: "Completed Interviews",
      value: stats?.completedInterviews,
      change: getRandomPercentage(),
      positive: getRandomPositive(),
      icon: <Target size={20} className="text-white" />,
      bg: "bg-violet-600",
      text: "text-violet-600",
      ring: "ring-violet-200",
    },
  ];

  const candidateExperienceData = {
    labels: [
      "Entry-Level",
      "Junior (1-3 yrs)",
      "Mid-Level (3-7 yrs)",
      "Senior (7+ yrs)",
    ],
    datasets: [
      {
        data: [
          stats?.experienceLevels?.entryLevel || 0,
          stats?.experienceLevels?.junior || 0,
          stats?.experienceLevels?.midLevel || 0,
          stats?.experienceLevels?.senior || 0,
        ],
        backgroundColor: ["#6366f1", "#a855f7", "#ec4899", "#ef4444"],
        hoverBackgroundColor: ["#4f46e5", "#9333ea", "#db2777", "#dc2626"],
        borderWidth: 0,
      },
    ],
  };

  const candidateExperienceDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 14 },
          color: "#374151",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            if (context.parsed !== null) {
              const value = context.parsed;
              const total = context.dataset.data.reduce(
                (acc, current) => acc + current,
                0
              );
              const percentage =
                total === 0 ? 0 : ((value / total) * 100).toFixed(1);
              return `${label}: ${value.toLocaleString()} (${percentage}%)`;
            }
            return label;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        bodyFont: { size: 14 },
        padding: 10,
      },
    },
  };

  const TOP_N = 10;
  const actualTechStacks = stats?.techStacks || [];
  const sortedTechStackData = [...actualTechStacks].sort(
    (a, b) => b.count - a.count
  );
  const topNStacks = sortedTechStackData.slice(0, TOP_N);
  const otherStacksValue = sortedTechStackData
    .slice(TOP_N)
    .reduce((sum, item) => sum + item.count, 0);

  const techStackTopNBarData = {
    labels: [
      ...topNStacks.map((d) => d.stackName),
      `Other (${Math.max(0, actualTechStacks.length - TOP_N)} stacks)`,
    ],
    datasets: [
      {
        label: "Usage Count",
        data: [...topNStacks.map((d) => d.count), otherStacksValue],
        backgroundColor: (context) => {
          return context.dataIndex === TOP_N
            ? "rgba(100, 100, 100, 0.7)"
            : "rgba(34, 197, 94, 0.7)";
        },
        borderColor: (context) => {
          return context.dataIndex === TOP_N
            ? "rgba(100, 100, 100, 1)"
            : "rgba(34, 197, 94, 1)";
        },
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: (context) => {
          return context.dataIndex === TOP_N
            ? "rgba(80, 80, 80, 0.8)"
            : "rgba(22, 163, 74, 0.8)";
        },
      },
    ],
  };

  const techStackTopNBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.x !== null) {
              label += context.parsed.x.toLocaleString();
            }
            return label;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        bodyFont: { size: 14 },
        padding: 10,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
          font: { size: 14, weight: "bold" },
          color: "#4b5563",
        },
        grid: { color: "rgba(200, 200, 200, 0.2)" },
      },
      y: {
        title: {
          display: true,
          text: "Tech Stack",
          font: { size: 14, weight: "bold" },
          color: "#4b5563",
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          font: { size: 12 },
        },
        grid: { color: "rgba(200, 200, 200, 0.2)" },
      },
    },
  };

  const allTechStackPieData = {
    labels: actualTechStacks.map((d) => d.stackName),
    datasets: [
      {
        data: actualTechStacks.map((d) => d.count),
        backgroundColor: generateDiverseColors(actualTechStacks.length),
        borderColor: "white",
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  const allTechStackPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "40%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 12 },
          color: "#374151",
        },
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            if (context.parsed !== null) {
              const value = context.parsed;
              const total = context.dataset.data.reduce(
                (acc, current) => acc + current,
                0
              );
              const percentage =
                total === 0 ? 0 : ((value / total) * 100).toFixed(1);
              return `${label}: ${value.toLocaleString()} (${percentage}%)`;
            }
            return label;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        bodyFont: { size: 14 },
        padding: 12,
        borderColor: "rgba(255,255,255,0.3)",
        borderWidth: 1,
      },
      title: {
        display: false,
      },
    },
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-inter text-gray-800">
          <div className="max-w-8xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mb-8">
              Overview of key metrics and data for the platform.
            </p>

            {/* Stat Card Skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between"
                >
                  <div className="flex-1">
                    <Skeleton width="w-24" height="h-4" className="mb-2" />
                    <Skeleton width="w-16" height="h-6" />
                  </div>
                  <div className="rounded-full p-3 bg-gray-200 ring-4 ring-gray-100">
                    <Skeleton width="w-5" height="h-5" rounded="rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="lg:col-span-1 bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <Skeleton width="w-48" height="h-5" className="mb-4" />
                <Skeleton width="w-64" height="h-4" className="mb-6" />
                <div className="h-[400px] sm:h-[450px] w-full max-w-full overflow-hidden">
                  <Skeleton
                    width="w-full"
                    height="h-full"
                    rounded="rounded-lg"
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <Skeleton width="w-64" height="h-5" className="mb-4" />
                <Skeleton width="w-72" height="h-4" className="mb-6" />
                <div className="h-[700px] sm:h-[800px] w-full max-w-full flex justify-center items-center">
                  <Skeleton
                    width="w-[600px]"
                    height="h-[600px]"
                    rounded="rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-inter text-gray-800 flex justify-center items-center">
          <p className="text-lg text-red-600">
            Error loading data: {error.message || String(error)}
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (!actualTechStacks || actualTechStacks.length === 0) {
    return (
      <AdminLayout>
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-inter text-gray-800">
          <div className="max-w-8xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mb-8">
              Overview of key metrics and data for the platform.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-500 mb-2">{item.title}</p>
                    <h3
                      className={`text-2xl sm:text-3xl font-extrabold ${item.text}`}
                    >
                      {item.value}
                    </h3>
                  </div>
                  <div
                    className={`rounded-full p-3 ${item.bg} ring-4 ${item.ring}`}
                  >
                    {item.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-gray-600 py-10">
              <p className="text-xl font-semibold mb-4">
                No Tech Stack Data Available
              </p>
              <p>Please check the API endpoint or ensure data is populated.</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-inter text-gray-800">
        <div className="max-w-8xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Overview of key metrics and data for the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-gray-500 mb-2">{item.title}</p>
                  <h3
                    className={`text-2xl sm:text-3xl font-extrabold ${item.text}`}
                  >
                    {item.value || "N/A"}
                  </h3>
                  {/* <div
                    className={`flex items-center text-xs sm:text-sm mt-2 font-medium ${
                      item.positive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.positive ? (
                      <ArrowUpRight size={16} className="inline-block mr-1" />
                    ) : (
                      <ArrowDownRight size={16} className="inline-block mr-1" />
                    )}
                    <span>
                      {item.positive ? `+${item.change}%` : `-${item.change}%`}
                    </span>
                    <span className="ml-1 text-gray-500">vs last month</span>
                  </div> */}
                </div>
                <div
                  className={`rounded-full p-3 ${item.bg} ring-4 ${item.ring}`}
                >
                  {item.icon}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="lg:col-span-1 bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <GitPullRequest size={20} className="text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Top {TOP_N} Tech Stacks by Usage
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                This chart highlights the most prominent tech stacks based on
                their usage count. The remaining{" "}
                {Math.max(0, actualTechStacks.length - TOP_N)} categories are
                grouped into "Other".
              </p>
              <div className="h-[400px] sm:h-[450px] w-full max-w-full overflow-hidden">
                <Bar
                  data={techStackTopNBarData}
                  options={techStackTopNBarOptions}
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <div className="flex items-center">
                  <Code size={20} className="text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    All Tech Stack Distribution (Detailed View)
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {showAllTechStacks
                  ? "This comprehensive chart shows all available tech stacks by their usage count. Each slice represents a specific tech stack. Hover for details."
                  : "Click to view a comprehensive chart of all tech stacks."}
              </p>
              <div className="h-[700px] sm:h-[800px] w-full max-w-full flex justify-center items-center">
                <div className="h-[600px] w-[600px] sm:h-[700px] sm:w-[700px] max-w-full">
                  <Doughnut
                    data={allTechStackPieData}
                    options={allTechStackPieOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(Dashboard, ["admin"]);
