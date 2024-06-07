import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { CreateEmployeeCommand } from './create-employee.command'
import { DataSource } from 'typeorm'
import { ContactInfo } from '@src/employees/entities/contact-info.entity'
import { Employee } from '@src/employees/entities/employee.entity'
import { ManagerAssignedEvent } from '@src/employees/events/manager-assigned'

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

      if (command.managerId) {
        await this.eventBus.publish(
          new ManagerAssignedEvent(employee.id, command.managerId),
        )
      }

      return employee.id
    })
  }
}
