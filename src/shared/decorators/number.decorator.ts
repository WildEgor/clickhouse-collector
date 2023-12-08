import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export const NumberDecorator = (
	min = Number.MIN_SAFE_INTEGER,
	max = Number.MAX_SAFE_INTEGER,
): ReturnType<typeof applyDecorators> =>
	applyDecorators(
		Transform((p) => Number.parseInt(p.value)),
		IsNumber({ allowNaN: false }),
		Min(min),
		Max(max),
	);
