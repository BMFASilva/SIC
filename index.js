import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from
    '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';


import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";

// Criar o esquema executável
const schema = makeExecutableSchema({ typeDefs, resolvers })

// Configurar o servidor Express
const app = express();
const httpServer = http.createServer(app);

// Adicionar o middleware para analisar JSON antes do middleware do Apollo Server
app.use(express.json());

// Inicializar o servidor Apollo
const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
});

// Iniciar o servidor
const startServer = async () => {
    await server.start();
    app.use('/graphql', expressMiddleware(server));
    // Configurar o servidor WebSocket para subscrições
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });
    useServer({ schema }, wsServer);
    const PORT = 4000;
    httpServer.listen(PORT, () => {
        console.log(`Servidor pronto em http://localhost:${PORT}/graphql`);
    });
};
startServer();
