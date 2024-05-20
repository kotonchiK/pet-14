import { OutputUserModel } from "../../features/users/api/models/output";
import { UsersEntity } from "../../features/users/infrastructure/domains/users.entity";
import { UserTest } from "../domains/schemas/users.schema";

export const userMapper = (user:UserTest|UsersEntity):OutputUserModel => {
  return {
    id:user.id.toString(),
    login:user.login,
    email:user.email,
    createdAt:user.createdAt
  }
}

