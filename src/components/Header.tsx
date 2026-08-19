import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { configUrl } from '../config/config';
import { GitHubIcon } from './icons';
import logoHorizontal from '../assets/brand/logo-horizontal-black-red.png';

const NAV = [
  { href: '#comunidade', key: 'nav.community' },
  { href: '#sobre', key: 'nav.about' },
  { href: '#transparencia', key: 'nav.transparency' },
  { href: '#apoie', key: 'nav.support' },
] as const;

export function Header() {
  const { language, toggleLanguage, t } = useLanguage();
  const { pathname } = useLocation();

  const isJoin = pathname === '/join';
  // As âncoras apontam para seções da home; fora dela, clicar não leva a lugar
  // nenhum. Só o link de hackathons é rota e vale em qualquer página.
  const isHome = pathname === '/';

  return (
    <>
      <div className="h-1 bg-primary" />
      <header className="sticky top-0 z-50 h-[73px] border-b border-line bg-surface">
        <div className="mx-auto flex h-full max-w-shell items-center justify-between gap-6 px-7">
          {pathname === '/' ? (
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex shrink-0 items-center gap-3 border-0 bg-transparent p-0"
              aria-label="Voltar ao topo"
            >
              <img
                src={logoHorizontal}
                alt="Hack SP"
                className="block h-[38px] w-[133px] object-contain"
              />
            </button>
          ) : (
            <Link to="/" className="flex shrink-0 items-center gap-3">
              <img
                src={logoHorizontal}
                alt="Hack SP"
                className="block h-[38px] w-[133px] object-contain"
              />
            </Link>
          )}

          <nav className="flex items-center gap-4 lg:gap-6">
            {!isJoin && (
              <div className="hidden items-center gap-6 lg:flex">
                {isHome &&
                  NAV.map(({ href, key }) => (
                    <a
                      key={href}
                      href={href}
                      className="border-b-2 border-transparent py-1.5 text-[15px] font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
                    >
                      {t(key)}
                    </a>
                  ))}
                <Link
                  to="/hackathons"
                  className={`border-b-2 py-1.5 text-[15px] font-semibold transition-colors hover:border-primary hover:text-primary ${
                    pathname === '/hackathons'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-ink'
                  }`}
                >
                  {t('nav.hackathons')}
                </Link>
                <span className="h-[22px] w-px bg-line" />
              </div>
            )}

            {isJoin && (
              <Link
                to="/"
                className="hidden border-b-2 border-transparent py-1.5 text-[15px] font-semibold text-ink transition-colors hover:border-primary hover:text-primary sm:block"
              >
                ← {t('register.back')}
              </Link>
            )}

            <a
              href={configUrl.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center text-ink transition-colors hover:text-primary"
            >
              <GitHubIcon size={22} />
            </a>

            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-lg border-[1.5px] border-ink bg-surface px-3 py-[7px] text-[13px] font-bold tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-surface"
            >
              {language === 'pt' ? 'EN' : 'PT'}
            </button>

            {!isJoin && (
              <Link
                to="/join"
                className="rounded-[10px] border-[1.5px] border-primary bg-primary px-5 py-2.5 text-[15px] font-bold text-white transition-colors hover:border-ink hover:bg-ink"
              >
                {t('nav.join')}
              </Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}