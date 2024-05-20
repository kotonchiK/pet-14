import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto, UserDb, UsersQueryModel } from "../api/models/input";
import { userMapper } from "../../../infrastructure/mappers/users.mapper";
import { OutputUserModel } from "../api/models/output";
import { UserDocument } from "../../../infrastructure/domains/schemas/users.schema";
import * as bcrypt from 'bcryptjs';
import { UsersQueryRepository } from "../infrastructure/users.query.repository";
import { Pagination } from "../../../base/types/pagination.type";
import { UsersRepository } from "../infrastructure/users.repository";
import { add } from "date-fns";
import { randomUUID } from "node:crypto";
import { UsersRepository_TYPEORM } from "../infrastructure/typeORM-repositories/users.repository";
import { UsersQueryRepository_TYPEORM } from "../infrastructure/typeORM-repositories/users.query.repository";

@Injectable()
export class UsersService {
  constructor(private usersRepository:UsersRepository_TYPEORM,
              private usersQueryRepository:UsersQueryRepository_TYPEORM) {}

  async deleteUser(id:number):Promise<void> {
    await this.usersRepository.deleteUser(id)
  }
  async createUser(dto:CreateUserDto):Promise<OutputUserModel> {
    const passwordSalt = await bcrypt.genSalt()
    const passwordHash = await this._generateHash(dto.password, passwordSalt)

    const userInfo:UserDb = {
      login:dto.login,
      password: passwordHash,
      email:dto.email,
      createdAt:new Date(),
      emailConfirmation:{
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false
      }
    }

    const createdUser = await this.usersRepository.createUser(userInfo)

    return userMapper(createdUser)
  }

  async getUsers(query:UsersQueryModel):Promise<Pagination<OutputUserModel>>{
    const sortData = {
      searchLoginTerm:query.searchLoginTerm ?? null,
      searchEmailTerm:query.searchEmailTerm ?? null,
      sortBy:query.sortBy ?? "createdAt",
      sortDirection:query.sortDirection ?? "DESC",
      pageNumber:query.pageNumber ? +query.pageNumber : 1,
      pageSize:query.pageSize ? +query.pageSize : 10
    }

   return await this.usersQueryRepository.getUsers(sortData)

  }



  async _generateHash(password:string, salt:string):Promise<string> {return await bcrypt.hash(password, salt)}
}