import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'varchar', unique:true, length:500})
  body: string;

  @Column("jsonb")
  correctAnswers: string[];

  @Column("boolean")
  published: boolean;

  @Column('timestamp with time zone')
  createdAt: Date;

  @Column({type:'timestamp with time zone', nullable:true})
  updatedAt: Date | null;
}