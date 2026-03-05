import "./globals.css";
import SessionProviderClient from "@/components/providers/SessionProviderClient";
import Navbar from "@/components/layout/Navbar";



export const metadata = {
  title: "Aarambh Quiz Platform",
  description: "Interactive quiz platform by Aarambh Club, Ramgarh Engineering College",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`bg-slate-950 text-slate-100 antialiased`}
      >
        <SessionProviderClient>
          <Navbar />
          <main className="mx-auto min-h-[calc(100vh-64px)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </SessionProviderClient>
      </body>
    </html>
  );
}
