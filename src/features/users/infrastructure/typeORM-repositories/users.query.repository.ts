import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from "@nestjs/typeorm";
import { TokensEntity, UsersEntity } from "../domains/users.entity";
import { ILike, Like, Repository } from "typeorm";
import { OutputUserModel } from "../../api/models/output";
import { userMapper } from "../../../../infrastructure/mappers/users.mapper";
import { loginUserDto, MailDto, UsersQueryModel } from "../../api/models/input";
import { Pagination } from "../../../../base/types/pagination.type";
import { DecodedRefreshToken } from "../../api/models/tokens.models";
import { format } from 'date-fns';

export class UsersQueryRepository_TYPEORM {
  constructor(@InjectRepository(UsersEntity) private usersRepository:Repository<UsersEntity>,
              @InjectRepository(TokensEntity) public tokensRepository:Repository<TokensEntity>) {}

  async isUser(userId: number): Promise<boolean> {
    try {
      const user = await this.usersRepository.findOne({where:{id:userId}});
      return !!user;
    } catch (error) {
      console.log(`Error while checking user: ${error}`);
      return false;
    }
  }

  async getUser(userId:number): Promise<OutputUserModel> {
    try {
      const user = await this.usersRepository.findOne({where:{id:userId}});

      return userMapper(user);
    } catch (error) {
      throw new NotFoundException('User is not exist')
    }
  }

  async getUsers(sortData:UsersQueryModel):Promise<Pagination<OutputUserModel>> {
    const {searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize} = sortData
    const filter = {
      where: [
        { email: ILike(`%${searchEmailTerm || ''}%`) },
        { login: ILike(`%${searchLoginTerm || ''}%`) },
      ],
      order: { [sortBy]: sortDirection },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    };
    const [users, totalCount] = await this.usersRepository.findAndCount(filter);

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
    const getUser = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email ILIKE :term OR user.login ILIKE :term', { term: `%${user.loginOrEmail || ''}%` })
      .getOne();

    if(!getUser) throw new UnauthorizedException('User is not exist')

    const isPassword = await bcrypt.compare(user.password, getUser.password)

    if(isPassword) return getUser.id

    throw new UnauthorizedException('Password is not correct')
  }

   async findByEmail(dto:MailDto):Promise<UsersEntity> {

    const getUser = await this.usersRepository.findOne({
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
    const isToken = await this.tokensRepository.findOne({where:filter})

    if(!isToken) throw new UnauthorizedException('Refresh token is not in white list')
  }
}