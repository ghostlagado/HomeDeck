export const ALL_APPS_CATEGORY_ID = 'all';

export const DEFAULT_CATEGORIES = [
  {
    id: ALL_APPS_CATEGORY_ID,
    name: 'Todos os aplicativos',
    description: 'Todos os atalhos cadastrados',
    icon: 'pi pi-th-large',
    color: 'cyan',
    showInSidebar: false,
    builtIn: true,
    sort: 0,
  },
  {
    id: 'streaming',
    name: 'Streaming',
    description: 'Filmes e séries',
    icon: 'pi pi-video',
    color: 'blue',
    showInSidebar: true,
    builtIn: true,
    sort: 1,
  },
  {
    id: 'videos',
    name: 'Vídeos',
    description: 'YouTube e mais',
    icon: 'pi pi-play-circle',
    color: 'pink',
    showInSidebar: true,
    builtIn: true,
    sort: 2,
  },
  {
    id: 'music',
    name: 'Música',
    description: 'Streaming de áudio',
    icon: 'pi pi-headphones',
    color: 'green',
    showInSidebar: false,
    builtIn: true,
    sort: 3,
  },
  {
    id: 'kids',
    name: 'Infantil',
    description: 'Conteúdo para crianças',
    icon: 'pi pi-face-smile',
    color: 'orange',
    showInSidebar: false,
    builtIn: true,
    sort: 4,
  },
  {
    id: 'games',
    name: 'Jogos',
    description: 'Diversão garantida',
    icon: 'pi pi-trophy',
    color: 'purple',
    showInSidebar: true,
    builtIn: true,
    sort: 5,
  },
  {
    id: 'apps',
    name: 'Aplicativos',
    description: 'Produtividade e utilitários',
    icon: 'pi pi-desktop',
    color: 'teal',
    showInSidebar: true,
    builtIn: true,
    sort: 6,
  },
  {
    id: 'others',
    name: 'Outros',
    description: 'Sem categoria',
    icon: 'pi pi-ellipsis-h',
    color: 'slate',
    showInSidebar: false,
    builtIn: true,
    sort: 7,
  },
];

export const CATEGORY_ICON_OPTIONS = [
  'pi pi-video',
  'pi pi-play-circle',
  'pi pi-ticket',
  'pi pi-headphones',
  'pi pi-trophy',
  'pi pi-face-smile',
  'pi pi-th-large',
  'pi pi-globe',
  'pi pi-book',
  'pi pi-image',
  'pi pi-desktop',
  'pi pi-mobile',
  'pi pi-camera',
  'pi pi-heart',
  'pi pi-star',
  'pi pi-lightbulb',
  'pi pi-bolt',
  'pi pi-cloud',
  'pi pi-shopping-cart',
  'pi pi-wallet',
  'pi pi-building',
  'pi pi-compass',
  'pi pi-microchip',
  'pi pi-sliders-h',
  'pi pi-ellipsis-h',
];

export const FALLBACK_CATEGORY_ID = 'others';

export function slugify(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
