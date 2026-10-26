import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useToast } from './ToastProvider';

const DialogContext = createContext(null);

const SIZE_MAP = {
  small: 'min(92vw, 420px)',
  medium: 'min(92vw, 600px)',
  large: 'min(94vw, 900px)',
  fullscreen: '96vw',
};

const DEFAULT_OPTIONS = {
  title: 'Dialog',
  description: '',
  size: 'medium',

  submitLabel: 'Salvar',
  cancelLabel: 'Cancelar',

  submitIcon: 'pi pi-check',
  cancelIcon: null,

  showSubmit: true,
  showCancel: true,

  dismissableMask: false,
  closable: true,
  closeOnEscape: true,

  content: null,
  onSubmit: null,
  onCancel: null,
};

export function DialogProvider({ children }) {
  const toast = useToast();

  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [submitting, setSubmitting] = useState(false);

  const resolverRef = useRef(null);
  const visibleRef = useRef(false);
  const submittingRef = useRef(false);
  const optionsRef = useRef(DEFAULT_OPTIONS);
  const submitHandlerRef = useRef(null);

  const setSubmitHandler = useCallback((handler) => {
    submitHandlerRef.current = typeof handler === 'function' ? handler : null;
  }, []);

  const open = useCallback((config = {}) => {
    if (visibleRef.current) {
      return Promise.resolve({
        action: 'busy',
        data: null,
      });
    }

    const nextOptions = {
      ...DEFAULT_OPTIONS,
      ...config,
    };

    submitHandlerRef.current = null;
    optionsRef.current = nextOptions;
    visibleRef.current = true;
    submittingRef.current = false;

    setOptions(nextOptions);
    setSubmitting(false);
    setVisible(true);

    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const settle = useCallback((action, data) => {
    const resolver = resolverRef.current;

    resolverRef.current = null;
    visibleRef.current = false;
    submitHandlerRef.current = null;

    setVisible(false);

    resolver?.({ action, data });
  }, []);

  const close = useCallback(
    (result = null) => {
      if (submittingRef.current) return;

      settle('close', result);
    },
    [settle]
  );

  const cancel = useCallback(async () => {
    if (submittingRef.current) return;

    try {
      await optionsRef.current.onCancel?.();

      settle('cancel', null);
    } catch (error) {
      toast.error(
        'Não foi possível cancelar',
        error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
      );
    }
  }, [settle, toast]);

  const submit = useCallback(async (data) => {
    if (submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);

    try {
      const result = await optionsRef.current.onSubmit?.(data);

      settle('submit', result ?? data ?? null);
    } catch (error) {
      // Mantém o dialog aberto para correção ou nova tentativa.
      toast.error(
        'Erro ao salvar',
        error instanceof Error ? error.message : 'Não foi possível concluir a operação.'
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [settle, toast]);

  const requestSubmit = useCallback(() => {
    if (submittingRef.current) return;

    if (submitHandlerRef.current) {
      submitHandlerRef.current();
      return;
    }

    submit(null);
  }, [submit]);

  const renderFooter = () => (
    <div className="flex justify-content-end gap-2">
      {options.showCancel && (
        <Button
          type="button"
          label={options.cancelLabel}
          icon={options.cancelIcon || undefined}
          severity="secondary"
          outlined
          disabled={submitting}
          onClick={cancel}
        />
      )}

      {options.showSubmit && (
        <Button
          type="button"
          label={options.submitLabel}
          icon={options.submitIcon}
          loading={submitting}
          onClick={requestSubmit}
        />
      )}
    </div>
  );

  const contextValue = useMemo(
    () => ({
      open,
      close,
      cancel,
      submit,
      setSubmitHandler,
      submitting,
    }),
    [open, close, cancel, submit, setSubmitHandler, submitting]
  );

  return (
    <DialogContext.Provider value={contextValue}>
      {children}

      <Dialog
        visible={visible}
        header={options.title}
        onHide={cancel}
        modal
        draggable={false}
        resizable={false}
        closable={options.closable && !submitting}
        closeOnEscape={options.closeOnEscape && !submitting}
        dismissableMask={options.dismissableMask}
        style={{
          width: SIZE_MAP[options.size] || SIZE_MAP.medium,
        }}
        breakpoints={{
          '960px': '94vw',
          '640px': '96vw',
        }}
        footer={renderFooter()}
      >
        {options.description && (
          <p className="homedeck-dialog-description">
            {options.description}
          </p>
        )}

        {options.content}
      </Dialog>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog deve ser utilizado dentro de DialogProvider.');
  }

  return context;
}
