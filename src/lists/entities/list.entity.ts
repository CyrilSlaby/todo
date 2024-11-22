import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  ManyToOne
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Item } from '../../items/entities/item.entity';

// Entity representing a list, which can contain multiple items and be shared with multiple users
@Entity()
export class List {
  // Primary key column, auto-generated for each list
  @PrimaryGeneratedColumn()
  id: number;

  // Title of the list
  @Column()
  title: string;

  // Many-to-many relationship with User entity
  // A list can be shared by multiple users and each user can have multiple lists
  @ManyToMany(() => User, (user) => user.lists)
  users: User[];

  // One-to-many relationship with Item entity
  // A list can contain multiple items
  @OneToMany(() => Item, (item) => item.list)
  items: Item[];

  // Many-to-one relationship with User entity, representing the creator of the list
  // Automatically loads the user who created the list
  @ManyToOne(() => User, { eager: true })
  createdBy: User; // User who created the list
}
