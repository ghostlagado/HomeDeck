import { Link } from 'react-router-dom';
import { useAppActions } from '../providers/useAppActions';
import AppIcon from '../components/AppIcon';
import { AddAppCard } from '../components/AppCard';
import CategoryCard from '../components/CategoryCard';
import { getColor } from '../config/colors';

const RECENT_LIMIT = 8;

export default function Home() {
  const { data, addApp } = useAppActions();

  const featuredApps = data.apps.filter((app) => app.featured).slice(0, 6);
  const displayApps = featuredApps.length > 0 ? featuredApps : data.apps.slice(0, 5);

  const recentApps = [...data.apps]
    .sort(
      (a, b) =>
        (b.lastOpenedAt || '').localeCompare(a.lastOpenedAt || '') ||
        (b.openCount || 0) - (a.openCount || 0)
    )
    .slice(0, RECENT_LIMIT);

  const visibleCategories = data.categories.filter(
    (category) => category.id !== 'all'
  );

  return (
    <div className="flex flex-column homedeck-home">
      <section className="homedeck-hero">
        <div className="homedeck-hero-body">
          <span className="homedeck-hero-welcome">Bem-vindo ao</span>

          <img
            src="/h_main_brand.png"
            alt="HomeDeck"
            className="homedeck-hero-logo"
            width={2523}
            height={300}
          />

          <p className="homedeck-hero-tagline">
            Seus filmes, séries, vídeos e muito mais.
            <br />
            Tudo em um só lugar.
          </p>
        </div>

        <span className="homedeck-status homedeck-hero-status">
          <span className="homedeck-status-dot" />
          Sistema pronto
        </span>
      </section>

      <section className="homedeck-section" aria-labelledby="featured-title">
        <div className="homedeck-section-header">
          <h2 id="featured-title">Aplicativos em destaque</h2>
        </div>

        <div className="homedeck-rail">
          {displayApps.map((app) => (
            <HomedeckFeaturedTile
              key={app.id}
              app={app}
              categoryName={
                data.getCategory(app.categoryId)?.name || 'Outros'
              }
              onOpen={data.openApp}
            />
          ))}

          {displayApps.length === 0 && (
            <p className="homedeck-rail-empty">
              Nenhum aplicativo cadastrado ainda. Adicione o primeiro para
              começar.
            </p>
          )}

          <AddAppCard onClick={() => addApp()} />
        </div>
      </section>

      <section className="homedeck-section" aria-labelledby="categories-title">
        <div className="homedeck-section-header">
          <h2 id="categories-title">Categorias</h2>
        </div>

        <div className="homedeck-category-grid">
          {visibleCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              count={data.appsByCategory(category.id).length}
              to={`/c/${category.id}`}
            />
          ))}

          <button
            type="button"
            className="homedeck-category-card homedeck-category-add"
            onClick={() => addApp()}
          >
            <span className="homedeck-category-icon">
              <i className="pi pi-plus" aria-hidden="true" />
            </span>

            <span className="homedeck-category-info">
              <strong>Novo atalho</strong>
              <span>Adicione um aplicativo</span>
            </span>
          </button>
        </div>
      </section>

      <section className="homedeck-section" aria-labelledby="recent-title">
        <div className="homedeck-section-header">
          <h2 id="recent-title">Apps recentes</h2>

          <Link to="/c/all" className="homedeck-section-link">
            Ver todos
          </Link>
        </div>

        {recentApps.length > 0 ? (
          <div className="homedeck-chip-rail">
            {recentApps.map((app) => (
              <button
                key={app.id}
                type="button"
                className="homedeck-chip"
                onClick={() => data.openApp(app)}
                title={`Abrir ${app.name}`}
              >
                <AppIcon app={app} category={data.getCategory(app.categoryId)} size={44} />
                <span>{app.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="homedeck-rail-empty">
            Seus aplicativos abertos aparecerão aqui.
          </p>
        )}
      </section>
    </div>
  );
}

function HomedeckFeaturedTile({ app, categoryName, onOpen }) {
  const color = getColor(app.color);

  return (
    <button
      type="button"
      className="homedeck-featured-tile"
      style={{
        background: color.gradient,
        boxShadow: `0 18px 40px -18px ${color.glow}`,
      }}
      onClick={() => onOpen(app)}
      title={`Abrir ${app.name}`}
    >
      <span className="homedeck-featured-logo">
        {app.iconUrl ? (
          <img src={app.iconUrl} alt="" loading="lazy" />
        ) : (
          <AppIcon app={app} size={72} />
        )}
      </span>

      <span className="homedeck-featured-info">
        <strong>{app.name}</strong>
        <span>{categoryName}</span>
      </span>
    </button>
  );
}
