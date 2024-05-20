import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersQueryRepository } from "../../features/users/infrastructure/users.query.repository";
import { JwtAuthService } from "../../features/users/application/jwt.service";
import { JwtAuthService_TYPEORM } from "../../features/users/application/typeORM/jwt.service";
import {
  UsersQueryRepository_TYPEORM
} from "../../features/users/infrastructure/typeORM-repositories/users.query.repository";
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtAuthService_TYPEORM,
  private readonly usersQueryRepository:UsersQueryRepository_TYPEORM) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
  private async validateRequest(request): Promise<boolean> {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token');
    }
    const token = authHeader.split(' ')[1];
    try {
      const userId = await this.jwtService.getUserIdByToken(token)
      const user = await this.usersQueryRepository.getUser(userId);
      request.userId = user.id
      return true
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
