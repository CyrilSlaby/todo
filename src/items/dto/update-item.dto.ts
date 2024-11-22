import { IsString, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO for updating an existing item
export class UpdateItemDto {
  @ApiProperty({
    description: 'Updated title of the item', // Description for Swagger documentation
    example: 'Buy new mouse', // Example of an updated title
    required: false, // This field is optional
  })
  @IsOptional() // Marks the property as optional for validation
  @IsString() // Ensures the value is a string if provided
  title?: string;

  @ApiProperty({
    description: 'Updated description of the item', // Description for Swagger documentation
    example: 'Get new mouse from my parents', // Example of an updated description
    required: false, // This field is optional
  })
  @IsOptional() // Marks the property as optional for validation
  @IsString() // Ensures the value is a string if provided
  description?: string;

  @ApiProperty({
    description: 'Updated deadline for completing the item', // Description for Swagger documentation
    example: '2024-12-05T23:59:59.000Z', // Example of an updated deadline in ISO8601 format
    required: false, // This field is optional
    type: String, // Swagger will display it as a string (ISO8601 format)
  })
  @IsOptional() // Marks the property as optional for validation
  @IsDateString() // Ensures the value is a valid date string in ISO8601 format
  deadline?: string;

  @ApiProperty({
    description: 'Updated status of the item', // Description for Swagger documentation
    enum: ['active', 'completed', 'cancelled'], // Specifies allowed values for status
    example: 'completed', // Example of an updated status
    required: false, // This field is optional
  })
  @IsOptional() // Marks the property as optional for validation
  @IsIn(['active', 'completed', 'cancelled']) // Ensures the value is one of the specified allowed values
  status?: string;
}
