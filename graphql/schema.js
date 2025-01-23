import { gql } from "apollo-server";

export const typeDefs = gql`
type Serie {
  id: ID!
  titulo: String!
  descricao: String
  ano: Int
  genero: String
  episodios: [Episodio] # Relação com os episódios
}

type Episodio {
  id: ID!
  titulo: String!
  duracao: Int! # Em minutos
  numero: Int! # Número do episódio na série
  serieId: ID! # Referência à série
}

# Queries principais
type Query {
  listarSeries: [Serie]
  obterSeriesPorGenero(genero: String!): [Serie]
  obterSeriesComMaisDeXEpisodios(numero: Int!): [Serie]
  identificarSerieComMaisEpisodios: Serie
  identificarSerieComMaiorDuracao: Serie
}

# Mutações para administração
type Mutation {
  adicionarSerie(titulo: String!, descricao: String, ano: Int, genero: String): Serie
  atualizarSerie(id: ID!, titulo: String, descricao: String, ano: Int, genero: String): Serie
  removerSerie(id: ID!): Serie
  
  adicionarEpisodio(serieId: ID!, titulo: String!, duracao: Int!, numero: Int!): Episodio
  atualizarEpisodio(id: ID!, titulo: String, duracao: Int, numero: Int): Episodio
  removerEpisodio(id: ID!): Episodio
}

# Subscrições para alterações nos dados
type Subscription {
  novaSerieAdicionada: Serie
  episodioAdicionadoRemovido: Episodio
}
`