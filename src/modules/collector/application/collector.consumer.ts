import { ConsumerController } from '../../../shared/decorators/consumer.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaxiTripPayloadDto } from '../infrastructure/dtos/taxi-trip.dto';
import { Logger } from '@nestjs/common';

@ConsumerController()
export class CollectorConsumer {
	private readonly logger: Logger;

	constructor() {
		this.logger = new Logger(CollectorConsumer.name);
	}

	@MessagePattern('taxi_analytics')
	public async collectTaxiAnalytics(@Payload() data: TaxiTripPayloadDto) {
		this.logger.debug(data);
	}
}
