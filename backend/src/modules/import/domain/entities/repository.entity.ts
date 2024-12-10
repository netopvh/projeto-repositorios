// src/modules/import/domain/entities/repository.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('repositories')
export class RepositoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner: string;

  @Column()
  name: string;

  @Column()
  stars: number;

  @Column({ nullable: true })
  description: string;

  @Column()
  url: string;
}
