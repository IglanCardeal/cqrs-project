import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Employee } from './employee.entity'

@Entity('meetings')
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  zoomUrl: string

  @ManyToMany(() => Employee)
  @JoinTable()
  attendees: Employee[]
}