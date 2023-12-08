import { Global, Module } from '@nestjs/common';
import { ConfiguratorModule } from '../../shared/modules/configurator/configurator.module';
import { AppConfig } from './app.config';

@Global()
@Module({
	imports: [
		ConfiguratorModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env', '.env.local'],
			cache: true,
		}),
	],
	providers: [AppConfig],
	exports: [AppConfig],
})
export class ConfigsModule {}
