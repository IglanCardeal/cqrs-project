import { Module } from '@nestjs/common'
import { ReportsController } from './reports.controller'
import { employeesReportsQueriesHandlers } from './queries/handlers'
import { CqrsModule } from '@nestjs/cqrs'

@Module({
  imports: [CqrsModule],
  controllers: [ReportsController],
  providers: [...employeesReportsQueriesHandlers],
})
export class ReportsModule {}
