import { ITaxiTripPayload } from '../interfaces/payload.interfaces';
import { ITaxiTripOrm } from '../interfaces/orm.interfaces';
import { DateUtils } from '../../../../shared/utils/date.utils';

export class OrmMapper {
	public static fromPayloadToOrm(data: ITaxiTripPayload): ITaxiTripOrm {
		const model: ITaxiTripOrm = {
			trip_id: data.trip_id,
			pickup_datetime: DateUtils.toDatetime(data.pickup_datetime),
			dropoff_datetime: DateUtils.toDatetime(data.dropoff_datetime),
			pickup_longitude: data?.pickup_longitude || 0,
			pickup_latitude: data?.pickup_longitude || 0,
			dropoff_longitude: data?.dropoff_longitude || 0,
			dropoff_latitude: data?.dropoff_latitude || 0,
			passenger_count: data.passenger_count,
			trip_distance: data.trip_distance,
			fare_amount: data.fare_amount,
			extra: data.extra,
			tip_amount: data.tip_amount,
			tolls_amount: data.tolls_amount,
			total_amount: data.total_amount,
			payment_type: data.payment_type,
			pickup_ntaname: data.pickup_ntaname,
			dropoff_ntaname: data.dropoff_ntaname,
		};

		return model;
	}
}
