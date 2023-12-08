import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfiguratorConstants } from './configurator.constants';
import { IConfiguratorOptions } from './configurator.models';
import { ConfiguratorService } from './configurator.service';

@Global()
@Module({})
export class ConfiguratorModule {
	public static forRoot(options: IConfiguratorOptions): DynamicModule {
		const ConfiguratorServiceProvider: Provider = {
			provide: ConfiguratorConstants.serviceToken,
			useFactory: (configService: ConfigService) => new ConfiguratorService(configService),
			inject: [ConfigService],
		};

		const dynamicModule: DynamicModule = {
			module: ConfiguratorModule,
			imports: [ConfigModule.forRoot(options)],
			providers: [ConfiguratorServiceProvider],
			exports: [ConfiguratorServiceProvider],
		};

		return dynamicModule;
	}
}
