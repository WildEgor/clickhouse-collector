import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { E_CODES } from '../cache.constants';
import { ChunkId } from '../cache.interfaces';
import { ChunkRegistry } from '../chunk-registry';
import { Chunk } from '../chunk/chunk';
import { IChunkMetadata } from '../chunk/chunk.interfaces';
import { Row } from '../row/row';
import { DataWatcher } from './abstract';
import { IDiskLoad, IFsWatcherOptions, ISave, TOperationId } from './watchers.interfaces';

const fsExistsAsync = promisify(fs.exists);
const fsMkdirAsync = promisify(fs.mkdir);
const fsReadFileAsync = promisify(fs.readFile);
const fsWriteFileAsync = promisify(fs.writeFile);
const fsAppendFileAsync = promisify(fs.appendFile);
const fsUnlinkAsync = promisify(fs.unlink);
const fsReaddirAsync = promisify(fs.readdir);

export class DiskWatcher extends DataWatcher<ISave, IDiskLoad, IFsWatcherOptions> {
	readonly _registry: ChunkRegistry;
	readonly _options: IFsWatcherOptions;
	readonly _chunks: Record<
		ChunkId,
		{
			ref: Chunk;
			operations: Record<TOperationId, Row[]>;
		}
	>;

	constructor(registry: ChunkRegistry, options: IFsWatcherOptions) {
		super(options);

		this._registry = registry;
		this._options = options;

		/**
		 * Runtime cache storage
		 */
		this._chunks = {};
	}

	public async save(op: ISave): Promise<void> {
		if (!op.insertRows.length) {
			throw new Error(E_CODES.E_EMPTY_SAVE);
		}

		if (!this.isWriteable()) {
			await this.toBeUnblocked();
		}

		const operationId = uuidv4();

		op.chunkRef.setConsistency(false);
		if (!this._chunks[op.chunkRef.id]) {
			this._chunks[op.chunkRef.id] = {
				ref: op.chunkRef,
				operations: {},
			};
		}
		this._chunks[op.chunkRef.id].operations[operationId] = op.insertRows;

		// Make dir for restore cache if not exists
		const chunkDirectoryExists = await fsExistsAsync(this._options.disk.outputDirectory);
		if (!chunkDirectoryExists) {
			await fsMkdirAsync(this._options.disk.outputDirectory);
		}

		const chunkFilename = `${op.chunkRef.id}.txt`;
		const chunkPathname = path.resolve(this._options.disk.outputDirectory, chunkFilename);

		// Save chunk to file
		const chunkExists = await fsExistsAsync(chunkPathname);
		if (!chunkExists) {
			const metadata = {
				table: op.chunkRef.table,
				expiresAt: op.chunkRef.expiredAt,
			};
			await fsWriteFileAsync(chunkPathname, `${JSON.stringify(metadata)}\n`);
		}

		/**
		 * Need some kind of schema to optimize
		 */
		const storeData = op.insertRows
			.map((row) => JSON.stringify(row))
			.join('\n')
			.concat('\n');

		await fsAppendFileAsync(chunkPathname, storeData).then(() => {
			this._registry.increaseSize(op.chunkRef.id, op.insertRows.length);
			op.chunkRef.setConsistency(true);
			delete this._chunks[op.chunkRef.id].operations[operationId];
		});
	}

	public async load(chunkId: string): Promise<IDiskLoad> {
		const chunkFilename = `${chunkId}.txt`;
		const chunkPathname = path.resolve(this._options.disk.outputDirectory, chunkFilename);

		const data = await fsReadFileAsync(chunkPathname, { encoding: 'utf8' });

		const [strMetadata, ...strRows] = data.trim().split('\n');

		const metadata: IChunkMetadata = JSON.parse(strMetadata);
		const rows: Record<string, unknown>[] = strRows.map((strRow) => JSON.parse(strRow));

		const chunk = new Chunk({
			dataWatcher: this,
			chunk: {
				id: chunkId,
				table: metadata.table,
				expiredAt: metadata.expiredAt,
				size: rows.length,
			},
		});

		return {
			chunkRef: chunk,
			loadedRows: rows,
		};
	}

	public backupRuntimeCache(): void {
		// eslint-disable-next-line guard-for-in,no-restricted-syntax
		for (const chunkId in this._chunks) {
			const chunkDirectoryExists = fs.existsSync(this._options.disk.outputDirectory);
			if (!chunkDirectoryExists) {
				fs.mkdirSync(this._options.disk.outputDirectory);
			}

			const chunkFilename = `${chunkId}.txt`;
			const chunkPathname = path.resolve(this._options.disk.outputDirectory, chunkFilename);

			const chunk = this._chunks[chunkId].ref;

			const chunkExists = fs.existsSync(chunkPathname);
			if (!chunkExists) {
				const metadata = {
					table: chunk.table,
					expiresAt: chunk.expiredAt,
				};
				fs.writeFileSync(chunkPathname, `${JSON.stringify(metadata)}\n`);
			}

			// eslint-disable-next-line guard-for-in,no-restricted-syntax
			for (const operationId in this._chunks[chunkId].operations) {
				const runtimeRows = this._chunks[chunkId].operations[operationId];

				/**
				 * Need some kind of schema to optimize
				 */
				const storeData = runtimeRows
					.map((row) => JSON.stringify(row))
					.join('\n')
					.concat('\n');

				fs.appendFileSync(chunkPathname, storeData);

				chunk.setConsistency(true);
				delete this._chunks[chunkId].operations[operationId];

				console.log(
					`[DiskWatcher] Successfully backed up operation ${operationId} of chunk ${chunkId} with ${runtimeRows.length} rows`,
				);
			}
		}
	}

	public async restore(): Promise<void> {
		const chunkDirectoryExists = await fsExistsAsync(this._options.disk.outputDirectory);
		if (!chunkDirectoryExists) {
			return;
		}

		const files = await fsReaddirAsync(this._options.disk.outputDirectory);

		for (const filename of files) {
			const isChunkFile = filename.includes('.txt');
			if (!isChunkFile) {
				continue;
			}

			const chunkId = filename.split('.txt').join('');

			const loaded = await this.load(chunkId);

			this._registry.register(loaded.chunkRef);
		}
	}

	public async cleanup(chunkId: string): Promise<void> {
		const chunkFilename = `${chunkId}.txt`;
		const chunkPathname = path.resolve(this._options.disk.outputDirectory, chunkFilename);

		await fsUnlinkAsync(chunkPathname);
	}

	public countRows(chunkId: string): number {
		return this._registry.getOne(chunkId).size;
	}
}
