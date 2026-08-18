import { sponsors } from '../constants/sponsors';

export function SponsorMarquee() {
  const groups = [0, 1, 2, 3];

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden py-4">
      <div className="flex w-max animate-sponsor-marquee items-center">
        {groups.map((group) => (
          <div
            key={group}
            aria-hidden={group !== 0}
            className="flex shrink-0 items-center"
          >
            {sponsors.map((sponsor) => {
              const monochrome = sponsor.monochrome !== false;

              return (
                <div
                  key={`${group}-${sponsor.alt}`}
                  className="flex h-20 w-[220px] shrink-0 items-center justify-center px-7"
                >
                  <img
                    src={sponsor.src}
                    alt={group === 0 ? sponsor.alt : ''}
                    draggable={false}
                    className="max-h-10 max-w-[150px] select-none object-contain opacity-55"
                    style={{
                      filter: sponsor.monochrome === false
                        ? 'none'
                        : 'brightness(0) invert(1)',
                    }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}