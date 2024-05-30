import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Employee, { onDelete: 'SET NULL' })
  manager: Employee
}
