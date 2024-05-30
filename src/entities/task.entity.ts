import { Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Employee } from './employee.entity'

export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Employee, { onDelete: 'SET NULL' })
  assignee: Employee
}
