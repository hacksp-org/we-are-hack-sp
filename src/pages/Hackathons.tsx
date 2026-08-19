import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useHackathons } from '../hooks/useHackathons';
import type { EventInfo } from '../constants/events';

/**
 * Página dos hackathons: o que ainda vai acontecer e o que já aconteceu.
 *
 * O redesign tinha reduzido os eventos a uma faixa de cartões na home, que não
 * cabia estatística, foto nem link. Aqui eles voltam inteiros — é o histórico
 * que mostra que a coisa acontece de verdade, e é o que alguém procura antes de
 * decidir se inscrever.
 */
export function Hackathons() {
  const { t } = useLanguage();
  const { upcoming, past, loading, failed } = useHackathons();

  return (
    <div className="border-t border-line bg-surface">
      <div className="mx-auto max-w-shell px-7 py-[72px]">
        <header className="mb-14 border-b border-line pb-10">
          <h1 className="m-0 font-display text-[40px] font-bold leading-tight sm:text-[52px]">
            {t('hackathons.title')}
          </h1>
          <p className="m-0 mt-4 max-w-[52ch] text-[17px] leading-[1.75] text-ink-soft">
            {t('hackathons.lead')}
          </p>
        </header>

        {loading && <p className="m-0 text-base text-ink-muted">{t('hackathons.loading')}</p>}

        {failed && (
          <p className="m-0 border border-line bg-surface-alt px-6 py-5 text-base text-ink-soft">
            {t('hackathons.failed')}
          </p>
        )}

        {!loading && !failed && (
          <div className="flex flex-col gap-20">
            <section>
              <SectionTitle>{t('hackathons.upcomingTitle')}</SectionTitle>

              {upcoming.length > 0 ? (
                <div className="flex flex-col gap-8">
                  {upcoming.map((event) => (
                    <EventBlock key={event.id} event={event} highlight />
                  ))}
                </div>
              ) : (
                <div className="border border-line bg-surface-alt px-7 py-9">
                  <h3 className="m-0 font-display text-xl font-bold">
                    {t('hackathons.noneUpcomingTitle')}
                  </h3>
                  <p className="m-0 mt-3 max-w-[54ch] text-[16px] leading-[1.7] text-ink-soft">
                    {t('hackathons.noneUpcomingBody')}
                  </p>
                  <Link
                    to="/join"
                    className="mt-6 inline-block bg-primary px-6 py-3 text-[15px] font-bold text-white"
                  >
                    {t('hackathons.registerCta')}
                  </Link>
                </div>
              )}
            </section>

            {past.length > 0 && (
              <section>
                <SectionTitle>{t('hackathons.pastTitle')}</SectionTitle>
                <div className="flex flex-col gap-14">
                  {past.map((event) => (
                    <EventBlock key={event.id} event={event} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="m-0 mb-8 border-b border-line pb-4 font-display text-[28px] font-bold">
      {children}
    </h2>
  );
}

function EventBlock({ event, highlight = false }: { event: EventInfo; highlight?: boolean }) {
  const { t, language } = useLanguage();
  const copy = event.translations[language] ?? event.translations.pt;
  const cover = event.bannerUrl ?? event.photos[0];

  return (
    <article
      className={`border bg-surface ${highlight ? 'border-primary' : 'border-line'}`}
    >
      {cover && (
        <div className="h-[220px] overflow-hidden bg-[#eaeaea] sm:h-[280px]">
          <img src={cover} alt={event.name} className="block h-full w-full object-cover" />
        </div>
      )}

      <div className="flex flex-col gap-5 px-7 py-8">
        <div>
          <h3 className="m-0 font-display text-[26px] font-bold">{event.name}</h3>
          <p className="m-0 mt-2 text-[15px] text-ink-muted">
            {[copy.date, copy.location].filter(Boolean).join(' · ')}
          </p>
        </div>

        <p className="m-0 max-w-[68ch] text-[16px] leading-[1.75] text-ink-soft">
          {copy.description}
        </p>

        {event.stats && (
          <dl className="m-0 flex flex-wrap gap-x-12 gap-y-4 border-t border-line pt-5">
            <Stat value={event.stats.participants} label={t('hackathons.statParticipants')} />
            <Stat value={event.stats.projects} label={t('hackathons.statProjects')} />
            <Stat value={event.stats.duration} label={t('hackathons.statDuration')} />
          </dl>
        )}

        <div className="flex flex-wrap gap-3">
          {event.registrationUrl && (
            <ExternalLink href={event.registrationUrl} primary>
              {t('hackathons.registerCta')}
            </ExternalLink>
          )}
          {event.websiteUrl && (
            <ExternalLink href={event.websiteUrl}>{t('hackathons.site')}</ExternalLink>
          )}
          {event.videoUrl && (
            <ExternalLink href={event.videoUrl}>{t('hackathons.video')}</ExternalLink>
          )}
          {event.googleMapsUrl && (
            <ExternalLink href={event.googleMapsUrl}>{t('hackathons.map')}</ExternalLink>
          )}
        </div>

        {event.photos.length > 1 && (
          <div className="border-t border-line pt-5">
            <p className="m-0 mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
              {t('hackathons.photosOf')} {event.name}
            </p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
              {event.photos.map((photo, index) => (
                <img
                  key={photo}
                  src={photo}
                  alt={`${event.name} ${index + 1}`}
                  loading="lazy"
                  className="block h-[110px] w-full bg-[#eaeaea] object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="m-0">
        <span className="font-display text-[26px] font-bold text-primary">{value}</span>{' '}
        <span className="text-[14px] text-ink-muted">{label}</span>
      </dd>
    </div>
  );
}

function ExternalLink({
  href,
  primary = false,
  children,
}: {
  href: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`px-5 py-2.5 text-[15px] font-bold ${
        primary ? 'bg-primary text-white' : 'border border-line text-ink hover:border-primary'
      }`}
    >
      {children}
    </a>
  );
}
