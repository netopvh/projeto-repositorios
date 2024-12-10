// src/modules/import/presentation/controllers/repositories.controller.ts
import { Controller, Get } from '@nestjs/common';
import { FetchAllUseCase } from '../../application/usecases/fetch-all.usecase';

@Controller('api/all')
export class RepositoriesController {
  constructor(private readonly fetchAllRepositoriesUseCase: FetchAllUseCase) {}

  @Get()
  async getAll() {
    return this.fetchAllRepositoriesUseCase.execute();
  }
}
