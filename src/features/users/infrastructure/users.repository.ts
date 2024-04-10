import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { User, UserDocument } from "../../../infrastructure/domains/schemas/users.schema";
import { CodeDto, UserDb } from "../api/models/input";
import { randomUUID } from "node:crypto";
import { add } from "date-fns";
import { BadRequestException } from "@nestjs/common";

export class UsersRepository {
  constructor(@InjectModel(User.name) public userModel:Model<UserDocument>) {}
  async createUser(newUser:UserDb):Promise<UserDocument | null> {
    try {
      const createdUser = new this.userModel(newUser)

      await createdUser.save()

      return createdUser

    } catch (error) {
      if(error.code === 11000){
        let fieldName = ''
        if(error.keyPattern.login){
          fieldName = 'login'
        } else if (error.keyPattern.email) {
              fieldName = 'email';
        }
        if(fieldName) {
          throw new BadRequestException({message:`User with this ${fieldName} already exists`, field:fieldName})
        }
      }
      console.log('Create-User error => ', error)
      return null
    }
  }


  async deleteUser(id:string):Promise<boolean> {
    try {
      const isUserDeleted = await this.userModel.findByIdAndDelete(new ObjectId(id))
      return !!isUserDeleted
    } catch (e) {
      console.log('Delete-User error => ', e)
      return false
    }
  }

   async emailConfirmation(code:CodeDto):Promise<boolean>{
    try{
      const user = await this.userModel.findOne({"emailConfirmation.confirmationCode":code.code}).lean()
      if(!user) return false
      if(user.emailConfirmation.isConfirmed) return false
      if(new Date() > user.emailConfirmation.expirationDate) return false

      const isConfirm = await this.userModel.findByIdAndUpdate(
        {_id:user._id},
        {$set:{"emailConfirmation.isConfirmed":true}})
      return !!isConfirm

    } catch (error) {
      throw new BadRequestException({message:'Confirm problem', field:'code'})
    }
  }


  async updateCodeConfirmationInfo(userId:string):Promise<string>{
    try {
      const confirmationCode = randomUUID()
      const expirationDate = add(new Date(), { hours: 1, minutes: 30, })

      await this.userModel.findByIdAndUpdate({ _id: new ObjectId(userId) },
        {
          $set: {
            "emailConfirmation.confirmationCode": confirmationCode,
            "emailConfirmation.expirationDate": expirationDate
          }
        })
      return confirmationCode
    } catch (e) {
      console.log('Confirm code info was not updated')
      return null
    }
  }


}