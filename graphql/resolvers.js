import { PubSub } from 'graphql-subscriptions';
import { GraphQLError } from 'graphql';

import Post from '../models/Post.js';
import User from '../models/User.js';

import jwt from 'jsonwebtoken';
// import { bcrypt } from 'bcryptjs'; // TODO

const pubsub = new PubSub();

const postResolver = {
    Query: {
        // implementar a função posts que retorna todos os posts 
        // (com paginação: offset-based pagination
        //      limit: número máximo de posts a retornar
        //      offset: número de posts a ignorar )
        posts: async (_, { limit = 10, offset = 0 }) => {
            // console.log(limit, offset)
            return await Post.find().populate('author').skip(offset).limit(limit);
        }
        ,
        // implementar a função posts que retorna todos os posts 
        // (com paginação: cursor-based pagination
        //      limit: número máximo de posts a retornar
        //      cursor: apontador para o 1º post retornado )
        posts_byCursor: async (_, { limit = 10, cursor }) => {
            let query = {};
            // Se um cursor for fornecido, adicione-o à consulta 
            if (cursor) {
                query._id = { $gt: cursor };
            }
            // Buscar Posts usando a consulta baseada em cursor 
            const posts = await Post.find(query).limit(limit);
       
            // Extrair o cursor seguinte e anterior do resultado 
            const prevCursor = cursor && posts.length > 0 ? posts[0]._id : null;
            // cursor do último post retornado (para a próxima página)
            const nextCursor = posts.length > 0 ? posts[posts.length - 1]._id : null;

            return { posts, prevCursor, nextCursor };
        }
        ,
    },
    Mutation: {
        createPost: async (_, { title, content }, contextValue) => {
            if (!contextValue.user) {
                throw new GraphQLError('User is not authenticated', {
                    extensions: {
                        code: 'UNAUTHORIZED',
                        http: { status: 401 },
                    }
                });
            };
            let user = await User.findById(contextValue.user.id);
            const post = new Post({ title, content, author: user });
            await post.save();

            pubsub.publish('NOVO_POST_ADICIONADO', { novoPostAdicionado: post });
            return post;
        },
    },
    Subscription: {
        novoPostAdicionado: {
            subscribe: () => pubsub.asyncIterableIterator(['NOVO_POST_ADICIONADO'])
        },
    }
};

const userResolver = {
    Query: {
        me: async (_, { }, contextValue) => {
            if (contextValue.loggedIn) {
                let user = await User.findById(contextValue.user.id);
                return user
            } else {
                throw new GraphQLError('Please login again', {
                    extensions: {
                        code: 'UNAUTHORIZED',
                        http: { status: 401 },
                    }
                });
            }
        },
        users: async () => await User.find(),
    },
    Mutation: {
        // async parameters: parent, args, context, info
        register: async (_, { username, password }) => {
            //TODO: encriptação da password e erro duplicação do username
            const user = new User({ username, password }); 
            await user.save();
            return user;
        },


        // create a mutation for user login
        login: async (_, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User not found');
            }

            // const check = bcrypt.compareSync(
            // password, user.password
            // );
            const check = password === user.password;
            if (!check) {
                throw new Error('Invalid password');
            }
            const token = jwt.sign({ id: user.id },
                process.env.JWT_SECRET, {
                expiresIn: '1h' // 1 hour
            });
            return token;
        }

    },
};
import { mergeResolvers } from '@graphql-tools/merge';
export const resolvers = mergeResolvers([userResolver, postResolver]);



// export const resolvers = {
// Query: {
// listarSeries: () => series, // Lista todas as séries
// obterSeriesPorGenero: (_, { genero }) => series.filter(s => s.genero === genero),
// obterSeriesComMaisDeXEpisodios: (_, { numero }) =>
// series.filter(s => s.episodios.length > numero),
// identificarSerieComMaisEpisodios: () =>
// series.reduce((max, s) => (s.episodios.length > max.episodios.length ? s : max), series[0]),
// identificarSerieComMaiorDuracao: () =>
// series.reduce((max, s) => {
// const totalDuracao = s.episodios.reduce((sum, e) => sum + e.duracao, 0);
// return totalDuracao > max.duracao ? { ...s, duracao: totalDuracao } : max;
// }, { duracao: 0 })
// },
// Mutation: {
// adicionarSerie: (_, { titulo, descricao, ano, genero }) => {
// const novaSerie = { id: series.length + 1, titulo, descricao, ano, genero, episodios: [] };
// series.push(novaSerie);
// pubsub.publish('NOVA_SERIE_ADICIONADA', { novaSerieAdicionada: novaSerie });
// return novaSerie;
// },
// atualizarSerie: (_, { id, ...updates }) => {
// const serie = series.find(s => s.id === id);
// if (!serie) throw new Error("Série não encontrada");
// Object.assign(serie, updates);
// return serie;
// },
// removerSerie: (_, { id }) => {
// const index = series.findIndex(s => s.id === id);
// if (index === -1) throw new Error("Série não encontrada");
// return series.splice(index, 1)[0];
// },
// adicionarEpisodio: (_, { serieId, titulo, duracao, numero }) => {
// const serie = series.find(s => s.id === serieId);
// if (!serie) throw new Error("Série não encontrada");
// const novoEpisodio = { id: serie.episodios.length + 1, titulo, duracao, numero, serieId };
// serie.episodios.push(novoEpisodio);
// pubsub.publish('EPISODIO_ADICIONADO_REMOVIDO', { episodioAdicionadoRemovido: novoEpisodio });
// return novoEpisodio;
// },
// atualizarEpisodio: (_, { id, ...updates }) => {
// let episodio;
// for (const serie of series) {
// episodio = serie.episodios.find(e => e.id === id);
// if (episodio) break;
// }
// if (!episodio) throw new Error("Episódio não encontrado");
// Object.assign(episodio, updates);
// return episodio;
// },
// removerEpisodio: (_, { id }) => {
// for (const serie of series) {
// const index = serie.episodios.findIndex(e => e.id === id);
// if (index !== -1) {
// const [episodioRemovido] = serie.episodios.splice(index, 1);
// pubsub.publish('EPISODIO_ADICIONADO_REMOVIDO', { episodioAdicionadoRemovido: episodioRemovido });
// return episodioRemovido;
// }
// }
// throw new Error("Episódio não encontrado");
// }
// },
// Subscription: {
// novaSerieAdicionada: {
// subscribe: () => pubsub.asyncIterableIterator(['NOVA_SERIE_ADICIONADA'])
// },
// episodioAdicionadoRemovido: {
// subscribe: () => pubsub.asyncIterableIterator(['EPISODIO_ADICIONADO_REMOVIDO'])
// }
// }
// }
