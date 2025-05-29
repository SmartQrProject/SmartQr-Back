import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const timeoutMs = 10000;

    console.log(`🟢 [START] ${req.method} ${req.originalUrl}`);

    const timeout = setTimeout(() => {
      console.warn(`⚠️ [TIMEOUT] ${req.method} ${req.originalUrl} está tardando más de ${timeoutMs / 1000}s`);
    }, timeoutMs);

    res.on('finish', () => {
      clearTimeout(timeout);
      const duration = Date.now() - start;
      console.log(`✅ [END] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });

    res.on('close', () => {
      clearTimeout(timeout);
      console.warn(`🔴 [CLOSED] ${req.method} ${req.originalUrl} - la conexión se cerró sin respuesta completa`);
    });

    next();
  }
}
