import { Module } from '@nestjs/common';
import { CollectorConsumer } from './application/collector.consumer';
import { AnalyticsRepository } from './infrastructure/repositories/analytics.repository';
import { InjectTypes } from '../../infrastructure/types/inject';

@Module({
	controllers: [CollectorConsumer],
	providers: [
		{
			provide: InjectTypes.AnalyticsRepository,
			useClass: AnalyticsRepository,
		},
	],
})
export class CollectorModule {}
