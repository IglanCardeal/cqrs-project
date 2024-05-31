import { Type } from 'class-transformer'
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator'

export class CreateContactInfoDto {
  @IsOptional()
  @IsPhoneNumber()
  phone?: string

  @IsOptional()
  @IsEmail()
  email?: string
}

export class CreateEmployeeDto {
  @IsString()
  name: string

  @IsInt()
  @IsOptional()
  managerId?: number

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateContactInfoDto)
  contactInfo?: CreateContactInfoDto
}
