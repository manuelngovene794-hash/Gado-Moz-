import React, { useState } from 'react';
import { 
  MonetagSettings, 
  getMonetagSettings, 
  saveMonetagSettings, 
  initMonetagPopunder 
} from '../utils/monetag';
import { X, DollarSign, Check, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';

interface MonetagConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export const MonetagConfigModal: React.FC<MonetagConfigModalProps> = ({
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [settings, setSettings] = useState<MonetagSettings>(getMonetagSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMonetagSettings(settings);
    if (settings.enabled && settings.popunderZoneId) {
      initMonetagPopunder(settings.popunderZoneId);
    }
    setSavedSuccess(true);
    onUpdated();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      id="modal-configuracao-monetag"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Monetização Monetag</h3>
              <p className="text-xs text-stone-300">Estrutura preparada para Banners e Popunder</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700 flex-1">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Configurações da Monetag salvas com sucesso!</span>
            </div>
          )}

          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-1">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Estrutura de Publicidade Pronta
            </span>
            <p className="text-stone-600 leading-relaxed">
              O Gado MZ foi arquitetado para integrar anúncios da <strong>Monetag</strong> nos formatos de <strong>Banner</strong> (em pontos estratégicos da feira) e <strong>Popunder/OnClick</strong>, sem poluir a experiência móvel nem bloquear a conversa no WhatsApp.
            </p>
          </div>

          {/* Ativar/Desativar */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200">
            <div>
              <span className="font-bold text-stone-900 block text-xs">Exibir Anúncios</span>
              <span className="text-[11px] text-stone-500">Ativa ou oculta os espaços da Monetag</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Banner Zone ID */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
              Banner Zone ID (Monetag)
            </label>
            <input
              type="text"
              placeholder="Ex: 8892144"
              value={settings.bannerZoneId}
              onChange={(e) => setSettings({ ...settings, bannerZoneId: e.target.value.trim() })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-emerald-600"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Identificador da zona de Banner / Native Widget criada no painel da Monetag.
            </p>
          </div>

          {/* Popunder Zone ID */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
              Popunder / OnClick Zone ID (Monetag)
            </label>
            <input
              type="text"
              placeholder="Ex: 8892145"
              value={settings.popunderZoneId}
              onChange={(e) => setSettings({ ...settings, popunderZoneId: e.target.value.trim() })}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs focus:ring-2 focus:ring-emerald-600"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Identificador do formato Popunder para monetização por clique.
            </p>
          </div>

          {/* Modo de Demonstração */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200">
            <div>
              <span className="font-bold text-stone-900 block text-xs">Modo Demonstração / Preview</span>
              <span className="text-[11px] text-stone-500">
                Mostra espaços demonstrativos estilizados enquanto a conta Monetag é configurada
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.testMode}
              onChange={(e) => setSettings({ ...settings, testMode: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded-sm border-stone-300 focus:ring-emerald-500"
            />
          </div>
        </form>

        <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};
