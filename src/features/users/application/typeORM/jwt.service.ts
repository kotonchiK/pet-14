import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import * as process from "process";
import { InjectRepository } from "@nestjs/typeorm";
import { TokensEntity } from "../../infrastructure/domains/users.entity";
import { Repository } from "typeorm";
import { CreateTokenModel, DecodedRefreshToken, refreshJwtModel } from "../../api/models/tokens.models";
import { appConfig, JwtSettings } from "../../../../app.settings";

@Injectable()
export class JwtAuthService_TYPEORM {
  constructor(@InjectRepository(TokensEntity) public tokensRepository:Repository<TokensEntity>) {}

  async createAccessJWT(userId: number): Promise<string> {
    const iat = Date.now()
    const exp = iat + JwtSettings.accessToken
    return jwt.sign({ userId, iat, exp }, appConfig.Access_Secret_Key);
  }

  async createRefreshJWT(data: CreateTokenModel): Promise<string> {
    const iat = Date.now();
    const tokenData = {
      userId: data.userId,
      ip: data.ip,
      title: data.title,
      deviceId: new ObjectId().toString(),
      iat: new Date(iat),
    };
    await this.tokensRepository.save(tokenData);
    const exp = iat + JwtSettings.refreshToken
    return jwt.sign({ userId: tokenData.userId, deviceId: tokenData.deviceId, iat, exp }, appConfig.Refresh_Secret_Key);
  }

  async refreshToken(refreshData: refreshJwtModel): Promise<string> {
    const iat = Date.now();
    const token = await this.tokensRepository.findOne({where:{ userId: refreshData.userId, deviceId: refreshData.deviceId }})
    token.ip = refreshData.ip
    token.iat = new Date(iat)
    await this.tokensRepository.save(token)
    const exp = iat + JwtSettings.refreshToken
    return jwt.sign({ userId: refreshData.userId, deviceId: refreshData.deviceId, iat, exp}, appConfig.Refresh_Secret_Key);
  }

  async getUserIdByToken(token: string): Promise<number | null> {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET);
      const currentTime = Math.floor(Date.now());
      if (currentTime > Number(result.iat + JwtSettings.accessToken)) throw new UnauthorizedException('Refresh token has expired'); // сравниваем текущее время с временем создания токена + 10 секунд

      return result.userId
    } catch (e) {
      throw new UnauthorizedException('Refresh token has expired'); // сравниваем текущее время с временем создания токена + 10
      return null;
    }
  }

  async getRefToken(token: string): Promise<DecodedRefreshToken> {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET2);

      const currentTime = Math.floor(Date.now());
      if (currentTime > Number(result.iat + JwtSettings.refreshToken)) throw new UnauthorizedException('Refresh token has expired'); // сравниваем текущее время с временем создания токена + 10 секунд

      return {
        userId: result.userId,
        deviceId: new ObjectId(result.deviceId).toString(),
        iat: new Date(result.iat),
      };
    } catch (e) {
      throw new UnauthorizedException('Refresh token is false')
    }
  }
}
