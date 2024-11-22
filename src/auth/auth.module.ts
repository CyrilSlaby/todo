import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

// Defines the AuthModule to handle authentication features in the application
@Module({
  imports: [
    // Registers the User entity with TypeORM, allowing it to be used in repositories
    TypeOrmModule.forFeature([User]),

    // Registers the Passport module with 'jwt' as the default authentication strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configures the JwtModule for token generation and validation
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', // Uses the JWT secret from environment variables or a default value if not provided
      signOptions: { expiresIn: '1h' }, // Configures the token expiration time (1 hour)
    }),
  ],
  // Registers controllers associated with this module
  controllers: [AuthController],

  providers: [
    AuthService,    // Provides the AuthService for handling authentication logic
    JwtStrategy,    // Provides the JWT strategy for validating JWT tokens with Passport
    LocalStrategy,  // Provides the local authentication strategy for validating user credentials
  ],

  exports: [
    AuthService,              // Exports AuthService so it can be used in other modules (e.g., to check authentication in different parts of the application)
    TypeOrmModule,            // Exports TypeOrmModule to allow access to User repository in other modules
    PassportModule,           // Exports PassportModule so other modules can use the authentication strategies
    JwtModule,                // Exports JwtModule for generating tokens in other parts of the application
  ],
})
export class AuthModule {}

