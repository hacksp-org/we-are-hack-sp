import { useEffect, useState } from 'react';
import { brazilianStates } from '../constants/states';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchCities } from '../lib/ibge';

const INPUT_CLASS =
  'rounded-[10px] border-[1.5px] border-[#d5d5d5] bg-surface px-4 py-3.5 text-base text-ink focus:border-primary focus:outline-none';

interface Props {
  uf: string;
  city: string;
  onChange: (name: 'uf' | 'city', value: string) => void;
}

/**
 * UF e cidade. A cidade depende da UF, então vira um par: escolher o estado
 * carrega os municípios daquele estado e limpa a cidade anterior — deixar
 * "Campinas" selecionada depois de trocar para o Ceará gravaria uma combinação
 * que não existe.
 *
 * Se o IBGE não responder, o campo vira texto livre em vez de travar o cadastro:
 * a API aceita o nome como texto, e perder uma inscrição por causa de um serviço
 * de terceiro fora do ar seria um mau negócio.
 */
export function LocationFields({ uf, city, onChange }: Props) {
  const { t } = useLanguage();
  // Guarda a UF junto do resultado para que tudo mais seja derivado: assim que
  // `uf` muda, `loaded.uf` deixa de bater e a lista some sozinha, sem um efeito
  // que limpe estado — que é onde esse tipo de componente costuma dessincronizar.
  const [loaded, setLoaded] = useState<{
    uf: string;
    cities: string[];
    failed: boolean;
  } | null>(null);

  useEffect(() => {
    if (!uf) return;

    const controller = new AbortController();

    fetchCities(uf, controller.signal)
      .then((cities) => setLoaded({ uf, cities, failed: false }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.warn('Não foi possível carregar os municípios do IBGE', error);
        setLoaded({ uf, cities: [], failed: true });
      });

    return () => controller.abort();
  }, [uf]);

  const ready = loaded?.uf === uf;
  const cities = ready ? loaded.cities : [];
  const failed = ready ? loaded.failed : false;
  const loading = Boolean(uf) && !ready;

  const handleUf = (next: string) => {
    onChange('uf', next);
    if (city) onChange('city', '');
  };

  const cityDisabled = !uf || loading;

  // O par ocupa a linha inteira e se divide internamente. Assim estado e cidade
  // ficam sempre lado a lado, independente de quantas células os campos
  // anteriores tenham ocupado — antes o telefone deslocava os dois e a cidade
  // caía sozinha na linha de baixo.
  return (
    <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-ink-soft">{t('register.field.uf')}</span>
        <select
          required
          value={uf}
          onChange={(event) => handleUf(event.target.value)}
          className={INPUT_CLASS}
        >
          <option value="" disabled>
            {t('register.field.uf.select')}
          </option>
          {brazilianStates.map((state) => (
            <option key={state.uf} value={state.uf}>
              {state.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-ink-soft">{t('register.field.city')}</span>
        {failed ? (
          <input
            required
            value={city}
            onChange={(event) => onChange('city', event.target.value)}
            placeholder={t('register.field.city.placeholder')}
            className={INPUT_CLASS}
          />
        ) : (
          <select
            required
            disabled={cityDisabled}
            value={city}
            onChange={(event) => onChange('city', event.target.value)}
            className={`${INPUT_CLASS} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            <option value="" disabled>
              {loading
                ? t('register.field.city.loading')
                : uf
                  ? t('register.field.city.select')
                  : t('register.field.city.pickUfFirst')}
            </option>
            {cities.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}
      </label>
    </div>
  );
}
