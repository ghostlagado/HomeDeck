import { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { useDialog } from '../providers/DialogProvider';
import { CATEGORY_ICON_OPTIONS } from '../config/categories';
import { COLORS, COLOR_KEYS } from '../config/colors';

export default function CategoryForm({ category = null }) {
  const formRef = useRef(null);

  const { submit, setSubmitHandler, submitting } = useDialog();

  const [name, setName] = useState(category?.name ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [icon, setIcon] = useState(category?.icon ?? 'pi pi-bookmark');
  const [color, setColor] = useState(category?.color ?? 'blue');
  const [showInSidebar, setShowInSidebar] = useState(
    Boolean(category?.showInSidebar)
  );

  useEffect(() => {
    setSubmitHandler(() => formRef.current?.requestSubmit());
  }, [setSubmitHandler]);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmed = name.trim();

    if (trimmed.length < 2) {
      throw new Error('Informe um nome com pelo menos 2 caracteres.');
    }

    await submit({
      name: trimmed,
      description: description.trim(),
      icon,
      color,
      showInSidebar,
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-column gap-4 homedeck-form"
    >
      <div className="grid">
        <div className="field col-12 md:col-6">
          <label htmlFor="category-name">Nome da categoria</label>
          <InputText
            id="category-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Documentários"
            maxLength={40}
            disabled={submitting}
            autoFocus
            fluid
          />
        </div>

        <div className="field col-12 md:col-6">
          <label htmlFor="category-description">Descrição (opcional)</label>
          <InputText
            id="category-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Ex.: Filmes e séries documentais"
            maxLength={80}
            disabled={submitting}
            fluid
          />
        </div>

        <div className="field col-12">
          <label>Ícone</label>
          <div className="homedeck-icon-picker" role="group" aria-label="Ícone da categoria">
            {CATEGORY_ICON_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`homedeck-icon-option${icon === option ? ' selected' : ''}`}
                title={option}
                aria-label={option}
                aria-pressed={icon === option}
                disabled={submitting}
                onClick={() => setIcon(option)}
              >
                <i className={option} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div className="field col-12">
          <label>Cor</label>
          <div className="homedeck-color-picker" role="group" aria-label="Cor da categoria">
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
            inputId="category-sidebar"
            checked={showInSidebar}
            onChange={(event) => setShowInSidebar(event.checked)}
            disabled={submitting}
          />
          <label htmlFor="category-sidebar">Mostrar no menu lateral</label>
        </div>
      </div>
    </form>
  );
}
