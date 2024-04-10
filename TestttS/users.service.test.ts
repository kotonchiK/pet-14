// import { UsersService } from "../src/features/users/application/users.service";
// import { UsersRepository } from "../src/features/users/infrastructure/users.repository";
// import mongoose, { Model } from "mongoose";
// import { User, UserDocument, UserSchema } from "../src/infrastructure/domains/schemas/users.schema";
// import { UsersQueryRepository } from "../src/features/users/infrastructure/users.query.repository";
// import { startDb, stopDb } from "./serverForTests";
// import { getModelToken } from "@nestjs/mongoose";
// import { TestingModule } from "@nestjs/testing";
//
// describe('Integration test for UsersService', () => {
//   let module:TestingModule
//   let userModel:Model<UserDocument>
//
//   beforeAll(async () => {
//     module = await startDb()
//     userModel = module.get<Model<UserDocument>>(getModelToken(User.name))
//   })
//
//   afterAll(async () => {
//     await stopDb()
//   })
//
//   const usersRepository = new UsersRepository(userModel)
//   const usersQueryRepository = new UsersQueryRepository(userModel)
//   const UserService = new UsersService(usersRepository, usersQueryRepository)
//
//   // start app и доставать модель
//   // в 6 по минску Ксюша
//
//   describe('Create user', () => {
//     it('Should return new user with statusCode 201', async () => {
//       const dto = {
//         email:'testEmail',
//         login:'testLogin',
//         password:'testPassword'
//       }
//       const result = await UserService.createUser(dto)
//
//       expect(result.id).toStrictEqual(expect.any(String))
//       expect(result.login).toBe(dto.login)
//       expect(result.email).toBe(dto.email)
//       expect(result.createdAt).toStrictEqual(expect.any(Date))
//     })
//   })
//
// })