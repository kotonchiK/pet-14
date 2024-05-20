import {
  Controller,
  Delete,
  Get,
  HttpCode, HttpStatus,
  Param,
 Req,
UseInterceptors,
} from "@nestjs/common";
import { DevicesService } from "../application/devices.service";
import { Sessions } from "./models/output";
import { ValidateObjectId } from "../../../infrastructure/pipes/ValidateObjectId";
import { RefreshTokenMiddleware } from "../../../infrastructure/middlewares/refToken.mdw";
import {Request} from "express";
import { DevicesQueryRepository } from "../infrastructure/devices.query.repository";
import { ValidateIdPipe } from "../../../infrastructure/pipes/ValidateIdNumber";
import { DevicesQueryRepository_TYPEORM } from "../infrastructure/typeORM/devices.query.repository";

@Controller('security/devices')
@UseInterceptors(RefreshTokenMiddleware)
export class DevicesController {
  constructor(private devicesService:DevicesService,
              private devicesQueryRepository:DevicesQueryRepository_TYPEORM) {}

  @Get()
  async getDevices(@Req() req:Request):Promise<Sessions[]>{
    const userId = req.userId
    return await this.devicesQueryRepository.getAllDevices(userId)
  }
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllDevices(@Req() req:Request):Promise<void> {
    const userId = req.userId
    const deviceId = req.deviceId

    await this.devicesService.deleteAllDevices(userId, deviceId)
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDevice(@Param('id', ValidateObjectId) id:string,
                     @Req() req:Request):Promise<void> {
    const requestData = {
      id:req.deviceId,
      requestId:id,
      userId:req.userId
    }
    await this.devicesService.deleteDevice(requestData)
  }

}