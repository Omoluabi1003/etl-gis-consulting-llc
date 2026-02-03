import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ETL GIS Consulting LLC | Spatial intelligence for decisive leaders",
  description:
    "Compliance-forward GIS modernization, analytics, and executive storytelling for transportation authorities, utilities, and public agencies.",
  metadataBase: new URL("https://etl-gis-consulting-llc.vercel.app"),
  openGraph: {
    title: "ETL GIS Consulting LLC",
    description:
      "Spatial intelligence designed for decisive leaders in transportation, utilities, and public agencies.",
    type: "website",
    url: "https://etl-gis-consulting-llc.vercel.app"
  },
  twitter: {
    card: "summary_large_image",
    title: "ETL GIS Consulting LLC",
    description:
      "Spatial intelligence designed for decisive leaders in transportation, utilities, and public agencies."
  },
  robots: {
    index: true,
    follow: true
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
