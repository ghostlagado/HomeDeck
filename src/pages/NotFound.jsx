import { useNavigate, useRouteError } from 'react-router-dom';
import EmptyState from '../components/EmptyState';

export default function NotFound() {
  const navigate = useNavigate();
  const error = useRouteError();

  const message =
    error instanceof Error
      ? error.message
      : 'A página solicitada não existe ou foi removida do HomeDeck.';

  return (
    <EmptyState
      icon="pi pi-compass"
      title="Página não encontrada"
      description={message}
      actionLabel="Voltar ao início"
      actionIcon="pi pi-home"
      onAction={() => navigate('/')}
    />
  );
}
