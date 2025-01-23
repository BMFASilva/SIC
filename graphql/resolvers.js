import { PubSub } from 'graphql-subscriptions';
import { series } from "../data.js";

const pubsub = new PubSub();

export const resolvers = {
    Query: {
        listarSeries: () => series, // Lista todas as séries
        obterSeriesPorGenero: (_, { genero }) => series.filter(s => s.genero === genero),
        obterSeriesComMaisDeXEpisodios: (_, { numero }) =>
            series.filter(s => s.episodios.length > numero),
        identificarSerieComMaisEpisodios: () =>
            series.reduce((max, s) => (s.episodios.length > max.episodios.length ? s : max), series[0]),
        identificarSerieComMaiorDuracao: () =>
            series.reduce((max, s) => {
                const totalDuracao = s.episodios.reduce((sum, e) => sum + e.duracao, 0);
                return totalDuracao > max.duracao ? { ...s, duracao: totalDuracao } : max;
            }, { duracao: 0 })
    },
    Mutation: {
        adicionarSerie: (_, { titulo, descricao, ano, genero }) => {
            const novaSerie = { id: series.length + 1, titulo, descricao, ano, genero, episodios: [] };
            series.push(novaSerie);
            pubsub.publish('NOVA_SERIE_ADICIONADA', { novaSerieAdicionada: novaSerie });
            return novaSerie;
        },
        atualizarSerie: (_, { id, ...updates }) => {
            const serie = series.find(s => s.id === id);
            if (!serie) throw new Error("Série não encontrada");
            Object.assign(serie, updates);
            return serie;
        },
        removerSerie: (_, { id }) => {
            const index = series.findIndex(s => s.id === id);
            if (index === -1) throw new Error("Série não encontrada");
            return series.splice(index, 1)[0];
        },
        adicionarEpisodio: (_, { serieId, titulo, duracao, numero }) => {
            const serie = series.find(s => s.id === serieId);
            if (!serie) throw new Error("Série não encontrada");
            const novoEpisodio = { id: serie.episodios.length + 1, titulo, duracao, numero, serieId };
            serie.episodios.push(novoEpisodio);
            pubsub.publish('EPISODIO_ADICIONADO_REMOVIDO', { episodioAdicionadoRemovido: novoEpisodio });
            return novoEpisodio;
        },
        atualizarEpisodio: (_, { id, ...updates }) => {
            let episodio;
            for (const serie of series) {
                episodio = serie.episodios.find(e => e.id === id);
                if (episodio) break;
            }
            if (!episodio) throw new Error("Episódio não encontrado");
            Object.assign(episodio, updates);
            return episodio;
        },
        removerEpisodio: (_, { id }) => {
            for (const serie of series) {
                const index = serie.episodios.findIndex(e => e.id === id);
                if (index !== -1) {
                    const [episodioRemovido] = serie.episodios.splice(index, 1);
                    pubsub.publish('EPISODIO_ADICIONADO_REMOVIDO', { episodioAdicionadoRemovido: episodioRemovido });
                    return episodioRemovido;
                }
            }
            throw new Error("Episódio não encontrado");
        }
    },
    Subscription: {
        novaSerieAdicionada: {
            subscribe: () => pubsub.asyncIterableIterator(['NOVA_SERIE_ADICIONADA'])
        },
        episodioAdicionadoRemovido: {
            subscribe: () => pubsub.asyncIterableIterator(['EPISODIO_ADICIONADO_REMOVIDO'])
        }
    }
}
