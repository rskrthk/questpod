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
  title: "QUESTPODAI",
  description:
    "Master your next career move with AI QUESTPODAI. Use our powerful tools for realistic mock interviews, craft a standout resume, and receive intelligent suggestions tailored to your success.",
  icons: {
    icon: "/favicons.svg",
    shortcut: "/favicons.svg",
    apple: "/favicons.svg",
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
