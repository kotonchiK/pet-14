import { TokensDocument, TokensTest } from "../domains/schemas/users.schema";
import { Sessions } from "../../features/devices/api/models/output";
export const sessionMapper = (session:TokensTest):Sessions => {
    return {
        deviceId:session.deviceId,
        ip:session.ip,
        title:session.title,
        lastActiveDate:session.iat
    }
}