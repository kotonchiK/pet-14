import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { AuthService } from "../../features/users/application/auth.service";

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies.refreshToken) throw new UnauthorizedException('error')

    const result = await this.authService.refreshTokenAuthorization(req.cookies.refreshToken);

    if (!result) throw new UnauthorizedException('error')

    req.deviceId = result.deviceId;
    req.userId = result.userId;
    next();
  }
}
