import { Injectable } from '@nestjs/common';
import { IAppConfig } from '../interfaces/app-config.interface';
import { ConfiguratorService, InjectConfigurator } from '../../shared/modules/configurator';

@Injectable()
export class AppConfig implements IAppConfig {
	public readonly name: string;
	public readonly port: number;
	public readonly isProduction: boolean;

	constructor(@InjectConfigurator() protected readonly configurator: ConfiguratorService) {
		this.name = configurator.getString('APP_NAME');
		this.port = configurator.getNumber('APP_PORT');
		this.isProduction = configurator.getBoolean('APP_PRODUCTION');
	}
}
