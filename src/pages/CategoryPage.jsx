import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { useAppActions } from '../providers/useAppActions';
import { ALL_APPS_CATEGORY_ID } from '../config/categories';
import { getColor } from '../config/colors';
import AppCard, { AddAppCard } from '../components/AppCard';
import EmptyState from '../components/EmptyState';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { data, addApp, editApp, deleteApp, toggleFeatured } = useAppActions();
  const [search, setSearch] = useState('');

  const category = data.getCategory(categoryId);
  const isAll = categoryId === ALL_APPS_CATEGORY_ID;

  const apps = useMemo(() => {
    if (!category && !isAll) {
      return [];
    }

    const list = data.appsByCategory(categoryId);

    if (!search.trim()) {
      return list;
    }

    const term = search.trim().toLowerCase();

    return list.filter(
      (app) =>
        app.name.toLowerCase().includes(term) ||
        (app.description || '').toLowerCase().includes(term)
    );
  }, [category, isAll, data, categoryId, search]);

  if (!category && !isAll) {
    return (
      <EmptyState
        icon="pi pi-compass"
        title="Categoria não encontrada"
        description={`A categoria "${categoryId}" não existe ou foi removida.`}
        actionLabel="Voltar ao início"
        actionIcon="pi pi-home"
        onAction={() => navigate('/')}
      />
    );
  }

  const color = getColor(isAll ? 'cyan' : category.color);
  const title = isAll ? 'Todos os aplicativos' : category.name;
  const description = isAll
    ? 'Todos os atalhos cadastrados no HomeDeck'
    : category.description;
  const icon = isAll ? 'pi pi-th-large' : category.icon;

  return (
    <div className="flex flex-column homedeck-category-page">
      <section className="homedeck-page-header">
        <span
          className="homedeck-page-icon"
          style={{ background: color.gradient }}
        >
          <i className={icon} aria-hidden="true" />
        </span>

        <div className="homedeck-page-title">
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          <span className="homedeck-page-count">
            {apps.length} {apps.length === 1 ? 'aplicativo' : 'aplicativos'}
          </span>
        </div>

        <Link to="/" className="homedeck-back-link">
          <i className="pi pi-arrow-left" aria-hidden="true" />
          Início
        </Link>
      </section>

      <div className="homedeck-toolbar">
        <span className="p-input-icon-left homedeck-search">
          <i className="pi pi-search" aria-hidden="true" />
          <InputText
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar aplicativo..."
            aria-label="Buscar aplicativo"
          />
        </span>

        <button
          type="button"
          className="homedeck-add-button"
          onClick={() => addApp({ defaultCategoryId: isAll ? undefined : categoryId })}
        >
          <i className="pi pi-plus" aria-hidden="true" />
          Adicionar aplicativo
        </button>
      </div>

      {apps.length > 0 ? (
        <div className="homedeck-app-grid">
          {apps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              category={data.getCategory(app.categoryId)}
              onOpen={data.openApp}
              onEdit={editApp}
              onDelete={deleteApp}
              onToggleFeatured={toggleFeatured}
            />
          ))}

          <AddAppCard
            onClick={() => addApp({ defaultCategoryId: isAll ? undefined : categoryId })}
          />
        </div>
      ) : (
        <EmptyState
          icon={icon}
          title={search ? 'Nenhum resultado' : 'Nenhum aplicativo aqui'}
          description={
            search
              ? `Nenhum aplicativo corresponde a "${search}".`
              : 'Adicione o primeiro atalho desta categoria.'
          }
          actionLabel={search ? undefined : 'Adicionar aplicativo'}
          onAction={search ? undefined : () => addApp({ defaultCategoryId: isAll ? undefined : categoryId })}
        />
      )}
    </div>
  );
}
