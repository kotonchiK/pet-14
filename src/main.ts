import * as process from "process";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { createWriteStream } from 'fs';
import { get } from 'http';
import { HttpExceptionFilter } from "./infrastructure/expection-filters/response.filter";
import { globalValidationPipe } from "./infrastructure/expection-filters/validation-Pipe";
import cookieParser from 'cookie-parser';

async function startApp() {
  const PORT = process.env.PORT || 4000
  const serverUrl = `http://localhost:${PORT}`
  const app = await NestFactory.create(AppModule)

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


  await app.listen(PORT, () => console.log(`Server started on port - ${PORT}`))

  // get the swagger json file (if app is running in development mode)
  if (process.env.NODE_ENV === 'development') {

    // write swagger ui files
    get(
      `${serverUrl}/swagger/swagger-ui-bundle.js`, function
      (response) {
        response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
        // console.log(`Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,);
      });

    get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      // console.log(`Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,);
    });

    get(
      `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
        // console.log(`Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,);
      });

    get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      // console.log(`Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,);
    });

  }

}

startApp()