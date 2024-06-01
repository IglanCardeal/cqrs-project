import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetEmployeesReportQuery } from './get-employees-report.query'
import { GetEmployeesReportDto } from './get-employees-report.dto'
import { DataSource } from 'typeorm'
import { plainToClass } from 'class-transformer'
import { getEmployeesReportSql } from './get-employees-report.sql'

@QueryHandler(GetEmployeesReportQuery)
export class GetEmployeesReportHandler
  implements IQueryHandler<GetEmployeesReportQuery, GetEmployeesReportDto[]>
{
  constructor(private readonly dataSource: DataSource) {}

  async execute(): Promise<GetEmployeesReportDto[]> {
    const rows: any[] = await this.dataSource.manager.query(
      getEmployeesReportSql,
    )
    return rows.map((row) => plainToClass(GetEmployeesReportDto, row))
  }
}
