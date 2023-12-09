import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpRequestDto, LoginRequestDto } from 'src/dto';
import { UsersService } from 'src/modules/users/users.service';
import * as md5 from 'md5';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailVerifyService } from '../email-verify/email-verify.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailVerifyService: EmailVerifyService,
    private readonly mailService: MailService,
  ) {}

  async signUp(SignUpRequestDto: SignUpRequestDto): Promise<any> {
    const userExists = await this.usersService.findByEmail(
      SignUpRequestDto.email,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hash = this.hashData(SignUpRequestDto.password);
    const newUser = await this.usersService.create({
      ...SignUpRequestDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser.id);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    this.emailVerifyService.sendVerificationLetter(newUser.id, newUser.email);
    return tokens;
  }

  async signIn(data: LoginRequestDto) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new BadRequestException('User does not exist');
    if (!(this.hashData(data.password) == user.password))
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    await this.usersService.update(user.id, { last_logged_at: new Date() });
    return tokens;
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refresh_token: null });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refresh_token)
      throw new ForbiddenException('Access Denied');
    if (!(this.hashData(refreshToken) == user.refresh_token))
      throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  hashData(data: string) {
    return md5(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refresh_token: hashedRefreshToken,
    });
  }

  async getTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async ForgotPasswordRequest(email: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const emailVerify = await this.emailVerifyService.create(user.id);

    const Url = `${process.env.EMAIL_HOST}/password-reset/${emailVerify.id}`;
    await this.mailService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `To reset your password click here: <a href="${Url}">${Url}</a>`,
    });

    return 'Password reset link has been sent to your email.';
  }

  async NewPasswordRequest(id: string, password: string): Promise<string> {
    const emailVerify = await this.emailVerifyService.findById(id);
    if (!emailVerify) throw new NotFoundException('Invalid id');

    const user = await this.usersService.findById(emailVerify.user);
    if (!user) throw new NotFoundException('User not found');

    const hashedPassword = md5(password);
    await this.usersService.update(user.id, { password: hashedPassword });

    await this.emailVerifyService.deleteById(id);

    return 'Password has been reset successfully.';
  }
}
