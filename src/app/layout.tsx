"use client"
import { Poppins } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/Providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import NavBar from "@/Components/NavBar";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient()
  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-slate-100 text-black`}
      >
       <Toaster />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NavBar />
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
