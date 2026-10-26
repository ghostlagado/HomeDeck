import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { useToast } from '../providers/ToastProvider';
import { useConfirm } from '../providers/ConfirmProvider';
import { useAppActions } from '../providers/useAppActions';
import { ALL_APPS_CATEGORY_ID } from '../config/categories';
import { getColor } from '../config/colors';
import AppIcon from '../components/AppIcon';

export default function Settings() {
  const toast = useToast();
  const confirm = useConfirm();
  const { data, addCategory, editCategory, deleteCategory, editApp, deleteApp } =
    useAppActions();

  const fileInputRef = useRef(null);
  const [importError, setImportError] = useState('');

  const userCategories = data.categories.filter(
    (category) => category.id !== ALL_APPS_CATEGORY_ID
  );

  async function handleExport() {
    const json = data.exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `homedeck-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
    toast.success('Backup gerado', 'O arquivo foi baixado com sucesso.');
  }

  async function handleImportFile(event) {
    const file = event.target.files?.[0];

    setImportError('');

    if (!file) {
      return;
    }

    try {
      const text = await file.text();

      data.restoreBackup(text);

      toast.success('Backup restaurado', 'Os dados foram importados com sucesso.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Não foi possível importar o arquivo.';

      setImportError(message);
      toast.error('Falha na importação', message);
    } finally {
      event.target.value = '';
    }
  }

  async function handleReset() {
    const accepted = await confirm({
      header: 'Restaurar dados padrão',
      message:
        'Todos os aplicativos e categorias personalizados serão substituídos pelos dados iniciais. Deseja continuar?',
      acceptLabel: 'Restaurar',
      acceptClassName: 'p-button-danger',
      rejectLabel: 'Cancelar',
      icon: 'pi pi-exclamation-triangle',
    });

    if (!accepted) {
      return;
    }

    data.resetToDefaults();
    toast.success('Dados restaurados', 'O HomeDeck voltou à configuração inicial.');
  }

  return (
    <div className="flex flex-column gap-5 homedeck-settings">
      <section className="homedeck-settings-header">
        <h1>
          <i className="pi pi-cog" aria-hidden="true" />
          Configurações
        </h1>
        <p>Gerencie categorias, aplicativos e os dados salvos neste dispositivo.</p>
      </section>

      <section className="homedeck-panel" aria-labelledby="categories-settings">
        <div className="homedeck-panel-header">
          <div>
            <h2 id="categories-settings">Categorias</h2>
            <span>{userCategories.length} categorias configuradas</span>
          </div>

          <Button
            label="Nova categoria"
            icon="pi pi-plus"
            size="small"
            onClick={addCategory}
          />
        </div>

        <div className="homedeck-list">
          {userCategories.map((category) => {
            const color = getColor(category.color);
            const count = data.appsByCategory(category.id).length;

            return (
              <div key={category.id} className="homedeck-list-item">
                <span
                  className="homedeck-list-icon"
                  style={{ background: color.gradient }}
                >
                  <i className={category.icon} aria-hidden="true" />
                </span>

                <div className="homedeck-list-info">
                  <strong>
                    {category.name}
                    {category.builtIn && (
                      <span className="homedeck-badge">padrão</span>
                    )}
                  </strong>
                  <span>
                    {category.description || 'Sem descrição'} · {count} app(s)
                    {category.showInSidebar ? ' · no menu lateral' : ''}
                  </span>
                </div>

                <div className="homedeck-list-actions">
                  <Button
                    icon="pi pi-pencil"
                    severity="secondary"
                    text
                    rounded
                    aria-label={`Editar ${category.name}`}
                    onClick={() => editCategory(category)}
                  />

                  {!category.builtIn && (
                    <Button
                      icon="pi pi-trash"
                      severity="danger"
                      text
                      rounded
                      aria-label={`Excluir ${category.name}`}
                      onClick={() => deleteCategory(category)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="homedeck-panel" aria-labelledby="apps-settings">
        <div className="homedeck-panel-header">
          <div>
            <h2 id="apps-settings">Aplicativos</h2>
            <span>{data.apps.length} atalhos cadastrados</span>
          </div>
        </div>

        {data.apps.length > 0 ? (
          <div className="homedeck-list">
            {data.apps.map((app) => (
              <div key={app.id} className="homedeck-list-item">
                <AppIcon app={app} category={data.getCategory(app.categoryId)} size={44} />

                <div className="homedeck-list-info">
                  <strong>
                    {app.name}
                    {app.featured && <span className="homedeck-badge">destaque</span>}
                  </strong>
                  <span>
                    {app.url} · {data.getCategory(app.categoryId)?.name || 'Outros'}
                  </span>
                </div>

                <div className="homedeck-list-actions">
                  <Button
                    icon="pi pi-pencil"
                    severity="secondary"
                    text
                    rounded
                    aria-label={`Editar ${app.name}`}
                    onClick={() => editApp(app)}
                  />

                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    rounded
                    aria-label={`Excluir ${app.name}`}
                    onClick={() => deleteApp(app)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="homedeck-panel-empty">
            Nenhum aplicativo cadastrado. Use a tela inicial para adicionar o primeiro.
          </p>
        )}
      </section>

      <section className="homedeck-panel" aria-labelledby="data-settings">
        <div className="homedeck-panel-header">
          <div>
            <h2 id="data-settings">Dados</h2>
            <span>Tudo é salvo localmente neste navegador.</span>
          </div>
        </div>

        <div className="homedeck-data-actions">
          <Button
            label="Exportar backup"
            icon="pi pi-download"
            severity="secondary"
            outlined
            onClick={handleExport}
          />

          <Button
            label="Importar backup"
            icon="pi pi-upload"
            severity="secondary"
            outlined
            onClick={() => fileInputRef.current?.click()}
          />

          <Button
            label="Restaurar padrão"
            icon="pi pi-refresh"
            severity="danger"
            text
            onClick={handleReset}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="homedeck-hidden-input"
            onChange={handleImportFile}
            aria-label="Selecionar arquivo de backup"
          />
        </div>

        {importError && <p className="homedeck-import-error">{importError}</p>}
      </section>
    </div>
  );
}
