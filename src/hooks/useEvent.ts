import { useEffect, useState } from 'react';
import { fetchEvents, findEvent, type EventInfo } from '../constants/events';

interface EventState {
  event: EventInfo | null;
  loading: boolean;
  /** A rede falhou — diferente de o evento não existir no arquivo. */
  failed: boolean;
}

/**
 * Um evento só, pela chave ou pelo `id` do `events.json`.
 *
 * Separa "não carregou" de "não existe" porque as duas telas dizem coisas
 * diferentes: uma pede para tentar de novo, a outra manda para a lista.
 */
export function useEvent(slug: string): EventState {
  // O resultado guarda para qual `slug` ele vale: trocar de evento pela URL
  // volta a "carregando" sem precisar zerar o estado dentro do efeito.
  const [result, setResult] = useState<{ slug: string; event: EventInfo | null; failed: boolean } | null>(null);

  useEffect(() => {
    let active = true;

    fetchEvents()
      .then((map) => {
        if (active) setResult({ slug, event: findEvent(map, slug), failed: false });
      })
      .catch(() => {
        if (active) setResult({ slug, event: null, failed: true });
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (!result || result.slug !== slug) return { event: null, loading: true, failed: false };
  return { event: result.event, loading: false, failed: result.failed };
}
