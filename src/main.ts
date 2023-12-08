import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';

const bootstrap = async (): Promise<void> => {
	const fastifyAdapter = new FastifyAdapter();
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);

	const logger = new Logger('Bootstrap');

	app.enableCors();
	app.setGlobalPrefix('api');
	app.enableVersioning({
		type: VersioningType.URI,
	});

	await app.listen('8080', '0.0.0.0', (_, address) => {
		logger.debug(`Service available on ${address}`);
	});
};

bootstrap();
