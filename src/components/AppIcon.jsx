import { useState } from 'react';
import { getColor } from '../config/colors';

export default function AppIcon({ app, category = null, className = '', size = 56 }) {
  const [failedUrl, setFailedUrl] = useState(null);

  const imageFailed = failedUrl === app?.iconUrl;

  const color = getColor(app?.color || category?.color || 'blue');
  const initials = (app?.name ?? '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  const style = {
    background: color.gradient,
    width: size,
    height: size,
    fontSize: size * 0.34,
  };

  if (app?.iconUrl && !imageFailed) {
    return (
      <span
        className={`homedeck-app-icon homedeck-app-icon-image ${className}`}
        style={style}
      >
        <img
          src={app.iconUrl}
          alt=""
          loading="lazy"
          onError={() => setFailedUrl(app.iconUrl)}
        />
      </span>
    );
  }

  return (
    <span
      className={`homedeck-app-icon ${className}`}
      style={style}
      aria-hidden="true"
    >
      {initials || '?'}
    </span>
  );
}
