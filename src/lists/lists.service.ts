import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { User } from '../auth/entities/user.entity';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Creates a new list.
   *
   * @param {CreateListDto} createListDto - The DTO containing the list data.
   * @param {number} userId - The ID of the user creating the list.
   * @returns {Promise<List>} - The newly created list.
   * @throws {NotFoundException} - If the user with the given ID is not found.
   */
  async create(createListDto: CreateListDto, userId: number): Promise<List> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const newList = this.listsRepository.create({
      ...createListDto,
      users: [user], // Adds the current user to the list
      createdBy: user, // Sets the user as the creator
    });

    return this.listsRepository.save(newList);
  }

  /**
   * Retrieves all lists with related users and items.
   *
   * @returns {Promise<List[]>} - A list of all lists.
   */
  async findAll(): Promise<List[]> {
    return this.listsRepository.find({ relations: ['users', 'items'] });
  }

  /**
   * Retrieves a specific list by ID.
   *
   * @param {number} id - The ID of the list to retrieve.
   * @param {number | null} userId - The ID of the user making the request, or null if not authenticated.
   * @returns {Promise<List>} - The requested list.
   * @throws {NotFoundException} - If the list with the given ID is not found.
   * @throws {ForbiddenException} - If the user does not have access to the list.
   */
  async findOne(id: number, userId: number | null): Promise<List> {
    const list = await this.listsRepository.findOne({
      where: { id },
      relations: ['users', 'items', 'createdBy'],
    });

    if (!list) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }

    // If `userId` exists, verify access
    if (userId && !list.users.some((user) => user.id === userId)) {
      throw new ForbiddenException(`You do not have access to this list`);
    }

    return list;
  }

  /**
   * Updates an existing list.
   *
   * @param {number} id - The ID of the list to update.
   * @param {UpdateListDto} updateListDto - The DTO containing the updated list data.
   * @param {number} userId - The ID of the user making the update.
   * @returns {Promise<List>} - The updated list.
   * @throws {NotFoundException} - If the list with the given ID is not found.
   * @throws {ForbiddenException} - If the user does not have access to the list.
   */
  async update(id: number, updateListDto: UpdateListDto, userId: number): Promise<List> {
    const list = await this.findOne(id, userId);

    Object.assign(list, updateListDto);
    return this.listsRepository.save(list);
  }

  /**
   * Deletes an existing list.
   *
   * @param {number} id - The ID of the list to delete.
   * @param {number} userId - The ID of the user making the delete request.
   * @returns {Promise<void>} - Void if successful.
   * @throws {NotFoundException} - If the list with the given ID is not found.
   * @throws {ForbiddenException} - If the user does not have access to the list.
   */
  async remove(id: number, userId: number): Promise<void> {
    const list = await this.findOne(id, userId);

    await this.listsRepository.remove(list);
  }

  /**
   * Shares an existing list with another user.
   *
   * @param {number} listId - The ID of the list to share.
   * @param {string} email - The email of the user to share the list with.
   * @param {number} ownerId - The ID of the owner of the list.
   * @returns {Promise<List>} - The updated list with the new shared user.
   * @throws {NotFoundException} - If the list or the user with the given email is not found.
   * @throws {ForbiddenException} - If the owner does not have permission to share the list.
   * @throws {ConflictException} - If the user is already in the list.
   */
  async shareList(listId: number, email: string, ownerId: number): Promise<List> {
    const list = await this.listsRepository.findOne({
      where: { id: listId },
      relations: ['users'],
    });

    if (!list) {
      throw new NotFoundException(`List with ID ${listId} not found`);
    }

    // Logging for debugging purposes
    console.log('List ID:', listId);
    console.log('List:', list);

    // Safe access to `list.users`
    console.log('List Users:', list.users || []);
    console.log('User ID from token:', ownerId);

    // Verify if the owner has access to share the list
    const isOwner = list.users.some((user) => user.id === ownerId);
    if (!isOwner) {
      throw new ForbiddenException(`You do not have permission to share this list`);
    }

    const userToShare = await this.usersRepository.findOneBy({ email });
    if (!userToShare) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Check if the user is already in the list
    const isAlreadyInList = list.users.some((user) => user.id === userToShare.id);
    if (isAlreadyInList) {
      throw new ConflictException(`User with email ${email} is already in the list`);
    }

    // Add the user to the list
    list.users.push(userToShare);
    return this.listsRepository.save(list);
  }
}
