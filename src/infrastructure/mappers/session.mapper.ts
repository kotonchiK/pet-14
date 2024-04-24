import { TokensDocument } from "../domains/schemas/users.schema";
import { Sessions } from "../../features/devices/api/models/output";
export const sessionMapper = (session:TokensDocument):Sessions => {
    return {
        deviceId:session.deviceId,
        ip:session.ip,
        title:session.title,
        lastActiveDate:session.iat
    }
}