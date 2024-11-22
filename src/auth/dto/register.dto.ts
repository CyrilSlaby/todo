import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Data Transfer Object (DTO) for user registration details
export class RegisterDto {

  // Property representing the user's email address
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  // @IsEmail validator ensures that the value is a valid email format
  @IsEmail()
  email: string = '';

  // Property representing the user's password
  @ApiProperty({
    description: 'Password for the user account',
    example: 'strongPassword123',
  })
  // @IsString validator ensures that the value is a string
  @IsString()
  // @MinLength validator ensures that the password is at least 8 characters long
  @MinLength(8)
  password: string = '';
}
