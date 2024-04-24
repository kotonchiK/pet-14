import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from "../src/app.module";
import { INestApplication } from "@nestjs/common";
import { appSettings } from "../src/app.settings";

let app:INestApplication
let mongoDb: MongoMemoryServer;
export const startDb = async () => {
  mongoDb = await MongoMemoryServer.create();
  const uri = mongoDb.getUri();

  const moduleFixture:TestingModule = await Test.createTestingModule({
    imports:[
      MongooseModule.forRoot(uri),
      AppModule]
  }).compile()
  app = moduleFixture.createNestApplication()
  appSettings(app)

  await app.init()
  return app.getHttpServer()
}

export const stopDb = async ()=> {
  await mongoDb.stop();
  await app.close()
}

export const basicAuth = ():string => {
  return 'Basic ' + Buffer.from('admin:qwerty').toString('base64')
}