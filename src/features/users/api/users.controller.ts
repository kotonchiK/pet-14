import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { UsersService } from "../application/users.service";
import { CreateUserDto } from "./models/input";
import { OutputUserModel } from "./models/output";
import { SortDirection } from "mongodb";
import { Pagination } from "../../../base/types/pagination.type";
import { ValidateObjectId } from "../../../infrastructure/pipes/ValidateObjectId";
import { BasicAuthGuard } from "../../../infrastructure/guards/auth.basic";

@Controller('users')
@UseGuards(new BasicAuthGuard())
export class UsersController {
  constructor(private usersService:UsersService) {}

  @Get()
  @UseGuards(BasicAuthGuard)
  async getUsers(
    @Query('sortBy') sortBy:string,
    @Query('sortDirection') sortDirection:SortDirection,
    @Query('pageNumber') pageNumber:number,
    @Query('pageSize') pageSize:number,
    @Query('searchLoginTerm') searchLoginTerm:string,
    @Query('searchEmailTerm') searchEmailTerm:string,
    ):Promise<Pagination<OutputUserModel>>{
    const query = {
      sortBy:sortBy,
      sortDirection:sortDirection,
      pageNumber:pageNumber,
      pageSize:pageSize,
      searchLoginTerm:searchLoginTerm,
      searchEmailTerm:searchEmailTerm
    }
    return await this.usersService.getUsers(query)
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  @UsePipes(ValidationPipe)
  async createUser(@Body() body :CreateUserDto):Promise<OutputUserModel> {

    return await this.usersService.createUser(body)
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async deleteUser(@Param('id', ValidateObjectId) id:string):Promise<boolean> {
    return await this.usersService.deleteUser(id)
  }
}

