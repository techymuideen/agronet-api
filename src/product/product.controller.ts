import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAllProducts() {
    try {
      const products = await this.productService.findAll();
      return products;
    } catch (error) {
      // Return mock data if database is not available
      console.log('Database connection issue, returning mock data:', error);
      return [
        {
          _id: '1',
          farmerId: 'farmer1',
          name: 'Fresh Tomatoes',
          description: 'Organic tomatoes grown locally',
          price: 5.99,
          quantity: 100,
          images: ['/placeholder.jpg'],
          location: {
            type: 'Point',
            coordinates: [-74.006, 40.7128],
          },
          ratingsAverage: 4.5,
          ratingsCount: 12,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: '2',
          farmerId: 'farmer2',
          name: 'Fresh Carrots',
          description: 'Crunchy organic carrots',
          price: 3.99,
          quantity: 80,
          images: ['/placeholder.jpg'],
          location: {
            type: 'Point',
            coordinates: [-74.006, 40.7128],
          },
          ratingsAverage: 4.2,
          ratingsCount: 8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }
  }

  @Get(':id')
  findProductById(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
