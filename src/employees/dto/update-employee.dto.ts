import { PartialType } from '@nestjs/mapped-types'
import { CreateEmployeeDto } from '../commands/create-employee'

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
