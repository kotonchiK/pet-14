import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne } from "typeorm";
@Entity()
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'text', unique:true})
  login: string;

  @Column({type:'text', unique:true})
  email: string;

  @Column("text")
  password: string;

  @Column('timestamp with time zone')
  createdAt: Date;

  @Column("text")
  confirmationCode: string;

  @Column('date')
  expirationDate: Date;

  @Column("boolean")
  isConfirmed: boolean;

}


@Entity()
export class TokensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number;

  @Column("text")
  deviceId: string;

  @Column("text")
  ip: string;

  @Column("text")
  title: string;

  @Column('timestamp with time zone')
  iat: Date;
}

@Entity()
export class PasswordChangeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  email: string;

  @Column("text")
  recoveryCode: string;

  @Column('date')
  expDate: Date;
}



