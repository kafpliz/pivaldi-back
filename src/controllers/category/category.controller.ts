import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryType } from '@prisma/client';

@Controller('menu')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('category/:type')
  getCategory(@Param('type') type:'regular'|'franchise'){
    const typePr = type == 'regular' ? CategoryType.REGULAR : CategoryType.FRANCHISE

    return this.categoryService.getCategory(typePr)
  }

  @Get('item/:id')
  getMenuCategory(@Param('id') id:string){
    
    return this.categoryService.getMenuItem(+id)
  }

  @Get('main')
  getMainSwiper(){
      return this.categoryService.getMainSwiper()
  }

  @Get('stock/:type')
  getStock(@Param('type') type:'regular'|'franchise'){
      const typePr = type == 'regular' ? CategoryType.REGULAR : CategoryType.FRANCHISE
      return this.categoryService.getStock(typePr)
  }

}
