import { createContext, useCallback, useContext,useMemo, useRef } from 'react';
import { Toast } from 'primereact/toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const toastRef = useRef(null);

    const showToast = useCallback((severity, summary, detail, options = {}) => {
        toastRef.current?.show({
            severity,
            summary,
            detail,
            life: 3500,
            ...options,
        });
    }, []);

    const toast = useMemo(
        () => ({
            success: (summary, detail, options) => showToast('success', summary, detail, options),
            error: (summary, detail, options) => showToast('error', summary, detail, options),
            warn: (summary, detail, options) => showToast('warn', summary, detail, options),
            info: (summary, detail, options) => showToast('info', summary, detail, options),
            clear: () => toastRef.current?.clear(),
        }), [showToast]
    );

    return (
        <ToastContext.Provider value={toast}>
            {children}

            <Toast
                ref={toastRef}
                position="top-right"
            />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            'useToast deve ser utilizado dentro de ToastProvider.'
        );
    }

    return context;
}