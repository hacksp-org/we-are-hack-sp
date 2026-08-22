import { QueryClient } from '@tanstack/react-query';

/**
 * Configuração compartilhada das consultas.
 *
 * Os dois conjuntos que o site busca — os eventos e a lista de municípios do
 * IBGE — mudam raramente e não são sensíveis ao tempo. O padrão do TanStack é
 * revalidar ao focar a janela, o que aqui só geraria requisição sem nada novo
 * do outro lado.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cinco minutos sem considerar obsoleto: é a mesma janela do
      // `max-age` que o raw.githubusercontent devolve no events.json.
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      // Uma repetição cobre a queda de rede momentânea; mais do que isso só
      // atrasa a mensagem de erro para quem está sem conexão.
      retry: 1,
    },
  },
});
