// src/modules/import/infrastructure/rabbitmq.processor.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/shared/queue/rabbitmq.service';
import { GatewayWebSocket } from './websocket.gateway';
import { RepositoryRepository } from './repositories/repository.repository';

@Injectable()
export class RabbitMQProcessor implements OnModuleInit {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly webSocketGateway: GatewayWebSocket,
    private readonly repositoryRepository: RepositoryRepository,
  ) {}

  async onModuleInit() {
    await this.rabbitMQService.connectWithRetry(process.env.RABBITMQ_URL);
    await this.sleep(3000);
    this.process();
  }

  async process() {
    this.rabbitMQService.consume('csv_processing_queue', async (message) => {
      const data = JSON.parse(message.content.toString());
      const repositories = data.repositories;

      if (!Array.isArray(repositories)) {
        throw new Error('Invalid data format: repositories should be an array');
      }

      try {
        for (const repo of repositories) {
          const existingRepo = await this.repositoryRepository.findOneBy({
            name: repo.name,
            owner: repo.owner,
          });

          if (!existingRepo) {
            await this.repositoryRepository.save(repo);
          }
        }
      } catch (error) {
        console.error('Error processing CSV:', error);
        this.webSocketGateway.notifyAll('error');
      }

      this.webSocketGateway.notifyAll('completed');
    });
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
