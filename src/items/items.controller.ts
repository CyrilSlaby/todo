import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Request,
  UseGuards
} from '@nestjs/common';

import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam
} from '@nestjs/swagger';

import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Item } from './entities/item.entity';

// Controller responsible for managing item-related endpoints
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // Endpoint for creating a new item
  @ApiTags('Items')
  @UseGuards(JwtAuthGuard) // Guard to ensure the user is authenticated
  @Post()
  @ApiBearerAuth() // Indicates the need for Bearer token in Swagger documentation
  @ApiBody({
    description: 'Data required to create a new item',
    type: CreateItemDto,
    examples: {
      validExample: {
        summary: 'Valid Input',
        value: {
          title: 'Buy Book',
          description: 'Buy book about programming in Typescript',
          deadline: '2024-11-30T23:59:59.000Z',
          status: 'active',
          listId: 1,
        },
      },
      invalidExample: {
        summary: 'Invalid Input',
        value: {
          title: '', // Empty title is invalid
          deadline: 'invalid-date', // Deadline must be a valid date
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Item successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 403,
    description: 'User does not have access to the specified list.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access. JWT token is missing or invalid.',
  })
  async create(@Body() createItemDto: CreateItemDto, @Request() req: any) {
    return this.itemsService.create(createItemDto, req.user.id);
  }

  // Endpoint for retrieving all items
  @ApiTags('Items')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns all items with their details',
  })
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  // Endpoint for retrieving a single item by ID
  @ApiTags('Items')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the item to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the item details',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
  })
  async findOne(@Param('id') id: number): Promise<Item> {
    return this.itemsService.findOne(+id);
  }

  // Endpoint for updating an item by ID
  @ApiTags('Items')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the item to update',
  })
  @ApiBody({
    description: 'Data for updating an item',
    type: UpdateItemDto,
    examples: {
      validExample: {
        summary: 'Valid Input',
        value: {
          title: 'Learn TypeScript',
          description: 'Focus on advanced features',
          deadline: '2024-12-15T23:59:59.000Z',
          status: 'active',
        },
      },
      partialUpdateExample: {
        summary: 'Partial Update',
        value: {
          status: 'completed',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The item was successfully updated',
  })
  @ApiResponse({
    status: 403,
    description: 'User does not have permission to update this item',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
  })
  async update(
    @Param('id') id: number,
    @Body() updateItemDto: UpdateItemDto,
    @Request() req: any,
  ) {
    return this.itemsService.update(id, updateItemDto, req.user.id);
  }

  // Endpoint for deleting an item by ID
  @ApiTags('Items')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the item to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The item was successfully deleted',
  })
  @ApiResponse({
    status: 403,
    description: 'User does not have permission to delete this item',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
  })
  async remove(@Param('id') id: number, @Request() req: any): Promise<void> {
    return this.itemsService.remove(+id, req.user.id);
  }
}
