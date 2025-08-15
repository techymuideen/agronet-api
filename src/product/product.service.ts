import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import cloudinary from '../common/cloudinary.config';
import * as streamifier from 'streamifier';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  findAll() {
    return this.productModel.find().exec();
  }

  async findOne(id: string) {
    const product = await this.productModel.findOne({ _id: id }).exec();

    if (!product) {
      throw new NotFoundException(`Product with the id ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.create(createProductDto);
    return product;
  }

  async createWithImage(createProductDto: CreateProductDto, file?: any) {
    const images: string[] = Array.isArray(createProductDto.images)
      ? [...createProductDto.images]
      : [];

    if (file && (file as any).buffer) {
      try {
        const uploadResult: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'agronet/products' },
            (error: any, result: any) => {
              if (error) return reject(error);
              resolve(result);
            },
          );
          streamifier.createReadStream((file as any).buffer).pipe(uploadStream);
        });

        if (uploadResult && typeof uploadResult.secure_url === 'string') {
          images.push(uploadResult.secure_url);
        }
      } catch (err) {
        console.warn(
          'Cloudinary upload warning - upload failed, continuing product create:',
          err,
        );
        // continue without failing product creation
      }
    }

    const payload = {
      ...createProductDto,
      images,
    };

    const product = await this.productModel.create(payload);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.productModel
      .findOneAndUpdate(
        { _id: id },
        { $set: updateProductDto },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!existingProduct) {
      throw new NotFoundException(`Product with the id ${id} not found`);
    }
    return existingProduct;
  }

  async remove(id: string) {
    const result = await this.productModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Product with the id ${id} not found`);
    }
    return result;
  }
}
