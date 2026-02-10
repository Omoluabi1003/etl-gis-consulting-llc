import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ETL GIS Consulting LLC | Spatial intelligence designed for decisive leaders",
  description:
    "Compliance-first GIS modernization, analytics-ready data engineering, and executive clarity for transportation authorities, utilities, and public agencies.",
  metadataBase: new URL("https://etl-gis-consulting-llc.vercel.app"),
  openGraph: {
    title: "ETL GIS Consulting LLC",
    description:
      "Spatial intelligence designed for decisive leaders in transportation, utilities, and public agencies.",
    type: "website",
    url: "https://etl-gis-consulting-llc.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
