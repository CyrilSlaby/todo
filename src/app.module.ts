import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ListsModule } from './lists/lists.module';
import { ItemsModule } from './items/items.module';
import { AppDataSource } from './data-source'; // Import AppDataSource for TypeORM configuration

@Module({
  imports: [
    // Load environment variables globally from .env
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration accessible across all modules
    }),

    // Configure TypeORM with settings from AppDataSource
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...AppDataSource.options, // Use the configuration defined in data-source.ts
        autoLoadEntities: true,  // Automatically load entities registered in the application
      }),
    }),

    // Feature modules for application functionality
    AuthModule,  // Handles user authentication (e.g., login, registration)
    ListsModule, // Manages "Lists" functionality
    ItemsModule, // Manages "Items" within lists
  ],
})
export class AppModule {}
