import { Injectable } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { ConfiguratorService, InjectConfigurator } from '../../shared/modules/configurator';
import { RmqOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';

@Injectable()
export class ConsumerConfig {
	public readonly options: RmqOptions;

	constructor(@InjectConfigurator() protected readonly configurator: ConfiguratorService) {
		const urls = configurator.getString('RMQ_HOST').split(',');
		const queue = configurator.getString('RMQ_QUEUE');

		this.options = {
			transport: Transport.RMQ,
			options: {
				urls: urls,
				queue: queue,
				queueOptions: {
					durable: true,
				},
			},
		};
	}
}
