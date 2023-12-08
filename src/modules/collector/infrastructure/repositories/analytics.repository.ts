import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { IAnalyticsRepository } from '../interfaces/repository.interfaces';
import {
	InjectClickhouseClient,
	InjectClickhouseResolver,
} from '../../../../infrastructure/adapters/clickhouse';
import {
	ClickhouseClient,
	TJSONFormatRow,
} from '../../../../infrastructure/adapters/clickhouse/client';
import { ChunkResolver } from '../../../../infrastructure/adapters/clickhouse/cache';
import { OrmMapper } from '../mappers/orm.mapper';
import { ITaxiTripPayload } from '../interfaces/payload.interfaces';
import { DatabaseTables } from '../../../../infrastructure/types/constants';
import { InsertRow } from '../../../../infrastructure/adapters/clickhouse/cache/cache.interfaces';

@Injectable()
export class AnalyticsRepository implements IAnalyticsRepository, OnApplicationBootstrap {
	private readonly _logger: Logger;

	constructor(
		@InjectClickhouseClient()
		protected readonly client: ClickhouseClient,
		@InjectClickhouseResolver()
		protected readonly resolver: ChunkResolver,
	) {
		this._logger = new Logger(AnalyticsRepository.name);
	}

	public onApplicationBootstrap(): void {
		// eslint-disable-next-line consistent-return
		this.resolver.onResolved(async (chunkLoader) => {
			const jsonRows = await chunkLoader.loadRows();

			try {
				this._logger.debug(
					`Inserting ${jsonRows.length} rows into ${chunkLoader.chunk.table}`,
				);
				await this.client.insert(chunkLoader.chunk.table, jsonRows as TJSONFormatRow[]);
			} catch (e) {
				this._logger.error(`Error inserting rows into ${chunkLoader.chunk.table}`, e);
				return this.resolver.cache(chunkLoader.chunk.table, jsonRows as InsertRow[]);
			}
		});
	}

	public async save(data: ITaxiTripPayload): Promise<void> {
		const ormModel = OrmMapper.fromPayloadToOrm(data);
		await this.resolver.cache(DatabaseTables.TAXI_TRIPS, [ormModel as unknown as InsertRow]);
	}
}
