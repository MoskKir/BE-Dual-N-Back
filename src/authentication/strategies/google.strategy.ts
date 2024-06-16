import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { googleConstants } from '../constants';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService
  ) {
    super({
      clientID: googleConstants.clientId,
      clientSecret: googleConstants.clientSecret,
      callbackURL: googleConstants.callbackUrl,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  // TODO: replace any types
  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const { name, emails, photos } = profile
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken
    }

    const isSignup = req.url.includes('signup');
    let existingUser;

    if (isSignup) {
      existingUser = await this.authService.findOrCreateUser(user);
    } else {
      existingUser = await this.authService.findUser(user.email);
      if (!existingUser) {
        return done(new Error('User not found'), null);
      }
    }

    done(null, user);
  }
}
