import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { brazilianStates } from '../constants/states';
import { apiUrl } from '../config/config';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const Join: React.FC = () => {
  const { t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [uf, setUf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch(apiUrl.subscribe, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          full_name: fullName,
          uf,
          birth_date: birthDate,
        }),
      });

      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const inputClasses = "w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors";
  const labelClasses = "block text-sm font-semibold mb-2 opacity-80";

  return (
    <div className="page-transition max-w-2xl mx-auto py-12 space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-6xl font-bold">{t('join.title')}</h1>
        <p className="text-xl opacity-70">{t('join.subtitle')}</p>
      </section>

      {status === 'success' ? (
        <div className="bg-primary/5 border border-primary/20 p-10 rounded-[2.5rem] text-center space-y-4">
          <CheckCircle2 className="text-primary mx-auto" size={56} />
          <h2 className="text-3xl font-bold">{t('join.success.title')}</h2>
          <p className="text-lg opacity-80">{t('join.success.message')}</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border p-8 md:p-10 rounded-[2.5rem] space-y-6"
        >
          <div>
            <label htmlFor="fullName" className={labelClasses}>{t('join.form.name')}</label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('join.form.namePlaceholder')}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClasses}>{t('join.form.email')}</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('join.form.emailPlaceholder')}
              className={inputClasses}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="uf" className={labelClasses}>{t('join.form.uf')}</label>
              <select
                id="uf"
                required
                value={uf}
                onChange={(e) => setUf(e.target.value)}
                className={inputClasses}
              >
                <option value="" disabled>{t('join.form.ufPlaceholder')}</option>
                {brazilianStates.map((state) => (
                  <option key={state.uf} value={state.uf}>
                    {state.uf} — {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="birthDate" className={labelClasses}>{t('join.form.birthDate')}</label>
              <input
                id="birthDate"
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-3 text-primary bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
              <AlertCircle size={20} className="flex-shrink-0" />
              <p className="text-sm font-medium">{t('join.error')}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {t('join.form.submitting')}
              </>
            ) : (
              <>
                <Send size={20} />
                {t('join.form.submit')}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
