import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import * as process from "process";
import { Tokens, TokensDocument, TokensTest } from "../../../infrastructure/domains/schemas/users.schema";
import { Model } from "mongoose";
import { CreateTokenModel, DecodedRefreshToken, refreshJwtModel } from "../api/models/tokens.models";
import { appConfig } from "../../../app.settings";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class JwtAuthService {
  constructor(@InjectModel(TokensTest) public tokenModel:typeof TokensTest) {}

  async createAccessJWT(userId: number): Promise<string> {
    return jwt.sign({ userId }, appConfig.Access_Secret_Key, { expiresIn: '10m' });
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
    await this.tokenModel.create(tokenData);
    const exp = iat + 20_000
    return jwt.sign({ userId: tokenData.userId, deviceId: tokenData.deviceId, iat, exp }, appConfig.Refresh_Secret_Key);
  }

  async refreshToken(refreshData: refreshJwtModel): Promise<string> {
    const iat = Date.now();
    const token = await this.tokenModel.findOne({where:{ userId: refreshData.userId, deviceId: refreshData.deviceId }})
    await token.update({ ip: refreshData.ip, iat:  new Date(iat) })
    const exp = iat + 20_000
    return jwt.sign({ userId: refreshData.userId, deviceId: refreshData.deviceId, iat, exp}, appConfig.Refresh_Secret_Key);
  }

  async getUserIdByToken(token: string): Promise<number | null> {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET);
      return result.userId
    } catch (e) {
      return null;
    }
  }

  async getRefToken(token: string): Promise<DecodedRefreshToken> {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET2);

      const currentTime = Math.floor(Date.now());
      if (currentTime > Number(result.iat + 20_000)) throw new UnauthorizedException('Refresh token has expired'); // сравниваем текущее время с временем создания токена + 10 секунд

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
