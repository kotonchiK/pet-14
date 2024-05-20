import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { DevicesQueryRepository } from "../infrastructure/devices.query.repository";
import { DevicesRepository } from "../infrastructure/devices.repository";
import { DeleteDeviceModel } from "../api/models/input";
import { DevicesRepository_TYPEORM } from "../infrastructure/typeORM/devices.repository";
import { DevicesQueryRepository_TYPEORM } from "../infrastructure/typeORM/devices.query.repository";

@Injectable()
export class DevicesService {
  constructor(private devicesRepository:DevicesRepository_TYPEORM,
              private devicesQueryRepository:DevicesQueryRepository_TYPEORM) {}

  async deleteDevice(requestData:DeleteDeviceModel):Promise<void> {

    if(!requestData.requestId) throw new NotFoundException('Device id is not exist')

    const device = await this.devicesQueryRepository.getDeviceById(requestData.requestId)

    if(requestData.userId !== Number(device.userId)) throw new ForbiddenException('Device does not belong to the owner')

    await this.devicesRepository.deleteById(requestData.requestId)
  }

  async deleteAllDevices(userId:number, devicesId:string):Promise<void>{

    await this.devicesRepository.deleteAllDevices(userId, devicesId)

  }

}