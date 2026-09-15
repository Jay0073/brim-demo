import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE } from "@/lib/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Single Google Tag Manager container. Kept as a list because the JSX below
// maps over it, so another container can be added back here alone — but if one
// is, keep each analytics tag in only one container to avoid double-counting an
// event. All containers share the one global `dataLayer`, which is Google's
// documented multi-container setup.
const GTM_IDS = ["GTM-M4WP7MXM"] as const;

// Display face: Bricolage Grotesque is variable — full weight range available,
// so heading weight is controlled via CSS (.font-display → 800).
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

// Body / UI face: Inter is variable, no weight needed.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: browser extensions inject attributes onto
          <body> (e.g. bis_register) before React hydrates, which is harmless. */}
      <body
        className="min-h-dvh bg-ink text-paper antialiased"
        suppressHydrationWarning
      >
        <noscript>
          {GTM_IDS.map((id) => (
            <iframe
              key={id}
              src={`https://www.googletagmanager.com/ns.html?id=${id}`}
              height="0"
              width="0"
              className="hidden invisible"
              title={`Google Tag Manager (${id})`}
            />
          ))}
        </noscript>
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
        {GTM_IDS.map((id) => (
          <Script
            key={id}
            id={`google-tag-manager-${id}`}
            strategy="afterInteractive"
          >
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`}
          </Script>
        ))}
      </body>
    </html>
  );
}
