import { useCallback } from 'react';
import { useData } from '../providers/DataProvider';
import { useDialog } from './DialogProvider';
import { useToast } from './ToastProvider';
import { useConfirm } from './ConfirmProvider';
import {
  confirmRemoveApp,
  confirmRemoveCategory,
  openAppForm,
  openCategoryForm,
} from '../services/appActions';

export function useAppActions() {
  const data = useData();
  const dialog = useDialog();
  const toast = useToast();
  const confirm = useConfirm();

  const addApp = useCallback(
    async ({ defaultCategoryId } = {}) => {
      const result = await openAppForm({ dialog, data, defaultCategoryId });

      if (result?.action === 'submit') {
        toast.success(
          'Aplicativo adicionado',
          `"${result.data?.name ?? 'Novo'}" foi salvo com sucesso.`
        );
      }

      return result;
    },
    [dialog, toast, data]
  );

  const editApp = useCallback(
    async (app) => {
      const result = await openAppForm({ dialog, data, app });

      if (result?.action === 'submit') {
        toast.success('Aplicativo atualizado', `"${app.name}" foi salvo.`);
      }

      return result;
    },
    [dialog, toast, data]
  );

  const deleteApp = useCallback(
    (app) => confirmRemoveApp({ confirm, toast, data, app }),
    [confirm, toast, data]
  );

  const toggleFeatured = useCallback(
    (app) => {
      const updated = data.toggleFeatured(app.id);

      toast.info(
        updated?.featured ? 'Adicionado aos destaques' : 'Removido dos destaques',
        `"${updated?.name ?? app.name}" foi atualizado.`
      );
    },
    [data, toast]
  );

  const addCategory = useCallback(
    async () => {
      const result = await openCategoryForm({ dialog, data });

      if (result?.action === 'submit') {
        toast.success('Categoria criada', `"${result.data?.name ?? ''}" está disponível.`);
      }

      return result;
    },
    [dialog, toast, data]
  );

  const editCategory = useCallback(
    async (category) => {
      const result = await openCategoryForm({ dialog, data, category });

      if (result?.action === 'submit') {
        toast.success('Categoria atualizada', `"${category.name}" foi salva.`);
      }

      return result;
    },
    [dialog, toast, data]
  );

  const deleteCategory = useCallback(
    (category) =>
      confirmRemoveCategory({
        confirm,
        toast,
        data,
        category,
        appCount: data.appsByCategory(category.id).length,
      }),
    [confirm, toast, data]
  );

  return {
    data,
    addApp,
    editApp,
    deleteApp,
    toggleFeatured,
    addCategory,
    editCategory,
    deleteCategory,
  };
}
