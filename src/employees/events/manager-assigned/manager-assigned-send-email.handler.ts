import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ManagerAssignedEvent } from './manager-assigned.event'
import { DataSource } from 'typeorm'
import { Employee } from '@src/employees/entities/employee.entity'

@EventsHandler(ManagerAssignedEvent)
export class ManagerAssignedSendEmailHandler
  implements IEventHandler<ManagerAssignedEvent>
{
  constructor(private readonly dataSource: DataSource) {}

  async handle({ managerId, employeeId }: ManagerAssignedEvent) {
    const manager = await this.dataSource.manager.findOne(Employee, {
      where: {
        id: managerId,
      },
      relations: ['contactInfo'],
    })

    if (!manager?.contactInfo?.email) return

    const employee = await this.dataSource.manager.findOne(Employee, {
      where: {
        id: employeeId,
      },
      relations: ['contactInfo'],
    })

    await this.sendEmail(manager, employee)
  }

  private async sendEmail(
    manager: Employee,
    employee: Employee,
  ): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(
      // eslint-disable-next-line max-len
      `\n\nSend email to ${manager.name}, saying that ${employee.name} has joined their team.\n\n`,
    )
  }
}
