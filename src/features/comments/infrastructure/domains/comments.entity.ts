import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "../../../users/infrastructure/domains/users.entity";
import { BlogsEntity } from "../../../blogs/infrastructure/domains/blogs.entity";
import { LikeStatus } from "../../../../base/models/likeStatusDto";

@Entity()
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  content: string;

  @Column('timestamp with time zone')
  createdAt: Date;

  @Column("int")
  postId: number;

  @Column('json')
  commentatorInfo: {
    userId: number;
    userLogin: string;
  };
}
@Entity()
export class CommentsLikesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: LikeStatus, default: LikeStatus.None })
  status: string;

  @Column("int")
  commentId: number;

  @Column("int")
  userId: number;
}
