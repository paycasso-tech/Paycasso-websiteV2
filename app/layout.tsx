import type { Metadata } from "next";
import "./globals.css";
import { fontPoppins } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Paycasso.in",
  description: "The future of money we build together",
  icons: {
    icon: ["/favicon.ico?v=2"],
    apple: ["/apple-touch-icon.png?v=4"],
    shortcut: ["/apple-touch-icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontPoppins.className} antialiased`}>{children}</body>
    </html>
  );
}
