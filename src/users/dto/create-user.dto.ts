import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly firstname: string;

  @IsString()
  readonly lastname: string;

  @IsEmail()
  readonly email: string;

  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  readonly password: string;

  readonly role?: 'buyer' | 'farmer' | 'admin';

  readonly farmerApplicationStatus?: 'pending' | 'approved' | 'rejected';

  readonly location?: {
    type: 'Point';
    coordinates: [number, number];
  };
}
