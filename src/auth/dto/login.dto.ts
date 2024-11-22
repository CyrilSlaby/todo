import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Data Transfer Object (DTO) for user login details
export class LoginDto {

  // Property for the user's email address with description and example for API documentation
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  // Validator to ensure the value is in email format
  @IsEmail()
  email: string;

  // Property for the user's password with description and example for API documentation
  @ApiProperty({
    description: 'Password for the user account',
    example: 'strongPassword123',
  })
  // Validator to ensure the value is a string
  @IsString()
  password: string;
}
