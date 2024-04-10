import {
  Body,
  Controller, Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res, UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { AuthService } from "../application/auth.service";
import { CodeDto, CreateUserDto, loginUserDto, MailDto, NewPasswordDto } from "./models/input";
import { Response, Request } from 'express';
import { RefreshTokenMiddleware } from "../../../infrastructure/middlewares/refToken.mdw";
import { JwtAuthGuard } from "../../../infrastructure/guards/auth.bearer";
import { UserMeInfoType } from "./models/output";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }


  @Post('registration')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationUser(@Body() dto:CreateUserDto):Promise<null>{

    await this.authService.registrationUser(dto);
    return null
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() dto:loginUserDto,
              @Res() res: Response):Promise<any> {
    // const title = req.headers['user-agent']
   // const ip = req.ip
    const tokens = await this.authService.userLogin(dto, 'ip', 'title')

    res.cookie('refreshToken', tokens.refresh, { httpOnly: true });

    return res.json({ accessToken:tokens.access })
  }


  @Post('/registration-confirmation')
  @UsePipes(ValidationPipe)
  @HttpCode(204)
  async emailConfirmation(@Body() dto:CodeDto):Promise<void>{

    await this.authService.emailConfirmation(dto)
  }


  @Post('/registration-email-resending')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.NO_CONTENT)
  async emailResending(@Body() dto:MailDto):Promise<void>{

    await this.authService.emailResending(dto)

  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(RefreshTokenMiddleware)
  async logout(@Req() req: Request):Promise<void>{
    await this.authService.logout(req.userId, req.deviceId)
  }

  @Post('/password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() dto:MailDto):Promise<void>{
    await this.authService.passwordRecovery(dto)
  }

  @Post('/new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() dto:NewPasswordDto):Promise<void>{
    await this.authService.newPassword(dto)
  }

  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshingTokens(@Req() req: Request,
                         @Res() res: Response):Promise<any>{
    const tokens = await this.authService.refreshingTokens(req.userId, req.deviceId, req.ip)

    res.cookie('refreshToken', tokens.refresh, { httpOnly: true });
    return res.json({ accessToken:tokens.access })
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req:Request):Promise<UserMeInfoType>{
    return await this.authService.userInfo(req.userId)
  }




}

