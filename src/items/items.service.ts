import {
  Injectable,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { List } from '../lists/entities/list.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>, // Repository for lists
  ) {}

  /**
   * Creates a new item associated with a specific list.
   *
   * @param {CreateItemDto} createItemDto - Data transfer object containing item details.
   * @param {number} userId - The ID of the user creating the item.
   * @returns {Promise<any>} - The newly created item details.
   * @throws {NotFoundException} - If the list is not found.
   * @throws {ForbiddenException} - If the user does not have access to the list.
   */
  async create(createItemDto: CreateItemDto, userId: number): Promise<any> {
    const { listId, ...itemData } = createItemDto;

    // Verify if the list exists
    const list = await this.listsRepository.findOne({
      where: { id: listId },
      relations: ['users'], // Load the users assigned to the list
    });

    if (!list) {
      throw new NotFoundException(`List with ID ${listId} not found`);
    }

    // Verify if the user has access to the list
    const isUserAuthorized = list.users.some((user: { id: number }) => user.id === userId);
    if (!isUserAuthorized) {
      throw new ForbiddenException(`You do not have access to this list`);
    }

    // Create a new item
    const newItem = new Item();
    newItem.title = itemData.title;
    newItem.description = itemData.description;
    newItem.deadline = itemData.deadline;
    newItem.status = itemData.status || 'active'; // Default status
    newItem.list = list; // Set the relationship to the list
    newItem.createdBy = { id: userId } as any; // Set the creator using user ID

    // Save the item
    const savedItem = await this.itemsRepository.save(newItem);

    // Return the response with `item_id`
    return {
      item_id: savedItem.id,
      title: savedItem.title,
      description: savedItem.description,
      deadline: savedItem.deadline,
      status: savedItem.status,
      list_id: list.id,
    };
  }

  /**
   * Retrieves all items.
   *
   * @returns {Promise<Item[]>} - A list of all items with their details.
   */
  async findAll(): Promise<Item[]> {
    return this.itemsRepository.find({ relations: ['list'] });
  }

  /**
   * Retrieves a specific item by its ID.
   *
   * @param {number} id - The ID of the item to retrieve.
   * @returns {Promise<Item>} - The item details.
   * @throws {NotFoundException} - If the item is not found.
   */
  async findOne(id: number): Promise<Item> {
    const item = await this.itemsRepository.findOne({ where: { id }, relations: ['list', 'list.users'] });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  /**
   * Updates an existing item.
   *
   * @param {number} id - The ID of the item to update.
   * @param {UpdateItemDto} updateItemDto - The DTO containing updated item details.
   * @param {number} userId - The ID of the user requesting the update.
   * @returns {Promise<Item>} - The updated item details.
   * @throws {NotFoundException} - If the item is not found.
   * @throws {ForbiddenException} - If the user does not have permission to update the item.
   */
  async update(id: number, updateItemDto: UpdateItemDto, userId: number): Promise<Item> {
    // Find the item by ID
    const item = await this.itemsRepository.findOne({
      where: { id },
      relations: ['list', 'list.users'], // Load the list and users
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // Verify if the user has access to the list
    const isUserAuthorized = item.list.users.some((user) => user.id === userId);
    if (!isUserAuthorized) {
      throw new ForbiddenException('You do not have permission to update this item');
    }

    // Partially update item properties
    Object.assign(item, updateItemDto);

    // Save the updated item
    return this.itemsRepository.save(item);
  }

  /**
   * Deletes an item by ID.
   *
   * @param {number} id - The ID of the item to delete.
   * @param {number} userId - The ID of the user requesting the deletion.
   * @returns {Promise<void>} - Void if successful.
   * @throws {ForbiddenException} - If the user does not have permission to delete the item.
   */
  async remove(id: number, userId: number): Promise<void> {
    // Find the item including relationships
    const item = await this.findOne(id);

    if (!item.list || !item.list.users) {
      throw new ForbiddenException('The list or its users are not properly loaded');
    }

    // Check if the user has authorization to delete the item
    const isAuthorized = item.list.users.some((user) => user.id === userId);
    if (!isAuthorized) {
      throw new ForbiddenException(`You do not have permission to delete this item`);
    }

    await this.itemsRepository.remove(item);
  }
}
