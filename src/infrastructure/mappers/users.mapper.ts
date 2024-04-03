import { UserDocument } from "../domains/schemas/users.schema";
import { OutputUserModel } from "../../features/users/api/models/output";

export const userMapper = (user:UserDocument):OutputUserModel => {
  return {
    id:user._id.toString(),
    login:user.login,
    email:user.email,
    createdAt:user.createdAt
  }
}

