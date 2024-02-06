import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";
import { Suspense } from "react";
import Loading from "@/components/auth/loading";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "SyncBoard - Whiteboard application",
  description: "Whiteboard application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <Suspense fallback={<Loading />} >
          <ConvexClientProvider>
            <Toaster />
            <ModalProvider />
            {children}
          </ConvexClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
