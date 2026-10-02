import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

interface AuthRequest extends Request {
  user: {
    jwt: string;
    user: {
      id: number;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      picture?: string | null;
      googleId?: string | null;
    };
  };
}

interface JwtRequest extends Request {
  user: {
    userId: number;
    email: string;
  };
}

@Controller('auth')
export class AuthController {

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport redirige automáticamente a Google
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: AuthRequest,
    @Res() res: Response,
  ) {
    const token = req.user.jwt;

    return res.status(200).json({
      token,
      user: req.user.user,
    });
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: JwtRequest) {
    return req.user;
  }
}