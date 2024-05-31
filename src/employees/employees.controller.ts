import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
} from '@nestjs/common'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { plainToClass } from 'class-transformer'
import { GetEmployeeQuery } from './queries/get-employee/get-employee.query'
import {
  CreateEmployeeCommand,
  CreateEmployeeDto,
} from './commands/create-employee'

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateEmployeeDto) {
    const createEmployeeCommand = plainToClass(CreateEmployeeCommand, dto)
    const id = await this.commandBus.execute(createEmployeeCommand)
    const query = plainToClass(GetEmployeeQuery, { id })
    return this.queryBus.execute(query)
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
