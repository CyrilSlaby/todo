import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables from `.env` file
config();

export const AppDataSource = new DataSource({
  type: 'postgres', // Type of database
  host: process.env.DB_HOST || 'localhost', // Database host, defaults to localhost
  port: parseInt(process.env.DB_PORT || '5432', 10), // Database port, defaults to 5432
  username: process.env.DB_USER || 'postgres', // Database username, defaults to 'postgres'
  password: process.env.DB_PASSWORD || 'password', // Database password, defaults to 'password'
  database: process.env.DB_NAME || 'todo_db', // Database name, defaults to 'todo_db'
  entities: [`${__dirname}/**/*.entity.{ts,js}`], // Finds entities (both TypeScript and JavaScript after build)
  migrations: [`${__dirname}/migrations/*.{ts,js}`], // Finds migration files (both TypeScript and JavaScript after build)
  synchronize: false, // Synchronization is disabled, as migrations are used
  logging: true, // Enables SQL query logging
});

// Initialize the data source and handle success or error
AppDataSource.initialize()
  .then(() => console.log('Data Source has been initialized!')) // Log success message
  .catch((err) => console.error('Error during Data Source initialization:', err)); // Log error if initialization fails
