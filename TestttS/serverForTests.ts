import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from "../src/app.module";

let mongoDb: MongoMemoryServer;
export const startDb = async () => {
  mongoDb = await MongoMemoryServer.create();
  const uri = mongoDb.getUri();

  const module: TestingModule = await Test.createTestingModule({
    imports: [
      MongooseModule.forRoot(uri),
      AppModule,
    ],
  }).compile()
  return module
}

export const stopDb = async ()=> {
  await mongoDb.stop();
}

