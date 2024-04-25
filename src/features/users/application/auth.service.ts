import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CodeDto, CreateUserDto, loginUserDto, MailDto, NewPasswordDto, UserDb } from "../api/models/input";
import {
  passwordChange,
  passwordChangeDocument,
  Tokens,
  TokensDocument, User, UserDocument
} from "../../../infrastructure/domains/schemas/users.schema";
import { UsersQueryRepository } from "../infrastructure/users.query.repository";
import { UsersRepository } from "../infrastructure/users.repository";
import { randomUUID } from "node:crypto";
import { UsersService } from "./users.service";
import { add } from "date-fns";
import { JwtAuthService } from "./jwt.service";
import { ReqRefData, TokensTypes } from "../api/models/tokens.models";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import bcrypt from 'bcryptjs'
import { EmailManager } from "../../../infrastructure/email/email.manager";
import { UserMeInfoType } from "../api/models/output";




@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository,
              private usersQueryRepository: UsersQueryRepository,
              private usersService:UsersService,
              private emailManager:EmailManager,
              private jwtService:JwtAuthService,
              @InjectModel(Tokens.name) private tokensModel:Model<TokensDocument>,
              @InjectModel(passwordChange.name) private passwordChangeModel:Model<passwordChangeDocument>,
              @InjectModel(User.name) private userModel:Model<UserDocument>

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

    if (user.emailConfirmation.isConfirmed) throw new BadRequestException({message:'Confirm problem', field:'email'})

    const userId = (user._id).toString()

     const confirmationCode = await this.usersRepository.updateCodeConfirmationInfo(userId)

     if(!confirmationCode) throw new BadRequestException({message:'Confirm problem', field:'code'})

     try {
      await this.emailManager.sendEmailConfirmationCode(user.email, confirmationCode)
    }catch (e){
       console.log("Email not sent", e)
    }
  };


  async refreshTokenAuthorization(token:string):Promise<ReqRefData | null> {
    const refreshToken = await this.jwtService.getRefToken(token)

    if (!refreshToken) throw new UnauthorizedException('Refresh token is false')

    const isWhite = await this.usersQueryRepository.checkList(refreshToken)

    if (!isWhite) throw new UnauthorizedException('Refresh token is not in white list')

    return {
      userId: refreshToken.userId,
      deviceId: refreshToken.deviceId,
    }
  };

  async logout(userId:string, deviceId:string):Promise<void>{
    const filter = {
      "userId":userId,
      "deviceId":deviceId
    }

    await this.tokensModel.deleteOne(filter)

    const isToken = await this.tokensModel.findOne(filter)
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

    const isCode = await this.passwordChangeModel.findOne({"recoveryCode":dto.recoveryCode}).lean()

    if(!isCode) throw new BadRequestException({message:'Code was not founden', field:'recoveryCode'})

    if(new Date() > isCode.expDate) throw new BadRequestException({message:'Code was not founden', field:'recoveryCode'})

    await this.passwordChangeModel.deleteOne({"recoveryCode":dto.recoveryCode})

    const passwordSalt = await bcrypt.genSalt()
    const passwordHash = await this.usersService._generateHash(dto.newPassword, passwordSalt)

    await this.userModel.updateOne(
      {"email":isCode.email},
      {$set:{
          password:passwordHash
        }})
  }
  async refreshingTokens(userId:string, deviceId:string, ip:string):Promise<TokensTypes>{
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

  async userInfo(userId:string):Promise<UserMeInfoType> {

    const user = await this.usersQueryRepository.getUser(userId)
    if(!user) throw new NotFoundException('User is not exist')

    return {
      email:user.email,
      login:user.login,
      userId:user.id
    }

  }



}