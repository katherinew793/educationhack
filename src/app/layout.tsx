import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "FirstTerm — Find your footing",
  description:
    "Practice the moments that make college yours. A personalized college readiness simulator.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
