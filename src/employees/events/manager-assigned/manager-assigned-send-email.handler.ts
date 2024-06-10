import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { ManagerAssignedEvent } from './manager-assigned.event'
import { DataSource } from 'typeorm'
import { Employee } from '@src/employees/entities/employee.entity'
import { Job, Queue } from 'bull'
import { InjectQueue, Process, Processor } from '@nestjs/bull'

@EventsHandler(ManagerAssignedEvent)
@Processor('employees')
export class ManagerAssignedSendEmailHandler
  implements IEventHandler<ManagerAssignedEvent>
{
  constructor(
    private readonly dataSource: DataSource,
    @InjectQueue('employees')
    private readonly queue: Queue,
  ) {}

  async handle(event: ManagerAssignedEvent) {
    const jobName = 'manager-assigned-send-email'
    await this.queue.add(jobName, event)
  }

  @Process('manager-assigned-send-email')
  async process(job: Job<ManagerAssignedEvent>) {
    const { employeeId, managerId } = job.data
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
