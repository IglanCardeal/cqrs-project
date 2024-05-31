import { PartialType } from '@nestjs/mapped-types'
import { CreateEmployeeDto } from '../create-employee'

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
