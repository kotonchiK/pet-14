import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { User, UserDocument } from "../../../infrastructure/domains/schemas/users.schema";
import { UserDb } from "../api/models/input";

export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel:Model<UserDocument>) {}
  async createUser(newUser:UserDb):Promise<UserDocument | null> {
    try {
      const createdUser = new this.userModel(newUser)

      await createdUser.save()

      return createdUser

    } catch (e) {
      console.log('Create-User error => ', e)
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
}