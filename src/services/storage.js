import { DEFAULT_CATEGORIES } from '../config/categories';

const APPS_KEY = 'homedeck.apps.v1';
const CATEGORIES_KEY = 'homedeck.categories.v1';
const SEEDED_KEY = 'homedeck.seeded.v1';

function iconUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const SEED_APPS = [
  { name: 'Netflix', url: 'https://www.netflix.com', categoryId: 'streaming', color: 'red', featured: true },
  { name: 'Prime Video', url: 'https://www.primevideo.com', categoryId: 'streaming', color: 'blue', featured: true },
  { name: 'Disney+', url: 'https://www.disneyplus.com', categoryId: 'streaming', color: 'purple', featured: true },
  { name: 'Max', url: 'https://www.max.com', categoryId: 'streaming', color: 'blue', featured: false },
  { name: 'Globoplay', url: 'https://globoplay.globo.com', categoryId: 'streaming', color: 'orange', featured: false },
  { name: 'Paramount+', url: 'https://www.paramountplus.com', categoryId: 'streaming', color: 'cyan', featured: false },
  { name: 'Jellyfin', url: 'http://localhost:8096', categoryId: 'streaming', color: 'green', featured: true },
  { name: 'YouTube', url: 'https://www.youtube.com', categoryId: 'videos', color: 'red', featured: true },
  { name: 'YouTube Kids', url: 'https://youtubekids.com', categoryId: 'kids', color: 'pink', featured: true, icon: 'www.youtube.com' },
  { name: 'Crunchyroll', url: 'https://www.crunchyroll.com', categoryId: 'videos', color: 'orange', featured: false },
  { name: 'Spotify', url: 'https://open.spotify.com', categoryId: 'music', color: 'green', featured: false },
  { name: 'Deezer', url: 'https://www.deezer.com', categoryId: 'music', color: 'purple', featured: false },
  { name: 'Twitch', url: 'https://www.twitch.tv', categoryId: 'games', color: 'purple', featured: false },
].map(({ icon, ...app }, index) => {
  const faviconHost = icon ?? (app.url.includes('localhost') ? null : new URL(app.url).hostname);

  return {
    id: `seed-${slugFromName(app.name)}-${index}`,
    ...app,
    iconUrl: faviconHost ? iconUrl(faviconHost) : null,
    description: '',
    createdAt: new Date(Date.UTC(2026, 9, 1) + index * 60000).toISOString(),
    lastOpenedAt: null,
    openCount: 0,
  };
});

function slugFromName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-');
}

export function seedIfEmpty() {
  if (localStorage.getItem(SEEDED_KEY)) {
    return;
  }

  localStorage.setItem(SEEDED_KEY, '1');

  if (!localStorage.getItem(CATEGORIES_KEY)) {
    writeJson(CATEGORIES_KEY, DEFAULT_CATEGORIES);
  }

  if (!localStorage.getItem(APPS_KEY)) {
    writeJson(APPS_KEY, SEED_APPS);
  }
}

export function loadApps() {
  return readJson(APPS_KEY, []);
}

export function saveApps(apps) {
  writeJson(APPS_KEY, apps);
}

export function loadCategories() {
  const stored = readJson(CATEGORIES_KEY, null);

  if (!stored) {
    return [...DEFAULT_CATEGORIES];
  }

  const missing = DEFAULT_CATEGORIES.filter(
    (category) => !stored.some((storedCategory) => storedCategory.id === category.id)
  );

  return [...stored, ...missing.map((category) => ({ ...category }))];
}

export function saveCategories(categories) {
  writeJson(CATEGORIES_KEY, categories);
}

export function exportData() {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      apps: loadApps(),
      categories: loadCategories(),
    },
    null,
    2
  );
}

export function importData(rawJson) {
  const parsed = JSON.parse(rawJson);

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Arquivo inválido.');
  }

  if (!Array.isArray(parsed.apps) || !Array.isArray(parsed.categories)) {
    throw new Error('O arquivo precisa conter as listas "apps" e "categories".');
  }

  const categories = parsed.categories.filter(
    (category) => category && typeof category.id === 'string' && typeof category.name === 'string'
  );

  const categoryIds = new Set(categories.map((category) => category.id));

  const apps = parsed.apps
    .filter((app) => app && typeof app.id === 'string' && typeof app.url === 'string')
    .map((app) => ({
      ...app,
      categoryId: categoryIds.has(app.categoryId) ? app.categoryId : 'others',
    }));

  writeJson(CATEGORIES_KEY, categories);
  writeJson(APPS_KEY, apps);
  localStorage.setItem(SEEDED_KEY, '1');

  return { apps, categories };
}

export function resetData() {
  localStorage.removeItem(APPS_KEY);
  localStorage.removeItem(CATEGORIES_KEY);
  localStorage.removeItem(SEEDED_KEY);
  seedIfEmpty();
}
