import { INestApplication } from "@nestjs/common";
import { globalValidationPipe } from "./infrastructure/expection-filters/validation-Pipe";
import { HttpExceptionFilter } from "./infrastructure/expection-filters/response.filter";
import cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import process from "process";


export const appConfig = {
  PORT:process.env.PORT || 4000,
  serverUrl:`http://localhost:${process.env.PORT || 4000}`
}

export const appSettings = (app:INestApplication) => {
  app.enableCors()
  app.useGlobalPipes(globalValidationPipe)
  app.useGlobalFilters(new HttpExceptionFilter())
  app.use(cookieParser());
  // app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Nest-Js Project')
    .setDescription('The blogs API description')
    .setVersion('13.0')
    .addTag('Project')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('Swagger', app, document);


}