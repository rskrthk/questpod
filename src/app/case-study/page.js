import Link from "next/link";
import Layout from "@/components/Layout/Layout";
import {
  FaArrowTrendUp,
  FaBookOpen,
  FaBuilding,
  FaCalendarCheck,
  FaChartLine,
  FaClock,
  FaGraduationCap,
  FaSchool,
  FaUserGraduate,
} from "react-icons/fa6";

const highlightStats = [
  { value: "5", label: "Case studies" },
  { value: "20K+", label: "Students represented" },
  { value: "4", label: "Institution segments" },
  { value: "1", label: "Individual success story" },
];

const caseStudies = [
  {
    id: "01",
    category: "Engineering College",
    institution: "Tier-2 Engineering College, Andhra Pradesh",
    segment: "B.Tech Engineering College",
    students: "3,200 students",
    icon: FaBuilding,
    summary:
      "QuestPodAI helped the placement cell replace manual tracking with an AI-driven workflow for mock interviews, resumes, and placement intelligence.",
    challenge: [
      "Placement rate was stuck at 38% for three consecutive years.",
      "Four placement staff members were manually managing 3,200 students.",
      "Students lacked structured interview practice and were submitting ATS-incompatible resumes.",
    ],
    solution:
      "The college deployed AI Mock Interview, AI Resume Builder, Placement Intelligence, and Career Readiness Score across all four years.",
    results: [
      "Placement rate increased from 38% to 74% in one academic year.",
      "1,840 resumes were optimized through the AI builder.",
      "6,200+ AI mock interviews were completed by final-year students.",
      "Placement staff saved 18 hours per week.",
    ],
    quote:
      "QuestPodAI gave us a live dashboard on day one. Our placement rate doubled - that is not a coincidence.",
  },
  {
    id: "02",
    category: "University",
    institution: "State Private University, Chhattisgarh",
    segment: "Multi-department university",
    students: "12,000 students across 8 departments",
    icon: FaGraduationCap,
    summary:
      "The university unified attendance, marks, reporting, and dropout-risk monitoring without overhauling its IT setup.",
    challenge: [
      "There was no unified view of student performance across departments.",
      "Dropout risk was identified only after students had already disengaged.",
      "NAAC reporting required manual aggregation from disconnected systems.",
    ],
    solution:
      "QuestPodAI centralized academic data and activated predictive dropout alerts, digital mark entry, and compliance-ready reporting.",
    results: [
      "340 at-risk students were flagged in the first semester.",
      "287 of those 340 students were successfully retained.",
      "Semester-end dropout rate reduced by 31%.",
      "Manual reporting time dropped from 6 hours per week to 45 minutes.",
    ],
    quote:
      "Without QuestPodAI's predictive alerts, those students would have been statistics - not success stories.",
  },
  {
    id: "03",
    category: "School Group",
    institution: "CBSE School Group, Tamil Nadu",
    segment: "5-campus school chain",
    students: "4,800 students from Grades 1-12",
    icon: FaSchool,
    summary:
      "QuestPodAI replaced paper-based administration across five campuses with one live platform for attendance, marks, timetables, and parent communication.",
    challenge: [
      "Each campus operated with disconnected tools and no group-level visibility.",
      "Attendance consolidation took three days per campus every week.",
      "Timetable changes and parent communication were inconsistent and manual.",
    ],
    solution:
      "The school group rolled out QuestPodAI for timetable management, digital attendance, AI-generated reports, and centralized dashboards.",
    results: [
      "Administrative time dropped from 4-5 hours per teacher per week to under 30 minutes.",
      "Attendance consolidation shifted from weekly manual work to real-time automation.",
      "Parent satisfaction with communication increased from 54% to 89%.",
      "Timetable communication errors were reduced to near zero.",
    ],
    quote:
      "QuestPodAI gave teachers back their time and gave management a real-time picture of every campus, every student, every day.",
  },
  {
    id: "04",
    category: "MBA Institute",
    institution: "MBA Institute, Pune",
    segment: "PGDM and MBA institute",
    students: "480 students",
    icon: FaChartLine,
    summary:
      "The institute used QuestPodAI to professionalize placement preparation, recruiter reporting, and interview readiness at scale.",
    challenge: [
      "Students were clearing written tests but underperforming in HR and group discussion rounds.",
      "Resume quality varied sharply across the batch.",
      "The placement team lacked visibility into student readiness before recruiter visits.",
    ],
    solution:
      "QuestPodAI delivered sector-specific AI mock interviews, AI resume rebuilding, Career Readiness Score, and structured recruiter dashboards.",
    results: [
      "Average package increased from INR 3.8 LPA to INR 5.6 LPA.",
      "91% of students were placed within 3 months of graduation, up from 67%.",
      "1,440 mock interviews were completed before placement season.",
      "23 new companies were onboarded through the professional dashboard.",
    ],
    quote:
      "The gap between our students and top-tier B-school graduates was never about intelligence. It was about preparation.",
  },
  {
    id: "05",
    category: "Individual Student",
    institution: "B.Tech (CSE) graduate, South India",
    segment: "Software developer job seeker",
    students: "Personal success story",
    icon: FaUserGraduate,
    summary:
      "A student who faced repeated interview-stage rejection used QuestPodAI independently to rebuild confidence, fix resume issues, and secure an offer.",
    challenge: [
      "He failed HR and communication rounds 9 out of 11 times despite clearing aptitude stages.",
      "His resume was text-heavy, not ATS-compatible, and underrepresented projects.",
      "Repeated rejection amplified interview anxiety and reduced confidence.",
    ],
    solution:
      "He completed 18 AI mock interviews in 6 weeks, rebuilt his resume with the AI builder, and followed a targeted AI-generated preparation plan.",
    results: [
      "Confidence score improved from 58% to 81%.",
      "Communication clarity score increased from 61% to 84%.",
      "Five critical ATS issues were identified and fixed.",
      "He secured an INR 7.2 LPA offer within 7 weeks.",
    ],
    quote:
      "I had the skills. I just did not know how to show them. QuestPodAI showed me exactly what I was doing wrong and how to fix it.",
  },
];

const platformThemes = [
  {
    title: "Placement outcomes",
    description: "AI mock interviews, ATS-ready resumes, and placement intelligence turn preparation into measurable hiring results.",
    icon: FaArrowTrendUp,
  },
  {
    title: "Academic visibility",
    description: "Attendance, marks, and performance reporting move from disconnected systems to one live operational view.",
    icon: FaBookOpen,
  },
  {
    title: "Operational efficiency",
    description: "Administrators, faculty, and placement teams spend less time on manual follow-up and more time on outcomes.",
    icon: FaClock,
  },
  {
    title: "Proactive intervention",
    description: "Institutions identify risk early, act before the semester ends, and improve retention with real-time signals.",
    icon: FaCalendarCheck,
  },
];

export const metadata = {
  title: "Case Study - QuestPodAI",
  description:
    "Explore how QuestPodAI improves placement, retention, school operations, and student readiness across colleges, universities, schools, and individual learners.",
};

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      <span className="section-label">{eyebrow}</span>
      <h2 className="mt-5 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
        {title}
      </h2>
      <p className="mt-4 text-base md:text-lg text-gray-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function CaseStudyPage() {
  return (
    <Layout>
      <section className="relative overflow-hidden pt-32 pb-20 px-5 md:px-10 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.12),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.10),_transparent_28%)]" />
        <div className="relative max-w-7xl mx-auto grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <span className="section-label">Customer Stories</span>
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
              Case studies that show how QuestPodAI changes outcomes.
            </h1>
            <p className="mt-6 text-lg text-gray-500 max-w-2xl leading-relaxed">
              These stories come from the QuestPodAI case study document and span
              engineering colleges, universities, school groups, MBA institutes,
              and individual students using the platform to improve readiness,
              retention, and placements.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-brand text-white font-semibold shadow-lg shadow-indigo-200/70 hover:opacity-95 transition"
              >
                Request a Demo
              </Link>
              <Link
                href="/students"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-gray-200 text-gray-700 font-semibold hover:border-indigo-300 hover:text-indigo-600 transition"
              >
                Explore Student Platform
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {highlightStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-[0_18px_60px_rgba(79,70,229,0.08)]"
              >
                <p className="text-3xl md:text-4xl font-extrabold text-gradient">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-5 md:px-10 bg-[#fafaff]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="What Shows Up Across Every Story"
            title="The same platform solves different institutional bottlenecks."
            description="Across each deployment, the pattern is consistent: manual processes shrink, visibility improves, and teams act earlier with better data."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {platformThemes.map((theme) => (
              <div
                key={theme.title}
                className="card rounded-3xl border border-gray-100 bg-white p-7 shadow-[0_18px_50px_rgba(79,70,229,0.08)]"
              >
                <div className="icon-box mb-5">
                  <theme.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{theme.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {theme.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-5 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Featured Stories"
            title="Five real scenarios from institutions and learners."
            description="Each case below captures the background, challenge, deployment, and measurable outcome described in the source document."
          />

          <div className="mt-12 space-y-8">
            {caseStudies.map((study) => (
              <article
                key={study.id}
                className="rounded-[2rem] border border-gray-100 bg-white p-7 md:p-10 shadow-[0_20px_70px_rgba(15,23,42,0.06)]"
              >
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-4">
                      <div className="icon-box">
                        <study.icon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-500">
                          Case Study {study.id}
                        </p>
                        <h3 className="mt-1 text-2xl md:text-3xl font-extrabold text-gray-900">
                          {study.category}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="rounded-full bg-indigo-50 px-4 py-2 text-indigo-700 font-medium">
                        {study.institution}
                      </span>
                      <span className="rounded-full bg-gray-50 px-4 py-2">
                        {study.segment}
                      </span>
                      <span className="rounded-full bg-gray-50 px-4 py-2">
                        {study.students}
                      </span>
                    </div>

                    <p className="mt-6 text-base leading-relaxed text-gray-600">
                      {study.summary}
                    </p>
                  </div>

                  <div className="lg:w-[320px] rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-100">
                      Outcome Snapshot
                    </p>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-indigo-50">
                      {study.results.slice(0, 3).map((result) => (
                        <li key={result}>{result}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
                  <div className="rounded-3xl bg-[#fafaff] p-6 border border-gray-100">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-900">
                      Challenge
                    </p>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
                      {study.challenge.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-3xl bg-[#fafaff] p-6 border border-gray-100">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-gray-900">
                      Solution
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-gray-600">
                      {study.solution}
                    </p>

                    <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-gray-900">
                      Expanded Results
                    </p>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600">
                      {study.results.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <blockquote className="mt-8 rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6">
                  <p className="text-base md:text-lg font-medium text-gray-800 leading-relaxed">
                    &ldquo;{study.quote}&rdquo;
                  </p>
                </blockquote>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20 px-5 md:px-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0f0c29,#1e1b4b,#312e81)" }}
      >
        <div className="dot-grid absolute inset-0 opacity-25 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center">
          <span className="section-label-dark">Next Step</span>
          <h2 className="mt-5 text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Want your institution to become the next case study?
          </h2>
          <p className="mt-5 text-lg text-indigo-200 leading-relaxed max-w-3xl mx-auto">
            QuestPodAI supports placement teams, universities, school groups, and
            students with one AI-powered platform for academic intelligence and
            career readiness.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition"
            >
              Request a Demo
            </Link>
            <Link
              href="/institutions"
              className="btn-outline-white inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold"
            >
              Explore Institutional Platform
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
