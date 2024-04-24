import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CodeDto, CreateUserDto, loginUserDto, MailDto, NewPasswordDto, UserDb } from "../api/models/input";
import {
  passwordChange,
  passwordChangeDocument, passwordChangeTest,
  Tokens,
  TokensDocument, TokensTest, User, UserDocument, UserTest
} from "../../../infrastructure/domains/schemas/users.schema";
import { UsersQueryRepository } from "../infrastructure/users.query.repository";
import { UsersRepository } from "../infrastructure/users.repository";
import { randomUUID } from "node:crypto";
import { UsersService } from "./users.service";
import { add } from "date-fns";
import { JwtAuthService } from "./jwt.service";
import { ReqRefData, TokensTypes } from "../api/models/tokens.models";
import bcrypt from 'bcryptjs'
import { EmailManager } from "../../../infrastructure/email/email.manager";
import { UserMeInfoType } from "../api/models/output";
import { InjectModel } from "@nestjs/sequelize";
@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository,
              private usersQueryRepository: UsersQueryRepository,
              private usersService:UsersService,
              private emailManager:EmailManager,
              private jwtService:JwtAuthService,
              @InjectModel(TokensTest) private tokensModel:typeof TokensTest,
              @InjectModel(passwordChangeTest) private passwordChangeModel:typeof passwordChangeTest,
              @InjectModel(UserTest) private userModel:typeof UserTest

  ) {
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
    const user = await this.usersQueryRepository.findByEmail(email)

     const emailConfirmationId = user.emailConfirmationId

     await this.usersRepository.isEmailConfirm(emailConfirmationId)

     const confirmationCode = await this.usersRepository.updateCodeConfirmationInfo(emailConfirmationId)

     if(!confirmationCode) throw new BadRequestException({message:'Confirm problem', field:'code'})
     try {
      await this.emailManager.sendEmailConfirmationCode(user.email, confirmationCode)
    }catch (e){
       console.log("Email not sent", e)
    }
  };


  async refreshTokenAuthorization(token:string):Promise<ReqRefData | null> {
    const refreshToken = await this.jwtService.getRefToken(token)

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
    try {
      const token = await this.tokensModel.findOne({where:filter})
      await token.destroy()
    } catch (e) {
      throw new NotFoundException('')
    }
    const isToken = await this.tokensModel.findOne({where:filter})
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

  async newPassword(dto:NewPasswordDto):Promise<void>{

    const isCode = await this.passwordChangeModel.findOne({where:{"recoveryCode":dto.recoveryCode}})

    if(!isCode) throw new BadRequestException({message:'Code was not founden', field:'recoveryCode'})

    if(new Date() > isCode.expDate) throw new BadRequestException({message:'Code was not founden', field:'recoveryCode'})

    await isCode.destroy()

    const passwordSalt = await bcrypt.genSalt()
    const passwordHash = await this.usersService._generateHash(dto.newPassword, passwordSalt)

    const user = await this.userModel.findOne({where:{"email":isCode.email}})

    await user.update({password:passwordHash})

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