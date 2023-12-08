import { Module } from '@nestjs/common';
import { ConfigsModule } from './infrastructure/configs/configs.module';
import { CollectorModule } from './modules/collector/collector.module';
import { ClickhouseModule } from './infrastructure/adapters/clickhouse';
import { ClickhouseConfig } from './infrastructure/configs/clickhouse.config';

@Module({
	imports: [
		ConfigsModule,
		ClickhouseModule.forRootAsync({
			imports: [ConfigsModule],
			useExisting: ClickhouseConfig,
		}),
		CollectorModule,
	],
})
export class AppModule {}
