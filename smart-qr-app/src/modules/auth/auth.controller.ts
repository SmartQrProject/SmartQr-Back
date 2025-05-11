import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('User creation (SignUP) and user login (SignIn) using Auth0')
@Controller('auth')
export class AuthController {
  //constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'protected endpoint for testing purpose ' })
  //@UseGuards(AuthGuard('jwt'))
  @Get('whoAmI')
  getProfile(@Req() req) {
    // console.log(req.oidc.accessToken);
    console.log(JSON.stringify(req.oidc.user));
    return JSON.stringify(req.oidc.user);
  }
}
