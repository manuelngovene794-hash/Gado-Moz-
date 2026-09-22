import React, { useState, useEffect, useMemo } from 'react';
import { 
  AnimalType, 
  CattleListing, 
  MOZAMBIQUE_PROVINCES 
} from './types/cattle';
import { SAMPLE_LISTINGS } from './data/initialListings';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { CreateListingModal } from './components/CreateListingModal';
import { SafetyTipsModal } from './components/SafetyTipsModal';
import { MonetagBannerSlot } from './components/MonetagBannerSlot';
import { MonetagConfigModal } from './components/MonetagConfigModal';
import { initMonetagPopunder } from './utils/monetag';
import { 
  Search, 
  Plus, 
  Filter, 
  ShieldCheck, 
  Compass, 
  Bookmark, 
  Sparkles, 
  Settings, 
  MapPin, 
  ArrowUpDown, 
  X, 
  RefreshCw,
  Info,
  SlidersHorizontal
} from 'lucide-react';

const STORAGE_KEY = 'gado_mz_listings_v1';

export default function App() {
  // Lista de anúncios
  const [listings, setListings] = useState<CattleListing[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Erro ao ler anúncios do localStorage', e);
    }
    return SAMPLE_LISTINGS;
  });

  // Filtros e Pesquisa
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [selectedProvince, setSelectedProvince] = useState<string>('Todas');
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc'>('recent');
  const [showOnlyUserCreated, setShowOnlyUserCreated] = useState(false);
  const [activeTab, setActiveTab] = useState<'feira' | 'meus-anuncios' | 'seguranca'>('feira');

  // Modais
  const [selectedListing, setSelectedListing] = useState<CattleListing | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isMonetagOpen, setIsMonetagOpen] = useState(false);
  const [monetagKey, setMonetagKey] = useState(0);

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    } catch (e) {
      console.error('Erro ao salvar anúncios', e);
    }
  }, [listings]);

  // Inicializar Monetag Popunder caso configurado
  useEffect(() => {
    initMonetagPopunder();
  }, [monetagKey]);

  // Adicionar novo anúncio
  const handleAddListing = (newListing: CattleListing) => {
    setListings((prev) => [newListing, ...prev]);
    // Abre os detalhes do anúncio recém-criado para visualização
    setSelectedListing(newListing);
  };

  // Remover anúncio (para a aba Meus Anúncios)
  const handleDeleteListing = (id: string) => {
    if (window.confirm('Tem certeza de que deseja remover este anúncio da feira?')) {
      setListings((prev) => prev.filter((item) => item.id !== id));
      if (selectedListing?.id === id) {
        setSelectedListing(null);
      }
    }
  };

  // Restaurar exemplos de teste
  const handleResetSampleData = () => {
    setListings(SAMPLE_LISTINGS);
  };

  // Meus anúncios (criados pelo usuário)
  const userListings = useMemo(() => {
    return listings.filter((l) => !l.isSample);
  }, [listings]);

  // Filtragem e ordenação inteligente
  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (activeTab === 'meus-anuncios') {
      result = result.filter((l) => !l.isSample);
    } else if (showOnlyUserCreated) {
      result = result.filter((l) => !l.isSample);
    }

    // Filtro por tipo de animal
    if (selectedType !== 'Todos') {
      result = result.filter((l) => l.animalType === selectedType);
    }

    // Filtro por Província
    if (selectedProvince !== 'Todas') {
      result = result.filter((l) => l.province === selectedProvince);
    }

    // Pesquisa por texto
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.breed?.toLowerCase().includes(q) ||
          l.district.toLowerCase().includes(q) ||
          l.province.toLowerCase().includes(q) ||
          l.animalType.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q)
      );
    }

    // Ordenação
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Recent
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [listings, activeTab, showOnlyUserCreated, selectedType, selectedProvince, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#f3f6f3] text-[#1c2e24] flex flex-col font-sans pb-24 sm:pb-8">
      {/* 1. CABEÇALHO PRINCIPAL MOBILE */}
      <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Ícone de boi/gado estilizado */}
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 border border-emerald-600/60 flex items-center justify-center text-white shadow-inner shrink-0">
              <span className="text-xl leading-none">🐂</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black tracking-tight leading-none text-white">
                  Gado MZ
                </h1>
                <span className="text-[10px] font-bold bg-emerald-800 text-emerald-200 px-1.5 py-0.5 rounded-sm border border-emerald-700">
                  MZ 🇲🇿
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 font-medium tracking-wide">
                Feira de Gado de Moçambique
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Botão de Dicas de Segurança */}
            <button
              onClick={() => setIsSafetyOpen(true)}
              className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-semibold flex items-center gap-1.5 border border-emerald-700/60 transition-colors"
              title="Dicas de Segurança e Sanidade"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Dicas</span>
            </button>

            {/* Botão de Configuração de Monetização Monetag */}
            <button
              onClick={() => setIsMonetagOpen(true)}
              className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs border border-emerald-700/60 transition-colors"
              title="Configurar Monetag (Publicidade)"
            >
              <Settings className="w-4 h-4 text-emerald-300" />
            </button>
          </div>
        </div>

        {/* 2. BARRA DE PESQUISA & SELETORES RÁPIDOS */}
        <div className="max-w-3xl mx-auto px-4 pb-3.5 space-y-2.5">
          {/* Campo de pesquisa: "Pesquisar gado..." */}
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 top-3" />
            <input
              id="input-pesquisar-gado"
              type="text"
              placeholder="Pesquisar gado... (raça, touro, cabrito, província)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-700/70 text-white placeholder-emerald-300/70 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-emerald-950 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-emerald-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categorias em Chips horizontais (Bovinos, Caprinos, Ovinos, Outros) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs font-bold">
            {['Todos', 'Bovinos', 'Caprinos', 'Ovinos', 'Outros'].map((cat) => (
              <button
                key={cat}
                id={`cat-${cat.toLowerCase()}`}
                onClick={() => setSelectedType(cat)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 text-xs ${
                  selectedType === cat
                    ? 'bg-white text-emerald-950 shadow-md font-extrabold scale-[1.02]'
                    : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-800 border border-emerald-700/60'
                }`}
              >
                {cat === 'Todos' && '🌾'}
                {cat === 'Bovinos' && '🐂'}
                {cat === 'Caprinos' && '🐐'}
                {cat === 'Ovinos' && '🐑'}
                {cat === 'Outros' && '🌿'}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <main className="max-w-3xl mx-auto w-full px-4 pt-3 flex-1 flex flex-col">
        {/* Filtros secundários: Província, Ordenação e Contagem */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-2 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            {/* Seletor de Província */}
            <div className="relative inline-flex items-center">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 absolute left-2 pointer-events-none" />
              <select
                id="select-provincia"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="pl-6 pr-6 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 font-semibold text-xs focus:ring-2 focus:ring-emerald-600 appearance-none shadow-2xs"
              >
                <option value="Todas">Todas as Províncias</option>
                {MOZAMBIQUE_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div className="relative inline-flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 absolute left-2 pointer-events-none" />
              <select
                id="select-ordenacao"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'price-asc' | 'price-desc')}
                className="pl-6 pr-6 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 font-medium text-xs focus:ring-2 focus:ring-emerald-600 appearance-none shadow-2xs"
              >
                <option value="recent">Mais Recentes</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
              </select>
            </div>
          </div>

          <div className="text-[11px] font-bold text-emerald-900 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
            {filteredListings.length} {filteredListings.length === 1 ? 'anúncio' : 'anúncios'} na feira
          </div>
        </div>

        {/* Banner de Demonstração / Aviso Transparente */}
        <div className="my-2 p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-[11px] text-stone-600 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Feira comunitária de produtores. Contacto e negociações directas via WhatsApp de cada vendedor.
            </span>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="text-emerald-800 font-bold hover:underline shrink-0 text-xs"
          >
            + Anunciar Meu Gado
          </button>
        </div>

        {/* 4. SLOT DE BANNER MONETAG (TOPO DA FEIRA) */}
        <MonetagBannerSlot
          slotId="topo-feira"
          onOpenSettings={() => setIsMonetagOpen(true)}
        />

        {/* 5. LISTA DE ANÚNCIOS */}
        {filteredListings.length === 0 ? (
          <div className="my-8 py-12 px-4 bg-white rounded-3xl border border-stone-200 text-center flex flex-col items-center justify-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-3xl mb-3">
              🐂
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Nenhum gado encontrado com estes filtros
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mb-4">
              Tente alterar a província, categoria ou termo de busca, ou seja o primeiro a publicar nesta região!
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('Todos');
                  setSelectedProvince('Todas');
                }}
                className="py-2 px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl"
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar Anúncio</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 my-2">
            {filteredListings.map((listing, index) => (
              <React.Fragment key={listing.id}>
                <ListingCard
                  listing={listing}
                  onSelect={(item) => setSelectedListing(item)}
                />

                {/* Inserir espaço preparado de publicidade Monetag a cada 3 anúncios sem poluir */}
                {index === 1 && (
                  <MonetagBannerSlot
                    slotId="meio-feira"
                    onOpenSettings={() => setIsMonetagOpen(true)}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* 6. SLOT DE BANNER MONETAG (RODAPÉ DA LISTA) */}
        {filteredListings.length > 2 && (
          <MonetagBannerSlot
            slotId="rodape-feira"
            onOpenSettings={() => setIsMonetagOpen(true)}
          />
        )}
      </main>

      {/* 7. BARRA DE NAVEGAÇÃO INFERIOR ERGONÓMICA PARA TELEMÓVEL */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg px-4 py-2 sm:hidden">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {/* Aba Feira */}
          <button
            onClick={() => setActiveTab('feira')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'feira' ? 'text-emerald-700 font-extrabold' : 'text-stone-500 font-medium'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px]">Feira</span>
          </button>

          {/* Botão Central de Criar Anúncio em Destaque */}
          <button
            id="btn-criar-anuncio-mobile"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs rounded-full shadow-md -translate-y-2 border-2 border-white"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Anunciar</span>
          </button>

          {/* Aba Meus Anúncios */}
          <button
            onClick={() => setActiveTab('meus-anuncios')}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              activeTab === 'meus-anuncios' ? 'text-emerald-700 font-extrabold' : 'text-stone-500 font-medium'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span className="text-[10px]">Meus Anúncios</span>
          </button>
        </div>
      </nav>

      {/* Botão Flutuante para Desktop */}
      <button
        id="btn-criar-anuncio-desktop"
        onClick={() => setIsCreateOpen(true)}
        className="hidden sm:flex fixed bottom-6 right-6 z-30 py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm rounded-2xl shadow-xl items-center gap-2 transition-all hover:scale-105"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
        <span>Publicar Anúncio de Gado</span>
      </button>

      {/* 8. MODAIS */}
      {/* Modal de Detalhes do Anúncio */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
      />

      {/* Modal de Criar Anúncio */}
      <CreateListingModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddListing={handleAddListing}
      />

      {/* Modal de Dicas de Segurança e Negociação em Moçambique */}
      <SafetyTipsModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
      />

      {/* Modal de Configurações da Monetag */}
      <MonetagConfigModal
        isOpen={isMonetagOpen}
        onClose={() => setIsMonetagOpen(false)}
        onUpdated={() => setMonetagKey((k) => k + 1)}
      />
    </div>
  );
}
