import { Module } from '@nestjs/common'
import { EmployeesController } from './employees.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Employee } from './entities/employee.entity'
import { ContactInfo } from './entities/contact-info.entity'
import { CqrsModule } from '@nestjs/cqrs'
import { employeesQueriesHandlers } from './queries/handlers'
import { commandsHandlers } from './commands/handlers'
import { eventsHandlers } from './events/handlers'
import { CommonModule } from '@src/common/common.module'
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Employee, ContactInfo]),
    CommonModule,
    BullModule.registerQueue({ name: 'employees' }),
  ],
  controllers: [EmployeesController],
  providers: [
    ...employeesQueriesHandlers,
    ...commandsHandlers,
    ...eventsHandlers,
  ],
})
export class EmployeesModule {}
