import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useData } from '../providers/DataProvider';

const MAX_SIDEBAR_CATEGORIES = 6;

function formatTime(date) {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(date) {
  const text = date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000);

    return () => clearInterval(timer);
  }, []);

  return now;
}

export default function MainLayout() {
  const { categories } = useData();
  const now = useClock();

  const sidebarCategories = categories
    .filter((category) => category.showInSidebar && category.id !== 'all')
    .slice(0, MAX_SIDEBAR_CATEGORIES);

  const hasMoreCategories =
    categories.filter((category) => category.showInSidebar && category.id !== 'all')
      .length > MAX_SIDEBAR_CATEGORIES;

  return (
    <div className="homedeck-shell">
      <aside className="homedeck-sidebar">
        <Link to="/" className="homedeck-brand" aria-label="HomeDeck — início">
          <img
            src="/h_main_brand.png"
            alt="HomeDeck"
            className="homedeck-brand-logo"
            width={2523}
            height={300}
          />
        </Link>

        <nav className="homedeck-navigation" aria-label="Navegação principal">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `homedeck-nav-item${isActive ? ' active' : ''}`
            }
          >
            <i className="pi pi-home" aria-hidden="true" />
            <span>Início</span>
          </NavLink>

          {sidebarCategories.map((category) => (
            <NavLink
              key={category.id}
              to={`/c/${category.id}`}
              className={({ isActive }) =>
                `homedeck-nav-item${isActive ? ' active' : ''}`
              }
            >
              <i className={category.icon} aria-hidden="true" />
              <span>{category.name}</span>
            </NavLink>
          ))}

          {hasMoreCategories && (
            <NavLink
              to="/c/all"
              className={({ isActive }) =>
                `homedeck-nav-item${isActive ? ' active' : ''}`
              }
            >
              <i className="pi pi-th-large" aria-hidden="true" />
              <span>Aplicativos</span>
            </NavLink>
          )}

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `homedeck-nav-item${isActive ? ' active' : ''}`
            }
          >
            <i className="pi pi-cog" aria-hidden="true" />
            <span>Configurações</span>
          </NavLink>
        </nav>

        <div className="homedeck-sidebar-footer">
          <span>© {new Date().getFullYear()} HomeDeck</span>
        </div>
      </aside>

      <div className="homedeck-main">
        <header className="homedeck-topbar">
          <div className="homedeck-topbar-label">Central de entretenimento</div>

          <div className="homedeck-topbar-actions">
            <div className="homedeck-clock" aria-label={`${formatDate(now)}`}>
              <strong>{formatTime(now)}</strong>
              <span>{formatDate(now)}</span>
            </div>

            <span className="homedeck-topbar-divider" aria-hidden="true" />

            <Link
              to="/settings"
              className="homedeck-icon-button"
              aria-label="Configurações"
              title="Configurações"
            >
              <i className="pi pi-cog" aria-hidden="true" />
            </Link>
          </div>
        </header>

        <main className="homedeck-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
