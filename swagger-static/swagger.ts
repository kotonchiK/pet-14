import process from "process";
import { get } from "http";
import { createWriteStream } from "fs";
import { appConfig } from "../src/app.settings";

export const swaggerActivate = () => {
  if (process.env.NODE_ENV === 'development') {
    const files = [
      'swagger-ui-bundle.js',
      'swagger-ui-init.js',
      'swagger-ui-standalone-preset.js',
      'swagger-ui.css'
    ];

    files.forEach(file => {
      get(`${appConfig.serverUrl}/swagger/${file}`, function(response) {
        response.pipe(createWriteStream(`swagger-static/${file}`));
      });
    });
  }
}