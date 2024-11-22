import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { List } from '../lists/entities/list.entity';

// Module for managing items, including imports, controllers, providers, and exports
@Module({
  // Registers the Item and List entities with TypeORM for database operations
  imports: [TypeOrmModule.forFeature([Item, List])],
  // Registers the ItemsController to handle HTTP requests
  controllers: [ItemsController],
  // Provides the ItemsService to handle business logic related to items
  providers: [ItemsService],
  // Exports ItemsService to be used in other modules if needed
  exports: [ItemsService],
})
export class ItemsModule {}
