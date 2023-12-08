import { ITaxiTripPayload } from '../interfaces/payload.interfaces';
import { IsISO8601, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class TaxiTripPayloadDto implements ITaxiTripPayload {
	@IsNotEmpty()
	@IsString()
	public trip_id!: string;

	@IsNotEmpty()
	@IsString()
	public dropoff_ntaname!: string;

	@IsNumberString()
	public extra!: number;

	@IsNumberString()
	public fare_amount!: number;

	@IsNumberString()
	public passenger_count!: number;

	@IsNumberString()
	public payment_type!: number;

	@IsNotEmpty()
	@IsString()
	public pickup_ntaname!: string;

	@IsNumberString()
	public tip_amount!: number;

	@IsNumberString()
	public tolls_amount!: number;

	@IsNumberString()
	public total_amount!: number;

	@IsNumberString()
	public trip_distance!: number;

	@IsISO8601()
	public pickup_datetime!: Date;

	@IsISO8601()
	public dropoff_datetime!: Date;

	@IsOptional()
	@IsNumberString()
	public dropoff_latitude?: number;

	@IsOptional()
	@IsNumberString()
	public dropoff_longitude?: number;

	@IsOptional()
	@IsNumberString()
	public pickup_latitude?: number;

	@IsOptional()
	@IsNumberString()
	public pickup_longitude?: number;
}
