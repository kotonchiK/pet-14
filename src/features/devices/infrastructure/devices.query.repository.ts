import { Tokens, TokensDocument, TokensTest } from "../../../infrastructure/domains/schemas/users.schema";
import { Model } from "mongoose";
import { Device, Sessions } from "../api/models/output";
import { deviceMapper } from "../../../infrastructure/mappers/device.mapper";
import { sessionMapper } from "../../../infrastructure/mappers/session.mapper";
import { NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

export class DevicesQueryRepository {
  constructor(@InjectModel(TokensTest) public tokensModel:typeof TokensTest) {}
  async getDeviceById(id:string):Promise<Device>{
    try {
      const device = await this.tokensModel.findOne({where:{"deviceId":id}})
      return deviceMapper(device)
    } catch (error) {
      console.log('Error in DevicesQueryRepository' +
        'Function = getDeviceById' +
        'Error => ', error)
      throw new NotFoundException('Device is not exist')
    }
  }

  async getAllDevices(userId:number):Promise<Sessions[]>{
    try {
      const devices = await this.tokensModel.findAll({where:{"userId":userId}})
      return Object.values(devices.map(sessionMapper))
    } catch (error) {
      console.log(error)
      throw new NotFoundException('No active devices')
    }
  }



}