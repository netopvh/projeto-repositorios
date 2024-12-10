// src/modules/rabbitmq/rabbitmq.module.ts
import { Module } from '@nestjs/common';
import { GatewayWebSocket } from 'src/modules/import/infrastructure/websocket.gateway';

@Module({
  providers: [GatewayWebSocket],
  exports: [GatewayWebSocket],
})
export class GatewayModule {}
