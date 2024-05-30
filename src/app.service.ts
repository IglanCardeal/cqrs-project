import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { Employee } from './entities/employee.entity'
import { ContactInfo } from './entities/contact-info.entity'
import { Task } from './entities/task.entity'
import { Meeting } from './entities/meeting.entity'

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    await this.dataSource.transaction(async (db) => {
      const ceo = db.create(Employee, {
        name: 'Mr. CEO',
      })
      await db.save(ceo)

      const contactInfo = db.create(ContactInfo, {
        email: 'ceo@acme.com',
        employee: ceo,
      })
      await db.save(contactInfo)

      const manager = db.create(Employee, {
        name: 'Manager da Silva',
        manager: ceo,
      })
      await db.save(manager)

      const task1 = db.create(Task, {
        assignee: manager,
        name: 'Manager Task 1',
      })
      const task2 = db.create(Task, {
        assignee: manager,
        name: 'Manager Task 2',
      })
      await db.save([task1, task2])

      const meeting = db.create(Meeting, {
        attendees: [ceo, manager],
        zoomUrl: 'any_url',
      })
      await db.save(meeting)
    })
  }
}
