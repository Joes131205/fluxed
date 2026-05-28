import { Controller, Get, BadRequestException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getHello() {
    try {
      return this.categoryService.getHello();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }
}
