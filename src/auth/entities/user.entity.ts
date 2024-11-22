import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { List } from '../../lists/entities/list.entity';

// Defining the User entity to be managed by TypeORM
@Entity()
export class User {

  // Primary key for the User entity, automatically generated
  @PrimaryGeneratedColumn()
  id: number;

  // Email field, unique for each user
  @Column({ unique: true })
  email: string;

  // Password field, not selected by default in queries to enhance security
  @Column({ select: false })
  password: string;

  // Many-to-Many relationship between User and List entities
  // A user can have multiple lists and each list can have multiple users
  @ManyToMany(() => List, (list: List) => list.users)
  // Specifies that the 'lists' field will be the owner side of the relationship and uses a join table to create a relation
  @JoinTable()
  lists: List[];
}
