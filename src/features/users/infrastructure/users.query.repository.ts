import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../../infrastructure/domains/schemas/users.schema";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { UsersQueryModel } from "../api/models/input";
import { userMapper } from "../../../infrastructure/mappers/users.mapper";
import { Pagination } from "../../../base/types/pagination.type";
import { OutputUserModel } from "../api/models/output";

export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel:Model<UserDocument>) {}

  async isUser(userId: string): Promise<boolean> {
    try {
      const user = await this.userModel.findById(new ObjectId(userId));
      return !!user;
    } catch (error) {
      console.log(`Error while checking user: ${error}`);
      return false;
    }
  }


  async getUsers(sortData:UsersQueryModel):Promise<Pagination<OutputUserModel>> {
    const {searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize} = sortData
    const filter = {
      $or: [
        {email:{$regex:searchEmailTerm || '', $options:'i'}},
        {login:{$regex:searchLoginTerm || '', $options:'i'}}
      ]
    }
    const users = await this.userModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean()
    const totalCount = await this.userModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)
    return {
      pageSize,
      page: pageNumber,
      pagesCount,
      totalCount,
      items: users.map(userMapper)
    }
  }

}