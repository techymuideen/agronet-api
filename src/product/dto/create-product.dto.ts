import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly farmerId: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly price: number;

  @IsNumber()
  readonly quantity: number;

  @IsString({ each: true })
  readonly images: string[];

  readonly location: {
    type: 'Point';
    coordinates: [number, number];
  };
}
