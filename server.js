import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from
    '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
// NEW
import 'dotenv/config';
import { connectDB } from './models/db.js';

// UPDATED
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";

// NEW
import jwt from 'jsonwebtoken';
import cors from 'cors';


// Criar o esquema executável
const schema = makeExecutableSchema({ typeDefs, resolvers })

// Configurar o servidor Express
const app = express();
const httpServer = http.createServer(app);

// Adicionar o middleware para analisar JSON antes do middleware do Apollo Server
app.use(express.json());
// NEW: adicionar o middleware CORS
app.use(cors());

// Inicializar o servidor Apollo
const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
});

// conectar à base de dados MongoDB
connectDB();

// Iniciar o servidor
const startServer = async () => {
    await server.start();
    app.use('/graphql',
        expressMiddleware(server, {
            // Context and contextValue:  Sharing information and request details throughout your server
            // https://www.apollographql.com/docs/apollo-server/data/context
            context: async ({ req }) => {
                const token = req.headers.authorization || '';
                let payload = null;
                try {
                    payload = jwt.verify(token, process.env.JWT_SECRET);
                    return { loggedIn: true, user: payload }
                } catch (err) {
                    return { loggedIn: false, user: null }
                }
            },
        })
    );
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
