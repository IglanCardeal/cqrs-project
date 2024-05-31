import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
} from '@nestjs/common'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { QueryBus } from '@nestjs/cqrs'
import { plainToClass } from 'class-transformer'
import { GetEmployeeQuery } from './queries/get-employee/get-employee.query'

@Controller('employees')
export class EmployeesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Post()
  create(@Body() _createEmployeeDto: CreateEmployeeDto) {
    return null
  }

  @Get()
  findAll() {
    return null
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const getEmployeeQuery = plainToClass(GetEmployeeQuery, {
      id: +id,
    })
    const data = await this.queryBus.execute(getEmployeeQuery)
    if (!data) throw new NotFoundException()
    return data
  }

  @Patch(':id')
  update(
    @Param('id') _id: string,
    @Body() _updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return null
  }
}
