import Layout from "@/components/Layout/Layout";
import {
  CheckCircle2,
  ClipboardCheck,
  FileText,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "Attendance | QuestPod AI",
  description:
    "Attendance. Report Cards. Communication. All in One. QuestPod AI helps schools automate daily operations with AI-driven insights.",
};

export default function AttendancePage() {
  const features = [
    {
      icon: ClipboardCheck,
      title: "Smart Attendance Management",
      points: [
        "One-tap attendance (Present / Absent / Late)",
        "Mobile app for teachers (no registers needed)",
        "Offline support with auto-sync",
        "Real-time attendance tracking",
      ],
    },
    {
      icon: FileText,
      title: "AI-Powered Report Cards",
      points: [
        "Easy marks entry (term-wise, subject-wise)",
        "Auto-generate report cards in seconds",
        "AI-generated teacher remarks and summaries",
        "Download and share as PDF",
      ],
    },
    {
      icon: Sparkles,
      title: "Custom Report Card Templates",
      points: [
        "School branding (logo, format, grading system)",
        "Multiple template options",
        "Flexible structure based on school requirements",
      ],
    },
    {
      icon: TrendingUp,
      title: "Intelligent Insights",
      points: [
        "Detect low-performing or at-risk students",
        "Identify trends between attendance and performance",
        "Smart alerts for low attendance or declining scores",
      ],
    },
    {
      icon: MessageSquareText,
      title: "Automated Parent Communication",
      points: [
        "Instant notifications for absences",
        "Report cards shared directly with parents",
        "Weekly/monthly performance updates",
        "Multi-channel alerts (SMS, WhatsApp, Email)",
      ],
    },
    {
      icon: Users,
      title: "Role-Based Access (4 User Types)",
      points: [
        "Teachers: attendance, marks, report cards",
        "Admins: manage school operations & analytics",
        "Parents: real-time alerts & progress tracking",
        "Students: attendance & performance visibility",
      ],
    },
  ];

  const whyChoose = [
    { icon: Zap, title: "Saves hours of manual work" },
    { icon: TrendingUp, title: "Improves student performance tracking" },
    { icon: MessageSquareText, title: "Strengthens parent engagement" },
    { icon: Sparkles, title: "Adds intelligence to decision-making" },
    { icon: ClipboardCheck, title: "Simple, mobile-first experience" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50" />
            <div className="relative p-8 sm:p-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
                <CheckCircle2 size={16} />
                University Platform
              </div>

              <h1 className="mt-6 text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                Attendance. Report Cards. Communication. All in One.
              </h1>

              <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-3xl">
                QuestPod AI brings together everything a modern school needs into one powerful,
                AI-driven platform. From daily attendance tracking to intelligent report card
                generation and seamless parent communication — manage your entire institution with
                ease.
              </p>

              <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-3xl">
                Built for administrators, teachers, students, and parents, our platform replaces
                manual processes with smart automation and real-time insights.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 transition-colors"
                >
                  Talk to Us
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">The Problem We Solve</h2>
              <p className="mt-2 text-gray-600">
                Schools today struggle with disconnected tools and slow, manual workflows.
              </p>
              <ul className="mt-5 space-y-3 text-gray-700">
                {[
                  "Manual attendance registers",
                  "Time-consuming report card creation",
                  "Lack of real-time visibility into student performance",
                  "Poor communication with parents",
                  "Multiple disconnected tools",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                      <span className="text-xs font-bold">!</span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 p-4 text-purple-800 font-semibold">
                QuestPod AI solves all of this in a single unified system.
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Our Solution</h2>
              <p className="mt-2 text-gray-600">
                A mobile-first + AI-powered platform that enables every stakeholder to work smarter.
              </p>
              <ul className="mt-5 space-y-4 text-gray-700">
                {[
                  "Teachers to manage attendance and marks effortlessly",
                  "Admins to track performance and streamline operations",
                  "Parents to stay informed in real-time",
                  "Students to monitor their progress",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-700">
                      <CheckCircle2 size={14} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="text-sm font-semibold text-gray-900">Bulk Operations</div>
                  <div className="mt-1 text-sm text-gray-600">
                    Enter marks and generate report cards in bulk.
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="text-sm font-semibold text-gray-900">Secure & Scalable</div>
                  <div className="mt-1 text-sm text-gray-600">
                    Role-based access and cloud-ready architecture.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
            <p className="mt-2 text-gray-600">
              Everything needed to run a modern school—fast, organized, and insight-driven.
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
                    <ul className="mt-4 space-y-2 text-sm text-gray-700">
                      {feature.points.map((p) => (
                        <li key={p} className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-purple-500" />
                          <span className="flex-1">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900">Why Schools Choose QuestPod AI</h2>
              <p className="mt-2 text-gray-600">
                Move beyond registers, spreadsheets, and disconnected tools.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {whyChoose.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-start gap-3"
                    >
                      <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-800">
                        <Icon size={18} />
                      </div>
                      <div className="font-semibold text-gray-900">{item.title}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                <ShieldCheck size={22} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">Secure & Scalable</h2>
              <p className="mt-2 text-gray-600">
                Designed for schools of all sizes, with robust access controls and modern
                infrastructure.
              </p>
              <div className="mt-5 space-y-3 text-sm text-gray-700">
                {[
                  "Role-based access control",
                  "Cloud-based infrastructure",
                  "Reliable for day-to-day operations",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-700">
                      <CheckCircle2 size={14} />
                    </div>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-gray-200 bg-gray-900 text-white overflow-hidden">
            <div className="p-8 sm:p-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                <Sparkles size={16} />
                Upgrade Your School Operations
              </div>
              <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight">
                QuestPod AI – The Future of School Management.
              </h2>
              <p className="mt-3 text-white/80 max-w-3xl">
                Adopt a smarter, faster, and more intelligent way to manage your institution with
                automation, insights, and seamless communication.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Request a Demo
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-transparent px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Explore QuestPod AI
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

