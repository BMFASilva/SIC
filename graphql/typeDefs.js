import { gql } from "graphql-tag";

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
    dataInicio: String!
    duracaoEstimativa: Int!
    dataTerminoPrevisto: String!
  }

  type DadosGravidez {
    id: ID!
    gestacaoId: ID!
    semana: Int!
    peso: Float!
    comprimento: Float!
    dataRegistro: String!
  }

  # Queries
  type Query {
    user(id: ID!): User!
    users: [User!]! 
    gestacaoPorUsuario(usuarioId: ID!): Gestacao!
    dadosGravidezPorUsuario(gestacaoId: ID!): [DadosGravidez!]!
  }

  type LoginResponse {
  token: String!
}

  # Mutations
  type Mutation {
    createUser(username: String!, password: String!): User!
    login(username: String!, password: String!): LoginResponse!
    createGestacao(usuarioId: ID!, ultimaMenstruacao: String!): Gestacao!
    updateGestacao(usuarioId: ID!, ultimaMenstruacao: String!): Gestacao!

    # Dados de Gravidez
    createGravidez(
      gestacaoId: ID!
      semana: Int!
      peso: Float!
      comprimento: Float!
      dataRegistro: String!
    ): DadosGravidez!
  }
`;
