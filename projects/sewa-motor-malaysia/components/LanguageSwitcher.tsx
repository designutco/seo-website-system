"use client";

import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import Link from "next/link";
import { usePathname } from "next/navigation";

const languageLabels: Record<string, string> = {
  en: "EN",
  zh: "中文",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  // Remove current locale prefix from pathname to get the base path
  const pathnameWithoutLocale = pathname.replace(/^\/(en|zh)/, "") || "/";

  return (
    <div className="relative group">
      {/* Trigger: globe icon + current locale code */}
      <button
        type="button"
        className="flex items-center gap-1.5 px-3 py-2 text-white/90 hover:text-white
                   transition-colors duration-200 rounded-lg
                   hover:bg-white/10 focus:bg-white/10 focus:outline-none
                   focus:ring-2 focus:ring-red-500/50 active:bg-white/15
                   text-sm font-medium tracking-wide cursor-pointer"
        aria-label="Switch language"
      >
        {/* Globe icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{locale.toUpperCase()}</span>
        {/* Chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:rotate-180"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown menu — CSS-only via group-hover */}
      <ul
        className="absolute right-0 top-full mt-1 min-w-[140px] py-1
                    bg-gray-900 border border-white/10 rounded-lg
                    shadow-[0_4px_20px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)]
                    opacity-0 invisible translate-y-1
                    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                    transition-all duration-200 z-50"
      >
        {routing.locales.map((loc) => (
          <li key={loc}>
            <Link
              href={`/${loc}${pathnameWithoutLocale}`}
              hrefLang={loc}
              className={`block px-4 py-2.5 text-sm transition-colors duration-150
                ${
                  loc === locale
                    ? "text-red-400 bg-red-500/10 font-semibold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }
                focus:outline-none focus:bg-white/10 active:bg-white/15`}
            >
              {languageLabels[loc]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
