import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import * as process from "process";
import { InjectModel } from "@nestjs/mongoose";
import { Tokens, TokensDocument } from "../../../infrastructure/domains/schemas/users.schema";
import { Model } from "mongoose";
import { CreateTokenModel, DecodedRefreshToken, refreshJwtModel } from "../api/models/tokens.models";
import { appConfig } from "../../../app.settings";

@Injectable()
export class JwtAuthService {
  constructor(@InjectModel(Tokens.name) public tokenModel:Model<TokensDocument>) {}

  async createAccessJWT(userId: string): Promise<string> {
    return jwt.sign({ userId }, appConfig.Access_Secret_Key, { expiresIn: '10s' });
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
    await this.tokenModel.updateOne(
      { userId: refreshData.userId, deviceId: refreshData.deviceId },
      { $set: { ip: refreshData.ip, iat:  new Date(iat) } },
    );
    const exp = iat + 20_000
    return jwt.sign({ userId: refreshData.userId, deviceId: refreshData.deviceId, iat, exp}, appConfig.Refresh_Secret_Key);
  }

  async getUserIdByToken(token: string): Promise<string | null> {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET);
      return new ObjectId(result.userId).toString();
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
        userId: new ObjectId(result.userId).toString(),
        deviceId: new ObjectId(result.deviceId).toString(),
        iat: new Date(result.iat),
      };
    } catch (e) {
      throw new UnauthorizedException('Refresh token is false')
    }
  }
}
