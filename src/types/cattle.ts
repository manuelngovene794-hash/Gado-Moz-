export type AnimalType = 'Bovinos' | 'Caprinos' | 'Ovinos' | 'Outros';

export type AnimalGender = 'Macho' | 'Fêmea' | 'Misto/Lote';

export interface CattleListing {
  id: string;
  title: string;
  animalType: AnimalType;
  gender: AnimalGender;
  age: string;
  breed: string;
  province: string;
  district: string;
  price: number;
  priceNegotiable?: boolean;
  description: string;
  photos: string[];
  sellerName: string;
  whatsappNumber: string;
  createdAt: string;
  isSample?: boolean;
  quantity?: number;
  healthStatus?: string;
  weightApprox?: string;
}

export const MOZAMBIQUE_PROVINCES = [
  'Maputo Província',
  'Maputo Cidade',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa',
] as const;

export const POPULAR_BREEDS: Record<AnimalType, string[]> = {
  Bovinos: ['Brahman', 'Bonsmara', 'Landim', 'Nguni', 'Girolando', 'Nelore', 'Simental', 'Mestiço Local'],
  Caprinos: ['Boer', 'Landim Moçambicano', 'Saanen', 'Anglo-Nubiana', 'Kalahari Red', 'Mestiço'],
  Ovinos: ['Dorper', 'Damara', 'Blackhead Persian', 'Landim Ovino', 'Mestiço'],
  Outros: ['Suínos Landrace', 'Suínos Duroc', 'Aves Caipiras', 'Equinos', 'Outro'],
};
