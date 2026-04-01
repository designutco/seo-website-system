import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { OrganizationSchema } from "@/components/schema/OrganizationSchema";
import { siteConfig } from "@/config/site";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });

  return {
    title: {
      default: t("title"),
      template: `%s | ${siteConfig.brandName}`,
    },
    description: t("description"),
    alternates: {
      canonical: `${siteConfig.baseUrl}/${locale}`,
      languages: {
        en: `${siteConfig.baseUrl}/en`,
        zh: `${siteConfig.baseUrl}/zh`,
        "x-default": `${siteConfig.baseUrl}/en`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteConfig.baseUrl}/${locale}`,
      siteName: siteConfig.brandName,
      locale: locale === "zh" ? "zh_CN" : "en_MY",
      type: "website",
    },
  };
}

const TOP_LOCATIONS = [
  { slug: "kuala-lumpur", name: "Kuala Lumpur" },
  { slug: "petaling-jaya", name: "Petaling Jaya" },
  { slug: "shah-alam", name: "Shah Alam" },
  { slug: "johor-bahru", name: "Johor Bahru" },
  { slug: "george-town", name: "George Town" },
  { slug: "ipoh", name: "Ipoh" },
];

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "zh")) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "nav" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  const currentYear = new Date().getFullYear();

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <OrganizationSchema />

          {/* Header */}
          <header className="sticky top-0 z-50 bg-[#111827] text-white shadow-lg shadow-black/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Brand */}
                <Link
                  href={`/${locale}`}
                  className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="18.5" cy="17.5" r="3.5" />
                    <circle cx="5.5" cy="17.5" r="3.5" />
                    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h3" />
                  </svg>
                  <span className="font-serif">Sewa Motor</span>
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm">
                  <a
                    href="#products"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {t("products")}
                  </a>
                  <a
                    href="#locations"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {t("locations")}
                  </a>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <LanguageSwitcher />
                  <a
                    href="https://wa.me/60123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-md shadow-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#111827]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 0 0 .611.611l4.458-1.495A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.325 0-4.47-.744-6.227-2.01l-.435-.326-2.847.954.954-2.847-.326-.435A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    {t("whatsapp")}
                  </a>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="bg-[#111827] text-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand + tagline */}
                <div>
                  <Link
                    href={`/${locale}`}
                    className="text-white font-serif text-xl font-bold tracking-tight"
                  >
                    Sewa Motor Malaysia
                  </Link>
                  <p className="mt-3 text-sm leading-relaxed">
                    {tFooter("tagline")}
                  </p>
                </div>

                {/* Quick links */}
                <div>
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                    {tFooter("quickLinks")}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href={`/${locale}`}
                        className="hover:text-white transition-colors"
                      >
                        {tFooter("home")}
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#products"
                        className="hover:text-white transition-colors"
                      >
                        {tFooter("products")}
                      </a>
                    </li>
                    <li>
                      <a
                        href="#locations"
                        className="hover:text-white transition-colors"
                      >
                        {tFooter("locations")}
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Top locations */}
                <div>
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                    {tFooter("topLocations")}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {TOP_LOCATIONS.map((loc) => (
                      <li key={loc.slug}>
                        <Link
                          href={`/${locale}/sewa-motor/${loc.slug}`}
                          className="hover:text-white transition-colors"
                        >
                          {loc.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Copyright */}
              <div className="mt-10 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                {tFooter("copyright", { year: currentYear })}
              </div>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
