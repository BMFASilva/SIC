import { PubSub } from 'graphql-subscriptions';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Gestacao from '../models/GestaoGravidez.js';
import Gravidez from '../models/Gravidez.js';
import GravidezMedia from '../models/GravidezMedia.js';

const pubsub = new PubSub();


const userResolver = {
  Query: {
    users: async () => {
      try {
        return await User.find();
      } catch (err) {
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
        throw new GraphQLError('Erro ao buscar o usuário');
      }
    },
  },

  Mutation: {
    createUser: async (_, { username, password }) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        return newUser;
      } catch (err) {
        throw new GraphQLError('Erro ao criar o usuário');
      }
    },

    login: async (_, { username, password }) => {
      try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new GraphQLError('Usuário ou senha inválidos');
        }
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Verifica o último registro de gravidez
        const ultimoRegistro = await Gravidez.findOne({ usuarioId: user.id }).sort({ dataRegistro: -1 });
        let notificacao = null;
        
        if (ultimoRegistro) {
          const umaSemanaAtras = new Date();
          umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7); // 7 dias atrás
    
          if (new Date(ultimoRegistro.dataRegistro) < umaSemanaAtras) {
            notificacao = {
              mensagem: 'Já passou uma semana desde o último registro de gravidez. Atualize os dados.',
              usuarioId: user.id,
            };
    
            // Publica a notificação para os inscritos
            pubsub.publish('NOTIFICACAO_NOVO_REGISTRO', {
              notificacaoNovoRegistro: notificacao,
            });
          }
        }
        
        return { token, user, notificacao };
      } catch (err) {
        throw new GraphQLError('Erro ao realizar login');
      }
    }
    
    
  },
  Subscription: {
    notificacaoNovoRegistro: {
      subscribe: () => pubsub.asyncIterableIterator(['NOTIFICACAO_NOVO_REGISTRO'])
    }
  }
  
  ,
};


const gestacaoResolver = {
  Query: {
    gestacaoPorUsuario: async (_, { usuarioId }) => {
      try {
          const gestacao = await Gestacao.findOne({ usuarioId: usuarioId });
          return gestacao;
      } catch (err) {
          throw new Error('Erro ao buscar gestação');
      }
  },
  },

  Mutation: {
    createGestacao: async (_, { usuarioId, ultimaMenstruacao }) => {
      try {
        const ultimaMenstruacaoDate = new Date(ultimaMenstruacao);
        
        const dataTerminoPrevisto = new Date(ultimaMenstruacaoDate);
        dataTerminoPrevisto.setDate(ultimaMenstruacaoDate.getDate() + 280);
        const gestacao = await Gestacao.create({
          usuarioId,
          ultimaMenstruacao: ultimaMenstruacaoDate,
          dataTerminoPrevisto,
        });
    
        return gestacao;
      } catch (error) {
        throw new Error("Erro ao criar nova gestação");
      }
    }
  },
};

const gravidezResolver = {
  Query: {
    dadosGravidezPorUsuario: async (_, { usuarioId }) => {
      try {
        return await Gravidez.find({ usuarioId });
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

        pubsub.publish('NOTIFICACAO_NOVO_REGISTRO', {
          notificacaoNovoRegistro: {
            mensagem: 'Novo registro de gravidez adicionado.',
            usuarioId: usuarioId,
          },
        });

        return newGravidez;
      } catch (err) {
        throw new GraphQLError('Erro ao criar dados de gravidez');
      }
    },
  },
};

const gravidezMedia = {
  Query: {
      gravidezMediaPorSemana: async (_, { semana }) => {
          return await GravidezMedia.findOne({ semana });
      }
  }
};

import { mergeResolvers } from '@graphql-tools/merge';

export const resolvers = mergeResolvers([userResolver, gestacaoResolver, gravidezResolver, gravidezMedia]);
