import { Module } from '@nestjs/common';
import { ConfigsModule } from './infrastructure/configs/configs.module';

@Module({
	imports: [ConfigsModule],
})
export class AppModule {}
