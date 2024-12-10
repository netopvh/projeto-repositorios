// src/modules/import/application/usecases/fetch-all-repositories.usecase.ts
import { Inject } from '@nestjs/common';
import { RepositoryRepository } from '../../infrastructure/repositories/repository.repository';

export class FetchAllUseCase {
  constructor(
    @Inject(RepositoryRepository)
    private readonly repository: RepositoryRepository,
  ) {}

  async execute() {
    return this.repository.findAll();
  }
}
