// src/modules/import/infrastructure/repositories/repository.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryEntity } from '../../domain/entities/repository.entity';

@Injectable()
export class RepositoryRepository {
  constructor(
    @InjectRepository(RepositoryEntity) // Injeção do repositório TypeORM
    private readonly repository: Repository<RepositoryEntity>,
  ) {}

  async save(data: Partial<RepositoryEntity>): Promise<RepositoryEntity> {
    return this.repository.save(data);
  }

  async saveAll(repositories: RepositoryEntity[]): Promise<void> {
    await this.repository.save(repositories);
  }

  async findAll(): Promise<RepositoryEntity[]> {
    return this.repository.find();
  }

  async findOneBy(
    criteria: Partial<RepositoryEntity>,
  ): Promise<RepositoryEntity | null> {
    return this.repository.findOneBy(criteria);
  }
}
