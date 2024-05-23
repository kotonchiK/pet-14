import { INestApplication } from "@nestjs/common";
import { globalValidationPipe } from "./infrastructure/expection-filters/validation-Pipe";
import { HttpExceptionFilter } from "./infrastructure/expection-filters/response.filter";
import cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import process from "process";
import { useContainer } from "class-validator";
import { AppModule } from "./app.module";
import { configDotenv} from "dotenv";
import { DataSource } from 'typeorm';
import { SequelizeModuleOptions } from "@nestjs/sequelize";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import {
  PasswordChangeEntity,
  TokensEntity,
  UsersEntity
} from "./features/users/infrastructure/domains/users.entity";
import { BlogsEntity } from "./features/blogs/infrastructure/domains/blogs.entity";
import { PostsEntity, PostsLikesEntity } from "./features/posts/infrastructure/domains/posts.entity";
import { CommentsEntity, CommentsLikesEntity } from "./features/comments/infrastructure/domains/comments.entity";
import { QuestionEntity } from "./features/quiz/infrastructure/domains/question.entity";

configDotenv()

export const JwtSettings = {
  accessToken:10000_000,
  refreshToken:20_000
}

export const appConfig = {
  PORT: process.env.PORT || 4000,
  // TODO this.PORT ??
  serverUrl: `http://localhost:${process.env.PORT || 4000}`,
  Access_Secret_Key: process.env.JWT_SECRET,
  Refresh_Secret_Key: process.env.JWT_SECRET2,
  BasicLogin: process.env.AUTH_LOGIN,
  BasicPass: process.env.AUTH_PASSWORD,
  MongoURL: process.env.MONGO_URL,
  MailLogin_1: process.env.MAIL_USER1,
  MailPass_1: process.env.MAIL_PASS1,
  MailHost_1: process.env.MAIL_HOST1,
  MailPort_1: Number(process.env.MAIL_PORT1),
  MailFrom_1: process.env.MAIL_FROM1
}
export const AuthThrottlerSettings = [{
  ttl: 10_000,
  limit: 5,
}]

export const SequelizeSettings:SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_SQL_HOST,
  port: Number(process.env.DB_SQL_PORT),
  username: process.env.DB_SQL_USERNAME,
  password: process.env.DB_SQL_PASSWORD,
  database: process.env.DB_SQL_DATABASE_1,
  synchronize:true,
  autoLoadModels:true,
  define:{
    timestamps:false
  }
}

export const TypeOrmSettings:TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_SQL_HOST,
  port: Number(process.env.DB_SQL_PORT),
  username: process.env.DB_SQL_USERNAME,
  password: process.env.DB_SQL_PASSWORD,
  database: 'blogs',


  entities: [UsersEntity, BlogsEntity, PostsEntity, PostsLikesEntity, CommentsEntity, CommentsLikesEntity, TokensEntity, PasswordChangeEntity, QuestionEntity],
  synchronize: true,
  autoLoadEntities:true,
}

export const appSettings = (app:INestApplication) => {
  app.enableCors()
  app.useGlobalPipes(globalValidationPipe)
  app.useGlobalFilters(new HttpExceptionFilter())
  app.use(cookieParser());
  // app.setGlobalPrefix('api')

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Nest-Js Project')
    .setDescription('The blogs API description')
    .setVersion('13.0')
    .addTag('Project')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('Swagger', app, document);


}