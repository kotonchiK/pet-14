import { Device } from "../../features/devices/api/models/output";
import { TokensDocument, TokensTest } from "../domains/schemas/users.schema";
export const deviceMapper = (device:TokensTest):Device => {
  return {
    userId: device.userId.toString(),
    deviceId: device.deviceId,
    ip: device.ip,
    title: device.title,
    lastActiveDate: device.iat,
  }
}