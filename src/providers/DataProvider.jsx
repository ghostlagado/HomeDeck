import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  FALLBACK_CATEGORY_ID,
  generateId,
  slugify,
} from '../config/categories';
import {
  loadApps,
  loadCategories,
  resetData,
  saveApps,
  saveCategories,
  seedIfEmpty,
  importData,
  exportData,
} from '../services/storage';

const DataContext = createContext(null);

function sortCategories(categories) {
  return [...categories].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
}

export function DataProvider({ children }) {
  // O seed precisa ocorrer antes da leitura das categorias.
  const [categories, setCategories] = useState(() => {
    seedIfEmpty();

    return sortCategories(loadCategories());
  });
  const [apps, setApps] = useState(() => loadApps());

  const persistCategories = useCallback((next) => {
    setCategories(next);
    saveCategories(next);
  }, []);

  const persistApps = useCallback((next) => {
    setApps(next);
    saveApps(next);
  }, []);

  const getCategory = useCallback(
    (id) => categories.find((category) => category.id === id) ?? null,
    [categories]
  );

  const appsByCategory = useCallback(
    (categoryId) => {
      if (!categoryId || categoryId === 'all') {
        return apps;
      }

      if (categoryId === FALLBACK_CATEGORY_ID) {
        const knownIds = new Set(categories.map((category) => category.id));
        return apps.filter(
          (app) => !app.categoryId || !knownIds.has(app.categoryId)
        );
      }

      return apps.filter((app) => app.categoryId === categoryId);
    },
    [apps, categories]
  );

  const addApp = useCallback(
    (data) => {
      const app = {
        id: generateId(),
        name: data.name.trim(),
        url: data.url.trim(),
        categoryId: data.categoryId || FALLBACK_CATEGORY_ID,
        iconUrl: data.iconUrl?.trim() || null,
        color: data.color || 'blue',
        description: data.description?.trim() || '',
        featured: Boolean(data.featured),
        createdAt: new Date().toISOString(),
        lastOpenedAt: null,
        openCount: 0,
      };

      persistApps([app, ...loadApps()]);

      return app;
    },
    [persistApps]
  );

  const updateApp = useCallback(
    (id, data) => {
      const current = loadApps();
      const index = current.findIndex((app) => app.id === id);

      if (index === -1) {
        throw new Error('Aplicativo não encontrado.');
      }

      const next = {
        ...current[index],
        name: data.name.trim(),
        url: data.url.trim(),
        categoryId: data.categoryId || FALLBACK_CATEGORY_ID,
        iconUrl: data.iconUrl?.trim() || null,
        color: data.color || current[index].color || 'blue',
        description: data.description?.trim() || '',
        featured: Boolean(data.featured),
      };

      const updated = [...current];
      updated[index] = next;
      persistApps(updated);

      return next;
    },
    [persistApps]
  );

  const removeApp = useCallback(
    (id) => {
      persistApps(loadApps().filter((app) => app.id !== id));
    },
    [persistApps]
  );

  const toggleFeatured = useCallback(
    (id) => {
      const current = loadApps();
      const updated = current.map((app) =>
        app.id === id ? { ...app, featured: !app.featured } : app
      );

      persistApps(updated);

      return updated.find((app) => app.id === id);
    },
    [persistApps]
  );

  const recordAppOpen = useCallback(
    (id) => {
      const current = loadApps();
      const updated = current.map((app) =>
        app.id === id
          ? {
              ...app,
              lastOpenedAt: new Date().toISOString(),
              openCount: (app.openCount || 0) + 1,
            }
          : app
      );

      persistApps(updated);
    },
    [persistApps]
  );

  const addCategory = useCallback(
    (data) => {
      const name = data.name.trim();

      if (
        loadCategories().some(
          (category) => category.name.toLowerCase() === name.toLowerCase()
        )
      ) {
        throw new Error('Já existe uma categoria com esse nome.');
      }

      const maxSort = loadCategories().reduce(
        (max, category) => Math.max(max, category.sort ?? 0),
        0
      );

      const category = {
        id: data.id?.trim() || slugify(name) || generateId(),
        name,
        description: data.description?.trim() || '',
        icon: data.icon || 'pi pi-bookmark',
        color: data.color || 'blue',
        showInSidebar: Boolean(data.showInSidebar),
        builtIn: false,
        sort: maxSort + 1,
      };

      if (loadCategories().some((existing) => existing.id === category.id)) {
        category.id = `${category.id}-${generateId().slice(0, 6)}`;
      }

      persistCategories(sortCategories([...loadCategories(), category]));

      return category;
    },
    [persistCategories]
  );

  const updateCategory = useCallback(
    (id, data) => {
      const current = loadCategories();
      const index = current.findIndex((category) => category.id === id);

      if (index === -1) {
        throw new Error('Categoria não encontrada.');
      }

      const name = data.name.trim();

      if (
        current.some(
          (category, categoryIndex) =>
            categoryIndex !== index &&
            category.name.toLowerCase() === name.toLowerCase()
        )
      ) {
        throw new Error('Já existe uma categoria com esse nome.');
      }

      const next = {
        ...current[index],
        name,
        description: data.description?.trim() || '',
        icon: data.icon || current[index].icon,
        color: data.color || current[index].color,
        showInSidebar:
          data.showInSidebar === undefined
            ? current[index].showInSidebar
            : Boolean(data.showInSidebar),
      };

      const updated = [...current];
      updated[index] = next;
      persistCategories(sortCategories(updated));

      return next;
    },
    [persistCategories]
  );

  const removeCategory = useCallback(
    (id) => {
      const category = loadCategories().find((existing) => existing.id === id);

      if (category?.builtIn) {
        throw new Error('Categorias padrão não podem ser excluídas.');
      }

      persistCategories(loadCategories().filter((existing) => existing.id !== id));

      persistApps(
        loadApps().map((app) =>
          app.categoryId === id ? { ...app, categoryId: FALLBACK_CATEGORY_ID } : app
        )
      );
    },
    [persistCategories, persistApps]
  );

  const openApp = useCallback(
    (app) => {
      recordAppOpen(app.id);
      window.open(app.url, '_blank', 'noopener,noreferrer');
    },
    [recordAppOpen]
  );

  const reloadFromStorage = useCallback(() => {
    setCategories(sortCategories(loadCategories()));
    setApps(loadApps());
  }, []);

  const restoreBackup = useCallback(
    (rawJson) => {
      importData(rawJson);
      reloadFromStorage();
    },
    [reloadFromStorage]
  );

  const resetToDefaults = useCallback(() => {
    resetData();
    reloadFromStorage();
  }, [reloadFromStorage]);

  const value = useMemo(
    () => ({
      categories,
      apps,
      getCategory,
      appsByCategory,
      addApp,
      updateApp,
      removeApp,
      toggleFeatured,
      openApp,
      addCategory,
      updateCategory,
      removeCategory,
      exportJson: exportData,
      restoreBackup,
      resetToDefaults,
    }),
    [
      categories,
      apps,
      getCategory,
      appsByCategory,
      addApp,
      updateApp,
      removeApp,
      toggleFeatured,
      openApp,
      addCategory,
      updateCategory,
      removeCategory,
      restoreBackup,
      resetToDefaults,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('useData deve ser utilizado dentro de DataProvider.');
  }

  return context;
}
