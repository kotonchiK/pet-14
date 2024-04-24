import { INestApplication } from "@nestjs/common";
import { globalValidationPipe } from "./infrastructure/expection-filters/validation-Pipe";
import { HttpExceptionFilter } from "./infrastructure/expection-filters/response.filter";
import cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import process from "process";
import { useContainer } from "class-validator";
import { AppModule } from "./app.module";
import { configDotenv} from "dotenv";
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { BlogTest } from "./infrastructure/domains/schemas/blogs.schema";

configDotenv()
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

const dbModels = [
  BlogTest
]

export const databaseConfig: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: process.env.DB_SQL_HOST,
  port: Number(process.env.DB_SQL_PORT),
  username: process.env.DB_SQL_USERNAME,
  password: process.env.DB_SQL_PASSWORD,
  database: process.env.DB_SQL_DATABASE,
  autoLoadModels:true,
  synchronize:true,
  models:[...dbModels],
  define: {
    timestamps: false,
  },
};

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