// src/modules/rabbitmq/rabbitmq.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQProcessor } from 'src/modules/import/infrastructure/rabbitmq.processor';
import { GatewayModule } from '../gateway/gateway.module';
import { ImportModule } from 'src/modules/import/import.module';

@Module({
  imports: [GatewayModule, forwardRef(() => ImportModule)],
  providers: [RabbitMQService, RabbitMQProcessor],
  exports: [RabbitMQService, RabbitMQProcessor],
})
export class RabbitMQModule {}
