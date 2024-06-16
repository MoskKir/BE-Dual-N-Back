import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) {}

  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Req() req) {
  //   return {
  //     statusCode: 200,
  //     data: req.user,
  //   };
  // }

  // ------------ //

  @Get('google/signin')
  @UseGuards(AuthGuard('google'))
  async googleSignIn(@Req() req) {}

  @Get('google/callback/signin')
  @UseGuards(AuthGuard('google'))
  async googleSignInCallback(@Req() req) {
    return {
      message: 'User signed in',
      user: req.user,
    };
  }

  @Get('google/signup')
  @UseGuards(AuthGuard('google'))
  async googleSignUp(@Req() req) {}

  @Get('google/callback/signup')
  @UseGuards(AuthGuard('google'))
  async googleSignUpCallback(@Req() req) {
    return {
      message: 'User signed up',
      user: req.user,
    };
  }
}
