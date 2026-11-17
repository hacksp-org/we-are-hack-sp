import { useEffect, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useEvent } from '../hooks/useEvent';
import { configUrl } from '../config/config';
import { DiscordIcon } from '../components/icons';
import type { EventInfo } from '../constants/events';

/**
 * A página de um evento.
 *
 * O /foton era um redirect direto para a inscrição no account: quem chegava
 * pelo link da divulgação caía numa tela de login sem saber data, local ou do
 * que se tratava. Aqui o evento se apresenta primeiro, e a inscrição é o botão.
 *
 * Tudo sai do `events.json`. As seções de conteúdo (programação, para quem é,
 * perguntas) só aparecem quando o arquivo as preenche, então a página nunca
 * mostra um título com nada embaixo.
 *
 * `slug` vem por prop nas rotas curtas (`/foton`) e pela URL em
 * `/hackathons/:slug`.
 */
export function EventPage({ slug: fixedSlug }: { slug?: string }) {
  const params = useParams();
  const slug = fixedSlug ?? params.slug ?? '';
  const { t, language } = useLanguage();
  const { event, loading, failed } = useEvent(slug);

  useEffect(() => {
    if (!event) return;
    const previous = document.title;
    document.title = `${event.name} — Hack SP`;
    return () => {
      document.title = previous;
    };
  }, [event]);

  if (loading) return <Notice>{t('event.loading')}</Notice>;
  if (failed) return <Notice>{t('hackathons.failed')}</Notice>;
  if (!event) {
    return (
      <Notice>
        <h1 className="m-0 font-display text-[32px] font-bold text-ink">{t('event.notFoundTitle')}</h1>
        <p className="m-0 mt-3">{t('event.notFoundBody')}</p>
        <Link to="/hackathons" className="btn btn-primary mt-6">
          {t('event.backToList')}
        </Link>
      </Notice>
    );
  }

  const copy = event.translations[language] ?? event.translations.pt;
  const details = copy.details ?? {};
  const upcoming = event.status === 'upcoming';
  const canRegister = upcoming && Boolean(event.registrationUrl);

  return (
    <>
      <EventHero event={event} />

      <div className="border-t border-line bg-surface">
        <div className="mx-auto max-w-shell px-7 py-[72px]">
          <Facts event={event} />

          <div className="mt-16 flex flex-col gap-16">
            {details.about && details.about.length > 0 && (
              <Section title={t('event.aboutTitle')}>
                <div className="flex max-w-[68ch] flex-col gap-4">
                  {details.about.map((paragraph) => (
                    <p key={paragraph} className="m-0 text-[17px] leading-[1.75] text-ink-soft">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Section>
            )}

            {details.schedule && details.schedule.length > 0 && (
              <Section title={t('event.scheduleTitle')}>
                <ol className="m-0 list-none border-l-2 border-primary p-0">
                  {details.schedule.map((item) => (
                    <li key={`${item.time}-${item.title}`} className="relative py-3 pl-7">
                      <span className="absolute -left-[7px] top-[22px] block h-3 w-3 rounded-full bg-primary" />
                      <p className="m-0 text-[14px] font-bold uppercase tracking-[0.12em] text-primary">
                        {item.time}
                      </p>
                      <p className="m-0 mt-1 font-display text-[19px] font-bold">{item.title}</p>
                      {item.description && (
                        <p className="m-0 mt-1 max-w-[60ch] text-[15px] leading-[1.7] text-ink-soft">
                          {item.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {canRegister && (
              <Section title={t('event.howTitle')}>
                <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
                  {(['1', '2', '3'] as const).map((step) => (
                    <li key={step} className="border border-line bg-surface-alt px-6 py-6">
                      <span className="font-display text-[32px] font-extrabold text-primary">{step}</span>
                      <p className="m-0 mt-2 font-display text-[18px] font-bold">
                        {t(`event.how${step}Title`)}
                      </p>
                      <p className="m-0 mt-2 text-[15px] leading-[1.7] text-ink-soft">
                        {t(`event.how${step}Body`)}
                      </p>
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            {(copy.locationDescription || event.googleMapsUrl || event.locationPhotos?.length) && (
              <Section title={t('event.location.title')}>
                <p className="m-0 font-display text-[20px] font-bold">{copy.location}</p>
                {copy.locationDescription && (
                  <p className="m-0 mt-2 max-w-[68ch] text-[16px] leading-[1.75] text-ink-soft">
                    {copy.locationDescription}
                  </p>
                )}
                {event.googleMapsUrl && (
                  <a
                    href={event.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline mt-5"
                  >
                    {t('hackathons.map')}
                  </a>
                )}
                {event.locationPhotos && event.locationPhotos.length > 0 && (
                  <Gallery photos={event.locationPhotos} name={event.name} />
                )}
              </Section>
            )}

            {event.stats && (
              <Section title={t('event.numbersTitle')}>
                <dl className="m-0 flex flex-wrap gap-x-14 gap-y-6">
                  <Stat value={event.stats.participants} label={t('hackathons.statParticipants')} />
                  <Stat value={event.stats.projects} label={t('hackathons.statProjects')} />
                  <Stat value={event.stats.duration} label={t('hackathons.statDuration')} />
                </dl>
              </Section>
            )}

            {event.photos.length > 0 && (
              <Section title={`${t('hackathons.photosOf')} ${event.name}`}>
                <Gallery photos={event.photos} name={event.name} />
              </Section>
            )}

            {details.faq && details.faq.length > 0 && (
              <Section title={t('event.faqTitle')}>
                <div className="flex flex-col border-t border-line">
                  {details.faq.map((item) => (
                    <details key={item.question} className="group border-b border-line py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[18px] font-bold">
                        {item.question}
                        <span className="text-primary transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="m-0 mt-3 max-w-[68ch] text-[16px] leading-[1.75] text-ink-soft">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>

      <ClosingBand canRegister={canRegister} registrationUrl={event.registrationUrl} />
    </>
  );
}

function EventHero({ event }: { event: EventInfo }) {
  const { t, language } = useLanguage();
  const copy = event.translations[language] ?? event.translations.pt;
  const cover = event.bannerUrl ?? event.photos[0];
  const upcoming = event.status === 'upcoming';

  return (
    <section className="bg-dark">
      {cover && (
        // Mesma regra do destaque da home: proporção, nunca altura fixa. No
        // desktop o banner (2410x612) aparece inteiro; no celular a caixa
        // engorda para 5:2 e o `object-cover` mostra o miolo da arte.
        <div className="mx-auto max-w-shell px-7 pt-10">
          <div className="aspect-[5/2] overflow-hidden border border-white/[0.12] bg-dark-alt md:aspect-[2410/612]">
            <img src={cover} alt={event.name} className="block h-full w-full object-cover" />
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-shell flex-col items-start gap-4 px-7 pb-16 pt-10">
        <Link
          to="/hackathons"
          className="text-[14px] font-semibold text-[#c9c9cf] hover:text-white"
        >
          ← {t('nav.hackathons')}
        </Link>

        <p className="eyebrow m-0 text-[#ff5c5c]">
          {upcoming ? t('home.nextEventEyebrow') : t('event.pastEyebrow')}
        </p>

        <h1 className="m-0 font-display text-[34px] font-extrabold leading-[1.12] tracking-[-0.01em] text-white md:text-[52px]">
          {event.name}
        </h1>

        <p className="m-0 max-w-[62ch] text-[18px] leading-[1.7] text-[#dcdcdc]">{copy.description}</p>

        <div className="mt-3 flex flex-wrap gap-3">
          {upcoming && event.registrationUrl && (
            <a href={event.registrationUrl} className="btn btn-primary px-7 py-3.5">
              {t('event.registerCta')}
            </a>
          )}
          {event.websiteUrl && (
            <ExternalButton href={event.websiteUrl}>{t('hackathons.site')}</ExternalButton>
          )}
          {event.videoUrl && (
            <ExternalButton href={event.videoUrl}>{t('hackathons.video')}</ExternalButton>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Data, local, público e custo, lado a lado — as quatro coisas que alguém
 * procura antes de decidir. "Gratuito" é fixo porque todo evento do Hack SP é;
 * o público cai no padrão da organização quando o evento não diz outro.
 */
function Facts({ event }: { event: EventInfo }) {
  const { t, language } = useLanguage();
  const copy = event.translations[language] ?? event.translations.pt;

  const facts = [
    { label: t('event.factDate'), value: copy.date },
    { label: t('event.factLocation'), value: copy.location },
    { label: t('event.factAudience'), value: copy.details?.audience ?? t('event.audienceDefault') },
    { label: t('event.factCost'), value: t('event.costFree') },
  ];

  return (
    <dl className="m-0 grid grid-cols-1 border border-line sm:grid-cols-2 lg:grid-cols-4">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="border-b border-line px-6 py-6 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
        >
          <dt className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink-faint">{fact.label}</dt>
          <dd className="m-0 mt-2 font-display text-[19px] font-bold leading-snug">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ClosingBand({ canRegister, registrationUrl }: { canRegister: boolean; registrationUrl?: string }) {
  const { t } = useLanguage();

  return (
    <section className="border-t border-white/[0.12] bg-dark-alt">
      <div className="mx-auto flex max-w-shell flex-col items-start gap-5 px-7 py-16 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="m-0 font-display text-[26px] font-bold text-white md:text-[32px]">
            {canRegister ? t('event.closingTitle') : t('event.questionsTitle')}
          </h2>
          <p className="m-0 mt-2 max-w-[56ch] text-[16px] leading-[1.7] text-[#c9c9cf]">
            {t('event.questionsBody')}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {canRegister && registrationUrl && (
            <a href={registrationUrl} className="btn btn-primary px-7 py-3.5">
              {t('event.registerCta')}
            </a>
          )}
          <a
            href={configUrl.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-discord px-6 py-3.5"
          >
            <DiscordIcon size={22} />
            {t('home.joinDiscord')}
          </a>
        </div>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="m-0 mb-7 border-b border-line pb-4 font-display text-[28px] font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Gallery({ photos, name }: { photos: string[]; name: string }) {
  return (
    <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
      {photos.map((photo, index) => (
        <img
          key={photo}
          src={photo}
          alt={`${name} ${index + 1}`}
          loading="lazy"
          className="block h-[140px] w-full bg-[#eaeaea] object-cover"
        />
      ))}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="m-0">
        <span className="font-display text-[36px] font-bold text-primary">{value}</span>{' '}
        <span className="text-[15px] text-ink-muted">{label}</span>
      </dd>
    </div>
  );
}

function ExternalButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn border-white/[0.28] px-7 py-3.5 text-white hover:border-white"
    >
      {children}
    </a>
  );
}

function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-line bg-surface">
      <div className="mx-auto max-w-shell px-7 py-[96px] text-base text-ink-soft">{children}</div>
    </div>
  );
}
