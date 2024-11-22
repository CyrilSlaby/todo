import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards
} from '@nestjs/common';

import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger';

import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { Request as ExpressRequest } from 'express';

// Controller responsible for managing authentication-related endpoints
@Controller('auth')
export class AuthController {
  // Injecting AuthService to manage authentication logic
  constructor(private readonly authService: AuthService) {}

  // Register endpoint for creating a new user
  @ApiTags('Auth') // Adds 'Auth' tag for Swagger documentation grouping
  @Post('register')
  @ApiBody({
    description: 'User registration data', // Description of the request body for documentation
    type: RegisterDto, // Specifies the data type for validation and documentation purposes
    examples: {
      validExample: {
        summary: 'Valid Input',
        value: {
          email: 'user@example.com',
          password: 'StrongPassword123!',
        },
      },
      invalidExample: {
        summary: 'Invalid Input',
        value: {
          email: '', // Empty email is invalid
          password: '123', // Weak password is invalid
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The user was successfully registered.', // Successful registration response
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        password: '$2b$10$HashedPasswordExample', // The password is hashed for security
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data', // Response when input validation fails
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email', 'password must be at least 8 characters'],
        error: 'Bad Request',
      },
    },
  })
  // Async method for registering a user, returns the created User entity
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }

  // Login endpoint for user authentication
  @ApiTags('Auth')
  @UseGuards(LocalAuthGuard) // Uses LocalAuthGuard to handle the login process
  @Post('login')
  @ApiBody({
    description: 'User login credentials', // Description for Swagger documentation
    schema: {
      example: {
        email: 'user@example.com',
        password: 'StrongPassword123!',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in. Returns an access token.', // Successful login response
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTYxNTc3MDAzMCwiZXhwIjoxNjE1NzcwMzMwfQ.DmXv6M8X90B_bL7yWmYp0Ns4SNzN7q1iPfHaVkfRlDQ',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or unauthorized access.', // Response when login credentials are incorrect
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  // Async method for logging in a user, returns an access token
  async login(@Request() req: ExpressRequest): Promise<{ accessToken: string }> {
    if (!req.user) {
      throw new Error('User not authenticated'); // Ensures the user is authenticated before proceeding
    }

    return this.authService.login(req.user as User); // Calls AuthService to generate a JWT access token
  }

  // Get profile endpoint for retrieving the authenticated user's information
  @ApiTags('Auth')
  @UseGuards(JwtAuthGuard) // Uses JwtAuthGuard to protect this route, requiring a valid JWT
  @Get('me')
  @ApiBearerAuth() // Adds a Bearer token authentication header in Swagger documentation
  @ApiResponse({
    status: 200,
    description: 'Returns the profile of the authenticated user.', // Successful response when retrieving user profile
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access. JWT token is missing or invalid.', // Response when JWT is missing or invalid
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  // Method to get the authenticated user's profile
  getProfile(@Request() req: ExpressRequest): User {
    if (!req.user) {
      throw new Error('User not authenticated'); // Ensures the user is authenticated before accessing profile
    }

    return req.user as User; // Returns user information (assumes `req.user` has been properly populated)
  }
}
