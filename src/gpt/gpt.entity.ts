import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GptContents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  url: string;

  @Column({ name: 'published_at' })
  publishedAt: Date;
}
