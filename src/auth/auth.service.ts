import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateGoogleUser(googleUser: {
    googleId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
    accessToken?: string;
  }) {
    try {
      let user = await this.usersService.findByGoogleId(
        googleUser.googleId,
      );

      if (!user) {
        user = await this.usersService.findByEmail(
          googleUser.email,
        );

        if (user) {
          user = await this.usersService.linkGoogleAccount(
            user.id,
            {
              googleId: googleUser.googleId,
              firstName: googleUser.firstName,
              lastName: googleUser.lastName,
              picture: googleUser.picture,
            },
          );
        } else {
          user = await this.usersService.createGoogleUser({
            googleId: googleUser.googleId,
            email: googleUser.email,
            firstName: googleUser.firstName,
            lastName: googleUser.lastName,
            picture: googleUser.picture,
          });
        }
      }

      const payload = {
        sub: user.id,
        email: user.email,
      };

      const jwt = await this.jwtService.signAsync(payload);

      return {
        user,
        jwt,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error durante la autenticación con Google',
      );
    }
  }
}