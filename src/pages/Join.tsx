import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { apiUrl, configUrl } from '../config/config';
import { DiscordIcon } from '../components/icons';
import {
  categories,
  categoryFields,
  commonFields,
  dependentFields,
  OTHER_OPTION_VALUE,
  type FieldConfig,
  type RegistrationCategory,
} from '../constants/registration';
import { brand } from '../constants/cdn';
import { LocationFields } from '../components/LocationFields';
import heroPhoto from '../assets/events/join-hero.webp';

const onlyDigits = (value: string) => value.replace(/\D/g, '');

// Reformatted from the raw digits on every keystroke, so paste and delete both
// land on a valid mask instead of drifting out of sync with it.
const maskCpf = (value: string) =>
  onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const maskCnpj = (value: string) =>
  onlyDigits(value)
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');

const FIELD_MASKS: Partial<Record<string, (value: string) => string>> = {
  cpf: maskCpf,
  cnpj: maskCnpj,
};

type Step = 'form' | 'code' | 'dependents' | 'done';

// Kept so a reload during verification doesn't strand a registration that
// already exists on the server.
const STORAGE_KEY = 'hacksp:registration';

interface PendingRegistration {
  id: string;
  sig: string;
  email: string;
  category: RegistrationCategory;
}

const readPending = (): PendingRegistration | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PendingRegistration) : null;
  } catch {
    return null;
  }
};

export function Join() {
  const { t } = useLanguage();

  const [step, setStep] = useState<Step>('form');
  const [category, setCategory] = useState<RegistrationCategory>('student');
  const [values, setValues] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<PendingRegistration | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [resending, setResending] = useState(false);
  // Kept in the mockup for the person filling it in, not sent anywhere: the
  // API has no field for it yet.
  const [notes, setNotes] = useState('');
  const [dependent, setDependent] = useState<Record<string, string>>({});
  const [dependents, setDependents] = useState<string[]>([]);

  const detailFields = categoryFields[category];

  /**
   * Quais campos da categoria ocupam a linha inteira.
   *
   * Alguns são largos por natureza — um select com opção "outro" revela um
   * campo de texto ao lado, e espremê-lo em meia coluna fica apertado. O resto
   * se divide em pares; se sobrar um ímpar, o último estreito estica, senão ele
   * fica sozinho deixando metade da linha vazia.
   */
  const wideFields = useMemo(() => {
    const naturallyWide = new Set(
      detailFields
        .filter((field) => field.type === 'select' && field.options?.length)
        .map((field) => field.name),
    );

    const narrow = detailFields.filter((field) => !naturallyWide.has(field.name));
    if (narrow.length % 2 === 1) {
      naturallyWide.add(narrow[narrow.length - 1].name);
    }

    return naturallyWide;
  }, [detailFields]);

  useEffect(() => {
    const stored = readPending();
    if (stored) {
      setPending(stored);
      setCategory(stored.category);
      setStep('code');
      return;
    }
    // The home hero hands the address over so nobody types it twice.
    const fromHero = new URLSearchParams(window.location.search).get('email');
    if (fromHero) setValues((prev) => ({ ...prev, email: fromHero }));
  }, []);

  const setValue = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const goTo = (next: Step) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startVerification = (registration: PendingRegistration) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registration));
    setPending(registration);
    setNotice(null);
    goTo('code');
  };

  const finishVerification = (verified: RegistrationCategory) => {
    if (verified === 'guardian') {
      goTo('dependents');
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    goTo('done');
  };

  // A select stores an option code; the API is sent the label in the language
  // the person is using, or their own words when they picked "other".
  const resolveValue = (field: FieldConfig, source: Record<string, string>): string => {
    if (field.type !== 'select') return source[field.name]?.trim() ?? '';
    const selected = source[field.name];
    if (selected === OTHER_OPTION_VALUE) return source[`${field.name}_other`]?.trim() ?? '';
    const option = field.options?.find((candidate) => candidate.value === selected);
    return option ? t(option.labelKey) : '';
  };

  const errorKeyForStatus = (status: number) => {
    if (status === 409) return 'register.error.duplicate';
    if (status === 422) return 'register.error.invalid';
    if (status === 429) return 'register.error.rateLimit';
    if (status === 502) return 'register.error.emailFailed';
    return 'register.error.generic';
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const payload: Record<string, string> = { category };
    [...commonFields, ...detailFields].forEach((field) => {
      const value = resolveValue(field, values);
      if (value || !field.optional) payload[field.name] = value;
    });

    // UF e cidade não passam por `commonFields` porque a cidade depende da UF —
    // o par é montado pelo LocationFields, fora da lista declarativa.
    if (values.uf) payload.uf = values.uf;
    if (values.city) payload.city = values.city.trim();
    // O campo tem estado próprio porque fica fora da grade de campos; sem isto,
    // o que a pessoa escrevia era descartado no navegador.
    if (notes.trim()) payload.notes = notes.trim();

    try {
      const response = await fetch(apiUrl.registrations, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const body = await response.json();
        startVerification({ id: body.id, sig: body.sig, email: payload.email, category });
        return;
      }

      // 502 means the row was saved but the email never left; the body carries
      // id and sig so the person continues through resend instead of restarting.
      if (response.status === 502) {
        const body = await response.json().catch(() => null);
        if (body?.id && body?.sig) {
          startVerification({ id: body.id, sig: body.sig, email: payload.email, category });
          setError(t('register.error.emailFailedRetry'));
          return;
        }
      }

      setError(t(errorKeyForStatus(response.status), { email: configUrl.contactEmail }));
    } catch {
      setError(t('register.error.generic'));
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault();
    if (!pending) return;

    setBusy(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(apiUrl.verifyEmail(pending.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        finishVerification(pending.category);
        return;
      }

      if (response.status === 400) setError(t('register.verify.invalid'));
      else if (response.status === 404) setError(t('register.verify.missing'));
      else if (response.status === 429) setError(t('register.verify.tooMany'));
      else setError(t('register.error.generic'));
    } catch {
      setError(t('register.error.generic'));
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (!pending) return;

    setResending(true);
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(apiUrl.resendCode(pending.id), { method: 'POST' });

      if (response.ok) setNotice(t('register.verify.resent'));
      else if (response.status === 409) finishVerification(pending.category);
      else if (response.status === 429) setError(t('register.verify.tooMany'));
      else if (response.status === 404) setError(t('register.verify.missing'));
      else setError(t('register.error.emailFailed', { email: configUrl.contactEmail }));
    } catch {
      setError(t('register.error.generic'));
    } finally {
      setResending(false);
    }
  };

  const handleAddDependent = async (event: FormEvent) => {
    event.preventDefault();
    if (!pending) return;

    setBusy(true);
    setError(null);

    try {
      const response = await fetch(apiUrl.dependents(pending.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sig: pending.sig,
          ...Object.fromEntries(
            dependentFields.map((field) => [field.name, resolveValue(field, dependent)]),
          ),
        }),
      });

      if (response.ok) {
        setDependents((prev) => [...prev, dependent.full_name?.trim() ?? '']);
        setDependent({});
        return;
      }

      if (response.status === 400) setError(t('register.dependents.badSig'));
      else if (response.status === 403) setError(t('register.dependents.unverified'));
      else if (response.status === 404) setError(t('register.verify.missing'));
      else setError(t('register.dependents.error'));
    } catch {
      setError(t('register.dependents.error'));
    } finally {
      setBusy(false);
    }
  };

  const restart = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPending(null);
    setValues({});
    setCode('');
    setError(null);
    setNotice(null);
    goTo('form');
  };

  return (
    <>
      <section className="relative overflow-hidden bg-dark-alt">
        <img
          src={heroPhoto}
          alt=""
          className="absolute inset-0 block h-full w-full object-cover opacity-[0.32]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,30,34,0.72)_0%,rgba(30,30,34,0.9)_100%)]" />
        <img
          src={brand.markRed}
          alt=""
          className="absolute -bottom-[60px] -right-10 hidden h-[260px] w-auto opacity-25 md:block"
        />
        <div className="relative z-[2] mx-auto max-w-shell px-7 pb-16 pt-[72px]">
          <div className="mb-5 flex items-center gap-3.5">
            <img src={brand.markWhite} alt="" className="block h-[22px] w-auto" />
            <p className="eyebrow m-0 text-white">{t('register.title')}</p>
          </div>
          <h1 className="m-0 mb-4 font-display text-[32px] font-extrabold leading-[1.15] tracking-[-0.02em] text-white md:text-[46px]">
            {t('join.heroTitle')}
          </h1>
          <p className="m-0 max-w-[680px] text-[19px] leading-[1.65] text-[#dcdcdc]">
            {t('join.heroLead')}
          </p>
        </div>
      </section>

      {step === 'form' && (
        <>
          <section className="mx-auto max-w-shell px-7 pb-10 pt-[72px]">
            <StepLabel>{t('join.step1')}</StepLabel>
            <h2 className="m-0 mb-8 font-display text-[32px] font-bold">
              {t('register.category.title')}
            </h2>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
              {categories.map(({ id, icon: Icon, labelKey, descKey }) => {
                const active = id === category;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setCategory(id)}
                    aria-pressed={active}
                    className={`rounded-[14px] bg-surface px-[22px] py-6 text-left transition-all ${
                      active
                        ? 'border-2 border-primary shadow-[0_6px_18px_rgba(255,0,0,0.12)]'
                        : 'border-2 border-line hover:border-ink-faint'
                    }`}
                  >
                    <Icon size={22} className="mb-3 block text-primary" />
                    <span className="block font-display text-lg font-bold">{t(labelKey)}</span>
                    <span className="mt-1.5 block text-[15px] leading-[1.6] text-ink-muted">
                      {t(descKey)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mx-auto max-w-shell px-7 pb-[88px] pt-4">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-10">
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-line bg-surface-alt px-[34px] py-9"
              >
                <StepLabel>{t('join.step2')}</StepLabel>
                <h2 className="m-0 mb-7 font-display text-[28px] font-bold">
                  {t('register.personal.title')}
                </h2>

                <div className="flex flex-col gap-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Todos ocupam a linha inteira: o telefone era o único
                        estreito, e sozinho deixava metade da linha vazia além
                        de empurrar o estado para a linha do telefone. */}
                    {commonFields.map((field) => (
                      <div key={field.name} className="sm:col-span-2">
                        <JoinField
                          field={field}
                          value={values[field.name] ?? ''}
                          other={values[`${field.name}_other`] ?? ''}
                          onChange={setValue}
                          t={t}
                        />
                      </div>
                    ))}

                    <LocationFields
                      uf={values.uf ?? ''}
                      city={values.city ?? ''}
                      onChange={setValue}
                    />

                    {detailFields.map((field) => (
                        <div
                          key={field.name}
                          className={wideFields.has(field.name) ? 'sm:col-span-2' : ''}
                        >
                          <JoinField
                            field={field}
                            value={values[field.name] ?? ''}
                            other={values[`${field.name}_other`] ?? ''}
                            onChange={setValue}
                            t={t}
                          />
                        </div>
                    ))}
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-ink-soft">
                      {t('join.notesLabel')}
                    </span>
                    <input
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder={t('join.notesPlaceholder')}
                      className={INPUT_CLASS}
                    />
                  </label>

                  {error && <Feedback tone="error">{error}</Feedback>}

                  <button
                    type="submit"
                    disabled={busy}
                    className="mt-2 w-full rounded-[10px] border-[1.5px] border-primary bg-primary px-6 py-[18px] font-display text-lg font-bold text-white transition-colors hover:border-ink hover:bg-ink disabled:opacity-50"
                  >
                    {busy ? t('register.submitting') : t('register.submit')}
                  </button>

                  <p className="m-0 text-sm leading-[1.6] text-ink-muted">{t('join.formNote')}</p>
                </div>
              </form>

              <div className="flex flex-col gap-5">
                <div className="relative flex flex-col gap-[18px] overflow-hidden rounded-2xl bg-dark px-8 py-[34px] text-white">
                  <img
                    src={brand.markWhite}
                    alt=""
                    className="absolute -bottom-[34px] -right-7 block h-40 w-auto opacity-[0.12]"
                  />
                  <p className="eyebrow relative m-0 text-[#ff5c5c]">{t('join.talkEyebrow')}</p>
                  <h3 className="relative m-0 font-display text-[26px] font-bold text-white">
                    {t('join.talkTitle')}
                  </h3>
                  <p className="relative m-0 text-base leading-[1.7] text-[#c9c9cf]">
                    {t('join.talkBody')}
                  </p>
                  <a
                    href={configUrl.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-discord relative mt-1 self-start px-[26px]"
                  >
                    <DiscordIcon size={22} />
                    {t('community.joinServer')}
                  </a>
                </div>

                <div className="flex flex-col gap-3.5 rounded-2xl border border-line px-[26px] py-7">
                  <h3 className="m-0 font-display text-xl font-bold">{t('join.knowTitle')}</h3>
                  <p className="m-0 text-[15px] leading-[1.7] text-ink-soft">{t('join.know1')}</p>
                  <p className="m-0 text-[15px] leading-[1.7] text-ink-soft">{t('join.know2')}</p>
                  <Link to="/conduct" className="link-underline">
                    {t('join.readConduct')}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {step === 'code' && (
        <section className="mx-auto max-w-shell px-7 pb-[88px] pt-[72px]">
          <form
            onSubmit={handleVerify}
            className="flex max-w-[620px] flex-col gap-5 rounded-2xl border border-line bg-surface-alt px-9 py-10"
          >
            <StepLabel>{t('join.lastStep')}</StepLabel>
            <h2 className="m-0 font-display text-[30px] font-bold">{t('register.verify.title')}</h2>
            <p className="m-0 text-[17px] leading-[1.7] text-ink-soft">{t('join.codeLead')}</p>

            <label className="mt-1 flex flex-col gap-2">
              <span className="text-sm font-semibold text-ink-soft">
                {t('register.verify.label')}
              </span>
              <input
                inputMode="numeric"
                required
                value={code}
                onChange={(event) => setCode(onlyDigits(event.target.value).slice(0, 6))}
                placeholder="000000"
                className="rounded-[10px] border-[1.5px] border-[#d5d5d5] bg-surface px-[18px] py-4 text-center font-display text-[26px] font-bold tracking-[0.34em] focus:border-primary focus:outline-none"
              />
            </label>

            {error && <Feedback tone="error">{error}</Feedback>}
            {notice && !error && <Feedback tone="success">{notice}</Feedback>}

            <button
              type="submit"
              disabled={busy || code.length !== 6}
              className="w-full rounded-[10px] border-[1.5px] border-primary bg-primary px-6 py-[18px] font-display text-lg font-bold text-white transition-colors hover:border-ink hover:bg-ink disabled:opacity-50"
            >
              {busy ? t('register.verify.confirming') : t('register.verify.confirm')}
            </button>

            <div className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="border-none bg-transparent p-0 text-[15px] font-bold text-primary-ink disabled:opacity-50"
              >
                {resending ? t('register.verify.resending') : t('register.verify.resend')}
              </button>
              <button
                type="button"
                onClick={restart}
                className="border-none bg-transparent p-0 text-[15px] font-bold text-ink-muted hover:text-ink"
              >
                {t('register.verify.restart')}
              </button>
            </div>

            <p className="m-0 text-sm leading-[1.6] text-ink-muted">{t('join.codeHelp')}</p>
          </form>
        </section>
      )}

      {step === 'dependents' && (
        <section className="mx-auto max-w-shell px-7 pb-[88px] pt-[72px]">
          <div className="flex max-w-[620px] flex-col gap-5 rounded-2xl border border-line bg-surface-alt px-9 py-10">
            <StepLabel>{t('join.lastStep')}</StepLabel>
            <h2 className="m-0 font-display text-[30px] font-bold">
              {t('register.dependents.title')}
            </h2>
            <p className="m-0 text-[17px] leading-[1.7] text-ink-soft">
              {t('register.dependents.message')}
            </p>

            {dependents.length > 0 && (
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {dependents.map((name, index) => (
                  <li
                    key={`${name}-${index}`}
                    className="rounded-[10px] border border-line bg-surface px-4 py-3 font-semibold"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddDependent} className="flex flex-col gap-5">
              {dependentFields.map((field) => (
                <JoinField
                  key={field.name}
                  field={field}
                  value={dependent[field.name] ?? ''}
                  other={dependent[`${field.name}_other`] ?? ''}
                  onChange={(name, value) => setDependent((prev) => ({ ...prev, [name]: value }))}
                  t={t}
                />
              ))}

              {error && <Feedback tone="error">{error}</Feedback>}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-[10px] border-[1.5px] border-primary bg-primary px-6 py-4 font-display text-base font-bold text-white transition-colors hover:border-ink hover:bg-ink disabled:opacity-50"
              >
                {busy ? t('register.dependents.adding') : t('register.dependents.add')}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                goTo('done');
              }}
              className="btn btn-outline w-full"
            >
              {t('register.dependents.finish')}
            </button>
          </div>
        </section>
      )}

      {step === 'done' && (
        <section className="mx-auto max-w-shell px-7 pb-24 pt-[88px]">
          <div className="flex max-w-[680px] flex-col gap-5 rounded-2xl border border-line bg-surface-alt px-10 py-11">
            <h2 className="m-0 font-display text-[34px] font-extrabold">{t('join.doneTitle')}</h2>
            <p className="m-0 text-lg leading-[1.7] text-ink-soft">{t('join.doneBody')}</p>
            <div className="mt-1 flex flex-wrap gap-3.5">
              <a
                href={configUrl.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-discord px-[26px]"
              >
                <DiscordIcon size={22} />
                {t('community.joinServer')}
              </a>
              <Link to="/" className="btn btn-outline px-[26px]">
                {t('register.success.home')}
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function StepLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <img src={brand.markRed} alt="" className="block h-4 w-auto" />
      <p className="m-0 text-[13px] font-bold uppercase tracking-[0.14em] text-primary">
        {children}
      </p>
    </div>
  );
}

function Feedback({ tone, children }: { tone: 'error' | 'success'; children: ReactNode }) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`m-0 rounded-[10px] px-4 py-3 text-sm font-semibold ${
        tone === 'error' ? 'bg-[#ffecec] text-primary-ink' : 'bg-[#e9f7f0] text-[#1a7f37]'
      }`}
    >
      {children}
    </p>
  );
}

const INPUT_CLASS =
  'rounded-[10px] border-[1.5px] border-[#d5d5d5] bg-surface px-4 py-3.5 text-base text-ink focus:border-primary focus:outline-none';

function JoinField({
  field,
  value,
  other,
  onChange,
  t,
}: {
  field: FieldConfig;
  value: string;
  other: string;
  onChange: (name: string, value: string) => void;
  t: ReturnType<typeof useLanguage>['t'];
}) {
  const label = (
    <span className="text-sm font-semibold text-ink-soft">
      {t(field.labelKey)}
      {field.optional && (
        <span className="font-normal text-ink-faint"> ({t('register.optional')})</span>
      )}
    </span>
  );

  if (field.type === 'select') {
    return (
      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-2">
          {label}
          <select
            required={!field.optional}
            value={value}
            onChange={(event) => onChange(field.name, event.target.value)}
            className={INPUT_CLASS}
          >
            <option value="" disabled>
              {field.placeholderKey ? t(field.placeholderKey) : ''}
            </option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </select>
        </label>

        {value === OTHER_OPTION_VALUE && (
          <input
            required
            value={other}
            onChange={(event) => onChange(`${field.name}_other`, event.target.value)}
            placeholder={t('register.field.other.placeholder')}
            className={INPUT_CLASS}
          />
        )}
      </div>
    );
  }

  const mask = FIELD_MASKS[field.name];

  return (
    <label className="flex flex-col gap-2">
      {label}
      <input
        type={field.type}
        inputMode={mask ? 'numeric' : undefined}
        required={!field.optional}
        value={value}
        onChange={(event) =>
          onChange(field.name, mask ? mask(event.target.value) : event.target.value)
        }
        placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
        className={INPUT_CLASS}
      />
    </label>
  );
}