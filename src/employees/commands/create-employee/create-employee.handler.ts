import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { CreateEmployeeCommand } from './create-employee.command'
import { DataSource } from 'typeorm'
import { ContactInfo } from '@src/employees/entities/contact-info.entity'
import { Employee } from '@src/employees/entities/employee.entity'

@CommandHandler(CreateEmployeeCommand)
export class CreateEmployeeHandler
  implements ICommandHandler<CreateEmployeeCommand, number>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateEmployeeCommand): Promise<number> {
    return await this.dataSource.transaction(async (db) => {
      const contactInfo = db.create(ContactInfo, command.contactInfo ?? {})
      const employee = db.create(Employee, {
        ...command,
        contactInfo,
      })
      await db.save(employee)

      await Promise.all(
        employee.getEvents().map((event) => this.eventBus.publish(event)),
      )

      return employee.id
    })
  }
}
