import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { Item } from '../items/entities/item.entity';
import { AuthModule } from '../auth/auth.module';

// Module for managing lists, including CRUD operations and related services
@Module({
  // Registering entities and importing required modules
  imports: [
    TypeOrmModule.forFeature([List, Item]), // Registers List and Item entities with TypeORM
    AuthModule, // Imports AuthModule for user authentication
  ],
  // Registering the controller for HTTP request handling
  controllers: [ListsController],
  // Providing ListsService to handle the business logic related to lists
  providers: [ListsService],
  // Exporting ListsService so that it can be used in other modules if needed
  exports: [ListsService],
})
export class ListsModule {}
