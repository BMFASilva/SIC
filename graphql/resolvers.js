import { PubSub } from 'graphql-subscriptions';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import Gestacao from '../models/GestaoGravidez.js';
import Gravidez from '../models/Gravidez.js';
import User from '../models/User.js';

const pubsub = new PubSub();

const userResolver = {
  Query: {
      users: async () => {
          try {
              return await User.find();
          } catch (err) {
              console.error('Erro ao buscar usuários:', err);
              throw new GraphQLError('Erro ao buscar usuários');
          }
      },

      user: async (_, { id }) => {
          try {
              const user = await User.findById(id);
              if (!user) {
                  throw new GraphQLError('Usuário não encontrado');
              }
              return user;
          } catch (err) {
              console.error('Erro ao buscar o usuário:', err);
              throw new GraphQLError('Erro ao buscar o usuário');
          }
      },
  },

  Mutation: {
      createUser: async (_, { username, password }) => {
          try {
              const newUser = new User({ username, password });
              await newUser.save();
              return newUser;
          } catch (err) {
              console.error('Erro ao criar o usuário:', err);
              throw new GraphQLError('Erro ao criar o usuário');
          }
      },

      login: async (_, { username, password }) => {
          try {
              const user = await User.findOne({ username });
              if (!user || user.password !== password) {
                  throw new GraphQLError('Usuário ou senha inválidos');
              }
              return { token: 'fake-jwt-token' }; // Exemplo simples, implemente sua lógica de token
          } catch (err) {
              throw new GraphQLError('Erro ao realizar login');
          }
      },
  },

  Subscription: {
      notificacaoNovoRegistro: {
          subscribe: (_, __, { pubsub }) => {
              return pubsub.asyncIterator('NOTIFICACAO_NOVO_REGISTRO');
          },
      },
  },
};

const gestacaoResolver = {
  Query: {
      gestacaoPorUsuario: async (_, { usuarioId }) => {
          try {
              const gestacao = await Gestacao.findOne({ usuarioId });
              if (!gestacao) {
                  throw new GraphQLError('Nenhuma gestação encontrada para este usuário');
              }
              return gestacao;
          } catch (err) {
              throw new GraphQLError('Erro ao buscar informações de gestação');
          }
      },
  },

  Mutation: {
      createGestacao: async (_, { usuarioId, ultimaMenstruacao }) => {
          try {
              const gestacao = new Gestacao({ usuarioId, ultimaMenstruacao });
              await gestacao.save();
              return gestacao;
          } catch (err) {
              throw new GraphQLError('Erro ao criar nova gestação');
          }
      },
  },
};

const gravidezResolver = {
  Query: {
      dadosGravidezPorUsuario: async (_, { usuarioId }) => {
          try {
              const dados = await Gravidez.find({ usuarioId });
              return dados;
          } catch (err) {
              throw new GraphQLError('Erro ao buscar dados de gravidez');
          }
      },
  },

  Mutation: {
      createGravidez: async (_, { usuarioId, semana, peso, comprimento, dataRegistro }) => {
          try {
              const newGravidez = new Gravidez({
                  usuarioId,
                  semana,
                  peso,
                  comprimento,
                  dataRegistro,
              });

              await newGravidez.save();

              // Publicar evento após criar o dado de gravidez
              pubsub.publish('NOTIFICACAO_NOVO_REGISTRO', {
                  notificacaoNovoRegistro: newGravidez,
              });

              return newGravidez;
          } catch (err) {
              throw new GraphQLError('Erro ao criar dados de gravidez');
          }
      },
  },
};

import { mergeResolvers } from '@graphql-tools/merge';
export const resolvers = mergeResolvers([userResolver, gestacaoResolver, gravidezResolver]);
