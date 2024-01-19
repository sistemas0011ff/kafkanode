import 'reflect-metadata';
import compress from 'compression'; 
import './apm';
import express, { Request, Response } from 'express';
import Router from 'express-promise-router';
import rtracer from 'cls-rtracer';
import helmet from 'helmet';
import cors from 'cors'; 
import * as https from 'https';  
import httpStatus from 'http-status';
import { registerRoutes } from './routes';
import { Logger, LoggerPino } from './logger';
import { Uuid } from '../contexts/shared/domain/valueobject/Uuid';
import { errorHandler } from './middlewares/errorHandler';
import xmlparser from 'express-xml-bodyparser';
import { Container, Token } from 'typedi';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import { InitiateTransactionResolvers } from './resolvers/InitiateTransactionResolvers'; 
import { TransactionService } from '../contexts/transaction/application/services/TransactionService';
import { IInitiateTransactionService } from '../contexts/transaction/application/interfaces/IInitiateTransactionService';
import { ICreateTransactionUseCase } from '../contexts/transaction/application/interfaces/ICreateTransactionUseCase';
import { CreateTransactionUseCase } from '../contexts/transaction/application/usecases/CreateTransactionUseCase';
import { CreateTransactionCommandHandler } from '../contexts/transaction/application/commands/CreateTransactionCommandHandler';

import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../contexts/shared/infrastructure/orm/prisma/PrismaService';
import { GetTransactionByIdUseCase, IGetTransactionByIdUseCaseToken } from '../contexts/transaction/application/usecases/GetTransactionByIdUseCase';
import { TransactionRepository } from '../contexts/transaction/infraestructure/repositories/TransactionRepository';
import { GetTransactionByIdQueryHandlerToken } from '../contexts/transaction/application/queries/GetTransactionByIdQueryHandler';
import { GetTransactionByIdQueryHandler } from '../contexts/transaction/application/queries/GetTransactionByIdQueryHandler';
import { IGetAllTransactionsUseCaseToken } from '../contexts/transaction/application/usecases/GetAllTransactionsUseCase';
import { GetAllTransactionsUseCase } from '../contexts/transaction/application/usecases/GetAllTransactionsUseCase';
import { GetAllTransactionsQueryHandlerToken } from '../contexts/transaction/application/queries/GetAllTransactionsQueryHandler';
import { GetAllTransactionsQueryHandler } from '../contexts/transaction/application/queries/GetAllTransactionsQueryHandler';
import { EventBusToken, InMemoryAsyncEventBus } from '../contexts/shared/infrastructure/eventBus/inmemory/InMemoryAsyncEventBus';
import { DomainEvent, DomainEventSubscriber } from '../contexts/shared/domain/events';
import { TransactionCreatedSubscriberToken } from '../contexts/transaction/application/event-handlers/TransactionCreatedSubscriber';
import { KafkaService, KafkaServiceToken } from '../contexts/shared/infrastructure/kafka/KafkaService';
import { Kafka } from 'kafkajs';
import { ITransactionRepository } from '../contexts/transaction/domain/interfaces/ITransactionRepository';

const PrismaClientToken = new Token<PrismaClient>();
const IInitiateTransactionServiceToken = new Token<IInitiateTransactionService>();
const ICreateTransactionUseCaseToken = new Token<ICreateTransactionUseCase>();
const CreateTransactionCommandHandlerToken = new Token<CreateTransactionCommandHandler>();
const TransactionRepositoryToken = new Token<ITransactionRepository>();

export class Server {
 
    private express: express.Express;
    private appName: string;
    private enviroment: string;
    private basePath: string;
    private port: string; 
    private httpsServer?: https.Server;  
    private log: Logger = new Logger(LoggerPino.create());

    constructor(appName: string, basePath: string, port: string, enviroment: string) {
        this.log.initializer();
        this.appName = appName;
        this.basePath = basePath;

        this.port = port;
        this.enviroment = enviroment;
        this.express = express();
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(cors());
        this.express.use(express.json());
        this.express.use(xmlparser()); //para xml
        this.express.use(helmet.xssFilter());
        this.express.use(helmet.noSniff());
        this.express.use(helmet.hidePoweredBy());
        this.express.use(helmet.frameguard({ action: 'deny' }));
        this.express.use(
            rtracer.expressMiddleware({
                requestIdFactory: (req: any) => {
                    const uuid = Uuid.random().toString();
                    return {
                        uniqueId: req.headers['x-request-id'] || uuid,
                        trackId: uuid
                    };
                }
            })
        );
        this.express.use(compress());
        const router = Router();
        this.express.use(this.basePath, router);

        registerRoutes(router);

        router.use((err: Error, req: Request, res: Response, next: Function) => {
            log.error(err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
        });

        this.express.use(errorHandler);   

        const kafkaBroker = process.env.KAFKA_BROKER;
        const kafkaTopic = process.env.KAFKA_TOPIC;
        const useTransactions = process.env.KAFKA_USE_TRANSACTIONS === 'true';
        const isIdempotent = process.env.KAFKA_IS_IDEMPOTENT === 'true';

        const kafkaInstance = new Kafka({
        clientId: 'mi-cliente-kafka',
        brokers: kafkaBroker.split(',')
        });

        Container.set(KafkaServiceToken, new KafkaService(
            kafkaInstance,
            kafkaTopic,
            useTransactions, 
            isIdempotent
          ));
 
  
        Container.set(PrismaClientToken, new PrismaService());
        Container.set(TransactionRepositoryToken, new TransactionRepository(Container.get(PrismaClientToken)));
 
        Container.set(GetTransactionByIdQueryHandlerToken, new GetTransactionByIdQueryHandler(Container.get(TransactionRepositoryToken)));
        Container.set(GetAllTransactionsQueryHandlerToken, new GetAllTransactionsQueryHandler(Container.get(TransactionRepositoryToken)));
 
        Container.set(TransactionCreatedSubscriberToken, Container.get(TransactionCreatedSubscriberToken));
 
        const subscribers: Array<DomainEventSubscriber<DomainEvent>> = [
            Container.get(TransactionCreatedSubscriberToken)
        ];
        Container.set(EventBusToken, new InMemoryAsyncEventBus(subscribers));
 
        Container.set(CreateTransactionCommandHandlerToken, new CreateTransactionCommandHandler(
            Container.get(TransactionRepositoryToken),
            Container.get(EventBusToken)  
        ));
        Container.set(ICreateTransactionUseCaseToken, new CreateTransactionUseCase(Container.get(CreateTransactionCommandHandlerToken)));   
        Container.set(IGetTransactionByIdUseCaseToken, new GetTransactionByIdUseCase(Container.get(GetTransactionByIdQueryHandlerToken)));
        Container.set(IGetAllTransactionsUseCaseToken, new GetAllTransactionsUseCase(Container.get(GetAllTransactionsQueryHandlerToken)));
        Container.set(IInitiateTransactionServiceToken, new TransactionService(
            Container.get(ICreateTransactionUseCaseToken),
            Container.get(IGetTransactionByIdUseCaseToken),
            Container.get(IGetAllTransactionsUseCaseToken)
        ));
  
        Container.set(InitiateTransactionResolvers, new InitiateTransactionResolvers(Container.get(IInitiateTransactionServiceToken)));

    }
     
    async listen(): Promise<void> {
        const schema = await buildSchema({
            resolvers: [InitiateTransactionResolvers],
            container: Container,  
        });
        const server = new ApolloServer({ schema });
        await server.start();
        server.applyMiddleware({ app: this.express });  
       
        const httpsOptions = await this.getHttpsOptions();

        return new Promise((resolve, reject) => {
            this.httpsServer = https.createServer(httpsOptions, this.express);
            this.httpsServer.on('error', reject);
            this.httpsServer.listen(this.port, () => {
                log.info(`${this.appName} App is running at https://localhost:${this.port}${server.graphqlPath} in ${this.enviroment} mode`);
                resolve();
            });
        });
    }
 
    getHTTPSServer() {
        return this.httpsServer;
    }
 
    async getHttpsOptions() {
        const key = await this.getRemoteFile(process.env.SSL_KEY_URL);
        const cert = await this.getRemoteFile(process.env.SSL_CERT_URL);
        return {
            key,
            cert
        };
    }

    async getRemoteFile(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            https.get(url, res => {
                let data = '';

                res.on('data', chunk => {
                    data += chunk;
                });

                res.on('end', () => {
                    resolve(data);
                });
            }).on('error', err => {
                reject(err);
            });
        });
    }

    async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.httpsServer) {
                this.httpsServer.close(error => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve();
                });
            }

            return resolve();
        });
    }
    
}

