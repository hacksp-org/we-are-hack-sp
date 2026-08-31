import ReactMarkdown from 'react-markdown';

import { useLanguage } from '../contexts/LanguageContext';
import { getLegalDocument, type LegalSlug } from '../lib/legalDocuments';

interface LegalMarkdownPageProps {
  slug: LegalSlug;
}

export function LegalMarkdownPage({ slug }: LegalMarkdownPageProps) {
  const { language } = useLanguage();

  const document = getLegalDocument(slug, language);

  const updated = new Date(`${document.frontmatter.updated}T00:00:00`);

  const formattedDate = updated.toLocaleDateString(
    language === 'pt' ? 'pt-BR' : 'en-US',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  );

  return (
    <>
      <section className="border-b border-line bg-surface-alt">
        <div className="mx-auto max-w-[900px] px-7 pb-[60px] pt-[72px]">
          <p className="eyebrow m-0 mb-5 text-primary">
            {language === 'pt' ? 'DOCUMENTO LEGAL' : 'LEGAL DOCUMENT'}
          </p>

          <h1 className="m-0 mb-5 font-display text-[32px] font-extrabold leading-[1.18] tracking-[-0.02em] md:text-[44px]">
            {document.frontmatter.title}
          </h1>

          <p className="m-0 text-sm text-ink-soft">
            {language === 'pt'
              ? `Última atualização: ${formattedDate}`
              : `Last updated: ${formattedDate}`}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-[900px] px-7 py-16">
        <article
          className="
            max-w-[760px]
            text-[17px]
            leading-[1.75]
            text-ink-soft

            [&_h1]:mb-6
            [&_h1]:font-display
            [&_h1]:text-3xl
            [&_h1]:font-bold
            [&_h1]:leading-tight
            [&_h1]:text-ink

            [&_h2]:mb-4
            [&_h2]:mt-12
            [&_h2]:font-display
            [&_h2]:text-2xl
            [&_h2]:font-bold
            [&_h2]:leading-tight
            [&_h2]:text-ink

            [&_h3]:mb-3
            [&_h3]:mt-8
            [&_h3]:font-display
            [&_h3]:text-xl
            [&_h3]:font-bold
            [&_h3]:text-ink

            [&_p]:mb-5

            [&_ul]:mb-5
            [&_ul]:ml-6
            [&_ul]:list-disc

            [&_ol]:mb-5
            [&_ol]:ml-6
            [&_ol]:list-decimal

            [&_li]:mb-2

            [&_a]:font-semibold
            [&_a]:text-primary
            [&_a]:underline
            [&_a]:underline-offset-2

            [&_strong]:font-bold
            [&_strong]:text-ink

            [&_blockquote]:my-6
            [&_blockquote]:border-l-2
            [&_blockquote]:border-primary
            [&_blockquote]:pl-5
            [&_blockquote]:italic

            [&_hr]:my-10
            [&_hr]:border-line

            [&_table]:my-6
            [&_table]:w-full
            [&_table]:border-collapse

            [&_th]:border
            [&_th]:border-line
            [&_th]:p-3
            [&_th]:text-left
            [&_th]:font-bold
            [&_th]:text-ink

            [&_td]:border
            [&_td]:border-line
            [&_td]:p-3
          "
        >
          <ReactMarkdown
            components={{
              a: ({ href, children, ...props }) => {
                const isExternal = href?.startsWith('http');

                return (
                  <a
                    href={href}
                    {...props}
                    {...(isExternal
                      ? {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        }
                      : {})}
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {document.content}
          </ReactMarkdown>
        </article>
      </main>
    </>
  );
}