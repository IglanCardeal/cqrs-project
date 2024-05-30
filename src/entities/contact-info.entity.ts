import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { Employee } from './employee.entity'

@Entity('contacts')
export class ContactInfo {
  @PrimaryColumn()
  employeeId: number

  @OneToOne(() => Employee)
  @JoinColumn()
  employee: Employee

  @Column()
  phone: string

  @Column()
  email: string
}
