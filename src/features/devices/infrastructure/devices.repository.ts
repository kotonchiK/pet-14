import { Model } from "mongoose";
import { Tokens, TokensDocument, TokensTest } from "../../../infrastructure/domains/schemas/users.schema";

import { NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

export class DevicesRepository {
  constructor(@InjectModel(TokensTest) public tokensModel:typeof TokensTest) {}
  async deleteById(deviceId:string):Promise<void>{
    try {
      const device = await this.tokensModel.findOne({where:{"deviceId":deviceId}})
      await device.destroy()
    } catch (error) {
      console.log(error)
      throw new NotFoundException('Device was not deleted')
    }
  }

  async deleteAllDevices(userId:number, deviceId:string):Promise<void>{
    try {
      await this.tokensModel.destroy({
        where: {
          userId: userId,
          deviceId: { [Op.ne]: deviceId }
        }
      });

    } catch (error) {
      console.log(error)
      throw new NotFoundException('Devices were not deleted')
    }

  }
}