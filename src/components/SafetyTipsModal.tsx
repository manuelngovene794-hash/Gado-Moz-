import React from 'react';
import { X, ShieldCheck, AlertTriangle, Truck, FileText, CheckCircle2 } from 'lucide-react';

interface SafetyTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyTipsModal: React.FC<SafetyTipsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-dicas-seguranca"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Guia de Negociação Segura</h3>
              <p className="text-xs text-emerald-200">Dicas para compra e venda de gado em Moçambique</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700 flex-1">
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950 mb-1">Nunca faça pagamentos antecipados</h4>
              <p className="text-amber-800 leading-relaxed text-xs">
                Desconfie de pedidos de adiantamento por M-Pesa, e-Mola ou transferência bancária para "reservar" o animal ou cobrir alegado frete antes de ver o animal ao vivo no curral.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-stone-900 mb-0.5">Visite o criador ou envie alguém de confiança</h5>
                <p className="text-stone-600 text-xs">
                  Avalie a conformação física, dentes (para confirmar idade), cascos e respiração do animal antes de fechar o negócio.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <FileText className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-stone-900 mb-0.5">Guia de Trânsito Pecuário (SDAE)</h5>
                <p className="text-stone-600 text-xs">
                  Para movimentar gado entre distritos ou províncias em Moçambique, exija sempre a emissão da Guia de Trânsito junto aos Serviços Distritais de Actividades Económicas (SDAE) e declaração de proveniência para evitar problemas nos postos de controlo policial.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-stone-900 mb-0.5">Transporte e Bem-Estar Animal</h5>
                <p className="text-stone-600 text-xs">
                  Combine previamente com o vendedor quem assume os custos de carga, frete em camião apropriado e descarregamento no destino.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
            <p className="text-emerald-950 font-medium text-xs">
              O <strong>Gado MZ</strong> é uma feira comunitária de aproximação entre criadores e compradores. Todo contacto e negociação é feito directamente via WhatsApp com o vendedor.
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-stone-50 border-t border-stone-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs"
          >
            Entendido, voltar à feira
          </button>
        </div>
      </div>
    </div>
  );
};
