import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

// Injectable class defining local authentication strategy using Passport.js
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // Constructor that injects AuthService and sets the username field as 'email'
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' }); // Use 'email' instead of default 'username' for authentication
  }

  // Method to validate user credentials
  async validate(email: string, password: string): Promise<any> {
    // Calls AuthService to validate the provided email and password
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      // Throws an exception if the credentials are invalid
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
