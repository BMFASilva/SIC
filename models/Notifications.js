import React from 'react';
import { useSubscription } from '@apollo/client';
import { gql } from 'graphql-tag';

// Define the GraphQL subscription to listen for new notifications
const NOTIFICACAO_NOVO_REGISTRO = gql`
  subscription {
    notificacaoNovoRegistro {
      mensagem
      usuarioId
    }
  }
`;

const NotificationComponent = () => {
  // Use the Apollo Client hook to subscribe to the notifications
  const { data, loading, error } = useSubscription(NOTIFICACAO_NOVO_REGISTRO);

  // Handling loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // If we get the notification data, display it
  return (
    <div>
      {data?.notificacaoNovoRegistro && (
        <p>{data.notificacaoNovoRegistro.mensagem}</p>
      )}
    </div>
  );
};

export default Notifications;
