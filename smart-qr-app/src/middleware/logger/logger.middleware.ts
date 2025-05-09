import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(this: void, req: Request, res: Response, next: NextFunction) {
    console.log(`Metodo : ${req.method} en la Ruta: ${req.url} a Horas: ${new Date().toISOString()}`);
    next();
  }
}
