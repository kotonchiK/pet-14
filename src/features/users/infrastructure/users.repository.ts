import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import {
  EmailConfirmationTest,
  User,
  UserDocument,
  UserTest
} from "../../../infrastructure/domains/schemas/users.schema";
import { CodeDto, UserDb } from "../api/models/input";
import { randomUUID } from "node:crypto";
import { add } from "date-fns";
import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { BlogTest } from "../../../infrastructure/domains/schemas/blogs.schema";
import { InjectModel } from "@nestjs/sequelize";
import { where } from "sequelize";
import { Repository } from 'typeorm';
import { UsersEntity } from "./domains/users.entity";
export class UsersRepository {
  constructor(@InjectModel(UserTest) private readonly userModel: typeof UserTest,
              @InjectModel(EmailConfirmationTest) private readonly emailConfirmationTest: typeof EmailConfirmationTest,
             ){}
  async createUser(newUser:UserDb):Promise<UserTest | null> {
    try {
      const emailConfirmation = await this.emailConfirmationTest.create(newUser.emailConfirmation)
      const confId = emailConfirmation.id
      const user = {
        login:newUser.login,
        email:newUser.email,
        password:newUser.password,
        createdAt:newUser.createdAt,
        emailConfirmationId:confId
      }

      return await this.userModel.create(user)
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        let fieldName = '';
        if (error.fields && error.fields.login) {
          fieldName = 'login';
        } else if (error.fields && error.fields.email) {
          fieldName = 'email';
        }
        if (fieldName) {
          throw new BadRequestException({ message: `User with this ${fieldName} already exists`, field: fieldName });
        }
      }
      console.log('Create-User error => ', error);
      return null;
    }
  }


  async deleteUser(id:number):Promise<void> {
    try {
      const user = await this.userModel.findByPk(id)
      await user.destroy()
    } catch (e) {
      console.log('Delete-User error => ', e)
      throw new NotFoundException()
    }
  }

   async emailConfirmation(code:CodeDto):Promise<boolean>{
    try{
      const userEmailConfirmation = await this.emailConfirmationTest.findOne({ where: { confirmationCode: code.code } });
      if(!userEmailConfirmation) return false
      if(userEmailConfirmation.isConfirmed) return false
      if(new Date() > userEmailConfirmation.expirationDate) return false

      const isConfirm = await userEmailConfirmation.update({ isConfirmed: true })

      return !!isConfirm
    } catch (error) {
      throw new BadRequestException({message:'Confirm problem', field:'code'})
    }
  }

  async updateCodeConfirmationInfo(emailConfirmationId:number):Promise<string>{
    try {
      const confirmationCode = randomUUID()
      const expirationDate = add(new Date(), { hours: 1, minutes: 30, })

      const uuu = await this.emailConfirmationTest.findByPk(emailConfirmationId)

      await uuu.update({confirmationCode, expirationDate })

      return confirmationCode
    } catch (e) {
      console.log('Confirm code info was not updated')
      return null
    }
  }

  async isEmailConfirm(id:number):Promise<void>{
    const email = await this.emailConfirmationTest.findByPk(id)

    if (email.isConfirmed) throw new BadRequestException({message:'Confirm problem', field:'email'})
  }
}