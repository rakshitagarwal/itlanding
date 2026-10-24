import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northline | Custom Software, AI SaaS & Digital Products",
  description:
    "Northline builds custom software, AI SaaS, TMS, CRM, and cloud products for startups and enterprises — from strategy through launch.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="/template/css/ritovex.webflow.shared.84db156a8.css"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
