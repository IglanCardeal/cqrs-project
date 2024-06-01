import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Employee } from '../employees/entities/employee.entity'

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Employee, { onDelete: 'SET NULL' })
  assignee: Employee
}
