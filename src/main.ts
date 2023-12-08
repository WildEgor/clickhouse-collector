import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { ConsumerConfig } from './infrastructure/configs/consumer.config';
import { AppConfig } from './infrastructure/configs/app.config';

const bootstrap = async (): Promise<void> => {
	const fastifyAdapter = new FastifyAdapter();
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);

	const logger = new Logger('Bootstrap');

	app.enableCors();
	app.setGlobalPrefix('api');
	app.enableVersioning({
		type: VersioningType.URI,
	});

	const appConfig = app.get<AppConfig>(AppConfig);
	const consumerConfig = app.get<ConsumerConfig>(ConsumerConfig);

	app.connectMicroservice({
		...consumerConfig.options,
		inheritAppConfig: true,
	});

	await app.startAllMicroservices();

	await app.listen(appConfig.port, '0.0.0.0', (_, address) => {
		logger.debug(`Service available on ${address}`);
	});
};

bootstrap().catch((e) => {
	throw e;
});
