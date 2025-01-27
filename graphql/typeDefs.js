import { gql } from "graphql-tag";

export const typeDefs = gql`
  # Definindo os tipos para as entidades da aplicação

type User {
  id: ID!
  nome: String!
  senha: String!
  dataRegisto: String!
}

type Gestacao {
  id: ID!
  usuarioId: ID!
  dataInicio: String!
  duracaoEstimativa: Int!
  dataTerminoPrevisto: String!
}

type GestacaoRegistro {
  id: ID!
  gestacaoId: ID!
  semana: Int!
  peso: Float!
  comprimento: Float!
  dataRegistro: String!
}

# Definindo as operações (queries e mutations)

# Consultas (queries)

type Query {
  users: [User]
  user(id: ID!): User
  gestaos: [Gestacao]
  gestacao(id: ID!): Gestacao
  gestacaoRegistros: [GestacaoRegistro]
  gestacaoRegistro(id: ID!): GestacaoRegistro
}

# Mutations (operações de escrita)

type Mutation {
  # Criar um novo usuário
  createUser(nome: String!, senha: String!): User

  # Atualizar informações do usuário
  updateUser(id: ID!, nome: String, senha: String): User

  # Criar uma nova gestação
  createGestacao(usuarioId: ID!, dataInicio: String!, duracaoEstimativa: Int!): Gestacao

  updateGestacao(id: ID!, dataInicio: String, duracaoEstimativa: Int): Gestacao

  createGestacaoRegistro(gestacaoId: ID!, semana: Int!, peso: Float!, comprimento: Float!): GestacaoRegistro

  updateGestacaoRegistro(id: ID!, semana: Int, peso: Float, comprimento: Float): GestacaoRegistro
}

type Subscription {
  gestacaoCriada: Gestacao
}

`;