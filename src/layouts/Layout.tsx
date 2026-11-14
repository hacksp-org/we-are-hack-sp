import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

/**
 * Para onde a página rola a cada navegação: topo, ou a seção da âncora.
 *
 * O navegador só faz isso sozinho num carregamento de página inteira. Numa
 * navegação do router — que é o que acontece ao clicar em "Transparência"
 * estando em /termos — a home monta e a página fica no topo, como se o link
 * não tivesse funcionado.
 *
 * A seção pode não existir no primeiro quadro, porque a home ainda está
 * montando; por isso a segunda tentativa no quadro seguinte.
 */
function useScrollOnNavigation() {
  const { hash, pathname } = useLocation();

  /**
   * Sem `#`, toda troca de rota começa no topo.
   *
   * O navegador guarda a posição da rolagem por documento, e numa SPA o
   * documento nunca muda: sair do fim do `/join` para o `/conduct` montava a
   * página nova já rolada no meio, como se ela tivesse aberto quebrada. O
   * O efeito abaixo só cobria o caso com âncora.
   *
   * `instant` de propósito: o `smooth` do caso com âncora faz sentido porque a
   * pessoa continua na mesma página, aqui ela trocou de página e ver a anterior
   * deslizando para fora não informa nada.
   */
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  useEffect(() => {
    if (!hash) return;

    let frame = 0;
    const scroll = (attemptsLeft: number) => {
      const target = document.querySelector(hash);
      if (target) {
        // `scrollIntoView` encostaria o título no topo da janela, atrás do
        // header, que é sticky. Descontar a altura dele deixa a seção começando
        // onde a pessoa consegue ler.
        const header = document.querySelector('header');
        const offset = header ? header.getBoundingClientRect().height : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top, behavior: 'smooth' });
        return;
      }
      if (attemptsLeft > 0) frame = requestAnimationFrame(() => scroll(attemptsLeft - 1));
    };

    scroll(10);
    return () => cancelAnimationFrame(frame);
  }, [hash, pathname]);
}

/**
 * No page padding here: the redesign is built from full-bleed sections that set
 * their own background and rules, so each one owns its horizontal gutter.
 */
export function Layout() {
  useScrollOnNavigation();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
