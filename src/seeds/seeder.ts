import { AppDataSource } from '../data-source';
import { User } from '../auth/entities/user.entity';
import { List } from '../lists/entities/list.entity';
import { Item } from '../items/entities/item.entity';
import * as bcrypt from 'bcrypt';

// Function to seed the database with initial data
async function seedDatabase() {
  const dataSource = AppDataSource;

  try {
    console.log('Connecting to the database...');
    await dataSource.initialize(); // Initialize the data source connection

    console.log('Clearing existing data...');

    // Delete relationships between users and lists, which are stored in the `user_lists_list` table
    await dataSource.query(`DELETE FROM "user_lists_list"`);

    // Delete records from `Item`, `List`, and `User` tables in the correct order
    await dataSource.manager.delete(Item, {});
    await dataSource.manager.delete(List, {});
    await dataSource.manager.delete(User, {});

    console.log('Creating seed data...');

    // Seed users - create and hash passwords for new users
    const hashedPassword = await bcrypt.hash('password', 10);
    const users = [
      dataSource.manager.create(User, {
        email: 'user1@example.com',
        password: hashedPassword,
      }),
      dataSource.manager.create(User, {
        email: 'user2@example.com',
        password: hashedPassword,
      }),
      dataSource.manager.create(User, {
        email: 'user3@example.com',
        password: hashedPassword,
      }),
    ];
    await dataSource.manager.save(users); // Save users to the database

    // Seed lists - thematic lists for bodybuilding, programming, and reading books about programming
    const lists = [
      dataSource.manager.create(List, {
        title: 'Bodybuilding Routine',
        users: [users[0]], // Assign the first user as part of the list
        createdBy: users[0], // Set the first user as the creator of the list
      }),
      dataSource.manager.create(List, {
        title: 'Programming Tasks',
        users: [users[1]], // Assign the second user as part of the list
        createdBy: users[1], // Set the second user as the creator of the list
      }),
      dataSource.manager.create(List, {
        title: 'Programming Books to Read',
        users: [users[2]], // Assign the third user as part of the list
        createdBy: users[2], // Set the third user as the creator of the list
      }),
    ];
    await dataSource.manager.save(lists); // Save lists to the database

    // Seed items - specific items for each list
    const items = [
      // Bodybuilding Routine Items
      dataSource.manager.create(Item, {
        title: 'Leg Day Workout',
        description: 'Squats, lunges, and leg press.',
        deadline: new Date('2024-12-01T10:00:00.000Z'),
        status: 'active',
        list: lists[0],
        createdBy: users[0],
      }),
      dataSource.manager.create(Item, {
        title: 'Chest and Triceps Workout',
        description: 'Bench press, dumbbell flyes, and tricep extensions.',
        deadline: new Date('2024-12-03T10:00:00.000Z'),
        status: 'active',
        list: lists[0],
        createdBy: users[0],
      }),
      dataSource.manager.create(Item, {
        title: 'Supplements Plan',
        description: 'Buy protein powder and creatine for next month.',
        deadline: new Date('2024-12-05T18:00:00.000Z'),
        status: 'active',
        list: lists[0],
        createdBy: users[0],
      }),

      // Programming Tasks Items
      dataSource.manager.create(Item, {
        title: 'Implement User Authentication',
        description: 'Create a login and registration system using JWT.',
        deadline: new Date('2024-12-06T23:59:59.000Z'),
        status: 'active',
        list: lists[1],
        createdBy: users[1],
      }),
      dataSource.manager.create(Item, {
        title: 'Fix Bug in Payment Module',
        description: 'Resolve the issue causing incorrect tax calculation.',
        deadline: new Date('2024-12-08T15:00:00.000Z'),
        status: 'active',
        list: lists[1],
        createdBy: users[1],
      }),
      dataSource.manager.create(Item, {
        title: 'Refactor Codebase',
        description: 'Refactor the old legacy code to improve readability and maintainability.',
        deadline: new Date('2024-12-10T17:00:00.000Z'),
        status: 'active',
        list: lists[1],
        createdBy: users[1],
      }),

      // Programming Books to Read Items
      dataSource.manager.create(Item, {
        title: 'Read "Clean Code" by Robert C. Martin',
        description: 'Focus on understanding best practices for writing clean and maintainable code.',
        deadline: new Date('2024-12-15T20:00:00.000Z'),
        status: 'active',
        list: lists[2],
        createdBy: users[2],
      }),
      dataSource.manager.create(Item, {
        title: 'Read "You Don\'t Know JS" by Kyle Simpson',
        description: 'Learn about the inner workings of JavaScript.',
        deadline: new Date('2024-12-20T20:00:00.000Z'),
        status: 'active',
        list: lists[2],
        createdBy: users[2],
      }),
      dataSource.manager.create(Item, {
        title: 'Read "The Pragmatic Programmer" by David Thomas and Andrew Hunt',
        description: 'Gain insights on software craftsmanship and best practices.',
        deadline: new Date('2024-12-25T18:00:00.000Z'),
        status: 'active',
        list: lists[2],
        createdBy: users[2],
      }),
    ];
    await dataSource.manager.save(items); // Save items to the database

    console.log('Seed data inserted successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await dataSource.destroy(); // Close the database connection
    console.log('Database connection closed.');
  }
}

// Call the seedDatabase function to populate the database
seedDatabase();
