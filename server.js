import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import 'dotenv/config';
import { connectDB } from './models/db.js';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { PubSub } from 'graphql-subscriptions';  // Importar o PubSub

// Criar o esquema executável
const schema = makeExecutableSchema({ typeDefs, resolvers });
const pubsub = new PubSub();  // Instanciar PubSub para subscrições

// Configurar o servidor Express
const app = express();
const httpServer = http.createServer(app);

// Adicionar o middleware para analisar JSON antes do middleware do Apollo Server
app.use(express.json());
// Adicionar o middleware CORS
app.use(cors());

// Inicializar o servidor Apollo
const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
    context: async ({ req }) => {
        const token = req.headers.authorization || '';
        let payload = null;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
            return { loggedIn: true, user: payload, pubsub }; // Passar o pubsub no contexto
        } catch (err) {
            return { loggedIn: false, user: null, pubsub };
        }
    },
});

// Conectar à base de dados MongoDB
connectDB();

// Iniciar o servidor
const startServer = async () => {
    await server.start();
    app.use('/graphql', expressMiddleware(server, {
        context: ({ req }) => {
            const token = req.headers.authorization || '';
            let payload = null;
            try {
                payload = jwt.verify(token, process.env.JWT_SECRET);
                return { loggedIn: true, user: payload };
            } catch (err) {
                return { loggedIn: false, user: null };
            }
        },
    }));

    // Configurar o servidor WebSocket para subscrições
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });
    useServer({ schema, context: () => ({ pubsub }) }, wsServer);

    const PORT = 4000;
    httpServer.listen(PORT, () => {
        console.log(`Servidor pronto em http://localhost:${PORT}/graphql`);
    });
};
startServer();
