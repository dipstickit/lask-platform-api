import { PassportSerializer } from '@nestjs/passport';
import { User } from '../users/models/user.entity';
import { UsersService } from '../users/users.service';
import { Injectable } from '@nestjs/common';
import { DoneCallback } from 'passport';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: DoneCallback) {
    done(null, user.id.toString());
  }

  async deserializeUser(id: string, done: DoneCallback) {
    try {
      const user = await this.usersService.findUserToSession(parseInt(id, 10));
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  }
}
