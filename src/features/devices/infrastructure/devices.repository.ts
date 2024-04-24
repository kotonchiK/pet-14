import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Tokens, TokensDocument} from "../../../infrastructure/domains/schemas/users.schema";

import { NotFoundException } from "@nestjs/common";

export class DevicesRepository {
  constructor(@InjectModel(Tokens.name) public tokensModel:Model<TokensDocument>) {}
  async deleteById(deviceId:string){
    try {
      await this.tokensModel.deleteOne({"deviceId":deviceId})
    } catch (error) {
      console.log(error)
      throw new NotFoundException('Device was not deleted')
    }
  }

  async deleteAllDevices(userId:string, deviceId:string):Promise<void>{
    try {

      await this.tokensModel.deleteMany({
        "userId":userId,
        "deviceId":{$ne:deviceId}
      })
    } catch (error) {
      console.log(error)
      throw new NotFoundException('Devices were not deleted')
    }

  }
}