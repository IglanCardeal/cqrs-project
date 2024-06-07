import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateEmployeeCommand } from './create-employee.command'
import { DataSource } from 'typeorm'
import { ContactInfo } from '@src/employees/entities/contact-info.entity'
import { Employee } from '@src/employees/entities/employee.entity'
import { EntityEventsDispatcher } from '@src/common/entity-events-dispatcher'

@CommandHandler(CreateEmployeeCommand)
export class CreateEmployeeHandler
  implements ICommandHandler<CreateEmployeeCommand, number>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly entityDispatcher: EntityEventsDispatcher,
  ) {}

  async execute(command: CreateEmployeeCommand): Promise<number> {
    return await this.dataSource.transaction(async (db) => {
      const contactInfo = db.create(ContactInfo, command.contactInfo ?? {})
      const employee = db.create(Employee, {
        ...command,
        contactInfo,
      })
      await db.save(employee)

      await this.entityDispatcher.dispatchEvents(employee)

      return employee.id
    })
  }
}
