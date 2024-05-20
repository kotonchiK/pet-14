import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TokensEntity } from "../../../users/infrastructure/domains/users.entity";
import { Repository } from "typeorm";
import { Device, Sessions } from "../../api/models/output";
import { deviceMapper } from "../../../../infrastructure/mappers/device.mapper";
import { sessionMapper } from "../../../../infrastructure/mappers/session.mapper";

export class DevicesQueryRepository_TYPEORM {
  constructor(
    @InjectRepository(TokensEntity) private tokensRepository:Repository<TokensEntity>) {}
  async getDeviceById(id:string):Promise<Device>{
    try {
      const device = await this.tokensRepository.findOne({where:{"deviceId":id}})

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
      const devices = await this.tokensRepository.find({where:{"userId":userId}})
      return Object.values(devices.map(sessionMapper))
    } catch (error) {
      console.log(error)
      throw new NotFoundException('No active devices')
    }
  }



}