import { Device } from "../../features/devices/api/models/output";
import { TokensDocument } from "../domains/schemas/users.schema";
export const deviceMapper = (device:TokensDocument):Device => {
  return {
    userId: device.userId,
    deviceId: device.deviceId,
    ip: device.ip,
    title: device.title,
    lastActiveDate: device.iat,
  }
}