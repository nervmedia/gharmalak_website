/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { LangProvider } from './data/translations';
import { Header, RoutePath } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { DealsView } from './components/DealsView';
import { SolarRoundView } from './components/SolarRoundView';
import { JoinView } from './components/JoinView';
import { PrivacyView } from './components/PrivacyView';
import { ClubStats, fetchClubStats } from './utils/api';

function resolveRoute(pathname: string): RoutePath {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/deals') return '/deals';
  if (clean === '/round/solar-nagpur') return '/round/solar-nagpur';
  if (clean === '/join') return '/join';
  if (clean === '/privacy') return '/privacy';
  return '/';
}

function AppContent() {
  const [route, setRoute] = useState<RoutePath>(() => resolveRoute(window.location.pathname));
  const [dealQueryId, setDealQueryId] = useState<string | null>(() =>
    new URLSearchParams(window.location.search).get('deal')
  );
  const [stats, setStats] = useState<ClubStats>({ members: 1, optins: 1 });

  const refreshStats = useCallback(async () => {
    const latest = await fetchClubStats();
    setStats(latest);
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(resolveRoute(window.location.pathname));
      setDealQueryId(new URLSearchParams(window.location.search).get('deal'));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((path: RoutePath, hash?: string, query?: string) => {
    const url = `${path}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
    window.history.pushState({}, '', url);
    setRoute(path);
    setDealQueryId(query ? new URLSearchParams(query).get('deal') : null);

    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F3] text-[#073B30]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-[#FFC928] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#073B30]"
      >
        Skip to content
      </a>

      <Header currentPath={route} onNavigate={navigate} />

      <main id="main" className="flex-1">
        {route === '/' && <HomeView stats={stats} onNavigate={navigate} />}
        {route === '/deals' && <DealsView initialDealId={dealQueryId} onNavigate={navigate} />}
        {route === '/round/solar-nagpur' && (
          <SolarRoundView
            stats={stats}
            onStatsUpdated={refreshStats}
            onNavigate={navigate}
          />
        )}
        {route === '/join' && (
          <JoinView onMemberJoined={refreshStats} onNavigate={navigate} />
        )}
        {route === '/privacy' && <PrivacyView />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppContent />
    </LangProvider>
  );
}
