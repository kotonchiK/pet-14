import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "../../../users/infrastructure/domains/users.entity";
import { BlogsEntity } from "../../../blogs/infrastructure/domains/blogs.entity";

@Entity()
export class PostsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  title: string;

  @Column('text')
  shortDescription: string;

  @Column("text")
  content: string;

  @Column('timestamp with time zone')
  createdAt: Date;

  @Column("text")
  blogName: string;

  @Column("int")
  blogId: number;
}

enum PostStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None'
}
@Entity()
export class PostsLikesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  login: string;

  @Column({ type: "enum", enum: PostStatus, default: PostStatus.None })
  status: string;

  @Column('timestamp with time zone')
  addedAt: Date;

  @Column("int")
  postId: number;

  @Column("int")
  userId: number;
}
