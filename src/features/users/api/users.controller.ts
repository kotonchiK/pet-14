import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { UsersService } from "../application/users.service";
import { CreateUserDto } from "./models/input";
import { OutputUserModel } from "./models/output";
import { SortDirection } from "mongodb";
import { Pagination } from "../../../base/types/pagination.type";
import { ValidateObjectId } from "../../../infrastructure/pipes/ValidateObjectId";

@Controller('/users')
export class UsersController {
  constructor(private usersService:UsersService) {}

  @Get()
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
  @UsePipes(ValidationPipe)
  async createUser(@Body() dto:CreateUserDto):Promise<OutputUserModel> {

    return await this.usersService.createUser(dto)
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id', ValidateObjectId) id:string):Promise<boolean> {
    return await this.usersService.deleteUser(id)
  }
}

