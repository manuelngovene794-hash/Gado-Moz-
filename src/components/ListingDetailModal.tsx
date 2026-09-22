import React, { useState } from 'react';
import { CattleListing } from '../types/cattle';
import { createWhatsAppLink, displayPhoneNumber } from '../utils/whatsapp';
import { trackAdInteraction } from '../utils/monetag';
import { 
  X, 
  MapPin, 
  MessageCircle, 
  ShieldAlert, 
  Calendar, 
  Share2, 
  Phone, 
  Tag, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: CattleListing | null;
  onClose: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!listing) return null;

  const priceFormatted = new Intl.NumberFormat('pt-MZ').format(listing.price);
  const photos = listing.photos && listing.photos.length > 0
    ? listing.photos
    : ['https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80'];

  const handleContactWhatsApp = () => {
    trackAdInteraction();
    const link = createWhatsAppLink(listing);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    const text = `Confira este anúncio de ${listing.animalType} no Gado MZ: ${listing.title} por ${priceFormatted} MT em ${listing.district}, ${listing.province}.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Gado MZ — ${listing.title}`,
          text,
          url: window.location.href,
        });
      } catch (err) {
        // Ignora cancelamento do utilizador
      }
    } else {
      navigator.clipboard?.writeText(`${text} ${window.location.href}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div 
      id="modal-detalhes-anuncio"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior de acção móvel */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center pointer-events-auto shadow-md hover:bg-black/80 transition-colors"
            aria-label="Fechar detalhes"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-md hover:bg-black/80 transition-colors"
              title="Partilhar anúncio"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Galeria de Fotos */}
        <div className="relative aspect-4/3 sm:aspect-16/10 w-full bg-stone-900 shrink-0">
          <img
            src={photos[activePhotoIdx]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />

          {/* Seletor de miniaturas caso tenha mais de 1 foto */}
          {photos.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 px-4">
              {photos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activePhotoIdx === idx ? 'bg-emerald-500 scale-125 w-6' : 'bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Ver foto ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {listing.isSample && (
            <span className="absolute bottom-3 right-3 text-[10px] font-semibold bg-stone-900/80 text-amber-300 px-2 py-0.5 rounded-md border border-amber-300/30">
              Demonstração
            </span>
          )}
        </div>

        {/* Conteúdo rolável */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Alerta de partilha copiada */}
          {copiedLink && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-2 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Link do anúncio copiado para a área de transferência!</span>
            </div>
          )}

          {/* Cabeçalho do Anúncio */}
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                {listing.animalType}
              </span>
              {listing.breed && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
                  Raça: {listing.breed}
                </span>
              )}
              {listing.gender && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {listing.gender}
                </span>
              )}
            </div>

            <h2 className="text-xl font-extrabold text-stone-900 leading-tight">
              {listing.title}
            </h2>

            <div className="flex items-center gap-1.5 mt-2 text-stone-600 text-xs font-medium">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{listing.district}, {listing.province}</span>
            </div>
          </div>

          {/* Bloco de Preço */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-800 font-semibold block">Valor Solicitado</span>
              <div className="text-2xl font-black text-emerald-900">
                {priceFormatted} <span className="text-sm font-bold text-emerald-700">MT</span>
              </div>
            </div>
            <div className="text-right">
              {listing.priceNegotiable ? (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-200/70 px-2.5 py-1 rounded-lg inline-block">
                  Preço Negociável
                </span>
              ) : (
                <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg inline-block">
                  Preço Fixo
                </span>
              )}
            </div>
          </div>

          {/* Ficha Técnica / Especificações */}
          <div>
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
              Especificações do Animal
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <span className="text-stone-400 block text-[11px]">Tipo de Animal</span>
                <span className="font-bold text-stone-800">{listing.animalType}</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <span className="text-stone-400 block text-[11px]">Sexo</span>
                <span className="font-bold text-stone-800">{listing.gender}</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <span className="text-stone-400 block text-[11px]">Idade</span>
                <span className="font-bold text-stone-800">{listing.age || 'Não especificada'}</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <span className="text-stone-400 block text-[11px]">Raça</span>
                <span className="font-bold text-stone-800">{listing.breed || 'Indefinida / Cruzamento'}</span>
              </div>
              {listing.weightApprox && (
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <span className="text-stone-400 block text-[11px]">Peso Aproximado</span>
                  <span className="font-bold text-stone-800">{listing.weightApprox}</span>
                </div>
              )}
              {listing.quantity && listing.quantity > 1 && (
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <span className="text-stone-400 block text-[11px]">Quantidade</span>
                  <span className="font-bold text-stone-800">{listing.quantity} cabeças</span>
                </div>
              )}
            </div>
          </div>

          {/* Saúde / Vacinas se houver */}
          {listing.healthStatus && (
            <div className="bg-amber-50/60 border border-amber-200/70 p-3 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Sanidade & Vacinação:</span>
                <span>{listing.healthStatus}</span>
              </div>
            </div>
          )}

          {/* Descrição detalhada */}
          <div>
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Descrição do Criador
            </h4>
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100 text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {listing.description || 'Nenhuma descrição adicional informada pelo vendedor.'}
            </div>
          </div>

          {/* Dados do Vendedor */}
          <div className="bg-stone-100/80 p-3.5 rounded-2xl border border-stone-200/70">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Contacto do Vendedor
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-900 text-sm">
                  {listing.sellerName || 'Vendedor Cadastrado'}
                </p>
                <p className="text-xs text-stone-600 font-mono flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  {displayPhoneNumber(listing.whatsappNumber)}
                </p>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-1 rounded-md">
                WhatsApp MZ
              </span>
            </div>
          </div>

          {/* Dica de Segurança e Protecção ao Comprador */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-[11px] text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Aviso de Segurança:</span>
              <span>
                Não efetue pagamentos adiantados por M-Pesa ou e-Mola sem antes verificar o animal pessoalmente ou solicitar inspeção veterinária no curral.
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé Fixo com Botão Grande de WhatsApp */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-stone-200 shrink-0 flex items-center gap-2">
          <button
            id="modal-btn-contactar-whatsapp"
            type="button"
            onClick={handleContactWhatsApp}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-md transition-colors touch-manipulation"
          >
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
            <span>Contactar vendedor no WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
