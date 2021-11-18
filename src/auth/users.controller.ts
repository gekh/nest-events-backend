import { BadRequestException, Body, Controller, Post } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { AuthService } from "./auth.service"
import { CreateUserDto } from "./input/create-user.dto"
import { User } from "./user.entity"

@Controller('user')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  @Post()
  async create(@Body() input: CreateUserDto) {
    const user = new User()
    if (input.password !== input.retypedPassword) {
      throw new BadRequestException(['Passwords are not identical.'])
    }

    const registeredCount = await this.userRepository.createQueryBuilder('u')
      .where('username=:username OR email=:email', {
        username: input.username,
        email: input.email,
      }).getCount()

    if (registeredCount > 0) {
      throw new BadRequestException(['There is a user with such credentials.'])
    }

    user.username = input.username
    user.password = await this.authService.hashPassword(input.password)
    user.email = input.email
    user.firstName = input.firstName
    user.lastName = input.lastName

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getTokenForUser(user)
    }
  }
}