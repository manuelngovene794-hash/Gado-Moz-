/**
 * Utilitário de integração para a plataforma de monetização Monetag.
 * Suporta formatos de Banner e Popunder/OnClick.
 */

export interface MonetagSettings {
  enabled: boolean;
  bannerZoneId: string;
  popunderZoneId: string;
  testMode: boolean;
}

const MONETAG_STORAGE_KEY = 'gado_mz_monetag_settings';

export const defaultMonetagSettings: MonetagSettings = {
  enabled: true,
  bannerZoneId: '', // Insira aqui a sua Zone ID da Monetag quando disponível
  popunderZoneId: '', // Insira aqui a sua Zone ID de Popunder
  testMode: true, // Modo de demonstração ativo enquanto não houver Zone ID oficial
};

export function getMonetagSettings(): MonetagSettings {
  try {
    const saved = localStorage.getItem(MONETAG_STORAGE_KEY);
    if (saved) {
      return { ...defaultMonetagSettings, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Erro ao ler configurações da Monetag', e);
  }
  return defaultMonetagSettings;
}

export function saveMonetagSettings(settings: MonetagSettings): void {
  try {
    localStorage.setItem(MONETAG_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Erro ao salvar configurações da Monetag', e);
  }
}

/**
 * Prepara o carregamento do Popunder da Monetag quando uma Zone ID for configurada.
 */
export function initMonetagPopunder(zoneId?: string): void {
  const currentSettings = getMonetagSettings();
  const activeZoneId = zoneId || currentSettings.popunderZoneId;

  if (!currentSettings.enabled || !activeZoneId) {
    return;
  }

  // Evita duplicar script caso já exista na página
  const existingScript = document.getElementById('monetag-popunder-script');
  if (existingScript) return;

  try {
    const script = document.createElement('script');
    script.id = 'monetag-popunder-script';
    script.src = `https://alwingulla.com/88/tag.min.js?z=${activeZoneId}`;
    script.setAttribute('data-cfasync', 'false');
    script.async = true;
    document.head.appendChild(script);
    console.log(`[Monetag] Script Popunder inicializado para Zone ${activeZoneId}`);
  } catch (error) {
    console.warn('[Monetag] Erro ao injetar script de Popunder', error);
  }
}

/**
 * Gatilho para disparar evento de publicidade (ex: ao tocar num anúncio de gado)
 */
export function trackAdInteraction(): void {
  const settings = getMonetagSettings();
  if (settings.enabled && !settings.testMode && settings.popunderZoneId) {
    // Caso a Monetag disponibilize a chamada global de onclick
    if (typeof (window as unknown as { _mgx?: () => void })._mgx === 'function') {
      try {
        (window as unknown as { _mgx: () => void })._mgx();
      } catch (e) {
        console.debug('[Monetag] Interação registrada', e);
      }
    }
  }
}
