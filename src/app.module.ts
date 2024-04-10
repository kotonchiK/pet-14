import { Module } from "@nestjs/common";
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
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "./features/users/api/auth.module";

@Module({
  controllers:[AppController],
  providers:[],
  imports:[
    UsersModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    TestingModule,
    AuthModule,


    ConfigModule.forRoot({
      envFilePath:'.env'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    JwtModule.register({
      secret:process.env.JWT_SECRET,
      signOptions:{expiresIn:'5m'}
    }),


    MongooseModule.forRoot(process.env.MONGO_URL),
  ]
})
export class AppModule {}