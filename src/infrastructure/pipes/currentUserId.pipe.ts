import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtAuthService } from "../../features/users/application/jwt.service";

@Injectable()
export class CurrentUserIdPipe implements NestMiddleware {
  constructor(private readonly jwtService: JwtAuthService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const userId = await this.jwtService.getUserIdByToken(token);
        req.userId = userId;
      } catch (error) {
        req.userId = 0;
      }
    } else {
      req.userId = 0;
    }
    next();
  }
}
