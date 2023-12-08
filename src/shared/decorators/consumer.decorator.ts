import { applyDecorators, Controller } from '@nestjs/common';

export const ConsumerController = () => applyDecorators(Controller());
