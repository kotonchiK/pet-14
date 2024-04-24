import { UserDocument, UserTest } from "../domains/schemas/users.schema";
import { OutputUserModel } from "../../features/users/api/models/output";

export const userMapper = (user:UserTest):OutputUserModel => {
  return {
    id:user.id.toString(),
    login:user.login,
    email:user.email,
    createdAt:user.createdAt
  }
}

