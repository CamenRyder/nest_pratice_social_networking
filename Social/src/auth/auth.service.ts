import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { RegisterDTO, LoginDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDTO: RegisterDTO): Promise<any> {
    try {
      const haveData = await this.prismaService.user.findFirst({
        where: {
          email: registerDTO.email,
        },
      });
      if (haveData) {
        throw new ForbiddenException('Email has signed up');
      }
      const hasedPassword = await argon.hash(registerDTO.password);
      const user = await this.prismaService.user.create({
        data: {
          email: registerDTO.email,
          hash_password: hasedPassword,
          fullname: registerDTO.fullname,
          role_id: 1,
        },
        // select: { user_id: true, email: true, hash_password: false },
        include: {
          Post: true,
          Follower_Follower_user_follow_er_idToUser: true,
          Follower_Follower_user_idToUser: true,
        },
      });
      return {
        data: user,
        message: 'Sign up success',
      };
    } catch (error) {
      if (error.code == 'P2002') {
        throw new ForbiddenException('Error in credentials');
      }
      return error;
    }
  }

  async login(loginDTO: LoginDTO) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: loginDTO.email,
      },
      include: {
        Post: true,
        Follower_Follower_user_idToUser: true,
        Follower_Follower_user_follow_er_idToUser: true,
      },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    } else {
      const passwordMatched = await argon.verify(
        user.hash_password,
        loginDTO.password,
      );
      if (!passwordMatched) {
        throw new ForbiddenException('Incorrect Password');
      } else {
        delete user.hash_password;
      }
    }
    const token = await this.signJwtToken(user.user_id, user.email);
    return {
      message: 'login success',
      data: user,
      accessToken: token,
    };
  }

  async signJwtToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    return this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}
