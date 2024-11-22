import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { List } from '../../lists/entities/list.entity';
import { User } from '../../auth/entities/user.entity';

// Entity representing an item in the database
@Entity()
export class Item {
  // Primary key column, auto-generated for each item
  @PrimaryGeneratedColumn()
  id: number;

  // Title of the item
  @Column()
  title: string;

  // Optional description of the item
  @Column({ nullable: true })
  description?: string;

  // Deadline for completing the item
  @Column()
  deadline: Date;

  // Status of the item, defaults to 'active'
  @Column({ default: 'active' })
  status: string;

  // Many-to-one relationship with the List entity
  // Items are associated with a list; cascade deletion is enabled
  @ManyToOne(() => List, (list) => list.items, { onDelete: 'CASCADE' })
  list: List;

  // Many-to-one relationship with the User entity, representing the creator of the item
  // Automatically loads the user entity; sets to null if the user is deleted
  @ManyToOne(() => User, { eager: true, onDelete: 'SET NULL' })
  createdBy: User;
}
