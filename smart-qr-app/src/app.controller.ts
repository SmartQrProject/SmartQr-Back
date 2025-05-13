// src/app.controller.ts
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

@Controller()
export class AppController {
  @Get('public')
  getPublic(): string {
    return 'This is a public endpoint';
  }

  @Get('protected')
  getProtected(@Req() req: Request): any {
    console.log('Token validado', req.user, req.auth);
    return {
      message: 'This is a protected endpoint',
      user: req.auth, // auth viene de express-oauth2-jwt-bearer
    };
  }
}
