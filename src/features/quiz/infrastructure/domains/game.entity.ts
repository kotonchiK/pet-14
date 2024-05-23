import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { AnswersDb, PlayerDbGame, QuestionsDb } from "../../api/models/db";
import { GameStatus } from "../../api/models/output";

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  questions: QuestionsDb[];

  @Column('jsonb')
  answers: AnswersDb[];

  @Column('jsonb')
  player1: PlayerDbGame;

  @Column({type:'jsonb', nullable:true})
  player2: PlayerDbGame;

  @Column({type: 'enum', enum: GameStatus, default: GameStatus.PendingSecondPlayer})
  status: GameStatus;

  @Column({type:'timestamp with time zone'})
  pairCreatedDate: Date;

  @Column({type:'timestamp with time zone', nullable:true})
  startGameDate: Date;

  @Column({type:'timestamp with time zone', nullable:true})
  finishGameDate: Date;
}