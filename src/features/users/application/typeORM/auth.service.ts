import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { add } from "date-fns";
import bcrypt from 'bcryptjs'
import { InjectRepository } from "@nestjs/typeorm";
import { PasswordChangeEntity, TokensEntity, UsersEntity } from "../../infrastructure/domains/users.entity";
import { Repository } from "typeorm";
import { UsersRepository_TYPEORM } from "../../infrastructure/typeORM-repositories/users.repository";
import { UsersQueryRepository_TYPEORM } from "../../infrastructure/typeORM-repositories/users.query.repository";
import { UsersService } from "../users.service";
import { EmailManager } from "../../../../infrastructure/email/email.manager";
import { JwtAuthService_TYPEORM } from "./jwt.service";
import { CodeDto, CreateUserDto, loginUserDto, MailDto, NewPasswordDto, UserDb } from "../../api/models/input";
import { ReqRefData, TokensTypes } from "../../api/models/tokens.models";
import { UserMeInfoType } from "../../api/models/output";
@Injectable()
export class AuthService_TYPEORM {
  constructor(private usersRepository: UsersRepository_TYPEORM,
              private usersQueryRepository: UsersQueryRepository_TYPEORM,
              private usersService:UsersService,
              private emailManager:EmailManager,
              private jwtService:JwtAuthService_TYPEORM,
              @InjectRepository(PasswordChangeEntity) private passwordChangeModel:Repository<PasswordChangeEntity>,
              @InjectRepository(UsersEntity) private usersModelRepository:Repository<UsersEntity>,
              @InjectRepository(TokensEntity) public tokensRepository:Repository<TokensEntity>

  ) {;
  }

  async registrationUser(dto:CreateUserDto):Promise<void> {

    const passwordSalt = await bcrypt.genSalt()
    const passwordHash = await this.usersService._generateHash(dto.password, passwordSalt)
    const newUser: UserDb = {
      login:dto.login,
      email:dto.email,
      password: passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: randomUUID().toString(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false
      }
    };

    const user = await this.usersRepository.createUser(newUser)

    if(!user) throw new BadRequestException('User was not created')

    try {
      await this.emailManager.sendEmailConfirmationCode(newUser.email, newUser.emailConfirmation.confirmationCode)
    } catch (e) {
      console.log("Email not sent", e)
    }
  }


  async userLogin(dto:loginUserDto, ip:string, title:string):Promise<TokensTypes> {

    const userId = await this.usersQueryRepository.getUserByLoginOrEmail(dto)

    if(userId) {
      const data = {
        title:title??"No Name",
        ip:ip??"0.0.0.0",
        userId:userId
      }
      const accessToken = await this.jwtService.createAccessJWT(userId)
      const refreshToken = await this.jwtService.createRefreshJWT(data)
      return {
        access: accessToken,
        refresh: refreshToken
      }
    } else {
      throw new UnauthorizedException('userLogin - error')
    }
  }


  async emailConfirmation(dto:CodeDto):Promise<void>{
    const isConfirmed = await this.usersRepository.emailConfirmation(dto)

    if(!isConfirmed) throw new BadRequestException({message:'Confirm problem', field:'code'})
  }


   async emailResending(email:MailDto):Promise<void> {

    const user = await this.usersRepository.findByEmail(email)

     if(user.isConfirmed) throw new BadRequestException({message:'Confirm problem', field:'email'})

     const confirmationCode = await this.usersRepository.updateCodeConfirmationInfo(user)

     if(!confirmationCode) throw new BadRequestException({message:'Confirm problem', field:'email'})

     try {
      await this.emailManager.sendEmailConfirmationCode(user.email, confirmationCode)
    }catch (e){
       console.log("Email not sent", e)
    }
  };


  async refreshTokenAuthorization(token:string):Promise<ReqRefData | null> {
    const refreshToken = await this.jwtService.getRefToken(token)

    if (!refreshToken) throw new UnauthorizedException('Refresh token is false')

    await this.usersQueryRepository.checkList(refreshToken)

    return {
      userId: refreshToken.userId,
      deviceId: refreshToken.deviceId,
    }
  };

  async logout(userId:number, deviceId:string):Promise<void>{
    const filter = {
      "userId":userId,
      "deviceId":deviceId
    }

    const token = await this.tokensRepository.findOne({where:filter})
    await this.tokensRepository.remove(token)

    const isToken = await this.tokensRepository.findOne({where:filter})
    if(isToken) throw new UnauthorizedException('tokens expaired or noch etwas')

  }

  async passwordRecovery(email:MailDto):Promise<void> {

    const recoveringData = {
      recoveryCode: randomUUID(),
      email:email.email,
      expDate: add(new Date(), {
        hours: 1,
        minutes: 30
      })
    }

    await this.passwordChangeModel.create(recoveringData)

   try {
     await this.emailManager.sendEmailRecoveryCode(recoveringData.email, recoveringData.recoveryCode)
   } catch (e) {
     console.log('Email with revocery code was not senden')
   }

  }

  async newPassword(dto:NewPasswordDto){

    const isCode = await this.passwordChangeModel.findOne({where:{"recoveryCode":dto.recoveryCode}})

    if(!isCode) throw new BadRequestException({message:'Code was not founden', field:'recoveryCode'})

    if(new Date() > isCode.expDate) throw new BadRequestException({message:'Code was not founden', field:'recoveryCode'})


    await this.passwordChangeModel.remove(isCode)

    const passwordSalt = await bcrypt.genSalt()
    const passwordHash = await this.usersService._generateHash(dto.newPassword, passwordSalt)

    const user = await this.usersModelRepository.findOne({where:{email:isCode.email}})

    user.password = passwordHash

    await this.usersModelRepository.save(user)
  }
  async refreshingTokens(userId:number, deviceId:string, ip:string):Promise<TokensTypes>{
    const user = await this.usersQueryRepository.isUser(userId)

    if (!user) throw new UnauthorizedException('User is not exist')

    const newRefreshData = {
      userId:userId,
      deviceId:deviceId,
      ip:ip
    }
    const accessToken = await this.jwtService.createAccessJWT(userId)
    const refreshToken = await this.jwtService.refreshToken(newRefreshData)
    return  {
      access:accessToken,
      refresh:refreshToken
    }
  }

  async userInfo(userId:number):Promise<UserMeInfoType> {

    const user = await this.usersQueryRepository.getUser(userId)
    if(!user) throw new NotFoundException('User is not exist')

    return {
      email:user.email,
      login:user.login,
      userId:user.id
    }

  }



}