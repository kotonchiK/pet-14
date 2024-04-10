import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import * as process from "process";
import { InjectModel } from "@nestjs/mongoose";
import { Tokens, TokensDocument } from "../../../infrastructure/domains/schemas/users.schema";
import { Model } from "mongoose";
import { CreateTokenModel, DecodedRefreshToken, refreshJwtModel } from "../api/models/tokens.models";

@Injectable()
export class JwtAuthService {
  constructor(@InjectModel(Tokens.name) public tokenModel:Model<TokensDocument>) {}

  async createAccessJWT(userId: string): Promise<string> {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10m' });
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
    return jwt.sign({ userId: tokenData.userId, deviceId: tokenData.deviceId, iat }, process.env.JWT_SECRET2, { expiresIn: '20m' });
  }

  async refreshToken(refreshData: refreshJwtModel): Promise<string> {
    const iat = Date.now();
    await this.tokenModel.updateOne(
      { userId: refreshData.userId, deviceId: refreshData.deviceId },
      { $set: { ip: refreshData.ip, iat: new Date(iat) } },
    );
    return jwt.sign({ userId: refreshData.userId, deviceId: refreshData.deviceId, iat }, process.env.JWT_SECRET2, { expiresIn: '20m' });
  }

  async getUserIdByToken(token: string): Promise<string | null> {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET);
      return new ObjectId(result.userId).toString();
    } catch (e) {
      return null;
    }
  }

  async getRefToken(token: string): Promise<DecodedRefreshToken | null> {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET2);
      return {
        userId: new ObjectId(result.userId).toString(),
        deviceId: new ObjectId(result.deviceId).toString(),
        iat: new Date(result.iat),
      };
    } catch (e) {
      return null;
    }
  }
}
