import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from 'react';

import { ConfirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';

const ConfirmContext = createContext(null);

const DEFAULT_OPTIONS = {
    header: 'Confirmar ação',
    message: 'Deseja continuar?',
    acceptLabel: 'Confirmar',
    rejectLabel: 'Cancelar',
    acceptClassName: 'p-button-primary',
    rejectClassName: 'p-button-text',
    icon: 'pi pi-question-circle',
    closable: true,
    closeOnEscape: true,
};

export function ConfirmProvider({ children }) {
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState(DEFAULT_OPTIONS);

    const resolverRef = useRef(null);
    const visibleRef = useRef(false);

    const settle = useCallback((result) => {
        const resolver = resolverRef.current;

        // Limpa primeiro para impedir resoluções duplicadas.
        resolverRef.current = null;
        visibleRef.current = false;

        setVisible(false);

        resolver?.(result);
    }, []);

    const confirm = useCallback((config = {}) => {
        // Evita substituir silenciosamente uma confirmação pendente.
        if (visibleRef.current) {
            return Promise.resolve(false);
        }

        visibleRef.current = true;

        setOptions({
            ...DEFAULT_OPTIONS,
            ...config,
        });

        setVisible(true);

        return new Promise((resolve) => {
            resolverRef.current = resolve;
        });
    }, []);

    const reject = useCallback(() => {
        settle(false);
    }, [settle]);

    const accept = useCallback(() => {
        settle(true);
    }, [settle]);

    const contextValue = { confirm };

    return (
        <ConfirmContext.Provider value={contextValue}>
            {children}

            <ConfirmDialog
                visible={visible}
                onHide={reject}
                header={options.header}
                message={options.message}
                icon={options.icon}
                closable={options.closable}
                closeOnEscape={options.closeOnEscape}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button
                            label={options.rejectLabel}
                            className={options.rejectClassName}
                            onClick={reject}
                            autoFocus
                        />

                        <Button
                            label={options.acceptLabel}
                            className={options.acceptClassName}
                            onClick={accept}
                        />
                    </div>
                }
            />
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const context = useContext(ConfirmContext);

    if (!context) {
        throw new Error(
            'useConfirm deve ser utilizado dentro de ConfirmProvider.'
        );
    }

    return context.confirm;
}