import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { useLang } from '../data/translations';
import {
  CLUB_CONFIG,
  JoinFormErrors,
  JoinFormInput,
  NAGPUR_AREAS,
  buildWhatsAppUrl,
  formatRupees,
  normalizeIndianPhone,
  validateJoinForm,
} from '../data/clubData';
import { submitMemberRegistration } from '../utils/api';
import { RoutePath } from './Header';
import { MalakCard } from './MalakCard';

interface JoinViewProps {
  onMemberJoined: () => void;
  onNavigate: (path: RoutePath) => void;
}

const INTEREST_KEYS = ['solar', 'painting', 'waterproofing', 'other'] as const;

export function JoinView({ onMemberJoined, onNavigate }: JoinViewProps) {
  const { t, lang } = useLang();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<JoinFormInput>({
    name: '',
    phone: '',
    area: '',
    home: '',
    interests: ['solar'],
    consent: false,
  });
  const [errors, setErrors] = useState<JoinFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [memberNumber, setMemberNumber] = useState('GM · NAGPUR');

  const updateField = <K extends keyof JoinFormInput>(key: K, value: JoinFormInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleInterest = (id: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((x) => x !== id)
        : [...prev.interests, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateJoinForm(form, {
      f_err_name: t.f_err_name,
      f_err_phone: t.f_err_phone,
      f_err_area: t.f_err_area,
      f_err_home: t.f_err_home,
      f_err_consent: t.f_err_consent,
    });
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      const res = await submitMemberRegistration({
        ...form,
        lang,
        source: 'join-page',
      });
      setMemberNumber(res.memberNumber);
      onMemberJoined();
      setStep(res.status === 'paid' ? 3 : 2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setErrors({ server: t.f_err_server });
    } finally {
      setSubmitting(false);
    }
  };

  const cleanPhone = normalizeIndianPhone(form.phone);

  return (
    <div className="bg-[#F8F8F3] py-12 sm:py-20">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        {/* Progress Indicator */}
        <div aria-hidden="true" className="grid grid-cols-3 gap-2 mb-8">
          <span
            className={`h-1.5 rounded-full ${step >= 1 ? 'bg-[#064E3B]' : 'bg-[#E4E9E3]'}`}
          />
          <span
            className={`h-1.5 rounded-full ${step >= 2 ? 'bg-[#064E3B]' : 'bg-[#E4E9E3]'}`}
          />
          <span
            className={`h-1.5 rounded-full ${step >= 3 ? 'bg-[#064E3B]' : 'bg-[#E4E9E3]'}`}
          />
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#064E3B]">
                {t.join_over}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#073B30]">
                {t.join_title}
              </h1>
              <p className="text-base text-[#073B30]/80">{t.join_body}</p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-2xl bg-white border border-[#E4E9E3] p-6 sm:p-8 shadow-xs space-y-5"
            >
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#073B30] mb-1.5">
                  {t.f_name}
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  aria-invalid={!!errors.name}
                  className="w-full rounded-xl border border-[#E4E9E3] bg-[#F8F8F3] px-4 py-3 text-sm text-[#073B30] focus:border-[#064E3B] focus:bg-white focus:outline-none"
                />
                {errors.name && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-[#073B30] mb-1.5"
                >
                  {t.f_phone}
                </label>
                <div className="flex rounded-xl border border-[#E4E9E3] bg-[#F8F8F3] overflow-hidden focus-within:border-[#064E3B] focus-within:bg-white">
                  <span className="inline-flex items-center px-3.5 text-sm font-semibold text-[#073B30]/70 border-r border-[#E4E9E3]">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={form.phone}
                    onChange={(e) =>
                      updateField('phone', e.target.value.replace(/[^\d\s]/g, '').slice(0, 12))
                    }
                    aria-invalid={!!errors.phone}
                    className="w-full px-4 py-3 text-sm text-[#073B30] bg-transparent focus:outline-none"
                  />
                </div>
                {errors.phone ? (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-[#073B30]/70">{t.f_phone_hint}</p>
                )}
              </div>

              {/* Area */}
              <div>
                <label htmlFor="area" className="block text-sm font-semibold text-[#073B30] mb-1.5">
                  {t.f_area}
                </label>
                <div className="relative">
                  <select
                    id="area"
                    value={form.area}
                    onChange={(e) => updateField('area', e.target.value)}
                    aria-invalid={!!errors.area}
                    className="w-full appearance-none rounded-xl border border-[#E4E9E3] bg-[#F8F8F3] px-4 py-3 pr-10 text-sm text-[#073B30] focus:border-[#064E3B] focus:bg-white focus:outline-none"
                  >
                    <option value="" disabled>
                      {t.f_area_pick}
                    </option>
                    {NAGPUR_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#073B30]/70" />
                </div>
                {errors.area && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.area}</span>
                  </p>
                )}
              </div>

              {/* Home Type */}
              <fieldset className="space-y-2">
                <legend className="text-sm font-semibold text-[#073B30]">{t.f_home}</legend>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    aria-pressed={form.home === 'house'}
                    onClick={() => updateField('home', 'house')}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                      form.home === 'house'
                        ? 'bg-[#064E3B] text-white'
                        : 'bg-[#F8F8F3] text-[#073B30] border border-[#E4E9E3] hover:bg-[#EAF2E9]'
                    }`}
                  >
                    {t.f_house}
                  </button>
                  <button
                    type="button"
                    aria-pressed={form.home === 'flat'}
                    onClick={() => updateField('home', 'flat')}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                      form.home === 'flat'
                        ? 'bg-[#064E3B] text-white'
                        : 'bg-[#F8F8F3] text-[#073B30] border border-[#E4E9E3] hover:bg-[#EAF2E9]'
                    }`}
                  >
                    {t.f_flat}
                  </button>
                </div>
                {errors.home && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.home}</span>
                  </p>
                )}
              </fieldset>

              {/* What would you like first? */}
              <fieldset className="space-y-2">
                <legend className="text-sm font-semibold text-[#073B30]">{t.f_interest}</legend>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_KEYS.map((key) => {
                    const selected = form.interests.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleInterest(key)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#064E3B] text-white'
                            : 'bg-[#F8F8F3] text-[#073B30] border border-[#E4E9E3] hover:bg-[#EAF2E9]'
                        }`}
                      >
                        {t[`i_${key}` as keyof typeof t]}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Consent */}
              <div>
                <label className="flex items-start gap-2.5 text-xs sm:text-sm text-[#073B30]/85 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => updateField('consent', e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[#E4E9E3] text-[#064E3B]"
                  />
                  <span>
                    {t.f_consent}{' '}
                    <a
                      href="/privacy"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('/privacy');
                      }}
                      className="underline font-semibold text-[#064E3B]"
                    >
                      {t.privacy}
                    </a>
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.consent}</span>
                  </p>
                )}
              </div>

              {errors.server && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700"
                >
                  {errors.server}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFC928] px-6 py-4 text-base font-bold text-[#073B30] hover:bg-[#f3bc18] transition-colors cursor-pointer"
              >
                <span>{submitting ? '…' : t.f_submit}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="flex items-center gap-2 text-xs text-[#073B30]/70">
                <ShieldCheck className="w-4 h-4 text-[#064E3B] shrink-0" />
                <span>{t.faq4_a}</span>
              </p>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#064E3B]">
                {t.pay_over}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#073B30]">
                {t.pay_title}
              </h1>
              <p className="text-base text-[#073B30]/80">{t.pay_body}</p>
            </div>

            <div className="rounded-2xl bg-white border border-[#E4E9E3] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-baseline gap-3 tabular-nums">
                <s className="text-xl text-[#073B30]/45 font-medium">
                  {formatRupees(CLUB_CONFIG.regularFee)}
                </s>
                <span className="text-4xl font-bold text-[#073B30]">
                  {formatRupees(CLUB_CONFIG.fee)}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#064E3B]">
                  {t.plan_badge}
                </span>
              </div>

              <p className="flex items-center gap-2 text-sm font-medium text-[#064E3B]">
                <BadgeCheck className="w-5 h-5 shrink-0" />
                <span>{t.pay_credit}</span>
              </p>

              <div className="rounded-xl bg-[#F8F8F3] border border-[#E4E9E3] p-4 text-sm font-semibold text-[#073B30] tabular-nums">
                +91 {cleanPhone}
              </div>

              <div className="rounded-xl bg-[#EAF2E9] border border-[#CFE0CF] p-4 text-sm text-[#073B30]">
                {t.pay_missing}
              </div>

              <a
                href={buildWhatsAppUrl(
                  `Hi Gharmalak, I just registered (${cleanPhone}). Please send me the ₹499 payment link.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#064E3B] px-6 py-4 text-base font-semibold text-white hover:bg-[#073B30] transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-[#FFC928]" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full rounded-xl border border-[#E4E9E3] bg-[#F8F8F3] px-5 py-3 text-sm font-semibold text-[#073B30] hover:bg-[#EAF2E9] transition-colors cursor-pointer"
              >
                {t.pay_after}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#064E3B]">
                {t.card_member}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#073B30]">
                {t.done_title}
              </h1>
            </div>

            <div className="flex justify-center py-2">
              <MalakCard
                name={form.name.trim() || 'Gharmalak member'}
                number={memberNumber}
                label={t.card_member}
                over={t.card_over}
                variant="emerald"
              />
            </div>

            <div className="rounded-2xl bg-white border border-[#E4E9E3] p-6 sm:p-8 shadow-xs space-y-4">
              <p className="text-base text-[#073B30]/85">{t.done_body}</p>

              <a
                href={buildWhatsAppUrl(
                  'Hi Gharmalak, I have joined the club. Please add me to Round 1 updates.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#064E3B] px-6 py-4 text-base font-semibold text-white hover:bg-[#073B30] transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-[#FFC928]" />
                <span>{t.done_wa}</span>
              </a>

              <a
                href="/round/solar-nagpur"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/round/solar-nagpur');
                }}
                className="flex w-full items-center justify-center rounded-xl bg-[#FFC928] px-6 py-3.5 text-sm font-bold text-[#073B30] hover:bg-[#f3bc18] transition-colors"
              >
                {t.round_cta}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
