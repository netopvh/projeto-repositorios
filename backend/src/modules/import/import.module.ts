// src/modules/import/import.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportController } from './presentation/controllers/import.controller';
import { RepositoriesController } from './presentation/controllers/repositories.controller';
import { RepositoryRepository } from './infrastructure/repositories/repository.repository';
import { RepositoryEntity } from './domain/entities/repository.entity';
import { ImportCSVUseCase } from './application/usecases/import-csv.usecase';
import { FetchAllUseCase } from './application/usecases/fetch-all.usecase';
import { GatewayWebSocket } from './infrastructure/websocket.gateway';
import { RabbitMQModule } from 'src/shared/queue/rabbitmq.module';

@Module({
  imports: [TypeOrmModule.forFeature([RepositoryEntity]), RabbitMQModule],
  controllers: [ImportController, RepositoriesController],
  providers: [
    RepositoryRepository,
    ImportCSVUseCase,
    FetchAllUseCase,
    GatewayWebSocket,
  ],
  exports: [RepositoryRepository],
})
export class ImportModule {}
