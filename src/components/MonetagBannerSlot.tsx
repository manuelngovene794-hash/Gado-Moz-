import React, { useEffect, useRef } from 'react';
import { getMonetagSettings } from '../utils/monetag';
import { Megaphone, ExternalLink, Sparkles } from 'lucide-react';

interface MonetagBannerSlotProps {
  slotId: string;
  format?: 'banner-320x50' | 'banner-300x250' | 'native-responsive';
  className?: string;
  onOpenSettings?: () => void;
}

export const MonetagBannerSlot: React.FC<MonetagBannerSlotProps> = ({
  slotId,
  format = 'native-responsive',
  className = '',
  onOpenSettings,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const settings = getMonetagSettings();

  useEffect(() => {
    if (!settings.enabled) return;

    // Se houver uma Zone ID real da Monetag configurada, injetar o script oficial do banner
    if (settings.bannerZoneId && containerRef.current) {
      containerRef.current.innerHTML = '';
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = `https://alwingulla.com/88/tag.min.js?z=${settings.bannerZoneId}`;
      containerRef.current.appendChild(script);
    }
  }, [settings.bannerZoneId, settings.enabled]);

  if (!settings.enabled) {
    return null;
  }

  // Se já tem Zone ID oficial configurada
  if (settings.bannerZoneId && !settings.testMode) {
    return (
      <div
        id={`monetag-slot-${slotId}`}
        ref={containerRef}
        className={`w-full flex items-center justify-center my-3 min-h-[50px] overflow-hidden ${className}`}
      />
    );
  }

  // Estrutura demonstrativa preparada para Monetag
  return (
    <div
      id={`monetag-preview-${slotId}`}
      className={`w-full my-3 px-3 py-2.5 rounded-xl border border-dashed border-emerald-300/80 bg-gradient-to-r from-emerald-50/70 via-stone-50 to-amber-50/50 flex flex-col items-center justify-center text-center transition-all ${className}`}
    >
      <div className="flex items-center justify-between w-full mb-1 px-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700/80 flex items-center gap-1">
          <Megaphone className="w-3 h-3 text-emerald-600" />
          Espaço de Anúncio Monetag
        </span>
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="text-[10px] text-stone-500 hover:text-emerald-700 underline flex items-center gap-0.5"
            title="Configurar Monetag"
          >
            <span>Configurar Zone ID</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        )}
      </div>

      <div className="w-full py-2 px-3 bg-white/80 backdrop-blur-xs rounded-lg border border-emerald-100 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2.5 text-left">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900 leading-tight">
              Feira Agropecuária & Insumos MZ
            </p>
            <p className="text-[11px] text-stone-500 leading-tight">
              Rações, vacinas e transporte de gado em todo o país
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-1 rounded-md shrink-0">
          Patrocinado
        </span>
      </div>
    </div>
  );
};
