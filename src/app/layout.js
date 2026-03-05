import "./globals.css";
import SessionProviderClient from "@/components/providers/SessionProviderClient";
import Navbar from "@/components/layout/Navbar";



export const metadata = {
  title: "Scalable Quiz Platform",
  description: "Modular quiz system with Auth.js, Express, and MongoDB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-zinc-100">
      <body
        className={`bg-zinc-100 text-zinc-900 antialiased`}
      >
        <SessionProviderClient>
          <Navbar />
          <main className="mx-auto min-h-[calc(100vh-64px)] max-w-6xl px-4 py-8">{children}</main>
        </SessionProviderClient>
      </body>
    </html>
  );
}
