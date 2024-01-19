import 'reflect-metadata';
import compress from 'compression';
// import { Apm } from './apm';
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
import { UpdateTransactionCommandHandler } from '../contexts/TransactionProcessing/application/commands/UpdateTransactionCommandHandler';

import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../contexts/shared/infrastructure/orm/prisma/PrismaService';
import { ITransactionRepository } from '../contexts/TransactionProcessing/domain/interfaces/ITransactionRepository';
import { TransactionRepository } from '../contexts/TransactionProcessing/infraestructure/repositories/TransactionRepository';
import { EventBusToken, InMemoryAsyncEventBus } from '../contexts/shared/infrastructure/eventBus/inmemory/InMemoryAsyncEventBus';
import { DomainEvent, DomainEventSubscriber } from '../contexts/shared/domain/events';
import { TransactionUpdateSubscriber, TransactionUpdateSubscriberToken } from '../contexts/TransactionProcessing/application/event-handlers/TransactionUpdatedSubscriber';
import { KafkaService, KafkaServiceToken } from '../contexts/shared/infrastructure/kafka/KafkaService';
import { Kafka } from 'kafkajs';
import { KafkaConsumerServiceToken } from '../contexts/TransactionProcessing/infraestructure/messaging/KafkaConsumerService';
import { KafkaConsumerService } from '../contexts/TransactionProcessing/infraestructure/messaging/KafkaConsumerService';
import { FraudValidationDomainServiceToken } from '../contexts/TransactionProcessing/domain/services/FraudValidationDomainService';
import { FraudValidationDomainService } from '../contexts/TransactionProcessing/domain/services/FraudValidationDomainService';

const PrismaClientToken = new Token<PrismaClient>();
const UpdateTransactionCommandHandlerToken = new Token<UpdateTransactionCommandHandler>();
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
        const kafkaTopic = process.env.KAFKA_TOPIC_UPDATE; 
        const useTransactions = process.env.KAFKA_USE_TRANSACTIONS === 'true';
        const isIdempotent = process.env.KAFKA_IS_IDEMPOTENT === 'true'; 
        const kafkaInstance = new Kafka({
            clientId: 'mi-cliente-kafka',
            brokers: kafkaBroker.split(',')
        });

        Container.set('KafkaInstance', kafkaInstance);
        Container.set('KafkaTopic', kafkaTopic);

        Container.set(KafkaServiceToken, new KafkaService(
            kafkaInstance,
            useTransactions,
            isIdempotent
        )); 
 
        Container.set(PrismaClientToken, new PrismaService());
        Container.set(TransactionRepositoryToken, new TransactionRepository(Container.get(PrismaClientToken)));
        Container.set(FraudValidationDomainServiceToken, new FraudValidationDomainService());
        const subscribers: Array<DomainEventSubscriber<DomainEvent>> = [];
        Container.set(EventBusToken, new InMemoryAsyncEventBus(subscribers));
        Container.set(UpdateTransactionCommandHandlerToken, new UpdateTransactionCommandHandler(
            Container.get(TransactionRepositoryToken)
        ));

        const transactionUpdateSubscriber = new TransactionUpdateSubscriber(
           Container.get(UpdateTransactionCommandHandlerToken)
        );
        Container.set(TransactionUpdateSubscriberToken, transactionUpdateSubscriber);
        subscribers.push(transactionUpdateSubscriber);

        const eventBus = Container.get(EventBusToken) as InMemoryAsyncEventBus;
        eventBus.addSubscribers([new TransactionUpdateSubscriber(Container.get(UpdateTransactionCommandHandlerToken))]);
        Container.set(KafkaConsumerServiceToken, new KafkaConsumerService(
            Container.get(KafkaServiceToken),
            Container.get(EventBusToken),
            kafkaTopic
        ));
          
    }
     

    async listen(): Promise<void> {

        const httpsOptions = await this.getHttpsOptions();

        return new Promise((resolve, reject) => {
            this.httpsServer = https.createServer(httpsOptions, this.express);
            this.httpsServer.listen(this.port, () => {
                log.info(`${this.appName} App is running at https://localhost:${this.port} in ${this.enviroment} mode`);

                const kafkaConsumerService = Container.get<KafkaConsumerService>(KafkaConsumerServiceToken);
                kafkaConsumerService.start()
                    .then(() => {
                        log.info("KafkaConsumerService ha iniciado la escucha de mensajes.");
                    })
                    .catch(error => {
                    });

                resolve();
            });

            this.httpsServer.on('error', reject);
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

