import AppForm from '../components/AppForm';
import CategoryForm from '../components/CategoryForm';

export function openAppForm({ dialog, data, app = null, defaultCategoryId }) {
  const isEdit = Boolean(app);

  return dialog.open({
    title: isEdit ? 'Editar aplicativo' : 'Adicionar aplicativo',
    description: isEdit
      ? 'Atualize as informações deste atalho.'
      : 'Cadastre um aplicativo ou serviço de entretenimento no HomeDeck.',
    size: 'large',
    submitLabel: isEdit ? 'Salvar alterações' : 'Adicionar aplicativo',
    submitIcon: isEdit ? 'pi pi-check' : 'pi pi-plus',
    cancelLabel: 'Cancelar',

    content: (
      <AppForm
        app={app}
        categories={data.categories}
        defaultCategoryId={defaultCategoryId}
      />
    ),

    onSubmit: async (payload) => {
      if (isEdit) {
        return data.updateApp(app.id, payload);
      }

      return data.addApp({
        ...payload,
        categoryId: payload.categoryId || defaultCategoryId || 'others',
      });
    },
  });
}

export function openCategoryForm({ dialog, data, category = null }) {
  const isEdit = Boolean(category);

  return dialog.open({
    title: isEdit ? 'Editar categoria' : 'Nova categoria',
    description: isEdit
      ? 'Atualize as informações da categoria.'
      : 'Crie uma nova categoria para organizar seus aplicativos.',
    size: 'large',
    submitLabel: isEdit ? 'Salvar alterações' : 'Criar categoria',
    submitIcon: 'pi pi-check',
    cancelLabel: 'Cancelar',

    content: <CategoryForm category={category} />,

    onSubmit: async (payload) => {
      if (isEdit) {
        return data.updateCategory(category.id, payload);
      }

      return data.addCategory(payload);
    },
  });
}

export async function confirmRemoveApp({ confirm, toast, data, app }) {
  const accepted = await confirm({
    header: 'Excluir aplicativo',
    message: `Deseja remover "${app.name}" do HomeDeck?`,
    acceptLabel: 'Excluir',
    acceptClassName: 'p-button-danger',
    rejectLabel: 'Cancelar',
    icon: 'pi pi-exclamation-triangle',
  });

  if (!accepted) {
    return false;
  }

  data.removeApp(app.id);
  toast.success('Aplicativo removido', `"${app.name}" foi removido do HomeDeck.`);

  return true;
}

export async function confirmRemoveCategory({ confirm, toast, data, category, appCount }) {
  const accepted = await confirm({
    header: 'Excluir categoria',
    message: appCount
      ? `A categoria "${category.name}" possui ${appCount} aplicativo(s). Eles serão movidos para "Outros". Deseja continuar?`
      : `Deseja excluir a categoria "${category.name}"?`,
    acceptLabel: 'Excluir',
    acceptClassName: 'p-button-danger',
    rejectLabel: 'Cancelar',
    icon: 'pi pi-exclamation-triangle',
  });

  if (!accepted) {
    return false;
  }

  try {
    data.removeCategory(category.id);
    toast.success('Categoria excluída', `"${category.name}" foi removida.`);

    return true;
  } catch (error) {
    toast.error(
      'Não foi possível excluir',
      error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
    );

    return false;
  }
}
