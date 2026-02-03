import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ETL GIS Consulting — Compliance-first GIS modernization",
  description:
    "Compliance-first GIS consulting for public-sector agencies. Accelerate modernization with documented controls, defensible data practices, and mission-ready outcomes.",
  metadataBase: new URL("https://etl-gis-consulting.example.com"),
  openGraph: {
    title: "ETL GIS Consulting — Compliance-first GIS modernization",
    description:
      "Public-sector GIS modernization with security, privacy, and audit-ready delivery.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
