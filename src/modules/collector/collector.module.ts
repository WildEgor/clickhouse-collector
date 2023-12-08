import { Module } from '@nestjs/common';
import { ClickhouseModule } from '../../infrastructure/adapters/clickhouse';
import { ConfigsModule } from '../../infrastructure/configs/configs.module';
import { ClickhouseConfig } from '../../infrastructure/configs/clickhouse.config';
import { CollectorConsumer } from './application/collector.consumer';
import { AnalyticsRepository } from './infrastructure/repositories/analytics.repository';
import { InjectTypes } from '../../infrastructure/types/inject';

@Module({
	imports: [
		ClickhouseModule.forRootAsync({
			imports: [ConfigsModule],
			useExisting: ClickhouseConfig,
		}),
	],
	controllers: [CollectorConsumer],
	providers: [
		{
			provide: InjectTypes.AnalyticsRepository,
			useClass: AnalyticsRepository,
		},
	],
})
export class CollectorModule {}
