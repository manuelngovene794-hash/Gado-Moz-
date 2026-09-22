import React from 'react';
import { CattleListing } from '../types/cattle';
import { createWhatsAppLink, displayPhoneNumber } from '../utils/whatsapp';
import { trackAdInteraction } from '../utils/monetag';
import { MapPin, MessageCircle, ShieldCheck, Tag, Info } from 'lucide-react';

interface ListingCardProps {
  listing: CattleListing;
  onSelect: (listing: CattleListing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect }) => {
  const priceFormatted = new Intl.NumberFormat('pt-MZ').format(listing.price);
  const primaryPhoto = listing.photos && listing.photos.length > 0 
    ? listing.photos[0] 
    : 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80';

  const handleContactWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackAdInteraction();
    const link = createWhatsAppLink(listing);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Bovinos':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'Caprinos':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'Ovinos':
        return 'bg-sky-100 text-sky-900 border-sky-200';
      default:
        return 'bg-stone-100 text-stone-900 border-stone-200';
    }
  };

  return (
    <article
      id={`anuncio-${listing.id}`}
      onClick={() => onSelect(listing)}
      className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col active:scale-[0.99] touch-manipulation"
    >
      {/* Imagem do animal */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={primaryPhoto}
          alt={listing.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Gradiente sutil para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Badges superiores */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${getBadgeColor(listing.animalType)}`}>
            {listing.animalType}
          </span>
          {listing.breed && (
            <span className="text-[11px] font-medium bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-full shadow-2xs">
              {listing.breed}
            </span>
          )}
        </div>

        {/* Aviso se for demonstrativo */}
        {listing.isSample && (
          <div className="absolute top-2.5 right-2.5">
            <span className="text-[10px] font-semibold bg-stone-900/80 backdrop-blur-xs text-amber-300 px-2 py-0.5 rounded-full border border-amber-300/30 shadow-2xs">
              Exemplo
            </span>
          </div>
        )}

        {/* Preço em destaque sobreposto no rodapé da foto para telemóvel */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
          <div className="bg-emerald-950/85 backdrop-blur-md text-white px-2.5 py-1 rounded-xl border border-emerald-500/30 shadow-md">
            <span className="text-[11px] text-emerald-300 font-medium block leading-none">Preço</span>
            <span className="text-base font-extrabold tracking-tight text-white leading-tight">
              {priceFormatted} <span className="text-xs font-semibold text-emerald-300">MT</span>
            </span>
          </div>

          {listing.priceNegotiable && (
            <span className="text-[10px] font-semibold bg-white/90 text-stone-800 px-2 py-0.5 rounded-md shadow-xs">
              Negociável
            </span>
          )}
        </div>
      </div>

      {/* Detalhes do anúncio */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-1">
            {listing.title}
          </h3>

          {/* Tags de características do animal */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px] text-stone-600">
            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium">
              {listing.gender}
            </span>
            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium">
              {listing.age}
            </span>
            {listing.quantity && listing.quantity > 1 && (
              <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-medium border border-amber-200/60">
                Lote de {listing.quantity} cabeças
              </span>
            )}
          </div>

          {/* Localização */}
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-stone-600 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="line-clamp-1">
              {listing.district}, {listing.province}
            </span>
          </div>

          {/* Descrição curta */}
          {listing.description && (
            <p className="mt-2 text-xs text-stone-500 line-clamp-2 leading-relaxed">
              {listing.description}
            </p>
          )}
        </div>

        {/* Botão de acção directa para WhatsApp */}
        <div className="pt-2 border-t border-stone-100 mt-1">
          <div className="flex items-center justify-between gap-2 mb-2 text-[11px] text-stone-500">
            <span className="line-clamp-1 font-medium text-stone-700">
              {listing.sellerName || 'Criador'}
            </span>
            <span className="text-[10px] text-stone-400">
              {displayPhoneNumber(listing.whatsappNumber)}
            </span>
          </div>

          <button
            id={`btn-whatsapp-${listing.id}`}
            type="button"
            onClick={handleContactWhatsApp}
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors touch-manipulation"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>Contactar vendedor</span>
          </button>
        </div>
      </div>
    </article>
  );
};
