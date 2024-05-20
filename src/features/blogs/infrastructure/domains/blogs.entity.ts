import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BlogsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column('text')
  description: string;

  @Column("text")
  websiteUrl: string;

  @Column('timestamp with time zone')
  createdAt: Date;

  @Column('boolean')
  isMembership: boolean;
}