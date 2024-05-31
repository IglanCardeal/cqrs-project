import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('contacts')
export class ContactInfo {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  phone?: string

  @Column({ nullable: true })
  email?: string
}
