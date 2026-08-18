import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { configUrl } from '../config/config';
import hackclubFlag from '../assets/hackclub_flag.svg';
import logoHorizontalWhite from '../assets/brand/logo-horizontal-white-red.png';

const SITE_LINKS = [
  { href: '#comunidade', key: 'nav.community' },
  { href: '#sobre', key: 'nav.about' },
  { href: '#transparencia', key: 'nav.transparency' },
  { href: '#sponsors', key: 'nav.sponsors' },
  { href: '#apoie', key: 'nav.support' },
] as const;

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t-4 border-primary bg-dark text-white">
      <div className="mx-auto grid max-w-shell grid-cols-[repeat(auto-fit,minmax(230px,1fr))] items-start gap-12 px-7 pb-10 pt-16">
        <div className="flex flex-col gap-[18px]">
          <img
            src={logoHorizontalWhite}
            alt="Hack SP"
            className="block h-[34px] w-[119px] object-contain"
          />
          <p className="m-0 max-w-[260px] text-sm leading-[1.7] text-[#a8a8ae]">
            {t('footer.tagline')}
          </p>
          <p className="m-0 text-[13px] text-ink-faint">{t('footer.sponsoredBy')}</p>
          <a href="https://hackclub.com" target="_blank" rel="noopener noreferrer" className="self-start">
            <img src={hackclubFlag} alt="Hack Club" className="block h-10 w-auto" />
          </a>
        </div>

        <FooterColumn title={t('footer.site')}>
          {SITE_LINKS.map(({ href, key }) => (
            <FooterLink key={href} href={href}>
              {t(key)}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title={t('footer.resources')}>
          <Link to="/join" className="text-[15px] text-[#e0e0e4] transition-colors hover:text-white">
            {t('nav.join')}
          </Link>
          <Link to="/conduct" className="text-[15px] text-[#e0e0e4] transition-colors hover:text-white">
            {t('footer.conduct')}
          </Link>
          <Link to="/terms" className="text-[15px] text-[#e0e0e4] transition-colors hover:text-white">
            {t('footer.terms')}
          </Link>
          <FooterLink href="https://hcb.hackclub.com/hack-sp/transactions" external>
            {t('footer.hcb')}
          </FooterLink>
        </FooterColumn>

        <FooterColumn title={t('footer.contact')}>
          <FooterLink href={`mailto:${configUrl.contactEmail}`}>{configUrl.contactEmail}</FooterLink>
          <FooterLink href={configUrl.discordUrl} external>
            Discord
          </FooterLink>
          <FooterLink href={configUrl.githubUrl} external>
            GitHub
          </FooterLink>
          <p className="m-0 text-[15px] text-ink-faint">{t('footer.location')}</p>
        </FooterColumn>
      </div>

      <div className="mx-auto flex max-w-shell flex-wrap justify-between gap-3 border-t border-[#3a3a41] px-7 pb-12 pt-6">
        <p className="m-0 text-[13px] text-ink-faint">© 2026 Hack SP</p>
        <p className="m-0 text-[13px] text-ink-faint">{t('footer.madeBy')}</p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="eyebrow m-0 mb-1.5 text-[#ff3b3b]">{title}</p>
      {children}
    </div>
  );
}

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="text-[15px] text-[#e0e0e4] transition-colors hover:text-white"
    >
      {children}
    </a>
  );
}
