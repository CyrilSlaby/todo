# Todo Application

## Description

This is a Todo Application built using NestJS and TypeScript. The application is fully dockerized and uses PostgreSQL as its database. It provides user authentication via JWT and supports features such as list and item management, sharing of lists, and error handling with a global error filter. The application is designed to run on Node.js v20 and PostgreSQL v17.

## Features:

    Authentication:
        User registration with JWT-based authentication.
        Secure login functionality.

    List Management:
        Add, get, update, delete, and manage todo lists.
        Share lists between users.

    Item Management:
        Add, update, delete, and manage items within todo lists.

    API Documentation:
        Comprehensive documentation via Swagger.

    Error Handling:
        Custom global error filter for consistent error management.

    Dockerized Setup:
        Application and database are configured and run using docker-compose.

    Database Migrations and Seeding:
        Supports automatic generation and execution of migrations as well as data seeding.

### Tech Stack

    Framework: NestJS (TypeScript)
    Database: PostgreSQL v17
    Runtime: Node.js v20
    API Documentation: Swagger
    Containerization: Docker with docker-compose

### Application Ports

    Application Port: 5000
    Database Port: 5432

### Installation and Setup

    Install Docker and Docker Compose on your machine.


### Build and run the application using Docker Compose:

    docker-compose build
    docker-compose up

    Access the application:
        Application: http://localhost:5000
        Swagger Documentation: http://localhost:5000/api

### Running Migrations and Seeds

After starting the application, you can run database migrations and seeds using the following commands:
Generate a new migration:

    docker exec -it amcef-api-1 npm run migration:generate -- ./src/migrations/NewMigration -d ./src/data-source.ts

### Run all migrations:

    docker exec -it amcef-api-1 npm run migration:run

### Run database seeds:

    docker exec -it amcef-api-1 npx ts-node ./src/seeds/seeder.ts


### Error Handling

The application features a global error filter to handle and standardize errors across the application.



## Possible Extensions:
    
    1. Frontend Integration

    Purpose: Build an interactive and user-friendly interface for the todo application. 
    A modern frontend framework (Angular, React, Vue.js) can be used to consume the NestJS API.
    
    2. UUID (Universal Unique Identifier)

    Purpose: Used to generate unique identifiers for entities like users, lists, or items. 
    This is particularly useful in distributed systems to ensure global uniqueness.

    3. File Upload and Storage

    Purpose: Allow users to upload and manage files (e.g., images or documents attached to lists or items).

    4. Internationalization (i18n)

    Purpose: Enable support for multiple languages to make the application more user-friendly for global audiences.
