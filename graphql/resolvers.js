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
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const newUser = new User({
                    username,
                    password: hashedPassword,
                });

                console.log('Novo usuário criado:', newUser);

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
                if (!user) {
                    throw new GraphQLError('Usuário ou senha inválidos');
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new GraphQLError('Usuário ou senha inválidos');
                }

                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return { token };
            } catch (err) {
                console.error('Erro ao realizar login:', err);
                throw new GraphQLError('Erro ao realizar login');
            }
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
                console.error('Erro ao buscar informações de gestação:', err);
                throw new GraphQLError('Erro ao buscar informações de gestação');
            }
        },
    },

    Mutation: {
        createGestacao: async (_, { usuarioId, ultimaMenstruacao }) => {
            try {
                const dataInicio = new Date(ultimaMenstruacao);
                const duracaoEstimativa = 40;
                const dataTerminoPrevisto = new Date(dataInicio);
                dataTerminoPrevisto.setDate(dataTerminoPrevisto.getDate() + duracaoEstimativa * 7);

                const existingGestacao = await Gestacao.findOne({ usuarioId });
                if (existingGestacao) {
                    throw new GraphQLError('Gestação já existe para este usuário');
                }

                const newGestacao = new Gestacao({
                    usuarioId,
                    ultimaMenstruacao,
                    dataInicio,
                    duracaoEstimativa,
                    dataTerminoPrevisto,
                });

                console.log('Nova gestação criada:', newGestacao);

                await newGestacao.save();
                return newGestacao;
            } catch (err) {
                console.error('Erro ao criar gestação:', err);
                throw new GraphQLError('Erro ao criar informações de gestão de gravidez');
            }
        },

        updateGestacao: async (_, { usuarioId, ultimaMenstruacao }) => {
            try {
                const dataInicio = new Date(ultimaMenstruacao);
                const duracaoEstimativa = 40;
                const dataTerminoPrevisto = new Date(dataInicio);
                dataTerminoPrevisto.setDate(dataTerminoPrevisto.getDate() + duracaoEstimativa * 7);

                const gestacao = await Gestacao.findOne({ usuarioId });
                if (!gestacao) {
                    throw new GraphQLError('Gestação não encontrada para este usuário');
                }

                gestacao.ultimaMenstruacao = ultimaMenstruacao;
                gestacao.dataInicio = dataInicio;
                gestacao.duracaoEstimativa = duracaoEstimativa;
                gestacao.dataTerminoPrevisto = dataTerminoPrevisto;

                console.log('Gestação atualizada:', gestacao);

                await gestacao.save();
                return gestacao;
            } catch (err) {
                console.error('Erro ao atualizar gestação:', err);
                throw new GraphQLError('Erro ao atualizar informações de gestão de gravidez');
            }
        },
    },
};

const gravidezResolver = {
    Query: {
        dadosGravidezPorUsuario: async (_, { usuarioId }) => {
            try {
                const dados = await Gravidez.find({ usuarioId });
                if (!dados.length) {
                    throw new GraphQLError('Nenhum dado de gravidez encontrado para este usuário');
                }
                return dados;
            } catch (err) {
                console.error('Erro ao buscar dados de gravidez:', err);
                throw new GraphQLError('Erro ao buscar dados de gravidez');
            }
        },
    },

    Mutation: {
        createGravidez: async (_, { gestacaoId, semana, peso, comprimento, dataRegistro }) => {
            try {
                const newGravidez = new Gravidez({
                    gestacaoId,
                    semana,
                    peso,
                    comprimento,
                    dataRegistro,
                });

                console.log('Novo dado de gravidez criado:', newGravidez);

                await newGravidez.save();
                return newGravidez;
            } catch (err) {
                console.error('Erro ao criar dados de gravidez:', err);
                throw new GraphQLError('Erro ao criar dados de gravidez');
            }
        },
    },
};

import { mergeResolvers } from '@graphql-tools/merge';
export const resolvers = mergeResolvers([userResolver, gestacaoResolver, gravidezResolver]);
