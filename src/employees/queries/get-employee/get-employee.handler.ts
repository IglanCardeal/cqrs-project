import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { EmployeeDto } from './employee.dto'
import { DataSource } from 'typeorm'
import { InjectDataSource } from '@nestjs/typeorm'
import { Employee } from '@src/employees/entities/employee.entity'
import { plainToClass } from 'class-transformer'
import { GetEmployeeQuery } from './get-employee.query'

@QueryHandler(GetEmployeeQuery)
export class GetEmployeeHandler
  implements IQueryHandler<GetEmployeeQuery, EmployeeDto | null>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute({ id }: GetEmployeeQuery): Promise<EmployeeDto | null> {
    const data = await this.dataSource.manager.findOne(Employee, {
      where: { id },
      relations: ['contactInfo'],
    })
    if (!data) return null
    return plainToClass(EmployeeDto, data)
  }
}
