import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getContentSection } from "@/lib/content-server";
import "./globals.css";

// Generate metadata dynamically from content management
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Use a simpler approach for metadata generation to avoid SSR issues
    // Try to fetch site info, but don't let errors break the app
    let siteInfo = null;
    try {
      siteInfo = await getContentSection('site_info');
    } catch (contentError) {
      // Silently fail for metadata generation - log but don't break
      console.log('Metadata: Could not fetch site info, using defaults');
    }
    
    const title = String(siteInfo?.content?.site_title || 'HUT KE-13 KAB. PANGANDARAN - Bulan Bahasa & Hari Santri 2025');
    const description = String(siteInfo?.content?.description || 'Youth Competition Event - Showcase your creativity and talents!');
    const eventName = String(siteInfo?.content?.event_name || 'Bulan Bahasa & Hari Santri 2025');

    return {
      title: `${title} - ${eventName}`,
      description,
      openGraph: {
        title: `${title} - ${eventName}`,
        description,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} - ${eventName}`,
        description,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    // Fallback metadata
    return {
      title: 'HUT KE-13 KAB. PANGANDARAN - Bulan Bahasa & Hari Santri 2025',
      description: 'Youth Competition Event - Showcase your creativity and talents!',
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="font-sans antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
