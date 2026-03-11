import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ETL GIS Consulting LLC | Spatial intelligence for decisive leaders",
  description:
    "ETL GIS Consulting LLC modernizes GIS platforms for transportation authorities, utilities, and public agencies with compliance-first data engineering, analytics-ready insights, and executive-ready dashboards.",
  openGraph: {
    title: "ETL GIS Consulting LLC | Spatial intelligence for decisive leaders",
    description:
      "Compliance-first GIS modernization, analytics, and executive storytelling for public-sector and utility leaders.",
    type: "website",
  },
  metadataBase: new URL("https://etl-gis-consulting-llc.vercel.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
