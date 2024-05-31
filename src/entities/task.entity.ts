import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Employee } from '../employees/entities/employee.entity'

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Employee, { onDelete: 'SET NULL' })
  assignee: Employee
}
