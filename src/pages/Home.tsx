import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useReveal } from '../hooks/useReveal';
import { configUrl } from '../config/config';
import { DiscordIcon } from '../components/icons';
import { SponsorMarquee } from '../components/SponsorMarquee';
import { sponsors } from '../constants/sponsors';
import { useEvents } from '../hooks/useEvents';
import brandMarkRed from '../assets/brand/brand-mark-red.png';
import brandMarkWhite from '../assets/brand/brand-mark-white.png';
import heroPhoto from '../assets/events/hero.jpeg';

export function Home() {
  useReveal();

  return (
    <>
      <span id="top" />
      <Hero />
      <Community />
      <About />
      <Transparency />
      <Support />
      <Sponsors />
    </>
  );
}

function Hero() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  // The field is a shortcut into the real form, not a second way to register:
  // whatever is typed here is carried over so nobody types it twice.
  const goToSignup = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    navigate(trimmed ? `/join?email=${encodeURIComponent(trimmed)}` : '/join');
  };

  return (
    <section className="relative overflow-hidden bg-dark-alt">
      <img
        src={heroPhoto}
        alt=""
        className="absolute inset-0 block h-full w-full object-cover opacity-[0.38]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#00000036,#0000009A)]" />
      <img
        src={brandMarkRed}
        alt=""
        className="absolute -right-[60px] top-10 hidden h-[340px] w-auto opacity-[0.22] md:block"
      />

      <div className="relative z-[2] mx-auto max-w-shell px-7 pb-24 pt-[104px]">
        <div data-reveal className="max-w-[900px]">
          <div className="mb-[22px] flex items-center gap-3.5">
            <img src={brandMarkWhite} alt="" className="block h-[26px] w-auto" />
            <p className="eyebrow m-0 text-white">{t('home.eyebrow')}</p>
          </div>

          <h1 className="m-0 mb-[26px] font-display text-[38px] font-extrabold leading-[1.14] tracking-[-0.02em] text-white md:text-[58px]">
            {t('home.title')}
          </h1>

          <p className="m-0 mb-10 max-w-[760px] text-lg leading-[1.65] text-[#dcdcdc] md:text-xl">
            {t('home.intro')}
          </p>

          <form
            onSubmit={goToSignup}
            className="flex max-w-[760px] flex-col gap-3.5 rounded-2xl border border-white/[0.14] bg-white/5 p-5"
          >
            <div className="flex flex-wrap gap-3">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('home.emailPlaceholder')}
                aria-label={t('home.emailPlaceholder')}
                className="min-w-[220px] flex-1 rounded-[10px] border-[1.5px] border-white/40 bg-white/10 px-[18px] py-4 text-[17px] text-white placeholder:text-white/60 focus:border-[#ff3b3b] focus:outline-none"
              />
              <button type="submit" className="btn btn-primary px-8 py-4 text-[17px]">
                {t('nav.join')}
              </button>
              <a
                href={configUrl.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-discord px-[26px] py-4 text-[17px]"
              >
                <DiscordIcon size={24} />
                {t('home.joinDiscord')}
              </a>
            </div>
          </form>
        </div>

        <div data-reveal className="mt-[72px]">
          <p className="m-0 mb-5 text-[13px] font-bold uppercase tracking-[0.14em] text-ink-faint">
            {t('home.trustedBy')}
          </p>
          <div className="[&_img]:brightness-0 [&_img]:invert">
            <SponsorMarquee />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div data-reveal className="mb-11 flex items-baseline gap-4">
      <img src={brandMarkRed} alt="" className="block h-5 w-auto self-center" />
      <span className="text-[13px] font-bold tracking-[0.16em] text-primary">{number}</span>
      <h2 className="m-0 font-display text-[30px] font-bold md:text-[40px]">{title}</h2>
    </div>
  );
}

function Community() {
  const { t } = useLanguage();

  return (
    <section id="comunidade" className="section-anchor border-t border-line bg-surface-alt">
      <div className="mx-auto max-w-shell px-7 py-[88px]">
        <SectionHeading number="01" title={t('nav.community')} />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-12 border border-line bg-surface px-10 py-11">
          <div data-reveal className="flex flex-col gap-5">
            <h3 className="m-0 font-display text-[28px] font-bold">{t('community.title')}</h3>
            <p className="m-0 text-[17px] leading-[1.75] text-ink-soft">{t('community.body')}</p>
            <div className="flex flex-wrap gap-3.5">
              <a
                href={configUrl.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-discord px-[26px]"
              >
                <DiscordIcon size={22} />
                {t('community.joinServer')}
              </a>
              <a href={`mailto:${configUrl.contactEmail}`} className="btn btn-outline px-[26px]">
                {t('community.talkToTeam')}
              </a>
            </div>
          </div>

          <div
            data-reveal
            className="relative flex flex-col gap-[18px] overflow-hidden rounded-2xl bg-dark px-8 py-[34px]"
          >
            <img
              src={brandMarkWhite}
              alt=""
              className="absolute -bottom-[34px] -right-7 block h-40 w-auto opacity-[0.12]"
            />
            <p className="eyebrow relative m-0 text-[#ff5c5c]">{t('community.freeLabel')}</p>
            <h3 className="relative m-0 font-display text-[26px] font-bold text-white">
              {t('community.freeTitle')}
            </h3>
            <p className="relative m-0 text-base leading-[1.7] text-[#c9c9cf]">
              {t('community.freeBody')}
            </p>
            <a
              href="#apoie"
              className="btn btn-primary relative mt-1 self-start px-[26px] hover:border-white hover:bg-white hover:text-ink"
            >
              {t('community.becomeSupporter')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  const { t, language } = useLanguage();
  const { cards, loading } = useEvents();
  const steps = ['01', '02', '03', '04'] as const;

  return (
    <section id="sobre" className="section-anchor border-t border-line bg-surface-alt">
      <div className="mx-auto max-w-shell px-7 py-[88px]">
        <SectionHeading number="02" title={t('about.title')} />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-14">
          <div data-reveal className="flex flex-col gap-[22px]">
            <h3 className="m-0 font-display text-2xl font-bold">{t('about.missionTitle')}</h3>
            <p className="m-0 text-[17px] leading-[1.75] text-ink-soft">{t('about.mission1')}</p>
            <p className="m-0 text-[17px] leading-[1.75] text-ink-soft">{t('about.mission2')}</p>
            <blockquote className="m-0 mt-2 border border-line border-l-4 border-l-primary bg-surface px-6 py-5 font-display text-[17px] italic leading-[1.7] text-ink">
              {t('about.quote')}
            </blockquote>
          </div>

          <div data-reveal className="flex flex-col gap-[22px]">
            <h3 className="m-0 font-display text-2xl font-bold">{t('about.whatIsTitle')}</h3>
            <p className="m-0 text-[17px] leading-[1.75] text-ink-soft">{t('about.whatIsBody')}</p>
            <div className="grid grid-cols-2 gap-0.5 bg-dark-alt">
              {steps.map((step) => (
                <div key={step} className="bg-dark p-5">
                  <p className="m-0 mb-2 text-xs font-bold tracking-[0.14em] text-[#ff5c5c]">
                    {step}
                  </p>
                  <p className="m-0 text-base font-semibold leading-[1.5] text-white">
                    {t(`about.step.${step}` as never)}
                  </p>
                </div>
              ))}
            </div>
            <p className="m-0 text-[15px] leading-[1.7] text-ink-muted">{t('about.ageNote')}</p>
          </div>
        </div>

        <div data-reveal className="mt-20 border-t border-line pt-11">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="m-0 font-display text-[28px] font-bold">{t('about.doneTitle')}</h3>
            <p className="m-0 text-sm text-ink-muted">{t('about.doneSubtitle')}</p>
          </div>

          {loading ? (
            <p className="m-0 border-t border-line py-8 text-base text-ink-muted">
              {t('about.loadingEvents')}
            </p>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
              {cards.map((event) => (
                <article key={event.id} className="border border-line bg-surface">
                  <div className="h-[180px] overflow-hidden bg-[#eaeaea]">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="block h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-3 px-6 pb-[26px] pt-[22px]">
                    <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                      {t('about.pastEvent')}
                    </p>
                    <h4 className="m-0 font-display text-[22px] font-bold">{event.name}</h4>
                    {event.meta[language] && (
                      <p className="m-0 text-sm text-ink-muted">{event.meta[language]}</p>
                    )}
                    <p className="m-0 text-[15px] leading-[1.65] text-ink-soft">
                      {event.description[language]}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Transparency() {
  const { t } = useLanguage();

  return (
    <section id="transparencia" className="section-anchor border-t border-line">
      <div className="mx-auto max-w-shell px-7 py-[88px]">
        <SectionHeading number="03" title={t('nav.transparency')} />

        <p data-reveal className="m-0 mb-12 max-w-[860px] text-xl leading-[1.7] text-ink-soft">
          {t('transparency.intro')}
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] border-l border-t border-line">
          <TransparencyCard title={t('transparency.financesTitle')} body={t('transparency.financesBody')}>
            <a
              href="https://hcb.hackclub.com/hack-sp/transactions"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline"
            >
              {t('transparency.financesLink')}
            </a>
          </TransparencyCard>

          <TransparencyCard
            title={t('transparency.sponsorshipTitle')}
            body={t('transparency.sponsorshipBody')}
          />

          <TransparencyCard title={t('transparency.openTitle')} body={t('transparency.openBody')}>
            <a
              href={configUrl.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline"
            >
              {t('transparency.openLink')}
            </a>
          </TransparencyCard>
        </div>
      </div>
    </section>
  );
}

function TransparencyCard({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      data-reveal
      className="flex flex-col gap-3.5 border-b border-r border-line px-7 py-8"
    >
      <h3 className="m-0 font-display text-[22px] font-bold">{title}</h3>
      <p className="m-0 text-base leading-[1.7] text-ink-soft">{body}</p>
      {children}
    </div>
  );
}

function Support() {
  const { t } = useLanguage();

  return (
    <section id="apoie" className="section-anchor border-t border-line">
      <div className="mx-auto max-w-shell px-7 py-[88px]">
        <SectionHeading number="04" title={t('support.title')} />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-12">
          <div data-reveal className="flex flex-col gap-[22px]">
            <p className="m-0 font-display text-xl leading-[1.7] text-ink">{t('support.lead')}</p>
            <p className="m-0 text-[17px] leading-[1.75] text-ink-soft">{t('support.body1')}</p>
            <p className="m-0 text-[17px] leading-[1.75] text-ink-soft">{t('support.body2')}</p>
          </div>

          <div data-reveal className="flex flex-col gap-5 bg-dark px-9 py-10 text-white">
            <h3 className="m-0 font-display text-[26px] font-bold text-white">
              {t('support.donateTitle')}
            </h3>
            <p className="m-0 text-base leading-[1.7] text-[#c9c9c9]">{t('support.donateBody')}</p>
            <div className="mt-1 flex flex-col gap-3">
              <a
                href={configUrl.donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary px-6 hover:border-white hover:bg-white hover:text-ink"
              >
                {t('support.donateCta')}
              </a>
              <a
                href={`mailto:${configUrl.contactEmail}`}
                className="btn border-white bg-transparent px-6 text-white hover:bg-white hover:text-ink"
              >
                {t('support.sponsorCta')}
              </a>
            </div>
            <p className="m-0 mt-1 text-sm text-[#8f8f8f]">{configUrl.contactEmail}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sponsors() {
  const { t } = useLanguage();

  return (
    <section id="sponsors" className="section-anchor border-t border-line bg-surface-alt">
      <div className="mx-auto max-w-shell px-7 py-[72px]">
        <div data-reveal className="mb-3 flex items-center gap-3">
          <img src={brandMarkRed} alt="" className="block h-5 w-auto" />
          <p className="eyebrow m-0 text-primary">{t('sponsors.eyebrow')}</p>
        </div>
        <h2 data-reveal className="m-0 mb-9 font-display text-[32px] font-bold">
          {t('home.trustedBy')}
        </h2>

        <div data-reveal className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.alt}
              className="flex h-24 items-center justify-center border border-line bg-surface p-4"
            >
              <img
                src={sponsor.src}
                alt={sponsor.alt}
                className="max-h-14 max-w-[160px] object-contain"
              />
            </div>
          ))}
        </div>

        <p data-reveal className="m-0 mt-7 text-[15px] text-ink-muted">
          {t('sponsors.cta')}{' '}
          <a href="#apoie" className="border-b border-primary text-primary-ink">
            {t('sponsors.ctaLink')}
          </a>
        </p>
      </div>
    </section>
  );
}