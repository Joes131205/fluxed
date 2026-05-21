import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginRequest, RegisterRequest } from './dto/auth.dto';
import { checkPasswordHash, hashPassword } from 'packages/shared/utils/auth';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  private get googleClientId() {
    return this.configService.get('GOOGLE_CLIENT_ID');
  }

  private get googleClientSecret() {
    return this.configService.get('GOOGLE_CLIENT_SECRET');
  }

  private get googleRedirectURI() {
    return this.configService.get('GOOGLE_REDIRECT_URI');
  }

  private get googleOAuthScopes() {
    return this.configService.get('GOOGLE_OAUTH_SCOPES', 'profile email');
  }

  private get jwtSecret() {
    return this.configService.get('JWT_SECRET');
  }

  private get mobileAuthSuccessURI() {
    return this.configService.get('MOBILE_AUTH_SUCCESS_URI');
  }

  private get webAuthSuccessURI() {
    return this.configService.get(
      'WEB_AUTH_SUCCESS_URI',
      'http://localhost:3001/auth-success',
    );
  }

  async register(body: RegisterRequest) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await hashPassword(body.password);
    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: hashedPassword,
      },
    });
    const payload = { userId: user.id };

    return {
      user,
      token: await this.jwtService.signAsync(payload),
    };
  }

  async login(body: LoginRequest) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (
      !user ||
      !user.password ||
      !(await checkPasswordHash(body.password, user.password))
    ) {
      throw new BadRequestException('Invalid Credentials');
    }

    const payload = { userId: user.id };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('User Not Found');
    }

    return {
      user,
    };
  }

  startGoogleAuth(state: string = 'web') {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', this.googleClientId);
    authUrl.searchParams.set('redirect_uri', this.googleRedirectURI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', this.googleOAuthScopes);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', state);

    return { url: authUrl.toString() };
  }

  async callbackGoogleAuth(
    code?: string,
    state: string = 'web',
    oauthError?: string,
    oauthErrorDescription?: string,
  ) {
    console.log('getting token...');

    if (oauthError) {
      throw new BadRequestException(oauthErrorDescription ?? oauthError);
    }

    if (!code) {
      throw new ForbiddenException('Not Authorized');
    }

    try {
      // Exchange code for tokens
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          code,
          client_id: this.googleClientId,
          client_secret: this.googleClientSecret,
          redirect_uri: this.googleRedirectURI,
          grant_type: 'authorization_code',
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          validateStatus: () => true,
        },
      );

      const tokens = tokenResponse.data as {
        access_token?: string;
        refresh_token?: string;
        error?: string;
        error_description?: string;
      };

      if (tokenResponse.status >= 400 || tokens.error || !tokens.access_token) {
        console.error('Google token exchange failed', {
          status: tokenResponse.status,
          error: tokens.error,
          error_description: tokens.error_description,
        });

        throw new BadRequestException(
          tokens.error_description ||
            'Unable to complete Google OAuth token exchange',
        );
      }

      const { access_token, refresh_token } = tokens;

      // Fetch user profile
      const userProfileResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          validateStatus: () => true,
        },
      );

      if (userProfileResponse.status >= 400) {
        console.error('Google profile fetch failed', {
          status: userProfileResponse.status,
          body: userProfileResponse.data,
        });

        throw new BadRequestException('Unable to fetch Google profile');
      }

      const userProfile = userProfileResponse.data as {
        email?: string;
        name?: string;
        sub?: string;
      };

      const { email, name, sub: googleId } = userProfile;

      if (!email || !name || !googleId) {
        throw new BadRequestException('Incomplete Google profile data');
      }

      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email,
            username: name,
            googleRefreshToken: refresh_token,
            googleId,
          },
        });
      } else {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            googleRefreshToken: refresh_token,
            googleId,
            email: user.email,
            username: user.username,
          },
        });
      }

      if (!user) {
        throw new InternalServerErrorException(
          'Unable to create or update user',
        );
      }

      const token = await this.jwtService.signAsync({ userId: user.id });

      console.log(token);
      console.log('Redirecting...' + state);

      const redirectUrl =
        state === 'mobile'
          ? `${this.mobileAuthSuccessURI}?token=${token}`
          : `${this.webAuthSuccessURI}?token=${token}`;

      return { url: redirectUrl };
    } catch (error) {
      console.error('Google callback failed', error);
      throw new InternalServerErrorException('Google callback failed');
    }
  }
}
