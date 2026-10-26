import { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { useDialog } from '../providers/DialogProvider';
import { normalizeAppUrl } from '../services/url';
import { COLORS, COLOR_KEYS } from '../config/colors';

export default function AppForm({
  app = null,
  categories = [],
  defaultCategoryId,
}) {
  const formRef = useRef(null);

  const { submit, setSubmitHandler, submitting } = useDialog();

  const [name, setName] = useState(app?.name ?? '');
  const [url, setUrl] = useState(app?.url ?? '');
  const [categoryId, setCategoryId] = useState(
    app?.categoryId ?? defaultCategoryId ?? ''
  );
  const [iconUrl, setIconUrl] = useState(app?.iconUrl ?? '');
  const [color, setColor] = useState(app?.color ?? 'blue');
  const [description, setDescription] = useState(app?.description ?? '');
  const [featured, setFeatured] = useState(Boolean(app?.featured));

  useEffect(() => {
    setSubmitHandler(() => formRef.current?.requestSubmit());
  }, [setSubmitHandler]);

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = await buildPayload({
      name,
      url,
      categoryId,
      iconUrl,
      color,
      description,
      featured,
    });

    await submit(payload);
  }

  const categoryOptions = categories
    .filter((category) => category.id !== 'all')
    .map((category) => ({ label: category.name, value: category.id }));

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-column gap-4 homedeck-form"
    >
      <div className="grid">
        <div className="field col-12 md:col-6">
          <label htmlFor="app-name">Nome do aplicativo</label>
          <InputText
            id="app-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: YouTube"
            maxLength={60}
            disabled={submitting}
            autoFocus
            fluid
          />
        </div>

        <div className="field col-12 md:col-6">
          <label htmlFor="app-url">Endereço do aplicativo</label>
          <InputText
            id="app-url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.youtube.com"
            inputMode="url"
            disabled={submitting}
            fluid
          />
        </div>

        <div className="field col-12 md:col-6">
          <label htmlFor="app-category">Categoria</label>
          <Dropdown
            id="app-category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.value)}
            options={categoryOptions}
            placeholder="Selecionar categoria"
            disabled={submitting}
            style={{ width: '100%' }}
          />
        </div>

        <div className="field col-12 md:col-6">
          <label htmlFor="app-icon">Ícone (URL da imagem, opcional)</label>
          <InputText
            id="app-icon"
            value={iconUrl}
            onChange={(event) => setIconUrl(event.target.value)}
            placeholder="https://exemplo.com/logo.png"
            inputMode="url"
            disabled={submitting}
            fluid
          />
        </div>

        <div className="field col-12">
          <label htmlFor="app-description">Descrição (opcional)</label>
          <InputTextarea
            id="app-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={2}
            maxLength={140}
            disabled={submitting}
            fluid
          />
        </div>

        <div className="field col-12">
          <label>Cor do card</label>
          <div className="homedeck-color-picker" role="group" aria-label="Cor do card">
            {COLOR_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                className={`homedeck-color-swatch${color === key ? ' selected' : ''}`}
                style={{ background: COLORS[key].gradient }}
                title={COLORS[key].label}
                aria-label={COLORS[key].label}
                aria-pressed={color === key}
                disabled={submitting}
                onClick={() => setColor(key)}
              />
            ))}
          </div>
        </div>

        <div className="field col-12 flex align-items-center gap-2">
          <Checkbox
            inputId="app-featured"
            checked={featured}
            onChange={(event) => setFeatured(event.checked)}
            disabled={submitting}
          />
          <label htmlFor="app-featured">Destacar na tela inicial</label>
        </div>
      </div>
    </form>
  );

  async function buildPayload(data) {
    if (!data.name.trim()) {
      throw new Error('Informe o nome do aplicativo.');
    }

    return {
      name: data.name.trim(),
      url: normalizeAppUrl(data.url),
      categoryId: data.categoryId || defaultCategoryId || 'others',
      iconUrl: normalizeIconUrl(data.iconUrl),
      color: data.color,
      description: data.description.trim(),
      featured: data.featured,
    };
  }
}

function normalizeIconUrl(input) {
  const trimmed = String(input || '').trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new Error();
    }

    return parsed.href;
  } catch {
    throw new Error('URL do ícone inválida.');
  }
}
