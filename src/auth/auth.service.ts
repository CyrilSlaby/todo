import {
  Injectable,
  ConflictException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  // Constructor injects dependencies required for the authentication service
  constructor(
    // Injects the User repository to interact with the User entity in the database
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // Injects JwtService to generate JWT tokens for authentication
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @param registerDto - Data Transfer Object containing the email and password for the new user
   * @returns - The newly created User entity
   */
  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password } = registerDto;

    // Check if a user with the given email already exists in the database
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists'); // Throws an exception if the email is already registered
    }

    // Hash the user's password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({ email, password: hashedPassword });

    // Save the new user entity in the database and return it
    return this.userRepository.save(newUser);
  }

  /**
   * Validate user credentials
   * @param email - The user's email address
   * @param password - The user's password
   * @returns - The User entity if credentials are valid, or null if they are not
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    // Find the user by email, selecting their hashed password for validation
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'], // Ensure password is selected as it is excluded by default
    });

    if (!user) {
      return null; // Returns null if no user is found with the given email
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      return null; // Returns null if the password does not match
    }

    // Return the user entity if the credentials are valid
    return user;
  }

  /**
   * Login the user and return a JWT token
   * @param user - The authenticated User entity
   * @returns - An object containing the access token
   */
  async login(user: User): Promise<{ accessToken: string }> {
    const payload = { email: user.email, sub: user.id }; // Create a payload with user's email and ID

    // Generate a JWT access token using the user's payload
    return { accessToken: this.jwtService.sign(payload) };
  }
}

