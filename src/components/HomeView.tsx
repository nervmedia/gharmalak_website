import React, { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  Check,
  ChevronDown,
  ClipboardList,
  Coins,
  IndianRupee,
  MessageCircle,
  Percent,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { useLang } from '../data/translations';
import {
  CLUB_CONFIG,
  DEALS,
  DealItem,
  LAUNCH_CITIES,
  REACH_LABELS,
  ROUND_1_SOLAR,
  SEASON_CATEGORIES,
  SeasonGroup,
  TIER_LABELS,
  buildWhatsAppUrl,
  formatRupees,
  getRemainingSeats,
  getRoundForDeal,
  getRoundProgress,
} from '../data/clubData';
import { ClubStats } from '../utils/api';
import { RoutePath } from './Header';
import { MalakCard } from './MalakCard';
import { ResilientImage } from './ResilientImage';

interface HomeViewProps {
  stats: ClubStats;
  onNavigate: (path: RoutePath, hash?: string, query?: string) => void;
}

export function HomeView({ stats, onNavigate }: HomeViewProps) {
  const { t } = useLang();
  const [activeSeason, setActiveSeason] = useState<'all' | SeasonGroup>('all');
  const [selectedDeal, setSelectedDeal] = useState<DealItem | null>(null);
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({
    5: true,
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [showVideoModal, setShowVideoModal] = useState(false);

  const roundProgress = getRoundProgress(stats.optins);
  const seatsInfo = getRemainingSeats(stats.members);
  const seatsLabel = t.plan_seats.replace('{n}', seatsInfo.remaining.toLocaleString('en-IN'));

  const toggleFaq = (id: number) => {
    setOpenFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNavClick = (
    e: React.MouseEvent,
    path: RoutePath,
    hash?: string,
    query?: string
  ) => {
    e.preventDefault();
    onNavigate(path, hash, query);
  };

  const howSteps = [
    {
      num: '01',
      title: t.step1_t,
      body: t.step1_b,
      Icon: ClipboardList,
    },
    {
      num: '02',
      title: t.step2_t,
      body: t.step2_b,
      Icon: MessageCircle,
    },
    {
      num: '03',
      title: t.step3_t,
      body: t.step3_b,
      Icon: Users,
    },
    {
      num: '04',
      title: t.step4_t,
      body: t.step4_b,
      Icon: ShieldCheck,
    },
  ];

  const whoCards = [
    {
      id: 1,
      title: t.who1_t,
      body: t.who1_b,
      detail:
        '3 kW rooftop solar with PM Surya Ghar paperwork, terrace waterproofing before the monsoon, exterior and interior painting, and solar water heaters.',
      image: '/images/independent-house.jpg',
      alt: 'Modern Indian independent house with landscaped garden and driveway',
    },
    {
      id: 2,
      title: t.who2_t,
      body: t.who2_b,
      detail:
        'Split air conditioners with installation, RO water purifiers, modular kitchens and wardrobes, energy-saving BLDC fans, and bathroom leak-proofing.',
      image: '/images/apartment-building.jpg',
      alt: 'Modern Indian residential apartment building with balconies and greenery',
    },
    {
      id: 3,
      title: t.who3_t,
      body: t.who3_b,
      detail:
        'Arrange dependable home upgrades and repairs for your parents in Nagpur from anywhere, with licence-checked vendors and our 5-year workmanship cover.',
      image: '/images/homeowners.jpg',
      alt: 'Older Indian homeowners in a comfortable residential setting',
    },
  ];

  const faqIds = [5, 1, 2, 3, 4] as const;

  const visibleSeasons =
    activeSeason === 'all'
      ? SEASON_CATEGORIES
      : SEASON_CATEGORIES.filter((s) => s.id === activeSeason);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#064E3B] text-white">
        {/* Background Residential Bungalow Photograph */}
        <div className="absolute inset-0 z-0">
          <ResilientImage
            src="/images/hero-bungalow.jpg"
            alt="Modern Indian bungalow with rooftop solar panels and landscaped garden"
            loading="eager"
            className="h-full w-full object-cover object-center"
            containerClassName="h-full w-full"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#042F23]/95 via-[#064E3B]/85 to-[#042F23]/55"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#FFC928]">
                {t.hero_over}
              </p>

              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.22] text-white max-w-2xl">
                {t.hero_title}
              </h1>

              <p className="text-lg sm:text-xl font-medium text-[#FFC928]">{t.h_line}</p>

              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl">
                {t.hero_body}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="/join"
                  onClick={(e) => handleNavClick(e, '/join')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFC928] px-6 py-3.5 text-base font-semibold text-[#073B30] shadow-md hover:bg-[#f3bc18] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>{t.hero_cta}</span>
                  <ArrowRight className="w-5 h-5" />
                </a>

                <a
                  href="/deals"
                  onClick={(e) => handleNavClick(e, '/deals')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 backdrop-blur-xs px-6 py-3.5 text-base font-semibold text-white hover:bg-white/20 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>{t.h_deals}</span>
                </a>
              </div>

              <div className="flex items-start gap-2.5 pt-2 text-sm text-white/90 max-w-xl">
                <BadgeCheck className="w-5 h-5 text-[#FFC928] shrink-0 mt-0.5" />
                <p>{t.hero_note}</p>
              </div>
            </div>

            {/* Right Column: Malak Card & WhatsApp Round 1 Preview */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end space-y-4">
              <div className="relative w-full max-w-[390px]">
                <MalakCard
                  name="Priya Deshmukh"
                  number="GM · 0001 · NGP"
                  label={t.card_member}
                  over={t.card_over}
                  variant="emerald"
                />

                {/* Subtle stacked second card indicator */}
                <div className="mt-3 rounded-xl border border-white/20 bg-[#042F23]/90 backdrop-blur-md p-4 text-white shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/20 text-[#25D366]">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div className="text-xs sm:text-sm space-y-1">
                      <p className="font-semibold text-white flex items-center gap-2">
                        <span>Gharmalak</span>
                        <span className="text-[11px] font-normal text-[#FFC928]">
                          · {t.example}
                        </span>
                      </p>
                      <p className="text-white/85 leading-snug">
                        Round 1: rooftop solar, installed in January. Opt in from 1 Nov. Reply{' '}
                        <strong className="text-[#FFC928]">YES</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY GHARMALAK SECTION */}
      <section className="bg-[#F8F8F3] py-16 sm:py-20 border-b border-[#E4E9E3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Proposition */}
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#064E3B]">
                {t.st_over}
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#073B30] leading-tight">
                {t.st_title}
              </h2>
              <p className="text-base sm:text-lg text-[#073B30]/80 leading-relaxed max-w-2xl">
                {t.st_body}
              </p>
            </div>

            {/* Right Column: Savings Highlight Panel & Verified Counters */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white border border-[#E4E9E3] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-5 pb-6 border-b border-[#E4E9E3]">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FFC928]/25 text-[#064E3B]">
                    <Coins className="h-8 w-8 text-[#064E3B]" />
                  </div>
                  <div>
                    <div className="text-4xl sm:text-5xl font-bold text-[#064E3B] tabular-nums">
                      10%
                    </div>
                    <p className="text-sm sm:text-base font-medium text-[#073B30]/85 mt-0.5">
                      {t.stat_saving}
                    </p>
                  </div>
                </div>

                {/* Live Club Counters */}
                <div
                  role="list"
                  className="grid grid-cols-3 gap-4 pt-1 text-center sm:text-left"
                >
                  <div role="listitem">
                    <span className="block text-2xl sm:text-3xl font-bold text-[#073B30] tabular-nums">
                      {stats.members.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#073B30]/75">{t.stat_members}</span>
                  </div>
                  <div role="listitem">
                    <span className="block text-2xl sm:text-3xl font-bold text-[#073B30] tabular-nums">
                      {stats.optins.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#073B30]/75">{t.stat_optins}</span>
                  </div>
                  <div role="listitem">
                    <span className="block text-2xl sm:text-3xl font-bold text-[#073B30] tabular-nums">
                      {LAUNCH_CITIES.length}
                    </span>
                    <span className="text-xs text-[#073B30]/75">{t.stat_cities}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW A ROUND WORKS SECTION */}
      <section id="how" className="bg-white py-16 sm:py-24 border-b border-[#E4E9E3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#064E3B]">
                {t.how_over}
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#073B30]">
                {t.how_title}
              </h2>
            </div>

            {/* Explainer Video Trigger */}
            <button
              type="button"
              onClick={() => setShowVideoModal(true)}
              className="inline-flex items-center gap-2.5 self-start md:self-auto rounded-xl bg-[#EAF2E9] hover:bg-[#dce8da] border border-[#CFE0CF] px-4 py-2.5 text-sm font-semibold text-[#064E3B] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <PlayCircle className="w-5 h-5 text-[#064E3B]" />
              <span>{t.vid_label}</span>
              <span className="text-xs font-normal text-[#073B30]/75">· {t.vid_note}</span>
            </button>
          </div>

          {/* 4 Equally Sized Step Cards with Desktop Connecting Arrows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howSteps.map((step, index) => {
              const Icon = step.Icon;
              return (
                <article
                  key={step.num}
                  className="relative flex flex-col justify-between rounded-2xl bg-[#F8F8F3] border border-[#E4E9E3] p-6 sm:p-7 hover:border-[#064E3B]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#064E3B] text-[#FFC928]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF2E9] text-xs font-bold text-[#064E3B] tabular-nums">
                        {step.num}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#073B30] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#073B30]/80 leading-relaxed">{step.body}</p>
                  </div>

                  {index < 3 && (
                    <div
                      aria-hidden="true"
                      className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full bg-white border border-[#E4E9E3] text-[#064E3B] shadow-2xs"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED ROOFTOP SOLAR DEAL */}
      <section className="bg-[#F8F8F3] py-16 sm:py-24 border-b border-[#E4E9E3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-white border border-[#E4E9E3] shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left: Real Photograph of Rooftop Solar Installation */}
              <div className="lg:col-span-6 relative min-h-[280px] sm:min-h-[360px]">
                <ResilientImage
                  src="/images/rooftop-solar.jpg"
                  alt="3 kW rooftop solar panels installed on a residential bungalow roof"
                  className="h-full w-full object-cover object-center"
                  containerClassName="h-full w-full"
                />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-[#042F23]/90 backdrop-blur-xs px-4 py-3 text-white text-xs sm:text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium">
                    <Sun className="w-4 h-4 text-[#FFC928]" />
                    <span>3 kW On-Grid Rooftop Solar · MSEDCL Cities</span>
                  </span>
                  <span className="text-[#FFC928] font-semibold">PM Surya Ghar Subsidy</span>
                </div>
              </div>

              {/* Right: Deal Details & Metadata */}
              <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#064E3B]">
                    <span>{t.round_over}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#073B30]/75">{t.r_status_soon}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#073B30]">
                    {t.round_title}
                  </h2>

                  <p className="text-base font-medium text-[#064E3B]">{t.r1_line}</p>

                  <p className="text-sm sm:text-base text-[#073B30]/80 leading-relaxed">
                    {t.round_body}
                  </p>
                </div>

                {/* Compact Metadata Grid with Calendar, Rupee, Percentage, and People Icons */}
                <div className="grid grid-cols-2 gap-4 rounded-2xl bg-[#F8F8F3] border border-[#E4E9E3] p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs text-[#073B30]/70">Opt-in window</span>
                      <strong className="text-sm font-semibold text-[#073B30]">
                        1 Nov – 31 Dec
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <IndianRupee className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs text-[#073B30]/70">{t.round_pbt}</span>
                      <strong className="text-sm font-semibold text-[#073B30]">
                        {t.round_pbt_val}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Percent className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs text-[#073B30]/70">{t.round_saving}</span>
                      <strong className="text-sm font-semibold text-[#073B30]">
                        {t.round_saving_val}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs text-[#073B30]/70">Minimum group</span>
                      <strong className="text-sm font-semibold text-[#073B30] tabular-nums">
                        {roundProgress.optins} / {ROUND_1_SOLAR.target} {t.round_homes}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div
                    role="progressbar"
                    aria-valuenow={roundProgress.optins}
                    aria-valuemin={0}
                    aria-valuemax={ROUND_1_SOLAR.target}
                    aria-label={t.round_homes}
                    className="h-2.5 w-full overflow-hidden rounded-full bg-[#EAF2E9]"
                  >
                    <div
                      className="h-full rounded-full bg-[#064E3B] transition-all duration-300"
                      style={{ width: `${Math.max(roundProgress.percent, 4)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#073B30]/75 tabular-nums">
                    <span>
                      <strong className="text-[#073B30]">{roundProgress.optins}</strong> /{' '}
                      {ROUND_1_SOLAR.target} {t.round_homes}
                    </span>
                    <span>{t.round_closes} 31 Dec</span>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="pt-1 flex flex-wrap items-center gap-4">
                  <a
                    href="/round/solar-nagpur"
                    onClick={(e) => handleNavClick(e, '/round/solar-nagpur')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#064E3B] px-6 py-3.5 text-sm sm:text-base font-semibold text-white hover:bg-[#073B30] transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>{t.round_cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <span className="text-xs text-[#073B30]/70">
                    Typical spend: ₹1.5–2.2 lakh before subsidy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TWELVE-MONTH DEAL CALENDAR */}
      <section className="bg-white py-16 sm:py-24 border-b border-[#E4E9E3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#064E3B]">
                {t.ahead_over}
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#073B30]">
                {t.ahead_title}
              </h2>
              <p className="text-base text-[#073B30]/80">{t.ahead_sub}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/deals"
                onClick={(e) => handleNavClick(e, '/deals')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#EAF2E9] hover:bg-[#dce8da] px-4 py-2.5 text-sm font-semibold text-[#064E3B] transition-colors whitespace-nowrap shrink-0"
              >
                <span>{t.ahead_cta}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Interactive Season Filter Bar */}
          <div
            role="group"
            aria-label="Filter deals by season"
            className="flex flex-wrap items-center gap-1.5 p-1.5 mb-8 rounded-xl bg-[#F8F8F3] border border-[#E4E9E3] w-fit"
          >
            <button
              type="button"
              onClick={() => setActiveSeason('all')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSeason === 'all'
                  ? 'bg-[#064E3B] text-white shadow-2xs'
                  : 'text-[#073B30]/80 hover:text-[#073B30]'
              }`}
            >
              All 23 Deals
            </button>
            {SEASON_CATEGORIES.map((season) => (
              <button
                key={season.id}
                type="button"
                onClick={() => setActiveSeason(season.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeSeason === season.id
                    ? 'bg-[#064E3B] text-white shadow-2xs'
                    : 'text-[#073B30]/80 hover:text-[#073B30]'
                }`}
              >
                {season.name}
              </button>
            ))}
          </div>

          {/* Seasonal Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleSeasons.map((season) => {
              const seasonDeals = DEALS.filter((d) => d.seasonGroup === season.id);
              return (
                <div
                  key={season.id}
                  className={`rounded-2xl border ${season.borderClass} ${season.bgClass} p-5 flex flex-col justify-between`}
                >
                  <div>
                    <div
                      className={`rounded-xl ${season.headerBgClass} px-4 py-2.5 mb-4 flex items-center justify-between`}
                    >
                      <h3 className="text-xs font-bold tracking-[0.16em] uppercase text-[#073B30]">
                        {season.name}
                      </h3>
                      <span className="text-[11px] font-medium text-[#073B30]/75">
                        {seasonDeals.length} deals
                      </span>
                    </div>

                    <div className="space-y-3">
                      {seasonDeals.map((deal) => (
                        <button
                          key={deal.id}
                          type="button"
                          onClick={() => setSelectedDeal(deal)}
                          className="group w-full text-left rounded-xl bg-white border border-[#E4E9E3] p-3 hover:border-[#064E3B] hover:shadow-xs transition-all flex items-center gap-3.5 cursor-pointer"
                        >
                          <div className="h-16 w-22 shrink-0 overflow-hidden rounded-lg bg-[#EAF2E9]">
                            <ResilientImage
                              src={deal.image}
                              alt={deal.title}
                              fallbackLabel={deal.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                              containerClassName="h-full w-full"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-medium text-[#064E3B] truncate">
                              {deal.seasonLabel}
                            </p>
                            <h4 className="text-sm font-semibold text-[#073B30] leading-snug line-clamp-2 mt-0.5">
                              {deal.title}
                            </h4>
                            <p className="text-xs text-[#073B30]/70 mt-1 tabular-nums truncate">
                              {deal.ticket}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. WHO IT IS FOR */}
      <section className="bg-[#F8F8F3] py-16 sm:py-24 border-b border-[#E4E9E3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-12 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#064E3B]">
              {t.who_over}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#073B30]">
              {t.who_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whoCards.map((card) => (
              <article
                key={card.id}
                className="overflow-hidden rounded-2xl bg-white border border-[#E4E9E3] shadow-xs flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#EAF2E9]">
                  <ResilientImage
                    src={card.image}
                    alt={card.alt}
                    className="h-full w-full object-cover object-center"
                    containerClassName="h-full w-full"
                  />
                </div>
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-[#073B30]">{card.title}</h3>
                    <p className="text-base font-medium text-[#064E3B] mt-1">{card.body}</p>
                    <p className="text-sm text-[#073B30]/75 leading-relaxed mt-2">{card.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TRUST AND PROMISE SECTION */}
      <section className="bg-[#064E3B] text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-4 mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFC928]">
              {t.not_over}
            </p>
            <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-bold tracking-tight leading-tight text-white">
              {t.not_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-white/15">
            <div className="space-y-3 pt-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#FFC928]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{t.why1_t}</h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">{t.why1_b}</p>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#FFC928]">
                <IndianRupee className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{t.why2_t}</h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">{t.why2_b}</p>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#FFC928]">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{t.why3_t}</h3>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">{t.why3_b}</p>
            </div>
          </div>

          {/* Coming soon homeowner vault note */}
          <div className="mt-12 rounded-2xl bg-white/8 border border-white/15 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <Sparkles className="w-5 h-5 text-[#FFC928] shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <h4 className="text-sm font-semibold text-white">{t.why4_t}</h4>
                <p className="text-xs sm:text-sm text-white/80">{t.why4_b}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOUNDING MEMBERSHIP SECTION */}
      <section id="join" className="bg-[#F8F8F3] py-16 sm:py-24 border-b border-[#E4E9E3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-12 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#064E3B]">
              {t.join_over}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#073B30]">
              {t.plan_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left Column: Malak Card Credential & Seats Remaining Panel */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="flex flex-col items-center lg:items-start">
                <MalakCard
                  name="Rahul Joshi"
                  number="GM · 0002 · NGP"
                  label={t.card_member}
                  over={t.card_over}
                  variant="brass"
                />
              </div>

              {/* Separate Founding Seats Availability Panel */}
              <div className="rounded-2xl bg-white border border-[#E4E9E3] p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-[#073B30] tabular-nums">
                    {seatsLabel}
                  </span>
                  <span className="text-xs font-medium text-[#064E3B]">Nagpur Founding Batch</span>
                </div>

                <div
                  role="progressbar"
                  aria-valuenow={seatsInfo.joined}
                  aria-valuemin={0}
                  aria-valuemax={CLUB_CONFIG.foundingSeats}
                  aria-label={seatsLabel}
                  className="h-2.5 w-full overflow-hidden rounded-full bg-[#EAF2E9]"
                >
                  <div
                    className="h-full rounded-full bg-[#064E3B] transition-all duration-300"
                    style={{ width: `${Math.max(seatsInfo.percentFull, 3)}%` }}
                  />
                </div>

                <p className="text-xs sm:text-sm text-[#073B30]/80 leading-relaxed">
                  {t.pay_credit}
                </p>
              </div>
            </div>

            {/* Right Column: Founding Membership Pricing & Benefits Checklist */}
            <div className="lg:col-span-7">
              <div className="h-full rounded-3xl bg-white border border-[#E4E9E3] p-6 sm:p-10 shadow-xs flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E4E9E3]">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#064E3B]">
                        {t.plan_badge}
                      </span>
                      <div className="mt-2 flex items-baseline gap-3 tabular-nums">
                        <s className="text-xl sm:text-2xl text-[#073B30]/45 font-medium">
                          {formatRupees(CLUB_CONFIG.regularFee)}
                        </s>
                        <span className="text-4xl sm:text-5xl font-bold text-[#073B30]">
                          {formatRupees(CLUB_CONFIG.fee)}
                        </span>
                        <span className="text-base font-medium text-[#073B30]/75">
                          {t.plan_per}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-[#064E3B]">
                      <BadgeCheck className="w-5 h-5 text-[#064E3B]" />
                      <span>{t.plan_save}</span>
                    </div>
                  </div>

                  {/* Benefits Checklist */}
                  <ul className="space-y-4">
                    {[t.plan_t1, t.plan_t2, t.plan_t3, t.plan_t4].map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3.5 text-base text-[#073B30]">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF2E9] text-[#064E3B]">
                          <Check className="h-4 w-4 stroke-[2.5]" />
                        </div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <a
                    href="/join"
                    onClick={(e) => handleNavClick(e, '/join')}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFC928] px-6 py-4 text-base font-bold text-[#073B30] shadow-xs hover:bg-[#f3bc18] transition-colors"
                  >
                    <span>{t.hero_cta}</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <p className="text-center text-xs sm:text-sm text-[#073B30]/70">{t.plan_note}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section className="bg-white py-16 sm:py-24 border-b border-[#E4E9E3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#073B30]">
              {t.faq_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {faqIds.map((id) => {
              const question = t[`faq${id}_q` as keyof typeof t];
              const answer = t[`faq${id}_a` as keyof typeof t];
              const isOpen = !!openFaqs[id];
              return (
                <div
                  key={id}
                  className="rounded-2xl bg-[#F8F8F3] border border-[#E4E9E3] overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleFaq(id)}
                    className="flex w-full items-center justify-between gap-4 p-6 text-left font-semibold text-base sm:text-lg text-[#073B30] hover:bg-[#EAF2E9]/50 transition-colors cursor-pointer"
                  >
                    <span>{question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#064E3B] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#073B30]/85 leading-relaxed border-t border-[#E4E9E3]/60">
                      {answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="bg-[#F8F8F3] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-[#064E3B] text-white shadow-md grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Real Photograph of Attractive Indian Residential Home */}
            <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[320px]">
              <ResilientImage
                src="/images/final-cta-home.jpg"
                alt="Attractive Indian residential home in warm daylight"
                className="h-full w-full object-cover object-center"
                containerClassName="h-full w-full"
              />
              <div
                aria-hidden="true"
                className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-[#064E3B]"
              />
            </div>

            {/* Right: Deep-Green Content Panel */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFC928]">
                {t.end_over}
              </p>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {t.end_title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="/join"
                  onClick={(e) => handleNavClick(e, '/join')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFC928] px-6 py-3.5 text-base font-semibold text-[#073B30] hover:bg-[#f3bc18] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>{t.hero_cta}</span>
                  <ArrowRight className="w-5 h-5" />
                </a>

                <a
                  href={buildWhatsAppUrl('Hi Gharmalak, I want to know more about the club.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white hover:bg-white/20 transition-colors whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-5 h-5 text-[#FFC928]" />
                  <span>{t.hero_wa}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEAL DETAIL MODAL */}
      {selectedDeal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="deal-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedDeal(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white border border-[#E4E9E3] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-52 w-full bg-[#EAF2E9]">
              <ResilientImage
                src={selectedDeal.image}
                alt={selectedDeal.title}
                className="h-full w-full object-cover"
                containerClassName="h-full w-full"
              />
              <button
                type="button"
                aria-label="Close deal details"
                onClick={() => setSelectedDeal(null)}
                className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium text-[#064E3B]">
                <span>Round {selectedDeal.round}</span>
                <span aria-hidden="true">·</span>
                <span>{ getRoundForDeal(selectedDeal).install }</span>
                <span aria-hidden="true">·</span>
                <span>{TIER_LABELS[selectedDeal.tier]}</span>
              </div>

              <h3 id="deal-modal-title" className="text-2xl font-bold text-[#073B30]">
                {selectedDeal.title}
              </h3>

              <p className="text-lg font-semibold text-[#064E3B] tabular-nums">
                Typical spend: {selectedDeal.ticket}
              </p>

              <p className="text-sm sm:text-base text-[#073B30]/85 leading-relaxed">
                {selectedDeal.why}
              </p>

              <div className="rounded-xl bg-[#F8F8F3] border border-[#E4E9E3] p-4 space-y-1.5 text-xs sm:text-sm">
                <p>
                  <strong className="text-[#073B30]">Vendors &amp; brands:</strong>{' '}
                  <span className="text-[#073B30]/80">{selectedDeal.brands}</span>
                </p>
                <p>
                  <strong className="text-[#073B30]">Coverage:</strong>{' '}
                  <span className="text-[#073B30]/80">{REACH_LABELS[selectedDeal.reach]}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {selectedDeal.roundHref ? (
                  <a
                    href={selectedDeal.roundHref}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedDeal(null);
                      onNavigate('/round/solar-nagpur');
                    }}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#064E3B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#073B30] transition-colors"
                  >
                    <span>See the solar round</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : null}

                <a
                  href={`/deals?deal=${selectedDeal.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const id = selectedDeal.id;
                    setSelectedDeal(null);
                    onNavigate('/deals', 'interest', `deal=${id}`);
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FFC928] px-5 py-3 text-sm font-semibold text-[#073B30] hover:bg-[#f3bc18] transition-colors"
                >
                  <span>Notify me when this opens</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPLAINER VIDEO MODAL */}
      {showVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.vid_label}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-[#042F23] border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/15 text-white">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <PlayCircle className="w-5 h-5 text-[#FFC928]" />
                <span>{t.vid_label}</span>
                <span className="text-xs font-normal text-white/70">· {t.vid_note}</span>
              </div>
              <button
                type="button"
                aria-label="Close video"
                onClick={() => setShowVideoModal(false)}
                className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <video
                controls
                autoPlay
                playsInline
                poster="/videos/how-gharmalak-works-16x9.jpg"
                className="h-full w-full"
              >
                <source src="/videos/how-gharmalak-works-16x9.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
