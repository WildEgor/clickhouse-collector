import { DateTime } from 'luxon';

export class DateUtils {
	public static toDatetime(date: Date): string {
		const converted = DateTime.fromJSDate(date).toFormat('yyyy-MM-dd HH:mm:ss');
		return converted;
	}
}
