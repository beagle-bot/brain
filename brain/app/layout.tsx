import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppFrame } from "@/components/AppFrame";
import { BrainProvider } from "@/components/BrainProvider";

export const metadata: Metadata = {
  title: "brain",
  description: "Personal cognitive asset builder for AI information streams.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "brain",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#15181d"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <BrainProvider>
          <AppFrame>{children}</AppFrame>
        </BrainProvider>
      </body>
    </html>
  );
}
