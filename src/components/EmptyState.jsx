import { Button } from 'primereact/button';

export default function EmptyState({
  icon = 'pi pi-inbox',
  title,
  description,
  actionLabel,
  onAction,
  actionIcon = 'pi pi-plus',
}) {
  return (
    <div className="homedeck-empty-state">
      <span className="homedeck-empty-icon">
        <i className={icon} aria-hidden="true" />
      </span>

      <h2>{title}</h2>

      {description && <p>{description}</p>}

      {onAction && (
        <Button
          className="mt-3"
          label={actionLabel}
          icon={actionIcon}
          onClick={onAction}
        />
      )}
    </div>
  );
}
