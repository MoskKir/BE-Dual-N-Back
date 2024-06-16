import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { IUser } from '../users/interfaces/user.interface';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { ILoginUser } from './interfaces/login-user.interface';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(User)
    // private userRepository: Repository<User>,

    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(id: number, email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(id);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginUser: ILoginUser) {
    const { email, password } = loginUser;
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await this.usersService.comparePasswords(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const {
      id,
      username,
      created_at,
     } = user;

    const payload = { username: username, sub: id };

    return {
      userId: id,
      username,
      email,
      created_at,
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  async signUp(user: IUser) {
    const {
      id,
      username,
      email,
      created_at,
     } = await this.usersService.create(user);
    const payload = { username: username, sub: id };

    return {
      userId: id,
      username,
      email,
      created_at,
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newPayload: IJwtPayload = { username: payload.username, sub: payload.sub };
      return {
        access_token: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
        refresh_token: this.jwtService.sign(newPayload, { expiresIn: '30d' }),
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async findUser(email: string) {
    return this.usersService.findByEmail(email);
  }

  // TODO: replace any types
  async findOrCreateUser(user: any) {

    // const user = {
    //   email: emails[0].value,
    //   firstName: name.givenName,
    //   lastName: name.familyName,
    //   picture: photos[0].value,
    //   accessToken
    // }

    // export interface IUser {
    //   username: string;
    //   email: string;
    //   password: string;
    // }

    const {
      firstName,
      lastName,
      email
    } = user;
    let currentUser = await this.usersService.findByEmail(email);

    if (!currentUser) {
      const userPayload = {
        username: `${firstName} ${lastName}`,
        email,
        password: null,
      }
      currentUser = await this.usersService.create(userPayload);
    }
  }
}
