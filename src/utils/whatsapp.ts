import { CattleListing } from '../types/cattle';

/**
 * Normaliza um número de telemóvel para o padrão internacional do WhatsApp para Moçambique (+258).
 */
export function formatMozambiqueWhatsApp(phone: string): string {
  // Remove todos os caracteres não numéricos
  let cleaned = phone.replace(/\D/g, '');

  // Se começar com 00258, remove o 00
  if (cleaned.startsWith('00258')) {
    cleaned = cleaned.substring(2);
  }

  // Se já começar com 258 e tiver 12 dígitos (258 + 9 dígitos), está pronto
  if (cleaned.startsWith('258') && cleaned.length === 12) {
    return cleaned;
  }

  // Se tiver 9 dígitos (ex: 841234567, 821234567, 861234567, etc.)
  if (cleaned.length === 9) {
    return `258${cleaned}`;
  }

  // Se tiver 8 dígitos (raro, mas alguns digitam sem prefixo ou erro), acrescenta 258
  if (cleaned.length > 0) {
    return cleaned.startsWith('258') ? cleaned : `258${cleaned}`;
  }

  return cleaned;
}

/**
 * Formata o número para exibição amigável ao utilizador (ex: +258 84 123 4567)
 */
export function displayPhoneNumber(phone: string): string {
  const normalized = formatMozambiqueWhatsApp(phone);
  if (normalized.length === 12 && normalized.startsWith('258')) {
    const ddi = normalized.slice(0, 3);
    const op = normalized.slice(3, 5);
    const p1 = normalized.slice(5, 8);
    const p2 = normalized.slice(8);
    return `+${ddi} ${op} ${p1} ${p2}`;
  }
  return phone;
}

/**
 * Cria a URL de WhatsApp com mensagem personalizada para o vendedor do gado.
 */
export function createWhatsAppLink(listing: CattleListing): string {
  const cleanNumber = formatMozambiqueWhatsApp(listing.whatsappNumber);
  
  const breedInfo = listing.breed ? ` (${listing.breed})` : '';
  const priceFormatted = new Intl.NumberFormat('pt-MZ').format(listing.price);
  
  const text = `Olá! Vi o anúncio no *Gado MZ*:\n` +
    `🐂 *${listing.title}*\n` +
    `📍 Tipo: ${listing.animalType}${breedInfo}\n` +
    `💰 Preço: ${priceFormatted} MT\n` +
    `🗺️ Localização: ${listing.district}, ${listing.province}\n\n` +
    `Gostaria de saber mais informações sobre o animal. Ainda está disponível?`;

  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}
