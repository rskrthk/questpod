import Layout from "@/components/Layout/Layout";
import {
  Bot,
  CheckCircle2,
  FileUp,
  FileText,
  Globe,
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "AI Chatbot | QuestPod AI",
  description:
    "From first question to admission — fully automated with AI. Answer queries, check eligibility, fill forms, and complete applications in one conversation.",
};

export default function UniversityAiChatbotPage() {
  const whatItDoes = [
    { icon: MessageCircle, text: "Instantly answers FAQs (courses, fees, deadlines, eligibility)" },
    { icon: Zap, text: "Guides students through the complete admission journey" },
    { icon: FileUp, text: "Allows students to upload marks cards/documents" },
    { icon: Sparkles, text: "Checks eligibility automatically using AI" },
    { icon: GraduationCap, text: "Recommends eligible courses & departments" },
    { icon: FileText, text: "Generates and fills admission forms instantly" },
  ];

  const capabilities = [
    {
      title: "Marks Card Analysis (Game Changer)",
      description:
        "Students upload their marks card → AI extracts data → instantly checks eligibility.",
    },
    {
      title: "Course & Department Matching",
      description:
        "Based on marks, preferences, and criteria: shows eligible programs, suggests best-fit courses, improves decision-making.",
    },
    {
      title: "Instant Admission Form Generation",
      description:
        "Auto-fills student details from uploaded documents, reduces manual form filling, minimizes errors.",
    },
    {
      title: "Web Crawling + RAG Intelligence",
      description:
        "Continuously scans your website, uses real institutional data, provides accurate, context-aware answers.",
    },
    {
      title: "Multi-Source Knowledge",
      description:
        "Website + PDFs + brochures — always up-to-date information.",
    },
  ];

  const impact = [
    "Faster admission process",
    "Higher conversion rates",
    "Massive time savings for both students & colleges",
    "Better student experience",
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50" />
            <div className="relative p-8 sm:p-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
                <Bot size={16} />
                University Platform
              </div>

              <h1 className="mt-6 text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                From First Question to Admission — Fully Automated with AI
              </h1>

              <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-3xl">
                Answer queries. Check eligibility. Fill forms. All in one conversation.
              </p>

              <p className="mt-6 text-base sm:text-lg text-gray-700 max-w-3xl">
                QuestPod AI transforms your university website into a complete admission engine.
                This intelligent chatbot widget not only answers student queries but also analyzes
                eligibility, recommends courses, and completes the admission process — all in a
                single seamless interaction.
              </p>

              <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-3xl">
                Powered by advanced AI, web crawling + RAG + document analysis, it delivers
                accurate, personalized, and instant responses — like a human admission counselor,
                but faster and available 24/7.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 transition-colors"
                >
                  Add AI Admission Bot to Your Website
                </a>
                <a
                  href="/ai-chatbot#marks"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  Upload Marks & Check Eligibility
                </a>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-semibold">
                <Sparkles size={16} />
                From Query to Application in Under 5 Minutes.
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">For Universities</h2>
              <div className="mt-2 text-2xl font-extrabold text-gray-900">
                Convert More Applicants with Zero Manual Effort
              </div>
              <ul className="mt-5 space-y-3 text-gray-700">
                {[
                  "Capture every student inquiry instantly",
                  "Reduce admission team workload by up to 80%",
                  "Eliminate repetitive queries",
                  "Automate eligibility checks and form filling",
                  "Increase application completion rates",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-700">
                      <CheckCircle2 size={14} />
                    </div>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">For Students</h2>
              <div className="mt-2 text-2xl font-extrabold text-gray-900">
                No More Confusion. No More Waiting.
              </div>
              <ul className="mt-5 space-y-3 text-gray-700">
                {[
                  "Get instant answers anytime",
                  "Know exactly which courses you’re eligible for",
                  "Upload marks card and get guided instantly",
                  "Complete admission forms in minutes",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                      <CheckCircle2 size={14} />
                    </div>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">What It Does</h2>
            <p className="mt-2 text-gray-600">
              All critical admission steps handled in one conversation.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {whatItDoes.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.text}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-start gap-3"
                  >
                    <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-800">
                      <Icon size={18} />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{item.text}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div id="marks" className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">Smart AI Capabilities</h2>
            <p className="mt-2 text-gray-600">
              Web crawling + RAG + document intelligence, tuned for admissions.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {capabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 border border-purple-100 px-3 py-1.5 text-sm font-semibold text-purple-700">
                    <Sparkles size={16} />
                    {cap.title}
                  </div>
                  <p className="mt-3 text-gray-700">{cap.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900">Real Impact</h2>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {impact.map((t) => (
                  <div
                    key={t}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-start gap-3"
                  >
                    <div className="mt-0.5 h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-800">
                      <Zap size={18} />
                    </div>
                    <div className="font-semibold text-gray-900">{t}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                <Globe size={22} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">Easy Integration</h2>
              <p className="mt-2 text-gray-600">
                Plug-and-play chatbot widget that works on any university website.
              </p>
              <div className="mt-5 space-y-3 text-sm text-gray-700">
                {["Setup in minutes", "Works on any website", "Scalable for thousands of users"].map(
                  (t) => (
                    <div key={t} className="flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-700">
                        <CheckCircle2 size={14} />
                      </div>
                      <span>{t}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-gray-200 bg-gray-900 text-white overflow-hidden">
            <div className="p-8 sm:p-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                <ShieldCheck size={16} />
                Secure & Reliable
              </div>
              <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight">
                Not Just a Chatbot — A Complete Admission Funnel
              </h2>
              <p className="mt-3 text-white/80 max-w-3xl">
                QuestPod AI doesn’t just answer questions. It captures interest → checks eligibility
                → recommends courses → completes applications — automatically.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/80">
                {[
                  "Secure document handling",
                  "Privacy-first design",
                  "Reliable 24/7 availability",
                  "Built to scale with demand",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                      <CheckCircle2 size={14} />
                    </div>
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Add AI Admission Bot to Your Website
                </a>
                <a
                  href="/ai-chatbot#marks"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-transparent px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Upload Your Marks & Check Eligibility Instantly
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

