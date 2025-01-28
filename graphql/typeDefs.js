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

  type DadosGravidez {
    id: ID!
    usuarioId: ID!
    semana: Int!
    peso: Float!
    comprimento: Float!
    dataRegistro: String!
  }

  type LoginResponse {
    token: String!
  }

  # Subscription
  type Subscription {
    notificacaoNovoRegistro: DadosGravidez!
  }

  # Queries
  type Query {
    user(id: ID!): User!
    users: [User!]!
    gestacaoPorUsuario(usuarioId: ID!): Gestacao!
    dadosGravidezPorUsuario(usuarioId: ID!): [DadosGravidez!]!
  }

  # Mutations
  type Mutation {
    createUser(username: String!, password: String!): User!
    login(username: String!, password: String!): LoginResponse!
    createGestacao(usuarioId: ID!, ultimaMenstruacao: String!): Gestacao!
    createGravidez(
      usuarioId: ID!
      semana: Int!
      peso: Float!
      comprimento: Float!
      dataRegistro: String!
    ): DadosGravidez!
  }
`;

