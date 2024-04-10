import { InjectModel } from "@nestjs/mongoose";
import { Tokens, TokensDocument, User, UserDocument } from "../../../infrastructure/domains/schemas/users.schema";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { loginUserDto, MailDto, UsersQueryModel } from "../api/models/input";
import { userMapper } from "../../../infrastructure/mappers/users.mapper";
import { Pagination } from "../../../base/types/pagination.type";
import { OutputUserModel } from "../api/models/output";
import { NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';
import { DecodedRefreshToken } from "../api/models/tokens.models";

export class UsersQueryRepository {
  constructor(@InjectModel(User.name) public userModel:Model<UserDocument>,
              @InjectModel(Tokens.name) public tokensModel:Model<TokensDocument>) {}

  async isUser(userId: string): Promise<boolean> {
    try {
      const user = await this.userModel.findById(new ObjectId(userId));
      return !!user;
    } catch (error) {
      console.log(`Error while checking user: ${error}`);
      return false;
    }
  }

  async getUser(userId:string): Promise<OutputUserModel> {
    try {
      const user = await this.userModel.findById(new ObjectId(userId));

      return userMapper(user);
    } catch (error) {
      throw new NotFoundException('User is not exist')
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

  async getUserByLoginOrEmail(user:loginUserDto):Promise<string >{

    const getUser = await this.userModel
      .findOne(
        {$or:
            [
              {login: user.loginOrEmail},
              {email:user.loginOrEmail}
            ]})
      .lean()

    if(!getUser) throw new NotFoundException('User is not exist')

    const isPassword = await bcrypt.compare(user.password, getUser.password)

    if(isPassword) return getUser._id.toString()

    throw new NotFoundException('Password is not correct')
  }

   async findByEmail(dto:MailDto):Promise<UserDocument> {
    const getUser = await this.userModel.findOne({"email": dto.email}).lean()
    if (!getUser) throw new NotFoundException('User is not exist')
    return getUser
  }


  async checkList(token:DecodedRefreshToken):Promise<boolean> {
    const filter = {
      "deviceId":token.deviceId,
      "iat":token.iat
    }
    const isWhite = await this.tokensModel.findOne(filter)
    return !!isWhite;
  };

}