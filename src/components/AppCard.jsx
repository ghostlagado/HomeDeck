import { useRef } from 'react';
import { Menu } from 'primereact/menu';
import AppIcon from './AppIcon';

export default function AppCard({
  app,
  category = null,
  onOpen,
  onEdit,
  onDelete,
  onToggleFeatured,
}) {
  const menuRef = useRef(null);

  const items = [
    onEdit && {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => onEdit(app),
    },
    onToggleFeatured && {
      label: app.featured ? 'Remover destaque' : 'Destacar na inicial',
      icon: app.featured ? 'pi pi-star-fill' : 'pi pi-star',
      command: () => onToggleFeatured(app),
    },
    onDelete && {
      label: 'Excluir',
      icon: 'pi pi-trash',
      command: () => onDelete(app),
    },
  ].filter(Boolean);

  return (
    <div className={`homedeck-app-tile${app.featured ? ' featured' : ''}`}>
      <button
        type="button"
        className="homedeck-app-tile-main"
        onClick={() => onOpen(app)}
        title={`Abrir ${app.name}`}
      >
        <span className="homedeck-app-tile-icon">
          <AppIcon app={app} category={category} size={64} />
        </span>

        <span className="homedeck-app-tile-info">
          <strong>{app.name}</strong>
          <span>{category ? category.name : 'Outros'}</span>
        </span>
      </button>

      {items.length > 0 && (
        <>
          <button
            type="button"
            className="homedeck-app-tile-menu"
            aria-label={`Ações de ${app.name}`}
            onClick={(event) => menuRef.current?.toggle(event)}
          >
            <i className="pi pi-ellipsis-v" aria-hidden="true" />
          </button>

          <Menu ref={menuRef} model={items} popup />
        </>
      )}
    </div>
  );
}

export function AddAppCard({ onClick, label = 'Adicionar App', hint = 'Personalize sua lista' }) {
  return (
    <button type="button" className="homedeck-add-card" onClick={onClick}>
      <span className="homedeck-add-card-plus">
        <i className="pi pi-plus" aria-hidden="true" />
      </span>

      <span className="homedeck-add-card-info">
        <strong>{label}</strong>
        <span>{hint}</span>
      </span>
    </button>
  );
}
