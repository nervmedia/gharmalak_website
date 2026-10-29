import React from 'react';
import { MessageCircle } from 'lucide-react';
import { GharmalakMark } from './Logo';
import { useLang } from '../data/translations';
import { buildWhatsAppUrl } from '../data/clubData';
import { RoutePath } from './Header';

interface FooterProps {
  onNavigate: (path: RoutePath, hash?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useLang();

  const handleNav = (e: React.MouseEvent, path: RoutePath, hash?: string) => {
    e.preventDefault();
    onNavigate(path, hash);
  };

  return (
    <footer className="bg-[#064E3B] text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand & Tagline */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <a
              href="/"
              onClick={(e) => handleNav(e, '/')}
              className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
            >
              <GharmalakMark size={24} color="#FFC928" />
              <span>
                Gharmalak<span className="text-[#FFC928] font-medium">.com</span>
              </span>
            </a>
            <span className="hidden sm:inline text-white/30" aria-hidden="true">
              ·
            </span>
            <p className="text-sm text-white/80">{t.footer_line}</p>
          </div>

          {/* Navigation & Legal Links */}
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/85"
          >
            <a
              href="/#how"
              onClick={(e) => handleNav(e, '/', 'how')}
              className="hover:text-[#FFC928] transition-colors whitespace-nowrap"
            >
              {t.nav_how}
            </a>
            <a
              href="/deals"
              onClick={(e) => handleNav(e, '/deals')}
              className="hover:text-[#FFC928] transition-colors whitespace-nowrap"
            >
              {t.nav_deals}
            </a>
            <a
              href="/round/solar-nagpur"
              onClick={(e) => handleNav(e, '/round/solar-nagpur')}
              className="hover:text-[#FFC928] transition-colors whitespace-nowrap"
            >
              {t.nav_round}
            </a>
            <a
              href="/privacy"
              onClick={(e) => handleNav(e, '/privacy')}
              className="hover:text-[#FFC928] transition-colors whitespace-nowrap"
            >
              {t.privacy}
            </a>
            <a
              href={buildWhatsAppUrl('Hi Gharmalak, I want to know more about the club.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#FFC928] hover:underline whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>+91 77678 77675</span>
            </a>
            <span className="text-white/60 whitespace-nowrap">
              © {new Date().getFullYear()} Gharmalak
            </span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
