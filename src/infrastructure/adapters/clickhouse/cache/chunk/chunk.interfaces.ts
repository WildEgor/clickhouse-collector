import { ChunkId, Table } from '../cache.interfaces';
import { DataWatcher } from '../watchers/abstract';
import { Chunk } from './chunk';
import { ChunkLoader } from './chunk-loader';

export interface IChunkData {
	id: ChunkId;
	size: number;
	table: Table;
	expiredAt: number;
}

export interface IChunkMetadata {
	table: string;
	expiredAt: number;
}

export interface IScratchChunkData {
	table: Table;
	liveAtLeastMs: number;
}

export interface IScratchChunkOptions {
	dataWatcher: DataWatcher;
	chunk: IScratchChunkData;
}

export interface IChunkOptions {
	dataWatcher: DataWatcher;
	chunk: IChunkData;
}

export interface IChunkState {
	ref: Chunk;
	size: number;
	expiredAt: number;
}

export interface IRegistryState {
	chunkTable: Record<string, string>;
	tableChunk: Record<string, string>;
	chunks: Record<ChunkId, IChunkState>;
}

export type TOnResolved = (chunk: ChunkLoader) => void;
export type TOnResolvedAsync = (chunk: ChunkLoader) => Promise<void>;
