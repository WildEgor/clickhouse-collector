import { Module } from '@nestjs/common';
import { ConfigsModule } from './infrastructure/configs/configs.module';
import { CollectorModule } from './modules/collector/collector.module';

@Module({
	imports: [ConfigsModule, CollectorModule],
})
export class AppModule {}
