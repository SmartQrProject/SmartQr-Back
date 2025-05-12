import { Controller, UseGuards, Get, Req, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('User creation (SignUP) and user login (SignIn) using Auth0')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  async getAuth0Login(@Req() req) {
    console.log(req.oidc.accessToken);
    console.log(JSON.stringify(req.oidc.user));
    return JSON.stringify(req.oidc.user);
  }

  // @ApiOperation({ summary: 'protected endpoint for testing purpose ' })
  // @Post('login')
  // async localLogin(@Req() req) {
  //   await console.log(req.oidc.accessToken);
  //   console.log(JSON.stringify(req.oidc.user));
  //   return JSON.stringify(req.oidc.user);
  // }
}
