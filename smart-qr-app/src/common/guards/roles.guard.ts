/* eslint-disable */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/common/decorators/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()]);
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const hasRole = () => requiredRole.some((role) => user?.roles?.includes(role));
    const valid = user && user.roles && hasRole();
    if (!valid) throw new ForbiddenException('You dont have permissions to access this route ');
    return valid;
  }
}
