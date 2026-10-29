import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { GharmalakMark } from './Logo';
import { SUPPORTED_LANGUAGES, useLang } from '../data/translations';

export type RoutePath = '/' | '/deals' | '/round/solar-nagpur' | '/join' | '/privacy';

interface HeaderProps {
  currentPath: RoutePath;
  onNavigate: (path: RoutePath, hash?: string) => void;
}

export function Header({ currentPath, onNavigate }: HeaderProps) {
  const { t, lang, setLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (e: React.MouseEvent, path: RoutePath, hash?: string) => {
    e.preventDefault();
    setMobileOpen(false);
    onNavigate(path, hash);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E4E9E3]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Brand Title */}
        <a
          href="/"
          onClick={(e) => handleNav(e, '/')}
          className="flex items-center gap-2.5 text-[#073B30] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#064E3B] rounded-md"
          aria-label="Gharmalak home"
        >
          <GharmalakMark size={28} color="#064E3B" />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight">
              Gharmalak<span className="text-[#064E3B]/70 font-medium">.com</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#073B30]/65 mt-0.5">
              {t.descriptor}
            </span>
          </div>
        </a>

        {/* Zone 2: Primary Navigation Links + Language Switcher */}
        <nav
          aria-label="Main"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#073B30]/85"
        >
          <a
            href="/#how"
            onClick={(e) => handleNav(e, '/', 'how')}
            className="hover:text-[#064E3B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-1"
          >
            {t.nav_how}
          </a>
          <a
            href="/deals"
            onClick={(e) => handleNav(e, '/deals')}
            className={`hover:text-[#064E3B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentPath === '/deals' ? 'text-[#064E3B] font-semibold underline' : ''
            }`}
          >
            {t.nav_deals}
          </a>
          <a
            href="/round/solar-nagpur"
            onClick={(e) => handleNav(e, '/round/solar-nagpur')}
            className={`hover:text-[#064E3B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentPath === '/round/solar-nagpur' ? 'text-[#064E3B] font-semibold underline' : ''
            }`}
          >
            {t.nav_round}
          </a>

          {/* Language Selector */}
          <div
            role="group"
            aria-label="Language"
            className="flex items-center gap-1 rounded-lg bg-[#EAF2E9] p-1 border border-[#E4E9E3]"
          >
            {SUPPORTED_LANGUAGES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={lang === item.id}
                onClick={() => setLang(item.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === item.id
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'text-[#073B30]/80 hover:text-[#073B30]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Zone 3: Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/join"
            onClick={(e) => handleNav(e, '/join')}
            className="inline-flex items-center justify-center rounded-lg bg-[#FFC928] px-4 py-2 text-sm font-semibold text-[#073B30] shadow-xs hover:bg-[#f3bc18] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#064E3B]"
          >
            {t.nav_join}
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex md:hidden items-center justify-center rounded-lg p-2 text-[#073B30] hover:bg-[#EAF2E9] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E4E9E3] bg-white px-4 pt-3 pb-5 shadow-lg">
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-2">
            <a
              href="/#how"
              onClick={(e) => handleNav(e, '/', 'how')}
              className="rounded-lg px-3 py-2.5 text-base font-medium text-[#073B30] hover:bg-[#EAF2E9]"
            >
              {t.nav_how}
            </a>
            <a
              href="/deals"
              onClick={(e) => handleNav(e, '/deals')}
              className="rounded-lg px-3 py-2.5 text-base font-medium text-[#073B30] hover:bg-[#EAF2E9]"
            >
              {t.nav_deals}
            </a>
            <a
              href="/round/solar-nagpur"
              onClick={(e) => handleNav(e, '/round/solar-nagpur')}
              className="rounded-lg px-3 py-2.5 text-base font-medium text-[#073B30] hover:bg-[#EAF2E9]"
            >
              {t.nav_round}
            </a>

            <div className="pt-2 border-t border-[#E4E9E3] flex items-center justify-between px-3">
              <span className="text-xs font-medium text-[#073B30]/70 uppercase tracking-wider">
                Language
              </span>
              <div
                role="group"
                aria-label="Mobile Language"
                className="flex items-center gap-1 rounded-lg bg-[#EAF2E9] p-1"
              >
                {SUPPORTED_LANGUAGES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={lang === item.id}
                    onClick={() => setLang(item.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      lang === item.id
                        ? 'bg-[#064E3B] text-white'
                        : 'text-[#073B30]/80 hover:text-[#073B30]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
