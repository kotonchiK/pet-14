import * as process from "process";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function start() {
  const PORT = process.env.PORT || 4000
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Project example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('Project')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('Swagger', app, document);


  await app.listen(PORT, () => console.log(`Server started on port - ${PORT}`))

}

start()