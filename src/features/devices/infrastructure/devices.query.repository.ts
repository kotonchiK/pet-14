import { InjectModel } from "@nestjs/mongoose";
import { Tokens, TokensDocument} from "../../../infrastructure/domains/schemas/users.schema";
import { Model } from "mongoose";
import { Device, Sessions } from "../api/models/output";
import { deviceMapper } from "../../../infrastructure/mappers/device.mapper";
import { sessionMapper } from "../../../infrastructure/mappers/session.mapper";
import { NotFoundException } from "@nestjs/common";

export class DevicesQueryRepository {
  constructor(@InjectModel(Tokens.name) public tokensModel:Model<TokensDocument>) {}
  async getDeviceById(id:string):Promise<Device>{
    try {
      const device = await this.tokensModel.findOne({"deviceId":id}).lean()
      return deviceMapper(device)
    } catch (error) {
      console.log('Error in DevicesQueryRepository' +
        'Function = getDeviceById' +
        'Error => ', error)
      throw new NotFoundException('Device is not exist')
    }
  }

  async getAllDevices(userId:string):Promise<Sessions[]>{
    try {
      const devices = await this.tokensModel.find({"userId":userId}).lean()
      return Object.values(devices.map(sessionMapper))
    } catch (error) {
      console.log(error)
      throw new NotFoundException('No active devices')
    }
  }



}