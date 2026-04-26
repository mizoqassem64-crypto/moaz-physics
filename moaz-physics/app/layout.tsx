import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap"
});

const orbitron = Orbitron({ 
  subsets: ["latin"], 
  variable: "--font-orbitron",
  display: "swap"
});

export const metadata: Metadata = {
  title: "MOAZ Physics | Quantum & Relativity Universe",
  description: "Explore the mysteries of quantum mechanics and relativity with Moaz Qassem. Professional physics education platform with 3D visualizations.",
  keywords: ["physics", "quantum mechanics", "relativity", "education", "Moaz Qassem", "3D physics"],
  authors: [{ name: "Moaz Qassem" }],
  openGraph: {
    title: "MOAZ Physics - Quantum & Relativity Universe",
    description: "Professional physics education platform by Moaz Qassem",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} antialiased`}>
        <Providers>
          <div className="relative min-h-screen overflow-x-hidden">
            <Starfield />
            <Navbar />
            <main className="relative z-10">{children}</main>
            <Footer />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}

function Starfield() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            "--duration": `${Math.random() * 3 + 2}s`,
            "--delay": `${Math.random() * 2}s`,
          } as React.CSSProperties}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-900/50 to-space-900" />
    </div>
  );
}