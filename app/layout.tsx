import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Toaster } from "@/components/ui/toaster";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TurfBook - Book Your Sports Turf",
  description: "Premium turf booking system for sports enthusiasts",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <Header user={user ? { email: user.email!, profile } : null} />
        <main className="pb-20 md:pb-0">
          {children}
        </main>
        <MobileNav />
        <Toaster />
      </body>
    </html>
  );
}
