import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { UpdateEmployeeCommand } from './update-employee.command'
import { Employee } from '@src/employees/entities/employee.entity'
import { DataSource } from 'typeorm'

@CommandHandler(UpdateEmployeeCommand)
export class UpdateEmployeeHandler
  implements ICommandHandler<UpdateEmployeeCommand, number>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateEmployeeCommand): Promise<number> {
    return await this.dataSource.transaction(async (db) => {
      const employee = await db.findOne(Employee, {
        where: { id: command.id },
        relations: ['contactInfo'],
      })
      if (!employee) return 0

      db.merge(Employee, employee, command)
      await db.save(Employee, employee)

      await Promise.all(
        employee.getEvents().map((event) => this.eventBus.publish(event)),
      )

      return 1
    })
  }
}
