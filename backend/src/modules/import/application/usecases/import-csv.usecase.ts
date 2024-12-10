// src/modules/import/application/usecases/import-csv.usecase.ts
import { Inject } from '@nestjs/common';
import { RepositoryEntity } from '../../domain/entities/repository.entity';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';
import { RabbitMQService } from 'src/shared/queue/rabbitmq.service';

export class ImportCSVUseCase {
  constructor(
    @Inject(RabbitMQService)
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async execute(fileBuffer: Buffer): Promise<void> {
    const repositories: RepositoryEntity[] = [];
    const stream = Readable.from(fileBuffer);
    const csvStream = stream.pipe(csvParser());

    for await (const row of csvStream) {
      const stars = Number(row['Estrelas']);
      if (isNaN(stars)) {
        console.error('Invalid number of stars:', row['Estrelas']);
        continue; // Pula a linha inválida
      }

      repositories.push({
        owner: row['Proprietário'],
        name: row['Nome'],
        description: row['Descrição'],
        stars: stars,
        url: row['URL'],
      } as RepositoryEntity);
    }

    try {
      await this.rabbitMQService.sendToQueue('csv_processing_queue', {
        repositories, // Envia os dados de repositórios para processamento
      });

      console.log('Data successfully sent to RabbitMQ for processing.');
    } catch (error) {
      console.error('Error publishing to RabbitMQ:', error);
    }
  }
}
