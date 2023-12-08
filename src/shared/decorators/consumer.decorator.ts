import { applyDecorators, Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from '../filters/exception.filter';
import { ValidationError } from 'class-validator';
import { RpcException } from '@nestjs/microservices';

export const ConsumerController = () =>
	applyDecorators(
		Controller(),
		UseFilters(ExceptionFilter),
		UsePipes(
			new ValidationPipe({
				transform: true,
				whitelist: true,
				forbidNonWhitelisted: true,
				exceptionFactory: (validationErrors: ValidationError[] = []) => {
					return new RpcException(validationErrors);
				},
			}),
		),
	);
