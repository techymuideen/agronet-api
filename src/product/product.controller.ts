import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: parseInt(
          process.env.MAX_FILE_SIZE_BYTES || String(5 * 1024 * 1024),
          10,
        ),
      },
      fileFilter: (req, file, cb) => {
        // accept only image mime types
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image uploads are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() body: any, @UploadedFile() file: any) {
    // Log incoming fields and file summary to help debug payload issues
    console.log('POST /product received form fields:', Object.keys(body));
    console.log('Form field sample:', body);
    if (file) {
      console.log('Received file:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size || (file.buffer && file.buffer.length),
      });
    }

    // Parse and normalize fields coming from multipart/form-data (all strings)
    const parsedLocation = (() => {
      try {
        if (!body.location) return { type: 'Point', coordinates: [0, 0] };
        if (typeof body.location === 'string') return JSON.parse(body.location);
        return body.location;
      } catch (err) {
        console.warn('Failed to parse location field, using default:', err);
        return { type: 'Point', coordinates: [0, 0] };
      }
    })();

    const createProductDto: CreateProductDto = {
      farmerId: body.farmerId,
      name: body.name,
      description: body.description,
      price: body.price ? Number(body.price) : 0,
      quantity: body.quantity ? Number(body.quantity) : 0,
      images: [],
      location: parsedLocation,
    } as CreateProductDto;

    try {
      const product = await this.productService.createWithImage(
        createProductDto,
        file,
      );
      return { success: true, data: product };
    } catch (err: any) {
      console.error('Failed to create product:', err);
      return {
        success: false,
        error: err?.message || 'Failed to create product',
      };
    }
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
