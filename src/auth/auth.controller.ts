import { Controller, Get, Logger, Post, UseGuards } from "@nestjs/common"
import { AuthGuardJwt } from "./auth-guard.jwt"
import { AuthGuardLocal } from "./auth-guard.local"
import { AuthService } from "./auth.service"
import { CurrentUser } from "./current-user.decorator"
import { User } from "./user.entity"

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(
    private readonly authService: AuthService,

  ) { }

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    }
  }

  @Get('Profile')
  @UseGuards(AuthGuardJwt)
  async getProfile(@CurrentUser() user: User) {
    return user
  }
}