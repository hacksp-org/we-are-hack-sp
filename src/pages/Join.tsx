import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { apiUrl, configUrl } from '../config/config';
import hDark from '../assets/h_dark.svg';
import hLight from '../assets/h_light.svg';
import {
  categories,
  categoryFields,
  commonFields,
  dependentFields,
  OTHER_OPTION_VALUE,
  type FieldConfig,
  type RegistrationCategory,
} from '../constants/registration';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MailCheck,
  Plus,
  Send,
} from 'lucide-react';

const onlyDigits = (value: string) => value.replace(/\D/g, '');

// Reformatted from the raw digits on every keystroke, so paste and delete
// both land on a valid mask instead of drifting out of sync with it.
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

type Step = 'category' | 'personal' | 'details' | 'verify' | 'dependents' | 'done';

// Kept so a reload during the email verification step doesn't strand the
// registration, which already exists on the server at that point.
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

const inputClasses =
  'w-full bg-background rounded-xl px-4 py-3.5 text-foreground border border-transparent placeholder:opacity-30 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all';
const selectClasses = `${inputClasses} appearance-none cursor-pointer`;
const labelClasses = 'block text-xs font-medium uppercase tracking-wider mb-2 opacity-45';
// The panel around each step is the card, so a step is just stacked content.
const cardClasses = 'space-y-6';
const primaryButtonClasses =
  'flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50';
const ghostButtonClasses =
  'flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold opacity-55 hover:opacity-100 transition-opacity';

export const Join: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const [step, setStep] = useState<Step>('category');
  const [category, setCategory] = useState<RegistrationCategory | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<PendingRegistration | null>(null);

  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [resending, setResending] = useState(false);

  const [dependent, setDependent] = useState<Record<string, string>>({});
  const [dependents, setDependents] = useState<string[]>([]);

  useEffect(() => {
    const stored = readPending();
    if (stored) {
      setPending(stored);
      setCategory(stored.category);
      setStep('verify');
    }
  }, []);

  const detailFields = category ? categoryFields[category] : [];
  const totalSteps = category === 'guardian' ? 5 : 4;
  const stepNumber: Record<Step, number> = { category: 1, personal: 2, details: 3, verify: 4, dependents: 5, done: 5 };

  const setValue = (name: string, value: string) => setValues((prev) => ({ ...prev, [name]: value }));
  const setDependentField = (name: string, value: string) =>
    setDependent((prev) => ({ ...prev, [name]: value }));

  // `values[field.name]` holds an option code (e.g. "mother"), not text — the
  // API gets whatever that code translates to in the language the person is
  // using, or their own words when they picked "other".
  const resolveFieldValue = (field: FieldConfig, source: Record<string, string>): string => {
    if (field.type !== 'select') return source[field.name]?.trim() ?? '';
    const selected = source[field.name];
    if (selected === OTHER_OPTION_VALUE) return source[`${field.name}_other`]?.trim() ?? '';
    const option = field.options?.find((candidate) => candidate.value === selected);
    return option ? t(option.labelKey) : '';
  };

  const errorKeyForStatus = (httpStatus: number) => {
    if (httpStatus === 409) return 'register.error.duplicate';
    if (httpStatus === 422) return 'register.error.invalid';
    if (httpStatus === 429) return 'register.error.rateLimit';
    // Only reached when a 502 arrives without the id/sig body — an older API
    // build. With them, handleSubmit routes the registrant to resend instead.
    if (httpStatus === 502) return 'register.error.emailFailed';
    return 'register.error.generic';
  };

  const startVerification = (registration: PendingRegistration) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registration));
    setPending(registration);
    setError(null);
    setNotice(null);
    setStep('verify');
  };

  // Reached once the email is confirmed, whether just now or on an earlier try.
  const finishVerification = (verifiedCategory: RegistrationCategory) => {
    if (verifiedCategory === 'guardian') {
      setStep('dependents');
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    setStep('done');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setStatus('loading');
    setError(null);

    const payload: Record<string, string> = { category };
    [...commonFields, ...detailFields].forEach((field) => {
      const value = resolveFieldValue(field, values);
      if (value || !field.optional) payload[field.name] = value;
    });

    try {
      const res = await fetch(apiUrl.registrations, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const body = await res.json();
        startVerification({ id: body.id, sig: body.sig, email: payload.email, category });
        return;
      }

      // 502 means the registration was saved but the email never left. The
      // body carries id and sig, so the registrant continues through resend
      // instead of signing up again.
      if (res.status === 502) {
        const body = await res.json().catch(() => null);
        if (body?.id && body?.sig) {
          startVerification({ id: body.id, sig: body.sig, email: payload.email, category });
          setError(t('register.error.emailFailedRetry'));
          return;
        }
      }

      setError(t(errorKeyForStatus(res.status), { email: configUrl.contactEmail }));
    } catch {
      setError(t('register.error.generic'));
    } finally {
      setStatus('idle');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending) return;

    setStatus('loading');
    setError(null);
    setNotice(null);

    try {
      const res = await fetch(apiUrl.verifyEmail(pending.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        finishVerification(pending.category);
        return;
      }

      if (res.status === 400) setError(t('register.verify.invalid'));
      else if (res.status === 404) setError(t('register.verify.missing'));
      else if (res.status === 429) setError(t('register.verify.tooMany'));
      else setError(t('register.error.generic'));
    } catch {
      setError(t('register.error.generic'));
    } finally {
      setStatus('idle');
    }
  };

  const handleResend = async () => {
    if (!pending) return;

    setResending(true);
    setError(null);
    setNotice(null);

    try {
      const res = await fetch(apiUrl.resendCode(pending.id), { method: 'POST' });

      if (res.ok) setNotice(t('register.verify.resent'));
      // Already verified: there is nothing left to confirm, so move on.
      else if (res.status === 409) finishVerification(pending.category);
      else if (res.status === 429) setError(t('register.verify.tooMany'));
      else if (res.status === 404) setError(t('register.verify.missing'));
      else if (res.status === 502) setError(t('register.error.emailFailed', { email: configUrl.contactEmail }));
      else setError(t('register.error.generic'));
    } catch {
      setError(t('register.error.generic'));
    } finally {
      setResending(false);
    }
  };

  const handleAddDependent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending) return;

    setStatus('loading');
    setError(null);
    setNotice(null);

    try {
      const res = await fetch(apiUrl.dependents(pending.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sig: pending.sig,
          ...Object.fromEntries(dependentFields.map((field) => [field.name, resolveFieldValue(field, dependent)])),
        }),
      });

      if (res.ok) {
        setDependents((prev) => [...prev, dependent.full_name?.trim() ?? '']);
        setDependent({});
        return;
      }

      if (res.status === 400) setError(t('register.dependents.badSig'));
      else if (res.status === 403) setError(t('register.dependents.unverified'));
      else if (res.status === 404) setError(t('register.verify.missing'));
      else if (res.status === 429) setError(t('register.error.rateLimit'));
      else setError(t('register.dependents.error'));
    } catch {
      setError(t('register.dependents.error'));
    } finally {
      setStatus('idle');
    }
  };

  const restart = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPending(null);
    setCategory(null);
    setValues({});
    setCode('');
    setError(null);
    setNotice(null);
    setStep('category');
  };

  const finish = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStep('done');
  };

  const renderField = (
    field: FieldConfig,
    values: Record<string, string>,
    setField: (name: string, value: string) => void,
    idPrefix = '',
  ) => {
    const id = `${idPrefix}${field.name}`;
    const value = values[field.name] ?? '';
    const label = (
      <label htmlFor={id} className={labelClasses}>
        {t(field.labelKey)}
        {field.optional && <span className="opacity-50 font-normal"> ({t('register.optional')})</span>}
      </label>
    );

    if (field.type === 'select') {
      const isOther = value === OTHER_OPTION_VALUE;
      return (
        <div key={id} className="space-y-3">
          <div>
            {label}
            <div className="relative">
              <select
                id={id}
                required={!field.optional}
                value={value}
                onChange={(e) => setField(field.name, e.target.value)}
                className={selectClasses}
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
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-40"
              />
            </div>
          </div>

          {isOther && (
            <input
              id={`${id}-other`}
              type="text"
              required
              autoFocus
              value={values[`${field.name}_other`] ?? ''}
              onChange={(e) => setField(`${field.name}_other`, e.target.value)}
              placeholder={t('register.field.relationship.other.placeholder')}
              className={`${inputClasses} animate-in fade-in slide-in-from-top-1 duration-300`}
            />
          )}
        </div>
      );
    }

    const mask = FIELD_MASKS[field.name];
    return (
      <div key={id}>
        {label}
        <input
          id={id}
          type={field.type}
          inputMode={mask ? 'numeric' : undefined}
          required={!field.optional}
          value={value}
          onChange={(e) => setField(field.name, mask ? mask(e.target.value) : e.target.value)}
          placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
          className={inputClasses}
        />
      </div>
    );
  };

  const feedback = useMemo(() => {
    if (!error && !notice) return null;

    return (
      <div className="flex items-center gap-3 text-primary bg-background rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-300">
        {error ? (
          <AlertCircle size={20} className="flex-shrink-0" />
        ) : (
          <MailCheck size={20} className="flex-shrink-0" />
        )}
        <p className="text-sm font-medium">{error ?? notice}</p>
      </div>
    );
  }, [error, notice]);

  const renderStep = () => {
    if (step === 'done') {
      return (
        <div className="space-y-6">
          <CheckCircle2 className="text-primary animate-pop-in" size={40} />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{t('register.success.title')}</h2>
            <p className="text-sm opacity-50">{t('register.success.message')}</p>
          </div>
          <Link to="/" className={`${ghostButtonClasses} inline-flex -ml-6`}>
            <ArrowLeft size={18} />
            {t('register.success.home')}
          </Link>
        </div>
      );
    }

    if (step === 'category') {
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">{t('register.category.title')}</h2>

          <div className="-mx-3 divide-y divide-hairline">
            {categories.map(({ id, icon: Icon, labelKey, descKey }, index) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setCategory(id);
                  setStep('personal');
                }}
                style={{ animationDelay: `${index * 60}ms` }}
                className="group w-full flex items-center gap-4 text-left px-3 py-4 hover:bg-hover transition-colors animate-in fade-in slide-in-from-left-4 fill-mode-both duration-500"
              >
                <Icon size={20} className="text-primary flex-shrink-0 transition-transform group-hover:scale-110" />
                <span className="flex-1 min-w-0">
                  <span className="block font-medium">{t(labelKey)}</span>
                  <span className="block text-sm opacity-45">{t(descKey)}</span>
                </span>
                <ArrowRight
                  size={18}
                  className="flex-shrink-0 opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 transition-all"
                />
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (step === 'personal' || step === 'details') {
      const isPersonal = step === 'personal';
      const fields = isPersonal ? commonFields : detailFields;

      return (
        <form
          onSubmit={(e) => {
            if (isPersonal) {
              e.preventDefault();
              setStep('details');
              return;
            }
            handleSubmit(e);
          }}
          className={cardClasses}
        >
          <h2 className="text-xl font-semibold">
            {t(isPersonal ? 'register.personal.title' : 'register.details.title')}
          </h2>

          <div className="space-y-6">
            {fields.map((field) => renderField(field, values, setValue))}
          </div>

          {feedback}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(isPersonal ? 'category' : 'personal');
              }}
              className={ghostButtonClasses}
            >
              <ArrowLeft size={18} />
              {t('register.back')}
            </button>

            <button type="submit" disabled={status === 'loading'} className={`${primaryButtonClasses} flex-1`}>
              {status === 'loading' ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {t('register.submitting')}
                </>
              ) : (
                <>
                  {isPersonal ? t('register.next') : t('register.submit')}
                  {isPersonal ? <ArrowRight size={20} /> : <Send size={20} />}
                </>
              )}
            </button>
          </div>
        </form>
      );
    }

    if (step === 'verify') {
      return (
        <form onSubmit={handleVerify} className={cardClasses}>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{t('register.verify.title')}</h2>
            <p className="text-sm opacity-50">{t('register.verify.message', { email: pending?.email ?? '' })}</p>
          </div>

          <div>
            <label htmlFor="code" className={labelClasses}>
              {t('register.verify.label')}
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className={`${inputClasses} text-center text-2xl tracking-[0.5em] font-bold`}
            />
          </div>

          {feedback}

          <div className="space-y-4">
            <button type="submit" disabled={status === 'loading'} className={`${primaryButtonClasses} w-full`}>
              {status === 'loading' ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {t('register.verify.confirming')}
                </>
              ) : (
                t('register.verify.confirm')
              )}
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-semibold">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="opacity-70 hover:opacity-100 transition-opacity disabled:opacity-40"
              >
                {resending ? t('register.verify.resending') : t('register.verify.resend')}
              </button>
              <button
                type="button"
                onClick={restart}
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                {t('register.verify.restart')}
              </button>
            </div>
          </div>
        </form>
      );
    }

    return (
      <div className={cardClasses}>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{t('register.dependents.title')}</h2>
          <p className="text-sm opacity-50">{t('register.dependents.message')}</p>
        </div>

        {dependents.length > 0 && (
          <div className="space-y-2">
            <p className={labelClasses}>{t('register.dependents.list')}</p>
            <ul className="space-y-2">
              {dependents.map((name, index) => (
                <li
                  key={`${name}-${index}`}
                  className="flex items-center gap-3 bg-background rounded-xl px-4 py-3"
                >
                  <CheckCircle2 size={18} className="text-primary flex-shrink-0" />
                  <span className="font-medium">{name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleAddDependent} className="space-y-6">
          {dependentFields.map((field) => renderField(field, dependent, setDependentField, 'dependent-'))}

          {feedback}

          <button type="submit" disabled={status === 'loading'} className={`${primaryButtonClasses} w-full`}>
            {status === 'loading' ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {t('register.dependents.adding')}
              </>
            ) : (
              <>
                <Plus size={20} />
                {t('register.dependents.add')}
              </>
            )}
          </button>
        </form>

        <button type="button" onClick={finish} className={`${ghostButtonClasses} w-full`}>
          {t('register.dependents.finish')}
        </button>
      </div>
    );
  };

  return (
    // Solid background of its own: this page sits outside the site layout.
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl bg-card rounded-[2rem] overflow-hidden grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:aspect-video">
        <aside className="flex md:flex-col items-center md:items-start justify-between md:justify-center gap-6 p-8 md:p-10 border-b md:border-b-0 md:border-r border-hairline">
          <img src={theme === 'dark' ? hDark : hLight} alt="Hack SP" className="h-9 md:h-12" />
          <p className="hidden md:block text-sm opacity-45 leading-relaxed">{t('register.subtitle')}</p>

          {step !== 'done' && (
            <div
              className="flex gap-1.5"
              aria-label={t('register.step', {
                current: String(stepNumber[step]),
                total: String(totalSteps),
              })}
            >
              {Array.from({ length: totalSteps }, (_, index) => (
                <span
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index < stepNumber[step] ? 'w-6 bg-primary' : 'w-3 bg-muted'
                  }`}
                />
              ))}
            </div>
          )}
        </aside>

        {/* The card is a fixed 16:9 box, so a long step scrolls inside it. */}
        <section className="flex flex-col justify-center gap-8 p-8 sm:p-10 md:p-12 md:overflow-y-auto">
          <h1 className="text-xs font-medium uppercase tracking-[0.2em] opacity-35">{t('register.title')}</h1>
          {/* Keyed by step so each transition replays the entrance instead of just swapping content. */}
          <div key={step} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderStep()}
          </div>
        </section>
      </div>
    </div>
  );
};
