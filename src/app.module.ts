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
import { appConfig } from "./app.settings";

@Module({
  controllers:[AppController],
  providers:[CurrentUserIdPipe],
  imports:[
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

    MongooseModule.forRoot(appConfig.MongoURL),

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
}}