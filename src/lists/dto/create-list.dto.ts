import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO for creating a new list
export class CreateListDto {
  @ApiProperty({
    description: 'Title of the list', // Description for Swagger documentation
    example: 'My New List', // Example value for the title
  })
  @IsString() // Ensures the value is a string
  @IsNotEmpty({ message: 'Title must not be empty' }) // Ensures the title is not an empty string, with a custom error message
  title: string;
}
