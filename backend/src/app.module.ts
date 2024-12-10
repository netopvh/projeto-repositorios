import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ImportModule } from './modules/import/import.module';
import { RabbitMQModule } from './shared/queue/rabbitmq.module';
import { GatewayModule } from './shared/gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST || 'db',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'neocredito',
      entities: [__dirname + '/modules/**/domain/entities/*.entity{.ts,.js}'],
      synchronize: true,
      retryAttempts: 5, // Número de tentativas
      retryDelay: 3000, // Intervalo entre tentativas (ms)
    }),
    ImportModule,
    RabbitMQModule,
    GatewayModule,
  ],
  providers: [],
})
export class AppModule {}
