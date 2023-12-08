import { Module } from '@nestjs/common';
import { ClickhouseModule } from '../../infrastructure/adapters/clickhouse';
import { ConfigsModule } from '../../infrastructure/configs/configs.module';
import { ClickhouseConfig } from '../../infrastructure/configs/clickhouse.config';
import { CollectorConsumer } from './application/collector.consumer';

@Module({
	imports: [
		ClickhouseModule.forRootAsync({
			imports: [ConfigsModule],
			useExisting: ClickhouseConfig,
		}),
	],
	controllers: [CollectorConsumer],
})
export class CollectorModule {}
