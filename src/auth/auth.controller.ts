import { Body, Controller, Get, Logger, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./create-user.dto"
import { CurrentUser } from "./current-user.decorator"
import { User } from "./user.entity"

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  @Post('registrate')
  async registrate(@Body() input: CreateUserDto) {
    const hash = this.authService.hashPassword(input.password).
    this.logger.debug(hash)
    return 'SUCCESS'
    // this.logg
    // return await this.userRepository.save({
    //   ...input,
    //   password: hash,
    // })
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    }
  }

  @Get('Profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@CurrentUser() user: User) {
    return user
  }
}