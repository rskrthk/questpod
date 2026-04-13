import Layout from "@/components/Layout/Layout";
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Gavel,
  LineChart,
  ScanText,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Placement | QuestPod AI",
  description:
    "AI Placement Portal – Smarter, Faster, Fairer Hiring for Universities. Automate screening, shortlisting, and tracking with actionable insights.",
};

export default function PlacementPage() {
  const features = [
    {
      icon: ScanText,
      title: "JD–Resume Parsing",
      description:
        "Automatically analyzes job descriptions and student resumes to identify relevant skills, experience, and eligibility in seconds.",
    },
    {
      icon: Sparkles,
      title: "AI Shortlisting Engine",
      description:
        "Smartly categorizes candidates into Selected, Rejected, or Borderline based on job fit, saving hours of manual effort.",
    },
    {
      icon: LineChart,
      title: "Instant Feedback for Students",
      description:
        "Provides clear insights like missing skills and match percentage, helping students understand and improve their profiles.",
    },
    {
      icon: BarChart3,
      title: "Admin Dashboard for Placement Cell",
      description:
        "A centralized dashboard to monitor applications, track hiring progress, and manage multiple companies effortlessly.",
    },
    {
      icon: ClipboardList,
      title: "Detailed Student Reports",
      description:
        "Go beyond basic screening with in-depth feedback on each student—strengths, gaps, and improvement areas.",
    },
    {
      icon: SlidersHorizontal,
      title: "Company-wise Shortlisting Rules",
      description:
        "Customize hiring criteria for each company based on CGPA, skills, departments, or experience levels.",
    },
    {
      icon: Gavel,
      title: "AI Bias Checks & Multi-Department Access",
      description:
        "Ensure fair and unbiased hiring decisions with built-in AI bias detection while allowing access across departments.",
    },
    {
      icon: Gauge,
      title: "Job Status Tracking",
      description:
        "Track every candidate’s journey with clear updates like Round 1 Completed, Round 2 Pending, ensuring full visibility.",
    },
    {
      icon: Users,
      title: "Basic HR Screening Automation",
      description:
        "Automate initial HR screening to filter candidates based on communication, eligibility, and basic criteria.",
    },
  ];

  const whyItMatters = [
    "Reduces placement workload by 70–80%",
    "Speeds up hiring cycles for companies",
    "Improves student placement success rate",
    "Ensures fair and transparent shortlisting",
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50" />
            <div className="relative p-8 sm:p-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
                <ShieldCheck size={16} />
                University Platform
              </div>

              <h1 className="mt-6 text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                AI Placement Portal – Smarter, Faster, Fairer Hiring for Universities
              </h1>

              <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-4xl">
                Transform your campus placement process with an intelligent, end-to-end AI-driven
                platform designed for placement cells, recruiters, and students.
              </p>

              <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-4xl">
                Our AI Placement Portal automates the most time-consuming parts of recruitment—right
                from resume screening to final shortlisting—while ensuring transparency, efficiency,
                and fairness.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 transition-colors"
                >
                  Request a Demo
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  Explore Features
                </a>
              </div>
            </div>
          </div>

          <div id="features" className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
            <p className="mt-2 text-gray-600">
              Automate screening, shortlisting, communication, and tracking—without losing fairness
              or transparency.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="h-11 w-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-sm text-gray-700">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900">Why It Matters</h2>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {whyItMatters.map((t) => (
                  <div
                    key={t}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-start gap-3"
                  >
                    <div className="mt-0.5 h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-800">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="font-semibold text-gray-900">{t}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                <BarChart3 size={22} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">The Result</h2>
              <p className="mt-2 text-gray-600">
                A seamless ecosystem where students get actionable feedback, placement officers save
                time, and companies hire the right talent faster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

