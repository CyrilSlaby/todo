import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Injectable class defining JWT authentication strategy using Passport.js
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Configuring the JWT strategy with settings
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts the JWT from the Authorization header as a Bearer token
      ignoreExpiration: false, // Ensures the token expiration is validated
      secretOrKey: process.env.JWT_SECRET, // Secret key used to verify the token's signature, taken from environment variables
    });
  }

  // Method to validate the payload of the JWT token
  async validate(payload: any) {
    console.log('Payload from token:', payload); // Debugging
    return { id: payload.sub, email: payload.email };
  }
}
