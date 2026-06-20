// app/layout.js
import ReduxProvider from "@/redux/ReduxProvider";
import RouteTracker from "@/components/RouteTracker";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Inter } from "next/font/google";
import { GoogleTagManager } from '@next/third-parties/google';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "QuestPodAI — Academic Intelligence Platform",
  description:
    "QuestPodAI is India's Academic Intelligence Platform. AI mock interviews, resume builder, academic coaching, placement intelligence, and institutional management for universities, colleges, and schools.",
  keywords:
    "academic intelligence platform India, AI mock interview, AI resume builder, student success platform, LMS India, college placement AI, QuestPodAI, aptitude test AI",
  icons: {
    icon: "/quest_icon.png",
    shortcut: "/quest_icon.png",
    apple: "/quest_icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body>
        <Toaster position="top-center" reverseOrder={false} />
        <ReduxProvider>
          <RouteTracker />
          {children}
        </ReduxProvider>
      </body>
      <GoogleTagManager gtmId="GTM-N3JM67QX" />
    </html>
  );
}
