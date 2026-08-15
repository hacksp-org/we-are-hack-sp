import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { apiUrl, configUrl } from '../config/config';
import { HeartCrack, Loader2, CheckCircle2, AlertCircle, ArrowLeft, Link2Off, FlaskConical } from 'lucide-react';

export const Unsubscribe: React.FC = () => {
  const { t, setLanguage } = useLanguage();
  const [searchParams] = useSearchParams();

  const id = searchParams.get('id');
  const sig = searchParams.get('sig');
  const lang = searchParams.get('lang');
  const isTest = Boolean(searchParams.get('test'));

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'test' | 'error' | 'invalid'>(
    isTest || (id && sig) ? 'idle' : 'invalid'
  );

  useEffect(() => {
    if (lang === 'pt' || lang === 'en') setLanguage(lang);
  }, [lang, setLanguage]);

  const handleConfirm = async () => {
    if (isTest) {
      setStatus('test');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch(apiUrl.unsubscribe, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, sig }),
      });

      if (res.status === 400 || res.status === 401 || res.status === 403 || res.status === 404) {
        setStatus('invalid');
        return;
      }

      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const backHome = (
    <Link
      to="/"
      className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-full font-semibold hover:border-primary transition-colors"
    >
      <ArrowLeft size={18} />
      {t('unsubscribe.success.back')}
    </Link>
  );

  const renderCard = () => {
    if (status === 'success' || status === 'test') {
      const isTestResult = status === 'test';

      return (
        <div className="bg-primary/5 border border-primary/20 p-10 rounded-[2.5rem] text-center space-y-6">
          {isTestResult ? (
            <FlaskConical className="text-primary mx-auto" size={56} />
          ) : (
            <CheckCircle2 className="text-primary mx-auto" size={56} />
          )}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold">
              {t(isTestResult ? 'unsubscribe.test.title' : 'unsubscribe.success.title')}
            </h2>
            <p className="text-lg opacity-80">
              {t(isTestResult ? 'unsubscribe.test.message' : 'unsubscribe.success.message')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {backHome}
            <Link
              to="/join"
              className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              {t('unsubscribe.success.rejoin')}
            </Link>
          </div>
        </div>
      );
    }

    if (status === 'invalid') {
      return (
        <div className="bg-card border border-border p-10 rounded-[2.5rem] text-center space-y-6">
          <Link2Off className="text-primary mx-auto" size={48} />
          <div className="space-y-3">
            <h2 className="text-3xl font-bold">{t('unsubscribe.invalid.title')}</h2>
            <p className="opacity-80">
              {t('unsubscribe.invalid.message', { email: configUrl.contactEmail })}
            </p>
          </div>
          {backHome}
        </div>
      );
    }

    return (
      <div className="bg-card border border-border p-8 md:p-10 rounded-[2.5rem] space-y-8">
        {isTest && (
          <div className="flex items-center gap-3 text-primary bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
            <FlaskConical size={20} className="flex-shrink-0" />
            <p className="text-sm font-medium">
              <span className="font-bold">{t('unsubscribe.test.badge')} — </span>
              {t('unsubscribe.test.notice')}
            </p>
          </div>
        )}

        <div className="text-center space-y-4">
          <HeartCrack className="text-primary mx-auto" size={48} />
          <h2 className="text-2xl md:text-3xl font-bold">{t('unsubscribe.confirm.question')}</h2>
          <p className="opacity-80">{t('unsubscribe.confirm.p1')}</p>
          <p className="opacity-60 text-sm">{t('unsubscribe.confirm.p2')}</p>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-3 text-primary bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p className="text-sm font-medium">{t('unsubscribe.error')}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {t('unsubscribe.form.submitting')}
              </>
            ) : (
              t('unsubscribe.form.confirm')
            )}
          </button>

          <Link
            to="/"
            className="block text-center text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity"
          >
            {t('unsubscribe.form.keep')}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="page-transition max-w-2xl mx-auto py-12 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-6xl font-bold">{t('unsubscribe.title')}</h1>
        <p className="text-xl opacity-70">{t('unsubscribe.subtitle')}</p>
      </section>

      {renderCard()}
    </div>
  );
};
