import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TokensEntity } from "../../../users/infrastructure/domains/users.entity";
import { Not, Repository } from "typeorm";

export class DevicesRepository_TYPEORM {
  constructor(
    @InjectRepository(TokensEntity) private tokensRepository:Repository<TokensEntity>) {}
  async deleteById(deviceId:string):Promise<void>{
    try {
      const device = await this.tokensRepository.findOne({where:{"deviceId":deviceId}})
      await this.tokensRepository.remove(device)
    } catch (error) {
      console.log(error)
      throw new NotFoundException('Device was not deleted')
    }
  }

  async deleteAllDevices(userId: number, deviceId: string): Promise<void> {
    try {
      await this.tokensRepository.delete({ userId, deviceId: Not(deviceId) });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Devices were not deleted');
    }
  }
}