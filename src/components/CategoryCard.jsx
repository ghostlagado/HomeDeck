import { Link } from 'react-router-dom';
import { getColor } from '../config/colors';

export default function CategoryCard({ category, count, to }) {
  const color = getColor(category.color);

  return (
    <Link
      to={to}
      className="homedeck-category-card"
      style={{
        '--hd-card-accent': color.accent,
        '--hd-card-glow': color.glow,
      }}
    >
      <span className="homedeck-category-icon" style={{ background: color.gradient }}>
        <i className={category.icon} aria-hidden="true" />
      </span>

      <span className="homedeck-category-info">
        <strong>{category.name}</strong>
        <span>{category.description || `${count} aplicativo(s)`}</span>
      </span>

      <i className="pi pi-chevron-right homedeck-category-arrow" aria-hidden="true" />
    </Link>
  );
}
