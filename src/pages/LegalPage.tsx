import { useLanguage } from '../contexts/LanguageContext';
import { useReveal } from '../hooks/useReveal';
import type { LegalBlock } from '../constants/legal';
import brandMarkRed from '../assets/brand/brand-mark-red.png';

/**
 * Renders the long-form pages (code of conduct, terms) from their block list.
 * Consecutive `item` blocks are grouped into one list so the source can stay a
 * flat sequence.
 */
export function LegalPage({ blocks }: { blocks: LegalBlock[] }) {
  const { language } = useLanguage();
  useReveal();

  const grouped: (LegalBlock | LegalBlock[])[] = [];
  blocks.forEach((block) => {
    const last = grouped[grouped.length - 1];
    if (block.kind === 'item' && Array.isArray(last)) {
      last.push(block);
      return;
    }
    grouped.push(block.kind === 'item' ? [block] : block);
  });

  return (
    <article className="mx-auto max-w-[820px] px-7 py-16 md:py-24">
      {grouped.map((entry, index) => {
        if (Array.isArray(entry)) {
          return (
            <ul key={index} data-reveal className="my-5 flex list-none flex-col gap-3 p-0">
              {entry.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-3 text-[17px] leading-[1.75] text-ink-soft">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item[language]}
                </li>
              ))}
            </ul>
          );
        }

        const text = entry[language];

        switch (entry.kind) {
          case 'title':
            return (
              <h1
                key={index}
                data-reveal
                className="m-0 mb-7 font-display text-[32px] font-extrabold leading-[1.18] tracking-[-0.02em] md:text-[44px]"
              >
                {text}
              </h1>
            );
          case 'heading':
            return (
              <div key={index} data-reveal className="mb-5 mt-14 flex items-baseline gap-3.5">
                <img src={brandMarkRed} alt="" className="block h-4 w-auto self-center" />
                <h2 className="m-0 font-display text-[26px] font-bold md:text-[30px]">{text}</h2>
              </div>
            );
          case 'subheading':
            return (
              <h3 key={index} data-reveal className="m-0 mb-2 mt-8 font-display text-xl font-bold">
                {text}
              </h3>
            );
          case 'link':
            return (
              <a
                key={index}
                href={entry.href}
                data-reveal
                className="mr-4 inline-block border-b border-primary py-1 text-[15px] font-bold text-primary-ink"
              >
                {text}
              </a>
            );
          default:
            return (
              <p key={index} data-reveal className="my-4 text-[17px] leading-[1.8] text-ink-soft">
                {text}
              </p>
            );
        }
      })}
    </article>
  );
}
