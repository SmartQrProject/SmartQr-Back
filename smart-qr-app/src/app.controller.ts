// src/app.controller.ts
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

@Controller()
export class AppController {}
