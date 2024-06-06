import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { Employee } from './employees/entities/employee.entity'
import { ContactInfo } from './employees/entities/contact-info.entity'
import { Task } from './entities/task.entity'
import { Meeting } from './entities/meeting.entity'

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const ceo = queryRunner.manager.create(Employee, {
        name: 'Mr. CEO',
        contactInfo: queryRunner.manager.create(ContactInfo, {
          email: 'ceo@acme.com',
        }),
      })
      await queryRunner.manager.save(ceo)

      const manager = queryRunner.manager.create(Employee, {
        name: 'Manager da Silva',
        manager: ceo,
        contactInfo: queryRunner.manager.create(ContactInfo, {}),
      })
      await queryRunner.manager.save(manager)

      const task1 = queryRunner.manager.create(Task, {
        assignee: manager,
        name: 'Manager Task 1',
      })
      const task2 = queryRunner.manager.create(Task, {
        assignee: manager,
        name: 'Manager Task 2',
      })
      await queryRunner.manager.save([task1, task2])

      const meeting = queryRunner.manager.create(Meeting, {
        attendees: [ceo, manager],
        zoomUrl: 'any_url',
      })
      await queryRunner.manager.save(meeting)

      await queryRunner.commitTransaction()
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }
  }
}
