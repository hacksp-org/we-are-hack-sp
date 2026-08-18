import { useLanguage } from '../contexts/LanguageContext';
import { useReveal } from '../hooks/useReveal';
import type { LegalBlock, LegalDocument } from '../constants/legal';
import brandMarkRed from '../assets/brand/brand-mark-red.png';

/**
 * Opening band, then a 250px sticky index beside the text. The index is the
 * only way to move around a document this long, so it stays on screen.
 */
export function LegalPage({ document }: { document: LegalDocument }) {
  const { language } = useLanguage();
  useReveal();

  return (
    <>
      <section className="border-b border-line bg-surface-alt">
        <div className="mx-auto max-w-[900px] px-7 pb-[60px] pt-[72px]">
          <div className="mb-5 flex items-center gap-3">
            <img src={brandMarkRed} alt="" className="block h-[22px] w-auto" />
            <p className="eyebrow m-0 text-primary">{document.eyebrow[language]}</p>
          </div>
          <h1 className="m-0 mb-[22px] font-display text-[32px] font-extrabold leading-[1.18] tracking-[-0.02em] md:text-[44px]">
            {document.title[language]}
          </h1>
          <p className="m-0 text-[19px] leading-[1.7] text-ink-soft">{document.lead[language]}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-shell items-start gap-14 px-7 pb-20 pt-16 lg:grid-cols-[250px_minmax(0,1fr)]">
        <nav className="top-[110px] hidden flex-col gap-2.5 border-l-2 border-line pl-[18px] lg:sticky lg:flex">
          {document.nav.map((group, index) => (
            <div key={index} className="flex flex-col gap-2.5">
              {group.label && (
                <p
                  className={`m-0 text-xs font-bold uppercase tracking-[0.14em] text-primary ${
                    index > 0 ? 'mt-4' : ''
                  }`}
                >
                  {group.label[language]}
                </p>
              )}
              {group.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-ink-soft transition-colors hover:text-primary"
                >
                  {link[language]}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <article className="flex max-w-[760px] flex-col gap-[52px]">
          {document.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              data-reveal
              className="flex scroll-mt-[110px] flex-col gap-4"
            >
              {groupBlocks(section.blocks).map((entry, index) =>
                Array.isArray(entry) ? (
                  <ul key={index} className="m-0 flex list-none flex-col gap-3 p-0">
                    {entry.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-3 text-[17px] leading-[1.75] text-ink-soft"
                      >
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {item[language]}
                      </li>
                    ))}
                  </ul>
                ) : entry.kind === 'h2' ? (
                  <h2 key={index} className="m-0 font-display text-[28px] font-bold">
                    {entry[language]}
                  </h2>
                ) : entry.kind === 'h3' ? (
                  <h3 key={index} className="m-0 mt-2 font-display text-lg font-bold">
                    {entry[language]}
                  </h3>
                ) : (
                  <p key={index} className="m-0 text-[17px] leading-[1.75] text-ink-soft">
                    {entry[language]}
                  </p>
                ),
              )}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}

/** Consecutive `li` blocks become one list; everything else stays as it is. */
function groupBlocks(blocks: LegalBlock[]): (LegalBlock | LegalBlock[])[] {
  const grouped: (LegalBlock | LegalBlock[])[] = [];

  blocks.forEach((block) => {
    const last = grouped[grouped.length - 1];
    if (block.kind === 'li' && Array.isArray(last)) {
      last.push(block);
      return;
    }
    grouped.push(block.kind === 'li' ? [block] : block);
  });

  return grouped;
}
