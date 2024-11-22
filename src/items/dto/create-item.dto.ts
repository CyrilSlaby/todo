import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsEnum,
  IsNumber
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// DTO for creating a new item
export class CreateItemDto {
  @ApiProperty({
    description: 'Title of the item', // Description for Swagger documentation
    example: 'Buy Books', // Example value for the title
  })
  @IsString() // Ensures the value is a string
  @IsNotEmpty() // Ensures the value is not empty
  title: string;

  @ApiProperty({
    description: 'Description of the item', // Description for Swagger documentation
    example: 'Buy books about programming in Python and Node.js', // Example value for the description
  })
  @IsString() // Ensures the value is a string
  description: string;

  @ApiProperty({
    description: 'Deadline for completing the item', // Description for Swagger documentation
    example: '2024-12-01T23:59:59.000Z', // Example value in ISO8601 format
    type: String, // Swagger will recognize it as an ISO8601 formatted string
  })
  @IsDate() // Ensures the value is a valid Date object
  @Type(() => Date) // Converts the input value to a Date instance
  deadline: Date;

  @ApiProperty({
    description: 'Status of the item', // Description for Swagger documentation
    enum: ['active', 'completed', 'cancelled'], // Allowed values for status
    example: 'active', // Example value for the status
  })
  @IsEnum(['active', 'completed', 'cancelled']) // Ensures the value matches one of the defined enum values
  status: string;

  @ApiProperty({
    description: 'ID of the list the item belongs to', // Description for Swagger documentation
    example: 1, // Example value for the list ID
  })
  @IsNumber() // Ensures the value is a number
  @IsNotEmpty() // Ensures the value is not empty
  listId: number; // ID of the list to which the item belongs
}
