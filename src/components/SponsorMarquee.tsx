import { sponsors } from '../constants/sponsors';

/**
 * The list is rendered twice and the track slides by exactly -50%, so the
 * second copy lands where the first began and the loop has no seam.
 *
 * The spacing is `padding-right` on each item rather than a flex `gap`: a gap
 * sits *between* items, so 2N items have 2N-1 gaps and half the track width is
 * no longer exactly one copy — the loop drifts a little further out of step on
 * every pass. Padding travels with the item, which keeps both halves identical.
 */
export function SponsorMarquee({ durationSeconds = 38 }: { durationSeconds?: number }) {
  return (
    <div className="marquee-mask relative overflow-hidden">
      <div
        className="marquee-track flex w-max items-center"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {[0, 1].map((copy) =>
          sponsors.map((sponsor) => (
            <img
              key={`${copy}-${sponsor.alt}`}
              src={sponsor.src}
              alt={copy === 0 ? sponsor.alt : ''}
              aria-hidden={copy === 1}
              className="block h-8 w-auto flex-none pr-16 opacity-70 grayscale"
            />
          )),
        )}
      </div>
    </div>
  );
}
