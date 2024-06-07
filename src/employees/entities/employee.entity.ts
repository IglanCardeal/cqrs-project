import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ContactInfo } from './contact-info.entity'
import { EntityBase } from '@src/common/entity-base'
import { ManagerAssignedEvent } from '../events/manager-assigned'

@Entity('employees')
export class Employee extends EntityBase {
  #managerId?: number
  #manager?: Employee

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Employee, { onDelete: 'SET NULL' })
  @JoinColumn()
  get manager(): Employee | undefined {
    return this.#manager
  }
  set manager(value: Employee | undefined) {
    this.managerId = value?.managerId
    this.#manager = value
  }

  @Column({ nullable: true })
  get managerId(): number | undefined {
    return this.#managerId
  }
  set managerId(value: number | undefined) {
    if (value && value !== this.#managerId)
      this.addEvent(new ManagerAssignedEvent(this.id, value))
    this.#managerId = value
  }

  @OneToOne(() => ContactInfo, { cascade: true })
  @JoinColumn()
  contactInfo?: ContactInfo
}
