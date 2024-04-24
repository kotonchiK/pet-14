import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { appConfig, appSettings } from "./app.settings";
import { swaggerActivate } from "../swagger-static/swagger";
import process from "process";

async function startApp():Promise<void> {
  const PORT = appConfig.PORT
  const app = await NestFactory.create(AppModule)

  appSettings(app)

  await app.listen(PORT, () => console.log(`Server started on port - ${PORT}`))

  swaggerActivate()
}

startApp()