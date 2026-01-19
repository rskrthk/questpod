"use client";

import Footer from "../Footer/Footer";
import Header from "../Header/Header";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col">
      <Header /> 
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
