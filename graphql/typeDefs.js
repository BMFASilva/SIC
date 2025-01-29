import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    password: String!
  }

  type Gestacao {
    id: ID!
    usuarioId: ID!
    ultimaMenstruacao: String!
    dataTerminoPrevisto: String!
  }

  type Gravidez {
    id: ID!
    usuarioId: ID!
    semana: Int!
    peso: Float!
    comprimento: Float!
    dataRegistro: String!
  }

  type LoginResponse {
    token: String!
    user: User!
}

  # Queries
  type Query {
    users: [User!]!
    user(id: ID!): User!
    gestacaoPorUsuario(usuarioId: ID!): Gestacao!
    dadosGravidezPorUsuario(usuarioId: ID!): [Gravidez!]!
  }

  # Mutations
  type Mutation {
    createUser(username: String!, password: String!): User!
    login(username: String!, password: String!): LoginResponse!
    createGestacao(usuarioId: ID!, ultimaMenstruacao: String!): Gestacao!
    createGravidez(usuarioId: ID!, semana: Int!, peso: Float!, comprimento: Float!, dataRegistro: String!): Gravidez!
  }

  # Subscriptions
  type Subscription {
    notificacaoNovoRegistro: Gravidez!
  }
`;
