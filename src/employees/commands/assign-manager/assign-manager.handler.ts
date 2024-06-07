import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs'
import { AssignManagerCommand } from './assign-manager.command'
import { Employee } from '@src/employees/entities/employee.entity'
import { DataSource } from 'typeorm'
import { ManagerAssignedEvent } from '@src/employees/events/manager-assigned'

@CommandHandler(AssignManagerCommand)
export class AssignManagerHandler
  implements ICommandHandler<AssignManagerCommand, number>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: AssignManagerCommand): Promise<number> {
    return await this.dataSource.transaction(async (db) => {
      const employee = await db.findOne(Employee, {
        where: { id: command.id },
      })

      if (!employee) return 0

      const isNewManager =
        command.managerId && command.managerId !== employee.managerId

      employee.managerId = command.managerId
      await db.save(Employee, employee)

      if (isNewManager) {
        await this.eventBus.publish(
          new ManagerAssignedEvent(employee.id, command.managerId),
        )
      }

      return 1
    })
  }
}
