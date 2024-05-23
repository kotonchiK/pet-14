import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import * as process from "process";
import { UsersModule } from "./features/users/api/users.module";
import { BlogsModule } from "./features/blogs/api/blogs.module";
import { PostsModule } from "./features/posts/api/posts.module";
import { CommentsModule } from "./features/comments/api/comments.module";
import { TestingModule } from "./features/testing/api/testing.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from 'path';
import { AuthModule } from "./features/users/api/auth.module";
import { CurrentUserIdPipe } from "./infrastructure/pipes/currentUserId.pipe";
import { DevicesModule } from "./features/devices/api/devices.module";
import { appConfig, TypeOrmSettings } from "./app.settings";
import { SequelizeModule } from "@nestjs/sequelize";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  PasswordChangeEntity,
  TokensEntity,
  UsersEntity
} from "./features/users/infrastructure/domains/users.entity";
import { BlogsEntity } from "./features/blogs/infrastructure/domains/blogs.entity";
import { PostsEntity, PostsLikesEntity } from "./features/posts/infrastructure/domains/posts.entity";
import { CommentsEntity, CommentsLikesEntity } from "./features/comments/infrastructure/domains/comments.entity";
import { QuizModule } from "./features/quiz/api/quiz.module";

@Module({
  controllers:[AppController],
  providers:[
    CurrentUserIdPipe
  ],
  imports:[

    QuizModule,
    UsersModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    TestingModule,
    AuthModule,
    DevicesModule,

    ConfigModule.forRoot({
      envFilePath:'.env'
    }),


   // SequelizeModule.forRoot(sett),

    TypeOrmModule.forRoot(TypeOrmSettings),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),

  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
  consumer
    .apply(CurrentUserIdPipe)
    .forRoutes('*');
}
}