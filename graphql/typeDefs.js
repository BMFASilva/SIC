import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!  # Apenas retorna o nome do utilizador (a password nunca é devolvida)
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User! # Referência ao autor
  }

  # paginação por cursores
  type PostPageInfo {
    posts: [Post]
    prevCursor: ID
    nextCursor: ID
  }

  type Query {
    me: User
    users: [User]
    posts(limit: Int, offset: Int): [Post]
    posts_byCursor(limit: Int, cursor: ID): PostPageInfo
  }

  type Mutation {
    register(username: String!, password: String!): User
    login(username: String!, password: String!): String!
    createPost(title: String!, content: String!): Post
  }

  # Subscrições para novos posts
  type Subscription {
    novoPostAdicionado: Post
  }
`;