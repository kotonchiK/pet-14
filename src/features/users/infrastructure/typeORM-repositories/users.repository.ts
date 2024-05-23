import { randomUUID } from "node:crypto";
import { add } from "date-fns";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersEntity } from "../domains/users.entity";
import { CodeDto, MailDto, UserDb } from "../../api/models/input";
export class UsersRepository_TYPEORM {
  constructor(
    @InjectRepository(UsersEntity) private usersRepository:Repository<UsersEntity>,
  ){}

  async getUserEntity(userId:number):Promise<UsersEntity>{
    const user = await this.usersRepository.findOne({where:{id:userId}});

    if(!user) throw new NotFoundException()

    return user
  }
  async createUser(newUser:UserDb):Promise<UsersEntity | null> {
    try {
      const user = {
        login:newUser.login,
        email:newUser.email,
        password:newUser.password,
        createdAt:newUser.createdAt,
        confirmationCode:newUser.emailConfirmation.confirmationCode,
        expirationDate:newUser.emailConfirmation.expirationDate,
        isConfirmed:newUser.emailConfirmation.isConfirmed
      }

      return await this.usersRepository.save(user)
    } catch (error) {
      if (error.code === '23505') {
        let fieldName = '';
        if (error.detail.includes('login')) {
          fieldName = 'login';
        } else if (error.detail.includes('email')) {
          fieldName = 'email';
        }
        if (fieldName) {
          throw new BadRequestException({ message: `User with this ${fieldName} already exists`, field: fieldName });
        }
      }
      console.log('Create-User error => ', error);
      return null;
    }
  }


  async deleteUser(id:number):Promise<void> {
    try {
      const user = await this.usersRepository.findOne({ where:{id:id} })
      await this.usersRepository.remove(user)
    } catch (e) {
      console.log('Delete-User error => ', e)
      throw new NotFoundException()
    }
  }

   async emailConfirmation(code:CodeDto):Promise<boolean>{
    try{
      const userEmailConfirmation = await this.usersRepository.findOne({ where: { confirmationCode: code.code } });

      if(!userEmailConfirmation || userEmailConfirmation.isConfirmed || new Date() > userEmailConfirmation.expirationDate) return false

      userEmailConfirmation.isConfirmed = true

      await this.usersRepository.save(userEmailConfirmation)

      return true
    } catch (error) {
      throw new BadRequestException({message:'Confirm problem', field:'code'})
    }
  }

  async updateCodeConfirmationInfo(user:UsersEntity):Promise<string>{
    try {
      const confirmationCode = randomUUID()
      const expirationDate = add(new Date(), { hours: 1, minutes: 30, })

      user.confirmationCode = confirmationCode
      user.expirationDate = expirationDate

      await this.usersRepository.save(user)

      return confirmationCode
    } catch (e) {
      console.log('Confirm code info was not updated')
      return null
    }
  }

  // const user = await this.dataSource
  //   .createQueryBuilder(UsersEntity,'users_entity')
  //  .leftJoinAndSelect(EmailConfirmationEntity,"email_confirmation_entity", "email_confirmation_entity.id = user.emailConfirmationId")
  //   .where('users_entity.email = :email', { email: dto.email })
  //   .getOne()
  //
  // console.log({user1:user})

  async findByEmail(dto:MailDto):Promise<UsersEntity> {

    const getUser = await this.usersRepository.findOne({
      where:{"email": dto.email}
    })

    if (!getUser) throw new BadRequestException({message:'Confirm problem', field:'email'})

    return getUser
  }

}