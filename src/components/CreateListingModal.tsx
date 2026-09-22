import React, { useState, useRef } from 'react';
import { 
  AnimalType, 
  AnimalGender, 
  CattleListing, 
  MOZAMBIQUE_PROVINCES, 
  POPULAR_BREEDS 
} from '../types/cattle';
import { formatMozambiqueWhatsApp } from '../utils/whatsapp';
import { 
  X, 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Plus, 
  Sparkles,
  Phone,
  Info
} from 'lucide-react';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (newListing: CattleListing) => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados do formulário
  const [title, setTitle] = useState('');
  const [animalType, setAnimalType] = useState<AnimalType>('Bovinos');
  const [gender, setGender] = useState<AnimalGender>('Macho');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [province, setProvince] = useState<string>('Gaza');
  const [district, setDistrict] = useState('');
  const [price, setPrice] = useState<string>('');
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [weightApprox, setWeightApprox] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [description, setDescription] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Lidar com seleção de fotos locais (galeria ou câmera do telemóvel)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  // Fotos de amostra para facilitar caso o criador esteja a testar sem fotos na galeria
  const handleUsePresetPhoto = () => {
    const presets: Record<AnimalType, string> = {
      Bovinos: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
      Caprinos: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80',
      Ovinos: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=800&q=80',
      Outros: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    };
    const sample = presets[animalType];
    if (!photos.includes(sample)) {
      setPhotos((prev) => [...prev, sample]);
    }
  };

  // Submissão do anúncio
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validações básicas
    if (!title.trim()) {
      setErrorMsg('Por favor, informe o título do anúncio (ex: Touro Brahman ou Cabritos Boer).');
      return;
    }

    const parsedPrice = parseFloat(price.replace(/\D/g, ''));
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMsg('Por favor, indique um valor de preço válido em Meticais (MT).');
      return;
    }

    if (!district.trim()) {
      setErrorMsg('Por favor, informe o distrito ou povoação onde o gado se encontra.');
      return;
    }

    // Validação estrita do número de WhatsApp
    const cleanedPhone = whatsappNumber.replace(/\D/g, '');
    if (cleanedPhone.length < 8) {
      setErrorMsg('Por favor, informe o seu número de WhatsApp válido (ex: 84 123 4567 ou 82 998 8776). Os interessados irão contactá-lo diretamente neste número.');
      return;
    }

    const defaultPhoto = animalType === 'Bovinos' 
      ? 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80'
      : animalType === 'Caprinos'
      ? 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=800&q=80';

    const newListing: CattleListing = {
      id: `anuncio-${Date.now()}`,
      title: title.trim(),
      animalType,
      gender,
      age: age.trim() || 'Não especificada',
      breed: breed.trim() || 'Mestiço Local',
      province,
      district: district.trim(),
      price: parsedPrice,
      priceNegotiable,
      quantity: quantity > 0 ? quantity : 1,
      weightApprox: weightApprox.trim() || undefined,
      healthStatus: healthStatus.trim() || undefined,
      description: description.trim() || 'Sem descrição adicional.',
      photos: photos.length > 0 ? photos : [defaultPhoto],
      sellerName: sellerName.trim() || 'Criador',
      whatsappNumber: formatMozambiqueWhatsApp(whatsappNumber),
      createdAt: new Date().toISOString(),
      isSample: false,
    };

    onAddListing(newListing);
    onClose();
  };

  return (
    <div
      id="modal-criar-anuncio"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do formulário */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-emerald-800 text-white shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-300" />
              <span>Publicar Anúncio de Gado</span>
            </h2>
            <p className="text-xs text-emerald-100">
              Feira de Gado de Moçambique — Contacto directo por WhatsApp
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário com scroll vertical ergonómico para mobile */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. FOTOS DO ANIMAL */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              1. Fotos do Animal
            </label>
            <p className="text-xs text-stone-500 mb-2">
              Tire fotos com boa iluminação mostrando a carcaça e conformação do animal.
            </p>

            <div className="flex flex-wrap gap-2 items-center">
              {photos.map((p, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-200 shadow-2xs group">
                  <img src={p} alt="Pré-visualização" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-xs hover:bg-red-700"
                    title="Remover foto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Botão de envio de foto */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100/50 text-emerald-800 flex flex-col items-center justify-center gap-1 transition-colors"
              >
                <Camera className="w-5 h-5 text-emerald-700" />
                <span className="text-[10px] font-bold">Adicionar</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {photos.length === 0 && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">Sem fotos no telemóvel agora?</span>
                <button
                  type="button"
                  onClick={handleUsePresetPhoto}
                  className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Usar foto ilustrativa de {animalType}
                </button>
              </div>
            )}
          </div>

          {/* 2. TIPO DE ANIMAL */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              2. Tipo de Animal *
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Bovinos', 'Caprinos', 'Ovinos', 'Outros'] as AnimalType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAnimalType(type)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
                    animalType === type
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {type === 'Bovinos' && '🐂 '}
                  {type === 'Caprinos' && '🐐 '}
                  {type === 'Ovinos' && '🐑 '}
                  {type === 'Outros' && '🌾 '}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 3. TÍTULO DO ANÚNCIO */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              3. Título do Anúncio *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Touro Brahman Puro, Cabrita Boer de 1 ano, etc."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            />
          </div>

          {/* 4. SEXO & IDADE */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Sexo *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as AnimalGender)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
                <option value="Misto/Lote">Misto / Lote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Idade do Animal
              </label>
              <input
                type="text"
                placeholder="Ex: 2 anos, 18 meses, 3 meses"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
              </input>
            </div>
          </div>

          {/* 5. RAÇA */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Raça do Animal
            </label>
            <input
              type="text"
              placeholder="Ex: Brahman, Bonsmara, Boer, Landim..."
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            {/* Sugestões rápidas de raças em Moçambique */}
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-[10px] text-stone-400 mr-1 self-center">Populares:</span>
              {POPULAR_BREEDS[animalType].slice(0, 5).map((popBreed) => (
                <button
                  key={popBreed}
                  type="button"
                  onClick={() => setBreed(popBreed)}
                  className="text-[10px] bg-stone-100 hover:bg-emerald-100 text-stone-700 px-2 py-0.5 rounded-full border border-stone-200"
                >
                  + {popBreed}
                </button>
              ))}
            </div>
          </div>

          {/* 6. LOCALIZAÇÃO (PROVÍNCIA & DISTRITO EM MOÇAMBIQUE) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Província *
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                {MOZAMBIQUE_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                Distrito / Povoação *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Chókwè, Manhiça, Boane..."
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* 7. PREÇO EM METICAIS (MT) */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Preço em Meticais (MT) *
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="100"
                step="50"
                placeholder="Ex: 45000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-3 pr-14 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <span className="absolute right-3 top-2.5 font-extrabold text-xs text-stone-500">
                MT
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="check-negociavel"
                checked={priceNegotiable}
                onChange={(e) => setPriceNegotiable(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm border-stone-300 focus:ring-emerald-500"
              />
              <label htmlFor="check-negociavel" className="text-xs text-stone-700 cursor-pointer font-medium">
                Preço negociável com o comprador
              </label>
            </div>
          </div>

          {/* 8. DETALHES ADICIONAIS OPCIONAIS (QUANTIDADE, PESO, SANIDADE) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Quantidade (Cabeças)
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Peso Aprox. (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: 450 kg ou 35 kg"
                value={weightApprox}
                onChange={(e) => setWeightApprox(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Vacinas e Sanidade (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Vacinado contra carbúnculo, desparasitado"
              value={healthStatus}
              onChange={(e) => setHealthStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* 9. DESCRIÇÃO */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Descrição Detalhada do Gado
            </label>
            <textarea
              rows={3}
              placeholder="Descreva detalhes como pastagem, temperamento, histórico de criatório, transporte, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* 10. DADOS DO PRÓPRIO VENDEDOR (WHATSAPP OBRIGATÓRIO) */}
          <div className="bg-emerald-50/70 border border-emerald-300/80 p-3.5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                Contacto Directo do Vendedor *
              </h3>
            </div>

            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Insira o seu próprio número de WhatsApp. O botão <strong>"Contactar vendedor"</strong> abrirá a conversa directamente consigo.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Nome do Criador ou Fazenda
              </label>
              <input
                type="text"
                placeholder="Ex: Criador Alberto ou Fazenda Chókwè"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-950 mb-1">
                Número de WhatsApp (Moçambique) *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="Ex: 84 123 4567 ou 82 998 8776"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-emerald-400 text-sm font-bold text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <span className="text-[10px] text-stone-500 mt-1 block">
                Operadoras aceites: Vodacom (84/85), Tmcel (82/83) ou Movitel (86/87). O prefixo +258 será adicionado automaticamente.
              </span>
            </div>
          </div>
        </form>

        {/* Rodapé com botão de publicação */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-stone-200 shrink-0 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Anúncio na Feira</span>
          </button>
        </div>
      </div>
    </div>
  );
};
