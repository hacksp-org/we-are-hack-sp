import conductEn from '../content/legal/conduct.en.md?raw';
import conductPt from '../content/legal/conduct.pt.md?raw';

import termsEn from '../content/legal/terms.en.md?raw';
import termsPt from '../content/legal/terms.pt.md?raw';

import safeguardingEn from '../content/legal/safeguarding.en.md?raw';
import safeguardingPt from '../content/legal/safeguarding.pt.md?raw';

export type LegalSlug = 'conduct' | 'terms' | 'safeguarding';
export type LegalLanguage = 'pt' | 'en';

export interface LegalFrontmatter {
  title: string;
  lang: LegalLanguage;
  updated: string;
}

export interface LegalDocument {
  frontmatter: LegalFrontmatter;
  content: string;
}

function parseDocument(raw: string): LegalDocument {
  const match = raw.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);

  if (!match) {
    throw new Error('Invalid legal Markdown: missing frontmatter.');
  }

  const [, frontmatterRaw, content] = match;

  const frontmatter: Record<string, string> = {};

  for (const line of frontmatterRaw.split('\n')) {
    const trimmed = line.trim();

    if (!trimmed || !trimmed.includes(':')) {
      continue;
    }

    const separator = trimmed.indexOf(':');
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();

    frontmatter[key] = value;
  }

  if (
    !frontmatter.title ||
    !frontmatter.lang ||
    !frontmatter.updated
  ) {
    throw new Error('Invalid legal Markdown frontmatter.');
  }

  if (frontmatter.lang !== 'pt' && frontmatter.lang !== 'en') {
    throw new Error(`Unsupported legal document language: ${frontmatter.lang}`);
  }

  return {
    frontmatter: {
      title: frontmatter.title,
      lang: frontmatter.lang,
      updated: frontmatter.updated,
    },
    content: content.trim(),
  };
}

const documents: Record<
  LegalSlug,
  Record<LegalLanguage, LegalDocument>
> = {
  conduct: {
    pt: parseDocument(conductPt),
    en: parseDocument(conductEn),
  },
  terms: {
    pt: parseDocument(termsPt),
    en: parseDocument(termsEn),
  },
  safeguarding: {
    pt: parseDocument(safeguardingPt),
    en: parseDocument(safeguardingEn),
  },
};

export function getLegalDocument(
  slug: LegalSlug,
  language: LegalLanguage,
): LegalDocument {
  return documents[slug][language];
}