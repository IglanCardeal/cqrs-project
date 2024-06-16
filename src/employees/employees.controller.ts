import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  HttpCode,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { plainToClass } from 'class-transformer'
import { GetEmployeeQuery } from './queries/get-employee/get-employee.query'
import {
  CreateEmployeeCommand,
  CreateEmployeeDto,
} from './commands/create-employee'
import {
  UpdateEmployeeCommand,
  UpdateEmployeeDto,
} from './commands/update-employee'
import {
  AssignManagerCommand,
  AssignManagerDto,
} from './commands/assign-manager'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    @InjectQueue('webhooks')
    private readonly webhooksQueue: Queue,
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
  async update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    const updateEmployeeCommand = plainToClass(UpdateEmployeeCommand, {
      ...dto,
      id: +id,
    })
    const affectedRows = await this.commandBus.execute(updateEmployeeCommand)
    if (!affectedRows) throw new NotFoundException()
    const getEmployeeQuery = plainToClass(GetEmployeeQuery, {
      id: +id,
    })
    return this.queryBus.execute(getEmployeeQuery)
  }

  @Patch(':id/assign-manager')
  async assignManager(@Param('id') id: string, @Body() dto: AssignManagerDto) {
    const assignManagerCommand = plainToClass(AssignManagerCommand, {
      ...dto,
      id: +id,
    })
    const affectedRows = await this.commandBus.execute(assignManagerCommand)
    if (!affectedRows) throw new NotFoundException()
    const getEmployeeQuery = plainToClass(GetEmployeeQuery, {
      id: +id,
    })
    return this.queryBus.execute(getEmployeeQuery)
  }

  @Post('webhooks/employee/payment')
  @HttpCode(204)
  async employeePayment(@Body() dto: any) {
    await this.webhooksQueue.add('process-employee-payment', dto, {
      delay: 5000,
    })
  }
}
