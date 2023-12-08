export class ClickhouseCommonUtils {
	public static isObject(value: unknown): value is Record<string, unknown> {
		return typeof value === 'object' && !Array.isArray(value) && value !== null;
	}

	public static isNull(value: unknown): value is null {
		return value === null;
	}
}
