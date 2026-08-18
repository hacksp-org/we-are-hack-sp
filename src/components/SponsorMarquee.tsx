import { sponsors } from '../constants/sponsors';

/**
 * The list is rendered twice inside one track. The animation translates the
 * track by exactly half its width, so the second copy lands where the first
 * started and the loop has no visible seam.
 */
export function SponsorMarquee({ durationSeconds = 38 }: { durationSeconds?: number }) {
  const loop = [...sponsors, ...sponsors];

  return (
    <div className="marquee-mask relative overflow-hidden">
      <div
        className="marquee-track flex w-max items-center gap-16"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {loop.map((sponsor, index) => (
          <img
            key={`${sponsor.alt}-${index}`}
            src={sponsor.src}
            alt={index < sponsors.length ? sponsor.alt : ''}
            aria-hidden={index >= sponsors.length}
            className="h-8 w-auto flex-none object-contain"
          />
        ))}
      </div>
    </div>
  );
}
