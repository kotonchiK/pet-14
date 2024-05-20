import { Device } from "../../features/devices/api/models/output";
import { TokensDocument, TokensTest } from "../domains/schemas/users.schema";
import { TokensEntity } from "../../features/users/infrastructure/domains/users.entity";
export const deviceMapper = (device:TokensTest |TokensEntity):Device => {
  return {
    userId: device.userId.toString(),
    deviceId: device.deviceId,
    ip: device.ip,
    title: device.title,
    lastActiveDate: device.iat,
  }
}