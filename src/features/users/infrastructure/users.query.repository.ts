import { TokensTest, UserTest } from "../../../infrastructure/domains/schemas/users.schema";
import { loginUserDto, MailDto, UsersQueryModel } from "../api/models/input";
import { userMapper } from "../../../infrastructure/mappers/users.mapper";
import { Pagination } from "../../../base/types/pagination.type";
import { OutputUserModel } from "../api/models/output";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';
import { DecodedRefreshToken } from "../api/models/tokens.models";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

export class UsersQueryRepository {
  constructor(@InjectModel(UserTest) public userModel:typeof UserTest,
              @InjectModel(TokensTest) public tokensModel:typeof TokensTest) {}

  async isUser(userId: number): Promise<boolean> {
    try {
      const user = await this.userModel.findByPk(userId);
      return !!user;
    } catch (error) {
      console.log(`Error while checking user: ${error}`);
      return false;
    }
  }

  async getUser(userId:number): Promise<OutputUserModel> {
    try {
      const user = await this.userModel.findByPk(userId);

      return userMapper(user);
    } catch (error) {
      throw new NotFoundException('User is not exist')
    }
  }

  async getUsers(sortData:UsersQueryModel):Promise<Pagination<OutputUserModel>> {
    const {searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize} = sortData
    const filter = {
      [Op.or]: [
        { email: { [Op.iLike]: `%${searchEmailTerm || ''}%` } }, // Фильтрация по email
        { login: { [Op.iLike]: `%${searchLoginTerm || ''}%` } }, // Фильтрация по login
      ],
    };

    const users = await this.userModel.findAll({
      where:filter,
      order: [[sortBy, sortDirection]],
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
      raw: true
    })
    const totalCount = await this.userModel.count({where:filter})
    const pagesCount = Math.ceil(totalCount / pageSize)
    return {
      pageSize,
      page: pageNumber,
      pagesCount,
      totalCount,
      items: users.map(userMapper)
    }
  }

  async getUserByLoginOrEmail(user:loginUserDto):Promise<number>{
    const filter = {
      [Op.or]: [
        { email: { [Op.iLike]: `%${user.loginOrEmail || ''}%` } }, // Фильтрация по email
        { login: { [Op.iLike]: `%${user.loginOrEmail || ''}%` } }, // Фильтрация по login
      ],
    };

    const getUser = await this.userModel.findOne({where:filter})

    if(!getUser) throw new UnauthorizedException('User is not exist')

    const isPassword = await bcrypt.compare(user.password, getUser.password)

    if(isPassword) return getUser.id

    throw new UnauthorizedException('Password is not correct')
  }

   async findByEmail(dto:MailDto):Promise<UserTest> {

    const getUser = await this.userModel.findOne({
      where:{"email": dto.email}
    })

     if (!getUser) throw new BadRequestException({message:'Confirm problem', field:'email'})

    return getUser
  }

  async checkList(token:DecodedRefreshToken):Promise<void> {
    const filter = {
      "deviceId":token.deviceId,
      "iat":token.iat
    }
    const isToken = await this.tokensModel.findOne({where:filter})

    if(!isToken) throw new UnauthorizedException('Refresh token is not in white list')
  }
}