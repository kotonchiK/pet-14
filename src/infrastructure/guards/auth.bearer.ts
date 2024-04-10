import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersQueryRepository } from "../../features/users/infrastructure/users.query.repository";
import { JwtAuthService } from "../../features/users/application/jwt.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtAuthService,
  private readonly usersQueryRepository:UsersQueryRepository) {}

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
