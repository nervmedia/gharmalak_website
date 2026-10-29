import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, Clock, MessageCircle, Sun } from 'lucide-react';
import { useLang } from '../data/translations';
import {
  ROUND_1_SOLAR,
  buildWhatsAppUrl,
  getRoundProgress,
  isValidIndianPhone,
} from '../data/clubData';
import { ClubStats, submitRoundOptIn } from '../utils/api';
import { RoutePath } from './Header';
import { ResilientImage } from './ResilientImage';

interface SolarRoundViewProps {
  stats: ClubStats;
  onStatsUpdated: () => void;
  onNavigate: (path: RoutePath) => void;
}

export function SolarRoundView({ stats, onStatsUpdated, onNavigate }: SolarRoundViewProps) {
  const { t } = useLang();
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'already' | 'notmember' | 'error'>(
    'idle'
  );
  const [addedOptin, setAddedOptin] = useState(0);

  useEffect(() => {
    try {
      const savedPhone = localStorage.getItem('gm_phone');
      if (savedPhone) setPhone(savedPhone);
    } catch {
      // ignore
    }
  }, []);

  const todayISO = new Date().toISOString().slice(0, 10);
  const roundStatusLabel =
    todayISO < ROUND_1_SOLAR.opens
      ? t.r_status_soon
      : todayISO <= ROUND_1_SOLAR.closes
      ? t.r_status_open
      : t.r_status_closed;

  const progress = getRoundProgress(stats.optins + addedOptin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIndianPhone(phone)) {
      setStatus('error');
      return;
    }
    setStatus('busy');
    const res = await submitRoundOptIn(phone);
    if (res.status === 'done' && res.created) {
      setAddedOptin((prev) => prev + 1);
      onStatsUpdated();
    }
    setStatus(res.status);
  };

  return (
    <div className="bg-[#F8F8F3] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Solar Round Full Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#064E3B]">
                {t.round_over}
              </p>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#073B30]">
                {t.round_title}
              </h1>
              <p className="text-base sm:text-lg text-[#073B30]/85 leading-relaxed">
                {t.round_body}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#E4E9E3] bg-white shadow-xs">
              <div className="aspect-[16/9] w-full overflow-hidden">
                <ResilientImage
                  src="/images/rooftop-solar.jpg"
                  alt="3 kW on-grid rooftop solar installation on an Indian bungalow"
                  className="h-full w-full object-cover"
                  containerClassName="h-full w-full"
                />
              </div>
            </div>

            {/* What you get */}
            <div className="rounded-2xl bg-white border border-[#E4E9E3] p-6 sm:p-8 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#073B30]">{t.r_what}</h2>
              <ul className="space-y-3">
                {[t.r_what1, t.r_what2, t.r_what3, t.r_what4].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base text-[#073B30]">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF2E9] text-[#064E3B]">
                      <Check className="h-4 w-4 stroke-[2.5]" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How to take part */}
            <div className="rounded-2xl bg-white border border-[#E4E9E3] p-6 sm:p-8 space-y-5">
              <h2 className="text-xl sm:text-2xl font-bold text-[#073B30]">{t.r_how}</h2>
              <ol className="space-y-4">
                {[1, 2, 3, 4].map((step) => (
                  <li
                    key={step}
                    className="flex items-start gap-4 rounded-xl bg-[#F8F8F3] border border-[#E4E9E3] p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#064E3B] text-xs font-bold text-[#FFC928] tabular-nums">
                      {step}
                    </span>
                    <div>
                      <p className="font-bold text-[#073B30]">
                        {t[`step${step}_t` as keyof typeof t]}
                      </p>
                      <p className="text-sm text-[#073B30]/80 mt-0.5">
                        {t[`step${step}_b` as keyof typeof t]}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right Column: Sticky Deal Status & Opt-In Form */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            {/* Deal Status Card */}
            <article className="rounded-2xl bg-white border border-[#E4E9E3] p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-bold text-[#073B30]">
                  <Sun className="w-5 h-5 text-[#064E3B]" />
                  <span>{t.i_solar}</span>
                </h2>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064E3B]">
                  <Clock className="w-4 h-4" />
                  <span>{roundStatusLabel}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-[#F8F8F3] border border-[#E4E9E3] p-4">
                <div>
                  <span className="block text-xs text-[#073B30]/70">{t.round_pbt}</span>
                  <strong className="text-sm font-semibold text-[#073B30]">
                    {t.round_pbt_val}
                  </strong>
                </div>
                <div>
                  <span className="block text-xs text-[#073B30]/70">{t.round_saving}</span>
                  <strong className="text-sm font-semibold text-[#073B30]">
                    {t.round_saving_val}
                  </strong>
                </div>
              </div>

              <div className="space-y-2">
                <div
                  role="progressbar"
                  aria-valuenow={progress.optins}
                  aria-valuemin={0}
                  aria-valuemax={ROUND_1_SOLAR.target}
                  aria-label={t.round_homes}
                  className="h-2.5 w-full overflow-hidden rounded-full bg-[#EAF2E9]"
                >
                  <div
                    className="h-full rounded-full bg-[#064E3B] transition-all duration-300"
                    style={{ width: `${Math.max(progress.percent, 4)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[#073B30]/75 tabular-nums">
                  <span>
                    <strong className="text-[#073B30]">{progress.optins}</strong> /{' '}
                    {ROUND_1_SOLAR.target} {t.round_homes}
                  </span>
                  <span>{t.round_closes} 31 Dec</span>
                </div>
              </div>
            </article>

            {/* Opt-In Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl bg-white border border-[#E4E9E3] p-6 shadow-xs space-y-5"
            >
              <div>
                <h2 className="text-xl font-bold text-[#073B30]">{t.r_opt_title}</h2>
                <p className="text-sm text-[#073B30]/80 mt-1 leading-relaxed">{t.r_opt_body}</p>
              </div>

              <div>
                <label
                  htmlFor="optin-phone"
                  className="block text-sm font-semibold text-[#073B30] mb-1.5"
                >
                  {t.f_phone}
                </label>
                <div className="flex rounded-xl border border-[#E4E9E3] bg-[#F8F8F3] overflow-hidden focus-within:border-[#064E3B] focus-within:bg-white">
                  <span className="inline-flex items-center px-3.5 text-sm font-semibold text-[#073B30]/70 border-r border-[#E4E9E3]">
                    +91
                  </span>
                  <input
                    id="optin-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/[^\d\s]/g, '').slice(0, 12));
                      setStatus('idle');
                    }}
                    className="w-full px-4 py-3 text-sm text-[#073B30] bg-transparent focus:outline-none"
                  />
                </div>
                {status === 'error' && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{t.f_err_phone}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'busy'}
                className="w-full rounded-xl bg-[#FFC928] px-6 py-3.5 text-sm sm:text-base font-bold text-[#073B30] hover:bg-[#f3bc18] transition-colors cursor-pointer"
              >
                {status === 'busy' ? '…' : t.r_opt_cta}
              </button>

              {status === 'done' && (
                <div
                  role="status"
                  className="rounded-xl bg-[#EAF2E9] border border-[#CFE0CF] p-4 text-sm font-medium text-[#064E3B]"
                >
                  {t.r_opt_done}
                </div>
              )}

              {status === 'already' && (
                <div
                  role="status"
                  className="rounded-xl bg-[#EAF2E9] border border-[#CFE0CF] p-4 text-sm font-medium text-[#064E3B]"
                >
                  {t.r_opt_already}
                </div>
              )}

              {status === 'notmember' && (
                <div
                  role="alert"
                  className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-[#073B30]"
                >
                  <span>{t.r_opt_notmember} </span>
                  <a
                    href="/join"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('/join');
                    }}
                    className="font-bold text-[#064E3B] underline"
                  >
                    {t.nav_join}
                  </a>
                </div>
              )}

              <a
                href={buildWhatsAppUrl(
                  'YES, opt me in to Round 1: rooftop solar, installed in January.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#064E3B] bg-white px-5 py-3 text-sm font-semibold text-[#064E3B] hover:bg-[#EAF2E9] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: YES</span>
              </a>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
}
