import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

// DTO for updating an existing list
export class UpdateListDto {
  @ApiProperty({
    description: 'Updated title of the list', // Description for Swagger documentation
    example: 'My Updated List', // Example value for the updated title
    required: true, // Indicates that this field is required
  })
  @IsString() // Ensures the value is a string
  @IsNotEmpty({ message: 'Title must not be empty' }) // Validates that the title is not empty, with a custom error message
  title: string;
}
