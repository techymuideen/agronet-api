import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
