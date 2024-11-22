import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Req,
  UnauthorizedException
} from '@nestjs/common';

import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam
} from '@nestjs/swagger';

import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { List } from './entities/list.entity';

// Controller to manage list-related endpoints
@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  // Endpoint to create a new list
  @ApiTags('Lists')
  @ApiBearerAuth() // Swagger bearer token for authentication
  @UseGuards(JwtAuthGuard) // Protects endpoint with JWT-based authentication
  @Post()
  @ApiBody({
    description: 'Data for creating a new list',
    type: CreateListDto,
    examples: {
      validExample: {
        summary: 'Valid Input',
        value: {
          title: 'My New List', // Expected value from the user
        },
      },
      invalidExample: {
        summary: 'Invalid Input',
        value: {
          title: '', // An empty title is invalid
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The list was successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access',
  })
  async create(@Body() createListDto: CreateListDto, @Request() req: any) {
    return this.listsService.create(createListDto, req.user.id);
  }

  // Endpoint to get all lists
  @ApiTags('Lists')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns all lists with their items and users',
  })
  async findAll() {
    const lists = await this.listsService.findAll();
    return lists.map((list) => ({
      id: list.id,
      title: list.title,
      users: list.users.map((user) => ({
        id: user.id,
        email: user.email,
      })),
      createdBy: {
        id: list.createdBy.id,
        email: list.createdBy.email,
      },
      items: list.items.map((item) => ({
        id: item.id,
        title: item.title,
        status: item.status,
      })),
    }));
  }

  // Endpoint to get a specific list by ID
  @ApiTags('Lists')
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the list to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'List successfully retrieved.',
  })
  @ApiResponse({
    status: 404,
    description: 'List not found.',
  })
  async findOne(@Param('id') id: number, @Request() req: any) {
    const userId = req.user?.id ?? null;
    return this.listsService.findOne(id, userId);
  }

  // Endpoint to update a list
  @ApiTags('Lists')
  @ApiBearerAuth() // Swagger bearer token for authentication
  @UseGuards(JwtAuthGuard) // Protects endpoint with JWT-based authentication
  @Put(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the list to update',
  })
  @ApiBody({
    description: 'Data for updating the list',
    type: UpdateListDto,
    examples: {
      validExample: {
        summary: 'Valid Input',
        value: {
          title: 'Updated List Title',
        },
      },
      invalidExample: {
        summary: 'Invalid Input',
        value: {
          title: '', // Empty title is invalid
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The list was successfully updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 403,
    description: 'User does not have permission to update this list.',
  })
  @ApiResponse({
    status: 404,
    description: 'List not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  async update(
    @Param('id') id: number,
    @Body() updateListDto: UpdateListDto,
    @Request() req: any,
  ) {
    return this.listsService.update(id, updateListDto, req.user.id);
  }

  // Endpoint to delete a list
  @ApiTags('Lists')
  @ApiBearerAuth() // Swagger bearer token for authentication
  @UseGuards(JwtAuthGuard) // Protects endpoint with JWT-based authentication
  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the list to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The list was successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'List not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  async remove(@Param('id') id: number, @Request() req: any) {
    return this.listsService.remove(id, req.user.id);
  }

  // Endpoint to share a list with another user
  @ApiTags('Lists')
  @ApiBearerAuth() // Swagger bearer token for authentication
  @UseGuards(JwtAuthGuard) // Protects endpoint with JWT-based authentication
  @Post(':id/share')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the list to share',
  })
  @ApiBody({
    description: 'Email of the user to share the list with',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'friend@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The list was successfully shared.',
  })
  @ApiResponse({
    status: 404,
    description: 'List not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
  })
  async shareList(
    @Param('id') id: number,
    @Body('email') email: string,
    @Req() req: any,
  ): Promise<List> {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.listsService.shareList(id, email, userId);
  }
}
