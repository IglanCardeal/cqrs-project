import { Controller, Get } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { GetEmployeesReportQuery } from './queries/get-employees-report'

@Controller('reports')
export class ReportsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('employees')
  getEmployeesReports() {
    return this.queryBus.execute(new GetEmployeesReportQuery())
  }
}
