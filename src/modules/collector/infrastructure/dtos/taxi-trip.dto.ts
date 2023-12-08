import { ITaxiTripPayload } from '../interfaces/payload.interfaces';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaxiTripPaymentTypes } from '../../../../infrastructure/types/constants';
import { Transform } from 'class-transformer';
import { NumberDecorator } from '../../../../shared/decorators/number.decorator';

export class TaxiTripPayloadDto implements ITaxiTripPayload {
	@IsNotEmpty()
	@IsString()
	public trip_id!: string;

	@IsNotEmpty()
	@IsString()
	public dropoff_ntaname!: string;

	@NumberDecorator(0.0)
	public extra!: number;

	@NumberDecorator(0.0)
	public fare_amount!: number;

	@NumberDecorator(1)
	public passenger_count!: number;

	@IsEnum(TaxiTripPaymentTypes)
	public payment_type!: number;

	@IsNotEmpty()
	@IsString()
	public pickup_ntaname!: string;

	@NumberDecorator(0.0)
	public tip_amount!: number;

	@NumberDecorator(0.0)
	public tolls_amount!: number;

	@NumberDecorator(0.0)
	public total_amount!: number;

	@NumberDecorator(0.0)
	public trip_distance!: number;

	@IsNotEmpty()
	// @IsISO8601()
	@Transform(({ value }) => new Date(value))
	public pickup_datetime!: Date;

	@IsNotEmpty()
	// @IsISO8601()
	@Transform(({ value }) => new Date(value))
	public dropoff_datetime!: Date;

	@IsOptional()
	@NumberDecorator(-180.0, 180.0)
	public dropoff_latitude?: number;

	@IsOptional()
	@NumberDecorator(-90.0, 90.0)
	public dropoff_longitude?: number;

	@IsOptional()
	@NumberDecorator(-180.0, 180.0)
	public pickup_latitude?: number;

	@IsOptional()
	@NumberDecorator(-90.0, 90.0)
	public pickup_longitude?: number;
}
